const Path = require('path')
const Fs = require('fs')

/** Config file path */
const CONFIG_PATH = Path.join(__dirname, '../../config.json')

/** Path to package.json */
const PACKAGE_PATH = Path.join(__dirname, '../../package.json')

/**
 * Configuration cache
 */
let configCache = null

/**
 * Configuration Manager
 */
const ConfigManager = {
	/**
	 * Configuration cache
	 */
	get cache() {
		if (!configCache) {
			ConfigManager.get()
		}
		return configCache
	},

	/**
	 * Default configuration
	 */
	get defaultConfig() {
		return {
			version: '1.1',
			openable: ['.scene', '.prefab'],
			autoCheckUpdate: true,
			recentItems: [],
		}
	},

	/**
	 * Read configuration
	 */
	get() {
		const config = ConfigManager.defaultConfig
		// Configuration
		if (Fs.existsSync(CONFIG_PATH)) {
			const localConfig = JSON.parse(Fs.readFileSync(CONFIG_PATH))
			for (const key in config) {
				if (localConfig[key] !== undefined) {
					config[key] = localConfig[key]
				}
			}
		}
		// Cache it
		configCache = JSON.parse(JSON.stringify(config))

		// Hotkey
		config.hotkey = ConfigManager.getAccelerator()

		// Done
		return config
	},

	/**
	 * Save configuration
	 * @param {*} value Configuration
	 */
	set(value) {
		const config = ConfigManager.defaultConfig
		// Configuration
		for (const key in config) {
			if (value[key] !== undefined) {
				config[key] = value[key]
			}
		}
		Fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2))
		// Cache it
		configCache = JSON.parse(JSON.stringify(config))

		// Hotkey
		ConfigManager.setAccelerator(value.hotkey)
	},

	/**
	 * Get accelerator
	 * @returns {string}
	 */
	getAccelerator() {
		const package = JSON.parse(Fs.readFileSync(PACKAGE_PATH)),
			item = package['contributions']['shortcuts'][0]
		return item['win'] || ''
	},

	/**
	 * Set accelerator
	 * @param {string} value
	 */
	setAccelerator(value) {
		const package = JSON.parse(Fs.readFileSync(PACKAGE_PATH)),
			item = package['contributions']['shortcuts'][0]
		if (value != undefined && value !== '') {
			item['win'] = value
			item['mac'] = value
		} else {
			item['win'] = ''
			item['mac'] = ''
		}
		Fs.writeFileSync(PACKAGE_PATH, JSON.stringify(package, null, 2))
	},

	/**
	 * Add an item to recent items
	 * @param {{ name: string, path: string, extname: string }} item
	 */
	addRecentItem(item) {
		const config = this.get()
		const recentItems = config.recentItems || []

		// Remove if already exists (to move it to top)
		const existingIndex = recentItems.findIndex((i) => i.path === item.path)
		if (existingIndex !== -1) {
			recentItems.splice(existingIndex, 1)
		}

		// Add to start of array
		recentItems.unshift(item)

		// Keep only 5 items
		if (recentItems.length > 5) {
			recentItems.pop()
		}

		// Save updated config
		config.recentItems = recentItems
		this.set(config)
	},

	/**
	 * Get recent items
	 * @returns {{ name: string, path: string, extname: string }[]}
	 */
	getRecentItems() {
		const config = this.get()
		return config.recentItems || []
	},
}

module.exports = ConfigManager
