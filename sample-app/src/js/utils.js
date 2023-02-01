import { STATE_KEY } from "./constants";

export function isAllowedProvider(provider) {
  return ['google', 'discord'].includes(provider);
}

export function setStateParam() {
	const state = createRandomString();
	sessionStorage.setItem(STATE_KEY, state);
	return state;
}

export function getStateParam() {
	return sessionStorage.getItem(STATE_KEY);
}

export function removeStateParam() {
	return sessionStorage.removeItem(STATE_KEY);
}

export function createQueryParams(params) {
	// Strip undefined values from params
	const filteredParams = Object.keys(params)
	.filter(k => typeof params[k] !== 'undefined')
	.reduce((acc, key) => ({ ...acc, [key]: params[key] }), {});
	// Create query string
	return new URLSearchParams(filteredParams).toString();
}

export function createRandomString() {
	let randomString = '';
	const randomNumber = Math.floor(Math.random() * 10);

	for (let i = 0; i < 20 + randomNumber; i++) {
		randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
	}

	return randomString;
}

export function encode(value) {
	return window.btoa(value);
}

export function decode(value) {
	return window.atob(value);
}