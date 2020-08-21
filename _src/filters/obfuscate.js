module.exports = str => {
	const chars = []
	for (var i = str.length - 1; i >= 0; i--) {
		chars.unshift(['&#', str[i].charCodeAt(), ';'].join(''))
	}
	return chars.join('')
}
