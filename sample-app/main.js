import { LitAuth } from 'siwl-test';
import './src/styles/main.css';
import './src/styles/lit.css';
import { LitOAuthClient } from './src/js/core';
import { initUI, bindLogin, bindLogout } from './src/js/appUI';
import { setLitUIConfig, renderLitUI } from './src/js/litUI';
import { SESSION_KEY } from './src/js/constants';

// ------ Initialize
const lightUIConfig = {
	theme: 'light',
	appName: 'Demo App',
	appLogo: 'https://cdn.shopify.com/s/files/1/1061/1924/products/The_Sun_Face_Emoji_1024x1024.png?v=1571606063',
	gradientColor: '#736CED',
	linkColor: '#5149E9',
}

const darkUIConfig = {
	theme: 'dark',
	appName: 'Demo App',
	appLogo: 'https://cdn.shopify.com/s/files/1/1061/1924/products/Dark_Blue_Moon_Emoji_1024x1024.png?v=1571606063',
	gradientColor: '#B4E33D',
	linkColor: '#B4E33D',
}

const oAuthClient = new LitOAuthClient(
	import.meta.env.VITE_CLIENT_DOMAIN,
	import.meta.env.VITE_CLIENT_REDIRECT_URI,
	darkUIConfig,
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

	// Set Lit UI config
	setLitUIConfig(oAuthClient.uiConfig);

	// Listen to Lit Auth events
	bindLitAuthEvents(litAuthClient);

	// Check if one is currently on the redirect url and if auth params exist
	const path = window.location.origin + window.location.pathname;
	const strippedPath = path.replace(/\/$/, '');
	const searchParams = new URLSearchParams(document.location.search);
	// Check if there's an error
	const error = searchParams.get('error');
	if (error) {
		handleError();
		return;
	}
	
	const provider = searchParams.get('provider');
	if (strippedPath.replace(/\/$/, '') === oAuthClient.redirectUri && provider) {
		try {
			handleLogin();
		} catch (e) {
			console.error(e);
			handleError();
		}
	}
};

const handleError = () => {
	localStorage.removeItem(SESSION_KEY);
	oAuthClient.logout();
	renderLitUI('error');
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

async function handleLogin() {
	renderLitUI('verify-redirect');

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
		initUI();
		bindLogout(handleLogout);
	}
}

function handleLogout() {
	localStorage.removeItem(SESSION_KEY);
	oAuthClient.logout();
	window.location.replace(window.location.origin);
}

function bindLitAuthEvents(litAuthClient) {
	litAuthClient.on('relayer_minting', (data) => {
		renderLitUI('minting');
	});

	litAuthClient.on('relayer_polling', (data) => {
		renderLitUI('polling');
	});

	litAuthClient.on('relayer_minted', (data) => {
		renderLitUI('polling');
	});

	litAuthClient.on('creating_session', (data) => {
		renderLitUI('create-session');
	});
}