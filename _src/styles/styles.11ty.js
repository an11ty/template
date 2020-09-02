const { promisify } = require('util')
const fs = require('fs')
const glob = promisify(require('glob'))
const mkdirp = require('mkdirp')
const path = require('path')
const sass = require('node-sass')
const CleanCSS = require('clean-css')
const cssesc = require('cssesc')

const isProd = process.env.ELEVENTY_ENV === 'production'

// main entry point name
const ENTRY_FILE_NAME = 'main.scss'
const OUTPUT_FILE_NAME = 'main.css'
const entryPath = path.join(__dirname, `/${ENTRY_FILE_NAME}`)
const outputPath = `_src/styles/${OUTPUT_FILE_NAME}`
const mapOutputPath = path.resolve(__dirname, '../../_site/_src/styles/')

const mainTemplate = files => `
// This is an auto-generated file, do not edit it.
// Look at the _README.md file next to it for details.

// Variables are imported first:
${(files.variables || []).map(file => `@import 'variables/${file}';`).join('\n')}

// Then any utilities:
${(files.utilities || []).map(file => `@import 'utilities/${file}';`).join('\n')}

// Base modules are ones that have global scope.
${(files.base || []).map(file => `@import 'base/${file}';`).join('\n')}

// Component modules are scoped to a component.
${(files.components || []).map(file => `@import 'components/${file}';`).join('\n')}
`

// display an error overlay when CSS build fails.
// this brilliant idea is taken from Mike Riethmuller / Supermaya
// @see https://github.com/MadeByMike/supermaya/blob/master/site/utils/compile-scss.js
const renderError = error => `
	/* Error compiling stylesheet */
	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}
	html,
	body {
		margin: 0;
		padding: 0;
		min-height: 100vh;
		font-family: monospace;
		font-size: 1.25rem;
		line-height:1.5;
	} 
	body::before { 
		content: ''; 
		background: #000;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		opacity: 0.7;
		position: fixed;
	}
	body::after { 
		content: '${cssesc(error)}'; 
		white-space: pre;
		display: block;
		top: 0; 
		padding: 30px;
		margin: 50px;
		width: calc(100% - 100px);
		color: #721c24;
		background-color: #f8d7da;
		border: solid 2px red;
		position: fixed;
	}`

// Compile Sass to CSS,
// Embed Source Map in Development
const compile = async config => new Promise((resolve, reject) => {
	config.sourceMap = true
	config.sourceMapEmbed = true
	config.sourceComments = true
	config.outputStyle = 'expanded'
	return sass.render(config, (err, result) => {
		if (err) {
			return reject(err)
		}
		resolve(result.css.toString())
	})
})

// Minify & Optimize with CleanCSS in Production
const minify = async css => new Promise((resolve, reject) => {
	const minified = new CleanCSS({
		sourceMap: true,
		sourceMapInlineSources: true
	}).minify(css)

	mkdirp.sync(mapOutputPath)
	fs.writeFileSync(path.join(mapOutputPath, `${OUTPUT_FILE_NAME}.map`), minified.sourceMap.toString(), 'utf8')

	return minified.error
		? reject(minified.error)
		: resolve(minified.styles + '\n' + `/*# sourceMappingURL=/${outputPath}.map */`)
})

module.exports = class {
	async data() {
		return {
			permalink: outputPath,
			eleventyExcludeFromCollections: true,
			entryPath
		}
	}
	async render({ entryPath }) {
		try {
			const scssFiles = await glob('*/*.scss', {
				cwd: path.join(__dirname)
			})
			const scssMain = mainTemplate(
				scssFiles
					.reduce((files, file) => {
						const [ key, filename ] = file.split('/')
						files[key] = files[key] || []
						files[key].push(
							filename
								.replace('.scss', '')
								.replace(/^_/, '')
						)
						return files
					}, {})
			)
			fs.writeFileSync(path.join(__dirname, ENTRY_FILE_NAME), scssMain, 'utf8')

			const css = await compile({
				file: entryPath
			})
			if (!isProd) {
				return css
			}
			return await minify(css)
		} catch (err) {
			// if things go wrong in production we want
			// to fully halt, but otherwise we can display
			// an error overlay for easier development
			if (isProd) {
				throw new Error(err)
			} else {
				console.error(err)
				return renderError(err.formatted || err.message)
			}
		}
	}
}
