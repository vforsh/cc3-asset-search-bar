const Path = require('path')
const ConfigManager = require('../common/config-manager')

/**
 * File Opener
 */
const Opener = {
	/**
	 * Try to open file
	 * @param {string} path Path
	 */
	async tryOpen(path) {
		const extname = Path.extname(path),
			uuid = await Opener.fspathToUuid(path)
		// Whether fast open is configured
		const { openable } = ConfigManager.cache
		if (openable.indexOf(extname) !== -1) {
			Opener.open(uuid)
		}
		// Focus on the file
		Opener.focusOnFile(uuid)
	},

	/**
	 * Open file
	 * @param {string} uuid Uuid
	 */
	open(uuid) {
		Editor.Message.send('asset-db', 'open-asset', uuid)
	},

	/**
	 * Focus on the file (show and select the file in the asset explorer)
	 * @param {string} uuid Uuid
	 */
	focusOnFile(uuid) {
		Editor.Selection.clear('asset')
		Editor.Selection.select('asset', [uuid])
	},

	/**
	 * Get uuid via absolute path
	 * @param {string} path Path
	 * @returns {Promise<string>}
	 */
	fspathToUuid(path) {
		return Editor.Message.request('asset-db', 'query-uuid', path)
	},
}

module.exports = Opener
