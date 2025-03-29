const { ipcRenderer } = require('electron')
const PackageUtil = require('./package-util')

/** Package name */
const PACKAGE_NAME = PackageUtil.name

/**
 * Renderer process IPC event
 */
const RendererEvent = {
	/**
	 * Listen for event (once)
	 * @param {string} channel Channel
	 * @param {Function} callback Callback
	 */
	once(channel, callback) {
		return ipcRenderer.once(`${PACKAGE_NAME}:${channel}`, callback)
	},

	/**
	 * Listen for event
	 * @param {string} channel Channel
	 * @param {Function} callback Callback
	 */
	on(channel, callback) {
		return ipcRenderer.on(`${PACKAGE_NAME}:${channel}`, callback)
	},

	/**
	 * Remove event listener
	 * @param {string} channel Channel
	 * @param {Function} callback Callback
	 */
	removeListener(channel, callback) {
		return ipcRenderer.removeListener(`${PACKAGE_NAME}:${channel}`, callback)
	},

	/**
	 * Remove all listeners for an event
	 * @param {string} channel Channel
	 */
	removeAllListeners(channel) {
		return ipcRenderer.removeAllListeners(`${PACKAGE_NAME}:${channel}`)
	},

	/**
	 * Send event to the main process
	 * @param {string} channel Channel
	 * @param {...any} args Arguments
	 */
	send(channel) {
		// return ipcRenderer.send(`${PACKAGE_NAME}:${channel}`, ...args);
		const args = [`${PACKAGE_NAME}:${channel}`]
		for (let i = 1, l = arguments.length; i < l; i++) {
			args.push(arguments[i])
		}
		return ipcRenderer.send.apply(ipcRenderer, args)
	},

	/**
	 * Send event to the main process (synchronously)
	 * @param {string} channel Channel
	 * @param {...any} args Arguments
	 * @returns {Promise<any>}
	 */
	sendSync(channel) {
		// return ipcRenderer.sendSync(`${PACKAGE_NAME}:${channel}`, ...args);
		const args = [`${PACKAGE_NAME}:${channel}`]
		for (let i = 1, l = arguments.length; i < l; i++) {
			args.push(arguments[i])
		}
		return ipcRenderer.sendSync.apply(ipcRenderer, args)
	},
}

module.exports = RendererEvent
