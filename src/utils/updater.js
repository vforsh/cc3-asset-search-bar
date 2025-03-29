const fetch = require('../../lib/node-fetch')
const PackageUtil = require('./package-util')
const { compareVersion } = require('./version-util')

/** Local version */
const LOCAL_VERSION = PackageUtil.version

/** Remote repository address */
const REMOTE_URL = PackageUtil.repository

/**
 * Updater
 */
const Updater = {
	/**
	 * Remote repository address
	 * @type {string}
	 */
	get remote() {
		return REMOTE_URL
	},

	/**
	 * Branch
	 * @type {string}
	 */
	branch: 'master',

	/**
	 * Get the remote package.json
	 * @returns {Promise<object>}
	 */
	async getRemotePackageJson() {
		const packageJsonUrl = `${Updater.remote}/raw/${Updater.branch}/package.json`
		// Initiate network request
		const response = await fetch(packageJsonUrl, {
			method: 'GET',
			cache: 'no-cache',
			mode: 'no-cors',
		})
		// Request result
		if (response.status !== 200) {
			return null
		}
		// Read json
		const json = response.json()
		return json
	},

	/**
	 * Get remote version number
	 * @returns {Promise<string>}
	 */
	async getRemoteVersion() {
		const package = await Updater.getRemotePackageJson()
		if (package && package.version) {
			return package.version
		}
		return null
	},

	/**
	 * Get local version number
	 * @returns {string}
	 */
	getLocalVersion() {
		return LOCAL_VERSION
	},

	/**
	 * Check if there is a new version remotely
	 * @returns {Promise<boolean>}
	 */
	async check() {
		// Remote version number
		const remoteVersion = await Updater.getRemoteVersion()
		if (!remoteVersion) {
			return false
		}
		// Local version number
		const localVersion = Updater.getLocalVersion()
		// Compare version numbers
		const result = compareVersion(localVersion, remoteVersion)
		return result < 0
	},
}

module.exports = Updater
