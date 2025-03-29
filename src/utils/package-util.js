const { shell } = require('electron')

/** Package information */
const PACKAGE_JSON = require('../../package.json')

/**
 * Package utility
 */
const PackageUtil = {
	/**
	 * Package name
	 * @type {string}
	 */
	get name() {
		return PACKAGE_JSON.name
	},

	/**
	 * Version
	 * @type {string}
	 */
	get version() {
		return PACKAGE_JSON.version
	},

	/**
	 * Repository address
	 * @type {string}
	 */
	get repository() {
		return PACKAGE_JSON.repository
	},

	/**
	 * Open repository page
	 */
	openRepository() {
		const url = PackageUtil.repository
		shell.openExternal(url)
	},
}

module.exports = PackageUtil
