require('dotenv').config();

const PORT = process.env.PORT || 3300;
const HOST = process.env.HOST || '0.0.0.0';
const ORIGIN = process.env.ORIGIN || `http://localhost:${PORT}`;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const path = require('path');

// Redis client
const redis = require('redis');
let redisClient = null;

(async () => {
  redisClient = redis.createClient({
    url: REDIS_URL,
  });

  redisClient.on('error', err => console.log('Redis client error: ', err));

  await redisClient.connect();
})();

// Google OAuth2 client
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${ORIGIN}/auth/google/callback`
);

// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true });
const fastifyStatic = require('@fastify/static');

// Add support for content type application/x-www-form-urlencoded
fastify.register(require('@fastify/formbody'));

// Add support for reading and setting cookies
fastify.register(require('@fastify/cookie'));

// Serve static assets from the /public folder
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
});

// Home page
fastify.get('/', function (req, reply) {
  return reply.sendFile("index.html");
});

// Error page
fastify.get('/error', function (req, reply) {
  return reply.sendFile("error.html");
});

// Redirect user to Discord authorization URL
fastify.get('/auth/discord', function (req, reply) {
  // Check for app redirect and state params
  const appRedirect = req.query.app_redirect;
  const state = req.query.state;
  if (state && appRedirect) {
    // Check if app redirect is valid
    try {
      const url = new URL(appRedirect);
      // Keep track of app redirect and state, using state to identify the app making the request
      redisClient.set(state, appRedirect, 'EX', 60 * 60 * 24);
    } catch (err) {
      return reply.redirect('/error?error=invalid_params');
    }
  } else {
    return reply.redirect('/error?error=invalid_params');
  }

  const redirectURI = encodeURIComponent(`${ORIGIN}/auth/discord/callback`);
  const authorizationUrl = `https://discord.com/api/oauth2/authorize?client_id=1052874239658692668&redirect_uri=${redirectURI}&response_type=code&scope=identify&state=${state}`;

  return reply.redirect(301, authorizationUrl);
});

// Auth callback endpoint for Discord
fastify.get('/auth/discord/callback', async function (req, reply) {
  // Check if error has occurred
  const error = req.query.error;
  if (error) {
    return reply.redirect(`/error?error=${error}`);
  }

  // Get the code from query string
  const code = req.query.code;

  // Get state from query string
  const state = req.query.state;

  // Get app redirect from redis
  let appRedirect = null;
  if (state) {
    appRedirect = await redisClient.get(state);
  } else {
    return reply.redirect('/error?error=missing_state');
  }
  if (!appRedirect) {
    return reply.redirect('/error?error=missing_redirect');
  }

  const params = new URLSearchParams();
  params.append('client_id', process.env.DISCORD_CLIENT_ID);
  params.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', `${ORIGIN}/auth/discord/callback`);

  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const json = await response.json();
  if (!json.access_token) {
    return reply.redirect(
      301,
      `${appRedirect}/?provider=discord&error=invalid_access_token`
    );
  }

  return reply.redirect(
    301,
    `${appRedirect}/?provider=discord&access_token=${json.access_token}&state=${state}`
  );
});

// Redirect user to Google authorization URL
fastify.get('/auth/google', function (req, reply) {
  // Check for app redirect and state params
  const appRedirect = req.query.app_redirect;
  const state = req.query.state;
  if (state && appRedirect) {
    // Check if app redirect is valid
    try {
      const url = new URL(appRedirect);
      // Keep track of app redirect and state, using state to identify the app making the request
      redisClient.set(state, appRedirect, 'EX', 60 * 60 * 24);
    } catch (err) {
      return reply.redirect('/error?error=invalid_params');
    }
  } else {
    return reply.redirect('/error?error=invalid_params');
  }

  const authorizationUrl = googleClient.generateAuthUrl({
    // If only one scope is needed, you can pass a scope URL as a string
    scope: 'https://www.googleapis.com/auth/userinfo.email',
    state: state,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
    // Setting the prompt to 'consent' will force this consent
    // every time, forcing a refresh_token to be returned.
    prompt: 'consent',
  });

  return reply.redirect(301, authorizationUrl);
});

// Auth callback endpoint for Google
fastify.get('/auth/google/callback', async function (req, reply) {
  // Get state from query string
  const state = req.query.state;

  // Get app redirect from redis
  let appRedirect = null;
  if (state) {
    appRedirect = await redisClient.get(state);
  } else {
    return reply.redirect('/error?error=missing_state');
  }
  if (!appRedirect) {
    return reply.redirect('/error?error=missing_redirect');
  }

  // Get ID token
  const code = req.query.code;
  const tokenReq = await googleClient.getToken(code);
  if (tokenReq.res.status != 200) {
    return reply.redirect('/error?error=token_error');
  }

  const idToken = tokenReq.tokens.id_token;
  const accessToken = tokenReq.tokens.access_token;
  return reply.redirect(
    301,
    `${appRedirect}/?provider=google&id_token=${idToken}&state=${state}&access_token=${accessToken}`
  );
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
