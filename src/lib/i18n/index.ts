import { init, register } from 'svelte-i18n';

const defaultLocale = 'fr';

register('fr', () => import('./fr.json'));
register('en', () => import('./en.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: defaultLocale
});
