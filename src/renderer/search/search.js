const { sep } = require('path')
const { getUrlParam } = require('../../utils/browser-util')
const { translate } = require('../../utils/i18n')
const RendererEvent = require('../../utils/renderer-event')
const ConfigManager = require('../../common/config-manager')
const lucide = require('lucide-vue-next')
const { shell } = require('electron')
const { dirname } = require('path')
const { platform } = require('process')

// Import Vue utility functions
const { ref, onMounted, onBeforeUnmount, nextTick, createApp, h } = Vue

// Import Lucide icons
const {
	FileIcon,
	FileCode2,
	FileType,
	FileText,
	FileJson,
	FileAudio,
	Image: ImageIcon,
	Box,
	Cube,
	Layers3,
	Puzzle,
	Palette,
	Type,
	FileSymlink,
	FileVideo,
	Code,
	FileSpreadsheet,
	FileImage,
	Markdown,
	FileInput,
	Folder,
	X,
} = require('lucide-vue-next')

/** Current language */
const LANG = getUrlParam('lang')

const ICON_MAP = {
	'.anim': 'layers-3',
	'.prefab': 'box',
	'.fire': 'box',
	'.scene': 'box',
	'.effect': 'palette',
	'.mesh': 'cube',
	'.FBX': 'cube',
	'.mtl': 'palette',
	'.pmtl': 'file-symlink',
	'.pac': 'file-image',
	'.ts': 'file-code-2',
	'.js': 'file-code-2',
	'.coffee': 'file-code-2',
	'.json': 'file-json',
	'.md': 'file-text',
	'.html': 'code',
	'.css': 'file-type',
	'.txt': 'file-text',
	'.ttf': 'type',
	'.fnt': 'type',
	'.mp3': 'file-audio',
	'.png': 'image',
	'.jpg': 'image',
	'.plist': 'file-spreadsheet',
}

