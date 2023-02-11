require('dotenv').config();

const PORT = process.env.PORT || 3300;
const HOST = process.env.HOST || '0.0.0.0';
const ORIGIN = process.env.ORIGIN || `http://localhost:${PORT}`;
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

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

// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true });
const fastifyStatic = require('@fastify/static');

// Add support for content type application/x-www-form-urlencoded
fastify.register(require('@fastify/formbody'));

// Add support for reading and setting cookies
fastify.register(require('@fastify/cookie'));

// Enable CORS
// const fastifyCors = require('@fastify/cors');
// fastify.register(fastifyCors, {
//   origin: (origin, cb) => {
//     const hostname = new URL(origin).hostname;
//     if(hostname === "localhost"){
//       //  Request from localhost will pass
//       cb(null, true);
//       return;
//     }
//     // Generate an error on other origins, disabling access
//     cb(new Error("Not allowed"), false);
//   }
// });

// Serve static assets from the /public folder
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public')
});

// Home page
fastify.get('/', function (req, reply) {
  return reply.sendFile("index.html");
});

// Error page
fastify.get('/error', function (req, reply) {
  return reply.sendFile("error.html");
});

// Login screen page
fastify.get('/login', function (req, reply) {
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

  return reply.sendFile("login.html");
});

// Auth callback endpoint for Discord
fastify.get('/auth/callback/discord', async function (req, reply) {
  // Check if error has occurred
  const error = req.query.error;
  if (error) {
    return reply.redirect(301, `http://localhost:4444/?provider=discord&error=${error}`);
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
  params.append('redirect_uri', `${ORIGIN}/auth/callback/discord`);
  
  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const json = await response.json();
  if (!json.access_token) {
    return reply.redirect(301, `${appRedirect}/?provider=discord&error=invalid_access_token`);
  }

  return reply.redirect(301, `${appRedirect}/?provider=discord&access_token=${json.access_token}&state=${state}`);
});

// Auth callback endpoint for Google
fastify.post('/auth/callback/google', async function (req, reply) {
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
  
  // Verify the Cross-Site Request Forgery (CSRF) token
  const csrfTokenCookie = req.cookies.g_csrf_token;
  if (!csrfTokenCookie) {
    return reply.redirect(301, `${appRedirect}/?provider=google&error=invalid_csrf_token`);
  }
  const csrfTokenBody = req.body.g_csrf_token;
  if (!csrfTokenBody) {
    return reply.redirect(301, `${appRedirect}/?provider=google&error=invalid_csrf_token`);
  }
  if (csrfTokenCookie != csrfTokenBody) {
    return reply.redirect(301, `${appRedirect}/?provider=google&error=invalid_csrf_token`);
  }

  // Get credential from query string
  const credential = req.body.credential;

  return reply.redirect(301, `${appRedirect}/?provider=google&id_token=${credential}&state=${state}`);
});


// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
start();