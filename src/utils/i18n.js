const zh = require('../../i18n/zh')
const en = require('../../i18n/en')

/**
 * Multi-language
 */
const I18n = {
	/**
	 * Chinese
	 */
	zh,

	/**
	 * English
	 */
	en,

	/**
	 * Multi-language text
	 * @param {string} lang Language
	 * @param {string} key Keyword
	 * @returns {string}
	 */
	translate(lang, key) {
		if (I18n[lang] && I18n[lang][key]) {
			return I18n[lang][key]
		}
		return key
	},
}

module.exports = I18n