// Build Vue application
const App = {
	components: {
		FileIcon,
		FileCode2,
		FileType,
		FileText,
		FileJson,
		FileAudio,
		ImageIcon,
		Box,
		Cube,
		Layers3,
		Puzzle,
		Palette,
		Type,
		FileSymlink,
		FileVideo,
		Code,
		FileSpreadsheet,
		FileImage,
		Markdown,
		FileInput,
		Folder,
		X,
	},

	/**
	 * Setup
	 * @param {*} props
	 * @param {*} context
	 */
	setup(props, context) {
		// Frame loading timer
		let loadHandler = null

		// Input field element
		const input = ref(null)

		// Input keyword
		const keyword = ref('')
		// Results from keyword matching
		const items = ref([])
		// Recent items
		const recentItems = ref([])
		// Show recent items
		const showRecent = ref(true)
		// Current selected item index
		const curIndex = ref(-1)

		/**
		 * Update current selection
		 */
		function updateSelected() {
			const currentItems = showRecent.value ? recentItems.value : items.value
			// Update input field text
			keyword.value = currentItems[curIndex.value].name
			// Handle scrolling
			nextTick(() => {
				const list = document.querySelector(showRecent.value ? '.recent .list' : '.result .list')
				const id = showRecent.value ? `recent-item-${curIndex.value}` : `item-${curIndex.value}`
				const element = document.getElementById(id)

				if (curIndex.value === 0) {
					// First item - scroll to very top
					list.scrollTop = 0
				} else if (curIndex.value === currentItems.length - 1) {
					// Last item - scroll to very bottom
					list.scrollTop = list.scrollHeight
				} else {
					// Middle items - keep them in view
					element.scrollIntoViewIfNeeded(false)
				}
			})
		}

		/**
		 * Input field update callback
		 * @param {*} event
		 */
		function onInputChange(event) {
			// Cancel frame loading
			if (loadHandler) {
				clearTimeout(loadHandler)
				loadHandler = null
			}
			// Cancel current selection
			curIndex.value = -1
			// Toggle recent items visibility
			showRecent.value = keyword.value === ''
			// Don't search when keyword is empty
			if (keyword.value === '') {
				items.value.length = 0
				return
			}
			// Send message to main process for keyword matching
			RendererEvent.send('match', keyword.value)
		}

		/**
		 * Confirm button click callback
		 * @param {*} event
		 */
		function onEnterBtnClick(event) {
			if (curIndex.value === -1) {
				if (keyword.value !== '') {
					// Input field text error animation
					const inputClasses = input.value.classList
					inputClasses.add('input-error')
					setTimeout(() => {
						inputClasses.remove('input-error')
					}, 500)
				}
			} else {
				const currentItems = showRecent.value ? recentItems.value : items.value
				const item = currentItems[curIndex.value]
				// Update input field text
				keyword.value = item.name
				// Add to recent items
				ConfigManager.addRecentItem(item)
				// Send message to main process
				RendererEvent.send('open', item.path)
			}
			// Focus on input field (focus is currently on button or list)
			focusOnInputField()
		}

		/**
		 * Up arrow key callback
		 * @param {*} event
		 */
		function onUpBtnClick(event) {
			const currentItems = showRecent.value ? recentItems.value : items.value
			if (currentItems.length === 0) return

			// Prevent default event (cursor movement)
			event.preventDefault()
			// Cycle through selection
			if (curIndex.value > 0) {
				curIndex.value--
			} else {
				curIndex.value = currentItems.length - 1
			}
			// Update selection
			updateSelected()
		}

		/**
		 * Down arrow key callback
		 * @param {*} event
		 */
		function onDownBtnClick(event) {
			const currentItems = showRecent.value ? recentItems.value : items.value
			if (currentItems.length === 0) return

			// Prevent default event (cursor movement)
			event.preventDefault()
			// Cycle through selection
			if (curIndex.value >= currentItems.length - 1) {
				curIndex.value = 0
			} else {
				curIndex.value++
			}
			// Update selection
			updateSelected()
		}

		/**
		 * Left arrow key callback
		 * @param {*} event
		 */
		function onLeftBtnClick(event) {
			// Check if item is selected
			if (curIndex.value === -1) {
				return
			}
			// Prevent default event (cursor movement)
			event.preventDefault()
			// Show and select file in asset explorer
			focusOnFileInAssets()
		}

		/**
		 * Right arrow key callback
		 * @param {*} event
		 */
		function onRightBtnClick(event) {
			// Check if item is selected
			if (curIndex.value === -1) {
				return
			}
			// Prevent default event (cursor movement)
			event.preventDefault()
			// Show and select file in asset explorer
			focusOnFileInAssets()
		}

		/**
		 * Show and select file in asset explorer
		 */
		function focusOnFileInAssets() {
			// Currently selected item
			const item = items.value[curIndex.value]
			// Send message to main process
			RendererEvent.send('focus', item.path)
		}

		/**
		 * Result click callback
		 * @param {{ name: string, path: string, extname: string }} item Data
		 * @param {number} index Index
		 */
		function onItemClick(item, index) {
			curIndex.value = parseInt(index)
			keyword.value = item.name
			// Add component
			onEnterBtnClick(null)
			// Focus on input field (focus is currently on list)
			// Now handled uniformly in onEnterBtnClick
			// focusOnInputField();
		}

		/**
		 * Focus on input field
		 */
		function focusOnInputField() {
			input.value.focus()
		}

		/**
		 * Open containing folder of a file
		 * @param {{ name: string, path: string, extname: string }} item File item
		 */
		function openInFolder(item) {
			shell.showItemInFolder(item.path)
		}

		/**
		 * (Main process) Data update callback
		 * @param {Electron.IpcRendererEvent} event
		 */
		function onDataUpdate(event) {
			// console.log('onDataUpdate');
			// Trigger file search
			onInputChange(null)
		}

		/**
		 * (Main process) Keyword matching callback
		 * @param {Electron.IpcRendererEvent} event
		 * @param {{ name: string, path: string, extname: string }[]} results Results
		 */
		function onMatchReply(event, results) {
			// console.log('onMatchReply', results);
			// Clear existing data
			items.value.length = 0
			// When there's only one result, select it directly
			if (results.length === 1) {
				items.value = results
				curIndex.value = 0
				return
			}
			// Load in segments when there are many results
			if (results.length >= 200) {
				// Number of items to load each time
				const threshold = 400
				// Segment loading function
				const load = () => {
					const length = results.length,
						count = length >= threshold ? threshold : length,
						part = results.splice(0, count)
					// Load a portion
					for (let i = 0, l = part.length; i < l; i++) {
						items.value.push(part[i])
					}
					// Check if there's more data
					if (results.length > 0) {
						// Continue with next batch
						loadHandler = setTimeout(load)
					} else {
						// Done
						loadHandler = null
					}
				}
				// Start loading
				load()
			} else {
				// Not many results, update result list directly
				items.value = results
			}
		}

		/**
		 * Process path
		 * @param {string} path Full path
		 * @returns {string}
		 */
		function getPath(path) {
			const start = path.indexOf(`${sep}assets`)
			return path.slice(start + 1)
		}

		/**
		 * Translate
		 * @param {string} key
		 */
		function t(key) {
			return translate(LANG, key)
		}

		/**
		 * Get icon component
		 * @param {string} extname Extension name
		 * @returns {VNode}
		 */
		function getIcon(extname) {
			/** @type {IconName} */
			const iconName = ICON_MAP[extname] || 'file'
			const Icon =
				lucide[
					`${iconName
						.split('-')
						.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
						.join('')}Icon`
				]
			return () => h(Icon, { class: 'icon' })
		}

		/**
		 * Get OS-specific tooltip text for opening in file explorer
		 * @returns {string}
		 */
		function getOpenInFolderTooltip() {
			switch (platform) {
				case 'darwin':
					return t('openInFinder')
				case 'win32':
					return t('openInExplorer')
				default:
					return t('openInFileManager')
			}
		}

		/**
		 * Reset search input handler
		 * @param {*} event
		 */
		function onResetSearch(event) {
			keyword.value = ''
			items.value.length = 0 // Clear search results as well
			curIndex.value = -1
			showRecent.value = true // Show recent items when input is cleared
			focusOnInputField() // Ensure input has focus
		}

		/**
		 * Lifecycle: After mount
		 */
		onMounted(() => {
			// Load recent items
			recentItems.value = ConfigManager.getRecentItems()

			// Listen for events
			RendererEvent.on('data-update', onDataUpdate)
			RendererEvent.on('match-reply', onMatchReply)
			RendererEvent.on('reset-search', onResetSearch)

			// Next frame
			nextTick(() => {
				// Focus on input field
				focusOnInputField()
			})
		})

		/**
		 * Lifecycle: Before unmount
		 */
		onBeforeUnmount(() => {
			// Remove event listeners
			RendererEvent.removeAllListeners('data-update')
			RendererEvent.removeAllListeners('match-reply')
			RendererEvent.removeAllListeners('reset-search')
		})

		return {
			input,
			keyword,
			items,
			recentItems,
			showRecent,
			curIndex,
			onInputChange,
			onEnterBtnClick,
			onUpBtnClick,
			onDownBtnClick,
			onLeftBtnClick,
			onRightBtnClick,
			onItemClick,
			openInFolder,
			getIcon,
			getPath,
			t,
			getOpenInFolderTooltip,
			onResetSearch,
		}
	},
}

// Create instance
const app = createApp(App)
// Mount
app.mount('#app')
