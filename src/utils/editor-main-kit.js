const MainEvent = require('./main-event')
const { print, checkUpdate } = require('./editor-main-util')

/**
 * (Renderer process) Check update callback
 * @param {Electron.IpcMainEvent} event
 * @param {boolean} logWhatever Log tips regardless of whether there is an update
 */
function onCheckUpdateEvent(event, logWhatever) {
	checkUpdate(logWhatever)
}

/**
 * (Renderer process) Print event callback
 * @param {Electron.IpcMainEvent} event
 * @param {'log' | 'info' | 'warn' | 'error' | any} type
 * @param {any[]?} args
 */
function onPrintEvent(event, type) {
	// print(type, ...args);
	const args = [type]
	for (let i = 2, l = arguments.length; i < l; i++) {
		args.push(arguments[i])
	}
	print.apply(null, args)
}

/**
 * Editor main process kit (Depends on Cocos Creator Editor)
 */
const EditorMainKit = {
	/**
	 * Register
	 */
	register() {
		MainEvent.on('check-update', onCheckUpdateEvent)
		MainEvent.on('print', onPrintEvent)
	},

	/**
	 * Unregister
	 */
	unregister() {
		MainEvent.removeListener('check-update', onCheckUpdateEvent)
		MainEvent.removeListener('print', onPrintEvent)
	},
}

module.exports = EditorMainKit
