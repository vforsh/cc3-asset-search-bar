/**
 * Browser Tools
 */
const BrowserUtil = {
	/**
	 * Get parameters from the current URL
	 * @param {string} key Key
	 * @returns {string}
	 */
	getUrlParam(key) {
		if (!window || !window.location) {
			return null
		}
		const query = window.location.search.replace('?', '')
		if (query === '') {
			return null
		}
		const substrings = query.split('&')
		for (let i = 0; i < substrings.length; i++) {
			const keyValue = substrings[i].split('=')
			if (decodeURIComponent(keyValue[0]) === key) {
				return decodeURIComponent(keyValue[1])
			}
		}
		return null
	},

	/**
	 * Get Cookie value
	 * @param {string} key Key
	 * @returns {string}
	 */
	getCookie(key) {
		const regExp = new RegExp(`(^| )${key}=([^;]*)(;|$)`),
			values = document.cookie.match(regExp)
		if (values !== null) {
			return values[2]
		}
		return null
	},

	/**
	 * Set Cookie
	 * @param {string} key Key
	 * @param {string | number | boolean} value Value
	 * @param {string} expires Expiration time (GMT)
	 */
	setCookie(key, value, expires) {
		let keyValues = `${key}=${encodeURIComponent(value)};`
		if (expires) {
			keyValues += `expires=${expires};`
		}
		document.cookie = keyValues
	},
}

module.exports = BrowserUtil
