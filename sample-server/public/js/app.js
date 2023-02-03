var lightMode = true;

window.onload = async () => {
	// Login page
	if (window.location.pathname === '/login') {
		// Check url for params
		const searchParams = new URLSearchParams(document.location.search);
		const state = searchParams.get('state');

		// Update copy
		const appDomain = searchParams.get('app_domain');

		// Check for UI config param
		const ui = searchParams.get('ui');
		if (ui) {
			try {
				const uiConfig = JSON.parse(LZString.decompressFromEncodedURIComponent(ui));
				if (uiConfig && Object.keys(uiConfig).length > 0) {
					customizeUI(uiConfig, appDomain);
				}
			} catch (e) {
			}
		}

		initPrompt(appDomain);
		initGoogleLogin(state);
		initDiscordLogin(state);
	} else if (window.location.pathname === '/error') {
		// Style other pages
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			lightMode = false;
			document.body.setAttribute("data-lit-theme", "dark");
		}
	}
}

function initGoogleLogin(state) {
	let theme = "outline";
	if (!lightMode) {
		theme = "filled_blue";
	}
	google.accounts.id.initialize({
		client_id: "355007986731-llbjq5kbsg8ieb705mo64nfnh88dhlmn.apps.googleusercontent.com",
		ux_mode: 'redirect',
    login_uri: `${window.location.origin}/auth/callback/google?state=${state}`,
	});
	google.accounts.id.renderButton(
		document.getElementById("googleLogin"),
		{ theme: theme, size: "large", text: "continue_with", width: 256 } 
	);
}

function initDiscordLogin(state) {
	const encodedOrigin = encodeURIComponent(window.location.origin);
	const baseUrl = `https://discord.com/api/oauth2/authorize?client_id=1052874239658692668&redirect_uri=${encodedOrigin}%2Fauth%2Fcallback%2Fdiscord&response_type=code&scope=identify`;
	const url = `${baseUrl}&state=${state}`;
	const linkBtn = document.getElementById("discordLogin");
	linkBtn.href = url;
	linkBtn.classList.remove("litButton--disabled");
}

function customizeUI(uiConfig, appDomain) {
	const prompt = document.getElementById('prompt');

	if ("theme" in uiConfig && uiConfig.theme) {
		if (uiConfig.theme === "dark") {
			lightMode = false;
			document.body.setAttribute("data-lit-theme", "dark");
		}
	}

	if ("appName" in uiConfig && uiConfig.appName && uiConfig.appName.length > 0) {
		if (prompt && prompt.innerHTML.length === 0 && appDomain) {
			prompt.innerHTML = `to continue to <a href=${appDomain} target="_blank" rel="noopener noreferrer">${uiConfig.appName}</a>`;
		}
	}

	if ("appLogo" in uiConfig && uiConfig.appLogo && uiConfig.appLogo.length > 0) {
		document.getElementById('appLogo').src = uiConfig.appLogo;
	}

	let root = document.documentElement;

	if ("gradientColor" in uiConfig && uiConfig.gradientColor && uiConfig.gradientColor.length > 0) {
		root.style.setProperty('--lit-gradient-color', uiConfig.gradientColor);
	}

	if ("linkColor" in uiConfig && uiConfig.linkColor && uiConfig.linkColor.length > 0) {
		root.style.setProperty('--lit-link-color', uiConfig.linkColor);
	}
}

function initPrompt(appDomain) {
	const prompt = document.getElementById('prompt');

	// Update copy if still blank
	if (prompt && prompt.innerHTML.length === 0 && appDomain) {
		prompt.innerHTML = `to continue to <a href=${appDomain} target="_blank" rel="noopener noreferrer">${appDomain}</a>`;
	}
}