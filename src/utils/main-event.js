const { ipcMain } = require('electron')
const PackageUtil = require('./package-util')

/** Package name */
const PACKAGE_NAME = PackageUtil.name

/**
 * Main process IPC event
 */
const MainEvent = {
	/**
	 * Listen for event (once)
	 * @param {string} channel Channel
	 * @param {Function} callback Callback
	 */
	once(channel, callback) {
		return ipcMain.once(`${PACKAGE_NAME}:${channel}`, callback)
	},

	/**
	 * Listen for event
	 * @param {string} channel Channel
	 * @param {Function} callback Callback
	 */
	on(channel, callback) {
		return ipcMain.on(`${PACKAGE_NAME}:${channel}`, callback)
	},

	/**
	 * Remove event listener
	 * @param {string} channel Channel
	 * @param {Function} callback Callback
	 */
	removeListener(channel, callback) {
		return ipcMain.removeListener(`${PACKAGE_NAME}:${channel}`, callback)
	},

	/**
	 * Remove all listeners for an event
	 * @param {string} channel Channel
	 */
	removeAllListeners(channel) {
		return ipcMain.removeAllListeners(`${PACKAGE_NAME}:${channel}`)
	},

	/**
	 * Send event to the specified renderer process
	 * @param {Electron.WebContents} webContents Renderer process event object
	 * @param {string} channel Channel
	 * @param {any[]?} args Arguments
	 */
	send(webContents, channel) {
		// return webContents.send(`${PACKAGE_NAME}:${channel}`, ...args);
		const args = [`${PACKAGE_NAME}:${channel}`]
		for (let i = 2, l = arguments.length; i < l; i++) {
			args.push(arguments[i])
		}
		return webContents.send.apply(webContents, args)
	},

	/**
	 * Reply event to the renderer process
	 * @param {Electron.IpcMainEvent} ipcMainEvent Event object
	 * @param {string} channel Channel
	 * @param {any[]?} args Arguments
	 */
	reply(ipcMainEvent, channel) {
		// return ipcMainEvent.reply(`${PACKAGE_NAME}:${channel}`, ...args);
		const args = [`${PACKAGE_NAME}:${channel}`]
		for (let i = 2, l = arguments.length; i < l; i++) {
			args.push(arguments[i])
		}
		return ipcMainEvent.reply.apply(ipcMainEvent, args)
	},
}

module.exports = MainEvent
