const Path = require('path')
const { map } = require('../utils/file-util')
const fzf = require('fzf')

/**
 * Finder
 */
const Finder = {
	/**
	 * Data cache
	 * @type {{ name: string, path: string, extname: string }[]}
	 */
	caches: null,

	/**
	 * Clear cache
	 */
	clearCaches() {
		Finder.caches = null
	},

	/**
	 * Collect file information in the project
	 */
	async collectFiles() {
		const caches = (Finder.caches = [])
		// File handler function
		const handler = (path, stat) => {
			// Filter
			if (Finder.filter(path)) {
				const name = Path.basename(path),
					extname = Path.extname(path)
				caches.push({ name, path, extname })
			}
		}
		// Iterate over project files
		const assetsPath = Path.join(Editor.Project.path, 'assets')
		await map(assetsPath, handler)
	},

	/**
	 * Filter files
	 * @param {string} path Path
	 * @returns {boolean}
	 */
	filter(path) {
		// Extension name
		const extname = Path.extname(path)
		// Exclude meta files and files without extension
		if (extname === '.meta' || extname === '') {
			return false
		}
		// Available
		return true
	},

	/**
	 * Get files in the project that match the keyword
	 * @param {string} keyword Keyword
	 * @returns {{ name: string, path: string, extname: string, similarity: number }[]}
	 */
	getMatchedFiles(keyword) {
		const results = []
		if (!Finder.caches) return results

		// Create fzf finder instance with case-insensitive option
		const finder = new fzf.Fzf(Finder.caches, {
			selector: (item) => item.name,
			casing: 'case-insensitive',
		})

		// Get matches
		const matches = finder.find(keyword)

		// Convert fzf matches to our expected format
		for (const match of matches) {
			const { item, score } = match
			results.push({
				name: item.name,
				path: item.path,
				extname: item.extname,
				similarity: -score, // Convert score to similarity (negative because fzf scores are higher for better matches)
			})
		}

		return results
	},
}

module.exports = Finder
