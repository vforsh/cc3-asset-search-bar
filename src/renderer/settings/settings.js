const { shell } = require('electron')
const { getUrlParam } = require('../../utils/browser-util')
const { translate } = require('../../utils/i18n')
const RendererEvent = require('../../utils/renderer-event')
const PackageUtil = require('../../utils/package-util')
const EditorRendererKit = require('../../utils/editor-renderer-kit')
const ConfigManager = require('../../common/config-manager')

// Import Vue utility functions
const { ref, watch, onMounted, onBeforeUnmount, createApp, computed } = Vue

/** Current language */
const LANG = getUrlParam('lang')

// Build Vue application
const App = {
	/**
	 * Setup
	 * @param {*} props
	 * @param {*} context
	 */
	setup(props, context) {
		// All file types that can be directly opened
		const OPENABLE_LIST = ref([
			{ ext: '.scene', type: t('scene') },
			{ ext: '.prefab', type: t('prefab') },
			{ ext: '.ts', type: t('typescript') },
			{ ext: '.js', type: t('javascript') },
			{ ext: '.json', type: t('json') },
			{ ext: '.md', type: t('markdown') },
			{ ext: '.txt', type: t('txt') },
		])
		
		// List of file types that can be directly opened
		const openable = ref([])

		// Preset shortcuts
		const presets = ref([
			{ key: '', name: t('none') },
			{ key: 'custom', name: t('custom') },
			{ key: 'F1', name: 'F1' },
			{ key: 'F3', name: 'F3' },
			{ key: 'F4', name: 'F4' },
			{ key: 'F5', name: 'F5' },
			{ key: 'F6', name: 'F6' },
			{ key: 'CmdOrCtrl+F', name: 'Cmd/Ctrl + F' },
			{ key: 'CmdOrCtrl+B', name: 'Cmd/Ctrl + B' },
			{ key: 'CmdOrCtrl+Shift+F', name: 'Cmd/Ctrl + Shift + F' },
		])
		
		// Selection
		const selectKey = ref('')
		
		// Custom
		const customKey = ref('')
		
		// Auto check for updates
		const autoCheckUpdate = ref(false)

		// Repository URL
		const repositoryUrl = PackageUtil.repository
		
		// Package name
		const packageName = PackageUtil.name

		// Computed property to determine if custom key input should be disabled
		const isCustomKeyDisabled = computed(() => selectKey.value !== 'custom')

		// Watch for shortcut selection changes
		watch(selectKey, (value) => {
			if (value !== 'custom') {
				customKey.value = ''
			}
		})

		// Watch for custom input changes
		watch(customKey, (value) => {
			if (value !== '' && selectKey.value !== 'custom') {
				selectKey.value = 'custom'
			}
		})

		/**
		 * Get configuration
		 */
		function getConfig() {
			const config = ConfigManager.get()
			if (!config) {
				return
			}

			// Openable file types
			openable.value = config.openable

			// Auto check for updates
			autoCheckUpdate.value = config.autoCheckUpdate

			// Shortcut key
			const hotkey = config.hotkey
			if (!hotkey || hotkey === '') {
				selectKey.value = ''
				customKey.value = ''
				return
			}

			// Preset shortcuts
			for (let i = 0, l = presets.value.length; i < l; i++) {
				if (presets.value[i].key === hotkey) {
					selectKey.value = hotkey
					customKey.value = ''
					return
				}
			}

			// Custom shortcut
			selectKey.value = 'custom'
			customKey.value = hotkey
		}

		/**
		 * Save configuration
		 */
		function setConfig() {
			const config = {
				openable: openable.value,
				hotkey: null,
				autoCheckUpdate: autoCheckUpdate.value,
			}

			if (selectKey.value === 'custom') {
				// Check if custom input is valid
				if (customKey.value === '') {
					EditorRendererKit.print('warn', translate('customKeyError'))
					return
				}
				// Cannot use double quotes (to avoid JSON parsing errors that could cause plugin loading failure)
				if (customKey.value.includes('"')) {
					customKey.value = customKey.value.replace(/\"/g, '')
					EditorRendererKit.print('warn', translate('quoteError'))
					return
				}
				config.hotkey = customKey.value
			} else {
				config.hotkey = selectKey.value
			}

			// Save to local storage
			ConfigManager.set(config)

			// Reload extension
			RendererEvent.send('reload')
		}

		/**
		 * Openable file type checkbox change callback
		 * @param {*} event
		 * @param {{ ext:string, type: string }} item
		 * @param {boolean} [isItemClick] Whether the event was triggered by clicking the item row
		 */
		function onOpenableChanged(event, item, isItemClick) {
			const { ext } = item
			const index = openable.value.indexOf(ext)

			if (isItemClick) {
				// For item clicks, always toggle the current state
				if (index === -1) {
					openable.value.push(ext)
				} else {
					openable.value.splice(index, 1)
				}
			} else {
				// For checkbox clicks, use the checkbox state
				if (event.target.checked && index === -1) {
					openable.value.push(ext)
				} else if (!event.target.checked && index !== -1) {
					openable.value.splice(index, 1)
				}
			}
		}

		/**
		 * Apply button click callback
		 * @param {*} event
		 */
		function onApplyBtnClick(event) {
			// Save configuration
			setConfig()
		}

		/**
		 * Close button click callback
		 */
		function onCloseClick() {
			RendererEvent.send('close-settings')
		}

		/**
		 * Translation
		 * @param {string} key
		 */
		function t(key) {
			return translate(LANG, key)
		}

		/**
		 * Lifecycle: After mount
		 */
		onMounted(() => {
			// Get configuration
			getConfig()

			// Override a tag click callback (use default browser to open web pages)
			const links = document.querySelectorAll('a[href]')
			links.forEach((link) => {
				link.addEventListener('click', (event) => {
					event.preventDefault()
					const url = link.getAttribute('href')
					shell.openExternal(url)
				})
			})

			// (Main process) Check for updates
			// RendererEvent.send('check-update', false)
		})

		/**
		 * Lifecycle: Before unmount
		 */
		onBeforeUnmount(() => {})

		return {
			OPENABLE_LIST,
			openable,
			presets,
			selectKey,
			customKey,
			autoCheckUpdate,
			repositoryUrl,
			packageName,
			isCustomKeyDisabled,
			onOpenableChanged,
			onApplyBtnClick,
			onCloseClick,
			t,
		}
	},
}

// Create instance
const app = createApp(App)
// Mount
app.mount('#app')
