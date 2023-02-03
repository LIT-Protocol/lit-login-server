export function setLitUIConfig(uiConfig) {
	if ("theme" in uiConfig && uiConfig.theme) {
		if (uiConfig.theme === "dark") {
			document.getElementById("lit").setAttribute("data-lit-theme", "dark");
		}
	}

	let root = document.documentElement;

	if ("gradientColor" in uiConfig && uiConfig.gradientColor && uiConfig.gradientColor.length > 0) {
		root.style.setProperty('--lit-gradient-color', uiConfig.gradientColor);
	}

	if ("linkColor" in uiConfig && uiConfig.linkColor && uiConfig.linkColor.length > 0) {
		root.style.setProperty('--lit-link-color', uiConfig.linkColor);
	}
}

export function renderLitUI(state) {
	const litContainer = document.getElementById('lit');
	if (!litContainer) {
		throw new Error('Lit UI container not found');
	}

	switch(state) {
		case 'verify-redirect':
			verifyingRedirect();
			break;
		case 'minting':
			mintingNewWallet();
			break;
		case 'polling':
			loadingNewWallet();
			break;
		case 'create-session':
			creatingSession();
			break;
		case 'error':
			loginError();
			break;
		default:
			break;
	}

	litContainer.removeAttribute('hidden');
}

function verifyingRedirect() {
	document.getElementById('lit').innerHTML = `
	<div class="litBg litBg--custom"></div>
	<div class="litModal">
		<div class="litModal__content">
			<div class="litImg litImg--loading">
				<div class="litImg__bg"></div>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="litImg__icon litImg__icon--small">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
				</svg>
			</div>
			<h1 class="litModal__title">Verifying</h1>
			<p class="litModal__body">Checking your credentials...</p>
			<div class="litModal__footer">
				<span>Powered by <a href="https://litprotocol.com/" target="_blank" rel="noopener noreferrer" class="litLink">Lit Protocol</a></span>
			</div>
		</div>
	</div>
	`
}

function mintingNewWallet() {
	document.getElementById('lit').innerHTML = `
	<div class="litBg litBg--custom"></div>
	<div class="litModal">
		<div class="litModal__content">
			<div class="litImg litImg--loading">
				<div class="litImg__bg"></div>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="litImg__icon litImg__icon--small">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
				</svg>
			</div>
			<h1 class="litModal__title">Minting</h1>
			<p class="litModal__body">Creating your cloud wallet...</p>
			<div class="litModal__footer">
				<span>Powered by <a href="https://litprotocol.com/" target="_blank" rel="noopener noreferrer" class="litLink">Lit Protocol</a></span>
			</div>
		</div>
	</div>`
}

function loadingNewWallet() {
	document.getElementById('lit').innerHTML = `
	<div class="litBg litBg--custom"></div>
	<div class="litModal">
		<div class="litModal__content">
			<div class="litImg litImg--loading">
				<div class="litImg__bg"></div>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="litImg__icon litImg__icon--small">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
				</svg>
			</div>
			<h1 class="litModal__title">Loading</h1>
			<p class="litModal__body">Preparing your new cloud wallet...</p>
			<div class="litModal__footer">
				<span>Powered by <a href="https://litprotocol.com/" target="_blank" rel="noopener noreferrer" class="litLink">Lit Protocol</a></span>
			</div>
		</div>
	</div>`
}

function creatingSession() {
	document.getElementById('lit').innerHTML = `
	<div class="litBg litBg--custom"></div>
	<div class="litModal">
		<div class="litModal__content">
			<div class="litImg litImg--loading">
				<div class="litImg__bg"></div>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="litImg__icon litImg__icon--small">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
				</svg>
			</div>
			<h1 class="litModal__title">Finalizing</h1>
			<p class="litModal__body">Saving your session...</p>
			<div class="litModal__footer">
				<span>Powered by <a href="https://litprotocol.com/" target="_blank" rel="noopener noreferrer" class="litLink">Lit Protocol</a></span>
			</div>
		</div>
	</div>`
}

function loginError() {
	document.getElementById('lit').innerHTML = `
	<div class="litBg litBg--custom"></div>
	<div class="litModal">
		<div class="litModal__content">
			<div class="litImg litImg--error">
				<div class="litImg__bg"></div>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="litImg__icon">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
				</svg>
			</div>
			<h1 class="litModal__title">Uh oh</h1>
			<p class="litModal__body">Unable to sign you in. Please try again.</p>
			<div class="litModal__buttonWrapper">
				<a class="litButton litButton--primary" href="${window.location.origin}">
					Return home
				</a>
			</div>
		</div>
	</div>`
}