const { BrowserWindow } = require('electron')

/**
 * Window Tools (Main Process)
 */
const WindowUtil = {
	/**
	 * First opened window
	 * @returns {BrowserWindow}
	 */
	getFirstWindow() {
		const wins = BrowserWindow.getAllWindows()
		return wins[wins.length - 1]
	},

	/**
	 * Get the currently focused window
	 * @returns {BrowserWindow}
	 */
	getFocusedWindow() {
		return BrowserWindow.getFocusedWindow()
	},

	/**
	 * Calculate window position (relative to the first opened window)
	 * @param {[number, number]} size Window size
	 * @param {'top' | 'center'} anchor Anchor
	 * @returns {[number, number]}
	 */
	calcWindowPosition(size, anchor) {
		const win = WindowUtil.getFirstWindow()
		return WindowUtil.calcWindowPositionByTarget(size, anchor, win)
	},

	/**
	 * Calculate window position (relative to the currently focused window)
	 * @param {[number, number]} size Window size
	 * @param {'top' | 'center'} anchor Anchor
	 * @returns {[number, number]}
	 */
	calcWindowPositionByFocused(size, anchor) {
		const win = WindowUtil.getFocusedWindow()
		return WindowUtil.calcWindowPositionByTarget(size, anchor, win)
	},

	/**
	 * Calculate window position (relative to the currently focused window)
	 * @param {[number, number]} size Window size
	 * @param {'top' | 'center'} anchor Anchor
	 * @param {BrowserWindow} win Target window
	 * @returns {[number, number]}
	 */
	calcWindowPositionByTarget(size, anchor, win) {
		// Calculate based on the target window's position and size
		const winSize = win.getSize(),
			winPos = win.getPosition()
		// Note: The origin (0, 0) is at the top-left corner of the screen
		// Also, the window position value must be an integer, otherwise the modification is invalid (minimum pixel granularity is 1)
		const x = Math.floor(winPos[0] + winSize[0] / 2 - size[0] / 2)
		let y
		switch (anchor) {
			case 'top': {
				y = Math.floor(winPos[1])
				break
			}
			default:
			case 'center': {
				y = Math.floor(winPos[1] + winSize[1] / 2 - size[1] / 2)
				break
			}
		}
		return [x, y]
	},
}

module.exports = WindowUtil
