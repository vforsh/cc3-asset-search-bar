/**
 * Version Tools
 */
const VersionUtil = {
	/**
	 * Split version string
	 * @param {string | number} version Version string
	 * @returns {number[]}
	 * @example
	 * splitVersionString('1.2.0');  // [1, 2, 0]
	 */
	splitVersionString(version) {
		if (typeof version === 'number') {
			return [version]
		}
		if (typeof version === 'string') {
			return version
				.replace(/-/g, '.')
				.split('.')
				.map((v) => parseInt(v) || 0)
		}
		return [0]
	},

	/**
	 * Compare version strings
	 * @param {string | number} a Version a
	 * @param {string | number} b Version b
	 * @returns {-1 | 0 | 1}
	 * @example
	 * compareVersion('1.0.0', '1.0.1');    // -1
	 * compareVersion('1.1.0', '1.1.0');    // 0
	 * compareVersion('1.2.1', '1.2.0');    // 1
	 * compareVersion('1.2.0.1', '1.2.0');  // 1
	 */
	compareVersion(a, b) {
		const acs = VersionUtil.splitVersionString(a),
			bcs = VersionUtil.splitVersionString(b)
		const count = Math.max(acs.length, bcs.length)
		for (let i = 0; i < count; i++) {
			const ac = acs[i],
				bc = bcs[i]
			// Former lacks component or former is less than latter
			if (ac == undefined || ac < bc) {
				return -1
			}
			// Latter lacks component or former is greater than latter
			if (bc == undefined || ac > bc) {
				return 1
			}
		}
		return 0
	},
}

module.exports = VersionUtil
