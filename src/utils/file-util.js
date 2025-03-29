const Fs = require('fs')
const Path = require('path')
const { promisify } = require('util')

/**
 * File Tools (Promisified)
 */
const FileUtil = {
	/**
	 * Get file status
	 * @param {Fs.PathLike} path Path
	 * @returns {Promise<Fs.stats>}
	 */
	stat: promisify(Fs.stat),

	/**
	 * Create directory
	 * @param {Fs.PathLike} path Path
	 * @param {Fs.MakeDirectoryOptions?} options Options
	 * @returns {Promise<void>}
	 */
	mkdir: promisify(Fs.mkdir),

	/**
	 * Read directory
	 * @param {Fs.PathLike} path Path
	 * @param {any} options Options
	 * @returns {Promise<string[]>}
	 */
	readdir: promisify(Fs.readdir),

	/**
	 * Remove directory
	 * @param {Fs.PathLike} path Path
	 * @param {Fs.RmDirOptions?} options Options
	 * @returns {Promise<void>}
	 */
	rmdir: promisify(Fs.rmdir),

	/**
	 * Read file
	 * @param {Fs.PathLike} path Path
	 * @param {any} options Options
	 * @returns {Promise<Buffer>}
	 */
	readFile: promisify(Fs.readFile),

	/**
	 * Create file
	 * @param {Fs.PathLike} path Path
	 * @param {string | NodeJS.ArrayBufferView} data Data
	 * @param {Fs.WriteFileOptions?} options Options
	 * @returns {Promise<void>}
	 */
	writeFile: promisify(Fs.writeFile),

	/**
	 * Remove file
	 * @param {Fs.PathLike} path Path
	 * @returns {Promise<void>}
	 */
	unlink: promisify(Fs.unlink),

	/**
	 * Check if path exists (synchronously)
	 * @param {Fs.PathLike} path Path
	 */
	existsSync: Fs.existsSync,

	/**
	 * Copy file/directory
	 * @param {Fs.PathLike} srcPath Source path
	 * @param {Fs.PathLike} destPath Destination path
	 * @returns {Promise<boolean>}
	 */
	async copy(srcPath, destPath) {
		if (!FileUtil.existsSync(srcPath)) {
			return false
		}
		const stats = await FileUtil.stat(srcPath)
		if (stats.isDirectory()) {
			if (!FileUtil.existsSync(destPath)) {
				await FileUtil.createDir(destPath)
			}
			const names = await FileUtil.readdir(srcPath)
			for (const name of names) {
				await FileUtil.copy(Path.join(srcPath, name), Path.join(destPath, name))
			}
		} else {
			await FileUtil.writeFile(destPath, await FileUtil.readFile(srcPath))
		}
		return true
	},

	/**
	 * Create directory (recursively)
	 * @param {Fs.PathLike} path Path
	 * @returns {Promise<boolean>}
	 */
	async createDir(path) {
		if (FileUtil.existsSync(path)) {
			return true
		} else {
			const dir = Path.dirname(path)
			if (await FileUtil.createDir(dir)) {
				await FileUtil.mkdir(path)
				return true
			}
		}
		return false
	},

	/**
	 * Remove file/directory (recursively)
	 * @param {Fs.PathLike} path Path
	 */
	async remove(path) {
		if (!FileUtil.existsSync(path)) {
			return
		}
		const stats = await FileUtil.stat(path)
		if (stats.isDirectory()) {
			const names = await FileUtil.readdir(path)
			for (const name of names) {
				await FileUtil.remove(Path.join(path, name))
			}
			await FileUtil.rmdir(path)
		} else {
			await FileUtil.unlink(path)
		}
	},

	/**
	 * Traverse file/directory and execute function
	 * @param {Fs.PathLike} path Path
	 * @param {(filePath: Fs.PathLike, stat: Fs.Stats) => void | Promise<void>} handler Handler function
	 */
	async map(path, handler) {
		if (!FileUtil.existsSync(path)) {
			return
		}
		const stats = await FileUtil.stat(path)
		if (stats.isDirectory()) {
			const names = await FileUtil.readdir(path)
			for (const name of names) {
				await FileUtil.map(Path.join(path, name), handler)
			}
		} else {
			await handler(path, stats)
		}
	},
}

module.exports = FileUtil
