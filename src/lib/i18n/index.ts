import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'fr';

register('fr', () => import('./fr.json'));
register('en', () => import('./en.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language.slice(0, 2) : defaultLocale
});
