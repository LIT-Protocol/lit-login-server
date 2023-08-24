# Lit Login Server

This server is dedicated to handling social login flows when authenticating with PKPs tied to social login accounts like Google and Discord.

The server is live at [https://lit-login-server.herokuapp.com/](https://lit-login-server.herokuapp.com/).

<br>

## 💻 Dev setup

Note: The server uses Redis to store temporary data. You'll need to [install Redis](https://redis.io/docs/getting-started/) on your machine and run it in the background.

1. Clone this repo and install dependencies:

```bash
git clone https://github.com/LIT-Protocol/lit-login-server

cd lit-login-server

pnpm install
```

2. Create `.env` in the root directory, and add the following environment variables:

```bash
GOOGLE_CLIENT_ID=355007986731-llbjq5kbsg8ieb705mo64nfnh88dhlmn.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<Ask team member>

DISCORD_CLIENT_ID=1052874239658692668
DISCORD_CLIENT_SECRET=<Ask team member>

PORT=3300
DOMAIN=localhost:3300
ORIGIN=http://localhost:3300
REDIS_URL=REDIS_URL=redis://default:xxx@redis-yyy:10585
```

3. Start your development server:

```bash
pnpm dev
```

Make sure that your Redis server is also running.

<br>

## 🚀 Deployment

The server is hosted on Heroku. You'll need access to the Lit Protocol Heroku account to manage the server.

<br>

## 🔁 Available Endpoints

| HTTP Verb | Path                   | Description                                                                          |
| --------- | ---------------------- | ------------------------------------------------------------------------------------ |
| GET       | /auth/discord          | Redirect user to Discord authorization URL                                           |
| GET       | /auth/google           | Redirect user to Google authorization URL                                            |
| GET       | /auth/apple            | Redirect user to Apple authorization URL                                             |
| GET       | /auth/discord/callback | Handles callback from Discord then redirects user back to the specified redirect URI |
| GET       | /auth/google/callback  | Handles callback from Google then redirects user back to the specified redirect URI  |
| GET       | /auth/apple/callback   | Handles callback from Apple then redirects user back to the specified redirect URI   |

<br>

## 🎈 Error Codes

If an error occurs, the server will redirect to an error page (hosted by either the server or the initial app that is calling the endpoints) and append an error code to the URL.

| Error Code           | Description                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| invalid_params       | Missing `state` and/or `app_redirect` param in the request URL when calling `/auth/discord` or `/auth/google` |
| missing_state        | Missing `state` param in the callback request URL                                                             |
| missing_redirect     | Unable to retrieve the `app_redirect` from Redis during the OAuth callback flows                              |
| invalid_access_token | Unable to verify Discord authorization code and retrieve the Discord access token                             |
| token_error          | Unable to verify Google authorization code and get the Google ID token                                        |

Additional error codes may appear at the `/auth/discord/callback` endpoint. These are returned by Discord and are documented [here](https://discord.com/developers/docs/topics/opcodes-and-status-codes).
