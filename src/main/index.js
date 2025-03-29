const MainEvent = require('../utils/main-event')
const EditorMainKit = require('../utils/editor-main-kit')
const { checkUpdate, reload } = require('../utils/editor-main-util')
const Updater = require('../utils/updater')
const ConfigManager = require('../common/config-manager')
const Finder = require('./finder')
const Opener = require('./opener')
const PanelManager = require('./panel-manager')
const { openRepository } = require('../utils/package-util')

/**
 * Lifecycle: Load
 */
function load() {
	// Set repository branch
	Updater.branch = 'ccc-v3'
	// Listen for events
	EditorMainKit.register()
	MainEvent.on('match', onMatchEvent)
	MainEvent.on('open', onOpenEvent)
	MainEvent.on('focus', onFocusEvent)
	MainEvent.on('reload', onReloadEvent)
}

/**
 * Lifecycle: Unload
 */
function unload() {
	// Destroy any open panels
	PanelManager.destroyAllWindows()
	// Remove event listeners
	EditorMainKit.unregister()
	MainEvent.removeAllListeners('match')
	MainEvent.removeAllListeners('open')
	MainEvent.removeAllListeners('focus')
	MainEvent.removeAllListeners('reload')
}

/**
 * (Renderer process) Keyword match event callback
 * @param {Electron.IpcMainEvent} event
 * @param {string} keyword Keyword
 */
function onMatchEvent(event, keyword) {
	// Match results
	const results = Finder.getMatchedFiles(keyword)
	// Return results to the renderer process
	MainEvent.reply(event, 'match-reply', results)
}

/**
 * (Renderer process) Open file event callback
 * @param {Electron.IpcMainEvent} event
 * @param {string} path Path
 */
function onOpenEvent(event, path) {
	// Open file
	Opener.tryOpen(path)
	// Close search bar
	PanelManager.closeSearchBar()
}

/**
 * (Renderer process) Focus file event callback
 * @param {Electron.IpcMainEvent} event
 * @param {string} path Path
 */
async function onFocusEvent(event, path) {
	// Show and select file in asset explorer
	const uuid = await Opener.fspathToUuid(path)
	Opener.focusOnFile(uuid)
}

/**
 * (Renderer process) Reload event callback
 * @param {Electron.IpcMainEvent} event
 */
function onReloadEvent(event) {
	reload()
}

/**
 * Open search bar
 */
function openSearchBar() {
	const options = {
		// Before opening
		onBeforeOpen: async () => {
			// Collect file information in the project
			await Finder.collectFiles()
			// Send message to notify renderer process (search bar)
			if (PanelManager.search) {
				const webContents = PanelManager.search.webContents
				MainEvent.send(webContents, 'data-update')
			}
		},
		// After closing
		onClosed: () => {
			// Clear caches
			Finder.clearCaches()
		},
	}
	PanelManager.openSearchBar(options)
}

exports.load = load

exports.unload = unload

exports.methods = {
	/**
	 * Open search bar
	 */
	openSearchBar() {
		openSearchBar()
	},

	/**
	 * Open settings panel
	 */
	openSettingsPanel() {
		PanelManager.openSettingsPanel()
	},

	/**
	 * Check for updates
	 */
	menuCheckUpdate() {
		checkUpdate(true)
	},

	/**
	 * Version number
	 */
	menuVersion() {
		openRepository()
	},

	/**
	 * After scene editor is ready
	 */
	onSceneReady() {
		// Automatically check for updates
		const config = ConfigManager.get()
		if (config.autoCheckUpdate) {
			// checkUpdate(false);
		}
	},
}
