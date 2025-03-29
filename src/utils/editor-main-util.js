const I18n = require('./i18n')
const PackageUtil = require('./package-util')
const Updater = require('./updater')

/** Editor language */
const LANG = Editor.lang || Editor.I18n.getLanguage()

/** Package name */
const PACKAGE_NAME = PackageUtil.name

/** Extension name */
const EXTENSION_NAME = I18n.translate(LANG, 'name')

/**
 * Editor main process utility (Depends on Cocos Creator Editor)
 */
const EditorMainUtil = {
	/**
	 * Language
	 */
	get language() {
		return LANG
	},

	/**
	 * i18n
	 * @param {string} key Keyword
	 * @returns {string}
	 */
	translate(key) {
		return I18n.translate(LANG, key)
	},

	/**
	 * Print information to the Editor console
	 * If you use console.log, it will print to the Developer Tools console instead of the Editor console.
	 * It is much easier to debug if you use this function.
	 *
	 * @param {'log' | 'info' | 'warn' | 'error' | any} type
	 * @param {any[]?} args
	 */
	print(type) {
		const args = [`[${EXTENSION_NAME}]`]
		for (let i = 1, l = arguments.length; i < l; i++) {
			args.push(arguments[i])
		}
		const object = Editor.log ? Editor : console
		switch (type) {
			case 'log': {
				object.log.apply(object, args)
				break
			}
			case 'info': {
				object.info.apply(object, args)
				break
			}
			case 'warn': {
				object.warn.apply(object, args)
				break
			}
			case 'error': {
				object.error.apply(object, args)
				break
			}
			default: {
				args.splice(1, 0, type)
				object.log.apply(object, args)
			}
		}
	},

	/**
	 * Check for updates
	 * @param {boolean} logWhatever Log tips regardless of whether there is an update
	 */
	async checkUpdate(logWhatever) {
		// Has the editor already checked during this startup?
		if (!logWhatever && Editor[PACKAGE_NAME] && Editor[PACKAGE_NAME].hasCheckUpdate) {
			return
		}
		Editor[PACKAGE_NAME] = { hasCheckUpdate: true }
		// Is there a new version?
		const hasNewVersion = await Updater.check()
		// Print to console
		const { print, translate } = EditorMainUtil
		const localVersion = Updater.getLocalVersion()
		if (hasNewVersion) {
			const remoteVersion = await Updater.getRemoteVersion()
			print('info', translate('hasNewVersion'))
			print('info', `${translate('localVersion')}${localVersion}`)
			print('info', `${translate('latestVersion')}${remoteVersion}`)
			print('info', translate('releases'))
			print('info', translate('cocosStore'))
		} else if (logWhatever) {
			print('info', translate('currentLatest'))
			print('info', `${translate('localVersion')}${localVersion}`)
		}
	},

	/**
	 * (3.x) Reload extension
	 */
	async reload() {
		const path = await Editor.Package.getPath(PACKAGE_NAME)
		await Editor.Package.unregister(path)
		await Editor.Package.register(path)
		await Editor.Package.enable(path)
	},
}

module.exports = EditorMainUtil
