window.onload = async () => {
	if (window.location.pathname === '/login') {
		// Check url for params
		const searchParams = new URLSearchParams(document.location.search);
		const state = searchParams.get('state');

		initGoogleLogin(state);
		initDiscordLogin(state);

		// Check for app domain
		const appDomain = searchParams.get('app_domain');
		if (appDomain) {
			document.getElementById('prompt').innerHTML = `to continue to <a href=${appDomain} target="_blank" rel="noopener noreferrer">${appDomain}</a>`;
		}
	}
};

function initGoogleLogin(state) {
	google.accounts.id.initialize({
		client_id: "355007986731-llbjq5kbsg8ieb705mo64nfnh88dhlmn.apps.googleusercontent.com",
		ux_mode: 'redirect',
    login_uri: `${window.location.origin}/auth/callback/google?state=${state}`,
	});
	google.accounts.id.renderButton(
		document.getElementById("googleLogin"),
		{ theme: "outline", size: "large", text: "continue_with", width: 256 } 
	);
}

function initDiscordLogin(state) {
	const encodedOrigin = encodeURIComponent(window.location.origin);
	const baseUrl = `https://discord.com/api/oauth2/authorize?client_id=1052874239658692668&redirect_uri=${encodedOrigin}%2Fauth%2Fcallback%2Fdiscord&response_type=code&scope=identify`;
	const url = `${baseUrl}&state=${state}`;
	const linkBtn = document.getElementById("discordLogin");
	linkBtn.href = url;
	linkBtn.classList.remove("button--disabled");
}