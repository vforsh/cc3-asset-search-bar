const RendererEvent = require('./renderer-event')

/**
 * Editor renderer process kit (Depends on Cocos Creator Editor)
 */
const EditorRendererKit = {
	/**
	 * Print information to the Creator editor console
	 * @param {'log' | 'info' | 'warn' | 'error' | any} type
	 * @param {any[]?} args
	 */
	print(type) {
		// return RendererEvent.send('print', type, ...args);
		const args = ['print', type]
		for (let i = 1, l = arguments.length; i < l; i++) {
			args.push(arguments[i])
		}
		return RendererEvent.send.apply(RendererEvent, args)
	},
}

module.exports = EditorRendererKit
