import { LitAuth } from 'siwl-test';
import './src/styles/main.css';
import { LitOAuthClient } from './src/js/core';
import { initUI, bindLogin, bindLogout, bindLitAuthEvents, renderUI } from './src/js/ui';
import { SESSION_KEY } from './src/js/constants';

// ------ Initialize
const uiConfig = {
	theme: 'light',
	appName: 'Demo App',
	appLogo: 'https://em-content.zobj.net/thumbs/160/apple/81/eyes_1f440.png',
	gradientColor: '#8AC926',
	linkColor: '#4C7A15',
}

const oAuthClient = new LitOAuthClient(
	import.meta.env.VITE_CLIENT_DOMAIN,
	import.meta.env.VITE_CLIENT_REDIRECT_URI,
	uiConfig,
);

// Initialize Lit Auth
const litAuthClient = new LitAuth({
	domain: import.meta.env.VITE_CLIENT_DOMAIN,
	rpcUrl: import.meta.env.VITE_RPC_URL,
	relayUrl: import.meta.env.VITE_RELAY_URL,
	relayApiKey: import.meta.env.VITE_RELAY_API_KEY,
});

window.onload = async () => {
	// Initialize UI
	initUI();
	bindLogin(() => oAuthClient.loginWithRedirect());
	bindLogout(handleLogout);

	// Listen to Lit Auth events
	bindLitAuthEvents(litAuthClient);

	// Check if one is currently on the redirect url and if auth params exist
	const path = window.location.origin + window.location.pathname;
	const strippedPath = path.replace(/\/$/, '');
	const searchParams = new URLSearchParams(document.location.search);
	const provider = searchParams.get('provider');
	if (strippedPath.replace(/\/$/, '') === oAuthClient.redirectUri && provider) {
		renderUI('loading');

		// Check if there's an error
		const error = searchParams.get('error');
		if (error) {
			handleError();
			return;
		}
		
		// Handle redirect callback
		const appState = await oAuthClient.handleRedirectCallback();
		// Clear url params
		window.history.pushState({}, document.title, "/");

		// Generate session keys with Lit Auth
		let session = null;
		if (appState) {
			if (appState.provider === 'google') {
				session = await authWithGoogle(appState.credential);
			} else if (appState.provider === 'discord') {
				session = await authWithDiscord(appState.credential);
			}
		}

		if (session) {
			renderUI('logged-in');
			bindLogout(handleLogout);
		}
	}
};

const handleError = () => {
	localStorage.removeItem(SESSION_KEY);
	oAuthClient.logout();
	renderUI('error');
}

async function authWithGoogle(credential) {
	const params = {
		idToken: credential,
		sessionConfig: {
			resources: ['litAction://*'],
			chain: 'mumbai',
		},
		onError: handleError,
	};

	// Generate session sigs
	const session = await litAuthClient.signInWithGoogle(params);
	if (session && Object.keys(session).length > 0) {
		localStorage.setItem(SESSION_KEY, JSON.stringify(session));
	}
	return session;
}

async function authWithDiscord(credential) {
	const params = {
		accessToken: credential,
		sessionConfig: {
			resources: ['litAction://*'],
			chain: 'mumbai',
		},
		onError: handleError,
	};

	// Generate session sigs
	const session = await litAuthClient.signInWithDiscord(params);
	if (session && Object.keys(session).length > 0) {
		localStorage.setItem(SESSION_KEY, JSON.stringify(session));
	}
	return session;
}

function handleLogout() {
	localStorage.removeItem(SESSION_KEY);
	oAuthClient.logout();
	window.location.replace(window.location.origin);
}