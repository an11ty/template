const critical = require('critical')

const buildDir = 'dist' // TODO ?????????

const shouldTransformHTML = (outputPath) =>
	outputPath &&
	outputPath.endsWith('.html') &&
	process.env.ELEVENTY_ENV === 'production'

const isHomePage = (outputPath) => outputPath === `${buildDir}/index.html`

process.setMaxListeners(Infinity)

module.exports = async (content, outputPath) => {
	if (shouldTransformHTML(outputPath) && isHomePage(outputPath)) {
		try {
			const config = {
				base: `${buildDir}/`,
				html: content,
				inline: true,
				width: 1280,
				height: 800,
				timeout: 30000
			}
			const html = await critical.generate(config)
			return html
		} catch (err) {
			console.error(err)
		}
	}
	return content
}
