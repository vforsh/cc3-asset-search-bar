/**
 * Color Tools
 */
const ColorUtil = {
	/**
	 * Convert hexadecimal color value to RGB format
	 * @param {string} hex
	 * @returns {{ r: number, g: number, b: number }}
	 */
	hexToRGB(hex) {
		// Is it in HEX format?
		const regExp = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
		if (!regExp.test(hex)) {
			return null
		}
		// Three digits
		if (hex.length === 4) {
			const r = hex.slice(1, 2),
				g = hex.slice(2, 3),
				b = hex.slice(3, 4)
			hex = `#${r}${r}${g}${g}${b}${b}`
		}
		// Convert base
		const rgb = {
			r: parseInt(`0x${hex.slice(1, 3)}`),
			g: parseInt(`0x${hex.slice(3, 5)}`),
			b: parseInt(`0x${hex.slice(5, 7)}`),
		}
		return rgb
	},
}

module.exports = ColorUtil
