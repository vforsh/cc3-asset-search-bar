/**
 * @type {import('prettier').Config}
 */
module.exports = {
	tabWidth: 4,
	useTabs: true,
	semi: false,
	singleQuote: true,
	printWidth: 120,
	bracketSameLine: true,
	quoteProps: 'consistent',
	plugins: ['prettier-plugin-organize-imports'],
};
