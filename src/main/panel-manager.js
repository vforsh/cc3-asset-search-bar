const { BrowserWindow } = require('electron')
const { join } = require('path')
const { language, translate } = require('../utils/editor-main-util')
const { calcWindowPositionByFocused } = require('../utils/window-util')
const MainEvent = require('../utils/main-event')

/** Extension Name */
const EXTENSION_NAME = translate('name')

/**
 * Window close policy type
 * @typedef {'hide' | 'destroy'} WindowClosePolicy
 */

/**
 * Panel Manager (Main Process)
 */
const PanelManager = {
	/**
	 * Controls how the search window should be handled when closing
	 * @type {WindowClosePolicy}
	 */
	searchClosePolicy: 'destroy',

	/**
	 * Search bar instance
	 * @type {BrowserWindow | null}
	 */
	search: null,

	/**
	 * Open search bar
	 * @param {{ onBeforeOpen: () => void, onClosed: () => void }} options
	 */
	openSearchBar(options) {
		// Collect file information in the project (if needed on first open)
		options.onBeforeOpen()

		// --- If window already exists, just show it ---
		if (PanelManager.search) {
			PanelManager.search.show()
			PanelManager.search.focus() // Bring it to the front
			MainEvent.send(PanelManager.search.webContents, 'reset-search')
			return
		}

		// Window size and position
		const winSize = [700, 650]
		const winPos = calcWindowPositionByFocused(winSize, 'top')

		const win = (PanelManager.search = new BrowserWindow({
			width: winSize[0],
			height: winSize[1],
			x: winPos[0],
			y: winPos[1] + 150,
			frame: false,
			resizable: false,
			fullscreenable: false,
			skipTaskbar: true,
			alwaysOnTop: true,
			transparent: true,
			backgroundColor: '#00000000',
			show: false, // Important: Start hidden until ready-to-show
			useContentSize: true,
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
			},
		}))

		// --- Event Listeners for the new window ---

		// Show when ready (avoid flickering)
		win.once('ready-to-show', () => {
			// Use 'once' if we only need it the first time
			win.show()
		})

		// Hide on blur
		win.on('blur', () => {
			PanelManager.closeSearchBar()
		})

		// Handle window actually closing (e.g., devtools close)
		win.on('closed', () => {
			PanelManager.search = null // Ensure we clear the reference
			options.onClosed()
		})

		// Listen for key presses (Hide on Escape)
		win.webContents.on('before-input-event', (event, input) => {
			if (input.key === 'Escape') {
				PanelManager.closeSearchBar()
			}
		})

		// Devtools for debugging
		// win.webContents.openDevTools({ mode: 'detach' });

		// Load page
		const path = join(__dirname, '../renderer/search/search.html')
		win.loadURL(`file://${path}?lang=${language}`)
	},

	/**
	 * Explicitly closes and destroys the search panel window.
	 * Should be called on extension unload.
	 */
	destroySearchPanel() {
		if (PanelManager.search) {
			// Remove all listeners to prevent errors during closing
			PanelManager.search.removeAllListeners()
			// Close the window (this will trigger the 'closed' event which sets PanelManager.search to null)
			PanelManager.search.close()
		}
	},

	/**
	 * Close search bar window according to the searchClosePolicy
	 */
	closeSearchBar() {
		if (!PanelManager.search || PanelManager.search.isDestroyed()) {
			return
		}

		if (PanelManager.searchClosePolicy === 'destroy') {
			PanelManager.search.removeAllListeners()
			PanelManager.search.close()
			PanelManager.search = null
		} else {
			PanelManager.search.hide()
		}
	},

	/**
	 * Panel instance
	 * @type {BrowserWindow | null}
	 */
	settings: null,

	/**
	 * Open settings panel
	 */
	openSettingsPanel() {
		// If already open and not destroyed, show it directly
		if (PanelManager.settings && !PanelManager.settings.isDestroyed()) {
			PanelManager.settings.show()
			return
		}

		// Clear the reference if the window was destroyed
		if (PanelManager.settings && PanelManager.settings.isDestroyed()) {
			PanelManager.settings = null
		}

		// Window size and position (macOS title bar height 28px)
		const winSize = [500, 604]
		const winPos = calcWindowPositionByFocused(winSize, 'center')

		// Create window
		const win = (PanelManager.settings = new BrowserWindow({
			width: winSize[0],
			height: winSize[1],
			minWidth: winSize[0],
			minHeight: winSize[1],
			x: winPos[0],
			y: winPos[1] - 100,
			frame: false,
			title: `${EXTENSION_NAME} ${translate('settings')}`,
			autoHideMenuBar: true,
			resizable: false,
			minimizable: false,
			maximizable: false,
			fullscreenable: false,
			skipTaskbar: false,
			hasShadow: true,
			show: false,
			transparent: true,
			// backgroundColor: '#00000000',
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
			},
		}))

		// After ready (show, avoid flickering)
		win.on('ready-to-show', () => win.show())

		// Listen for close request from renderer
		const closeHandler = (event) => {
			if (win && event.sender === win.webContents) {
				MainEvent.removeListener('close-settings', closeHandler)
				PanelManager.closeSettingsPanel()
			}
		}
		MainEvent.on('close-settings', closeHandler)

		// After closing
		win.on('closed', () => {
			MainEvent.removeListener('close-settings', closeHandler)
			PanelManager.settings = null
		})

		// Listen for key presses
		win.webContents.on('before-input-event', (event, input) => {
			if (input.key === 'Escape') {
				MainEvent.removeListener('close-settings', closeHandler)
				PanelManager.closeSettingsPanel()
			}
		})

		// Devtools for debugging
		// win.webContents.openDevTools({ mode: 'detach' });

		// Load page
		const path = join(__dirname, '../renderer/settings/settings.html')
		win.loadURL(`file://${path}?lang=${language}`)
	},

	closeSettingsPanel() {
		if (!PanelManager.settings) {
			return
		}

		PanelManager.settings.close()
	},

	/**
	 * Destroys the settings panel window.
	 * Should be called on extension unload.
	 */
	destroySettingsPanel() {
		if (!PanelManager.settings) {
			return
		}

		PanelManager.settings.removeAllListeners()
		PanelManager.settings.close() // Triggers 'closed' event which sets PanelManager.settings = null
	},
}

// Add a combined destroy function for convenience
PanelManager.destroyAllWindows = function () {
	PanelManager.destroySearchPanel()
	PanelManager.destroySettingsPanel()
}

module.exports = PanelManager
