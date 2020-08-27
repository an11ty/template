const fs = require('fs')
const globModuleFile = require('glob-module-file')
const MemoryFileSystem = require('memory-fs')
const mkdirp = require('mkdirp')
const path = require('path')
const webpack = require('webpack')

const isProd = process.env.ELEVENTY_ENV === 'production'
const mfs = new MemoryFileSystem()

// main entry point name
const ENTRY_FILE_NAME = 'main.js'
const ENTRY_FILE_MAP_NAME = 'main.js.map'
const OUTPUT_FILE_NAME = 'main.js'
const entryPath = path.join(__dirname, `/${ENTRY_FILE_NAME}`)
const outputPath = `_src/scripts/${OUTPUT_FILE_NAME}`
const mapOutputPath = path.resolve(__dirname, '../../_site/_src/scripts/')

const sourcemapFilePath = `_src/scripts/${ENTRY_FILE_MAP_NAME}`

// Compile JS with Webpack, write the result to Memory Filesystem.
// this brilliant idea is taken from Mike Riethmuller / Supermaya
// @see https://github.com/MadeByMike/supermaya/blob/master/site/utils/compile-webpack.js
const compile = async webpackConfig => {
	await globModuleFile({
		format: 'es',
		// relative to the path where the `eleventy` command is run
		pattern: 'modules/*.js',
		outputPath: './_src/scripts/globbed.js'
	}, {
		cwd: __dirname
	})

	const compiler = webpack(webpackConfig)
	compiler.outputFileSystem = mfs
	compiler.inputFileSystem = fs
	compiler.resolvers.normal.fileSystem = mfs

	return new Promise((resolve, reject) => {
		compiler.run((err, stats) => {
			if (err || stats.hasErrors()) {
				return reject(err || (stats.compilation ? stats.compilation.errors : null))
			}

			const { assets } = stats.compilation

			mkdirp.sync(mapOutputPath)
			fs.writeFileSync(
				path.join(mapOutputPath, ENTRY_FILE_MAP_NAME),
				assets[sourcemapFilePath].source(),
				'utf8'
			)

			resolve(assets[ENTRY_FILE_NAME].source())
		})
	})
}

// Main Config
const defaultWebpackConfig = {
	mode: isProd ? 'production' : 'development',
	entry: entryPath,
	output: {
		path: path.resolve(__dirname, '../../memory-fs/js/')
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ '@babel/preset-env' ],
						plugins: [ '@babel/plugin-transform-runtime' ]
					}
				}
			}
		]
	},
	plugins: [
		new webpack.SourceMapDevToolPlugin({
			filename: sourcemapFilePath,
			fileContext: '../../'
		}),
		new webpack.EnvironmentPlugin({
			ELEVENTY_ENV: process.env.ELEVENTY_ENV
		})
	]
}

module.exports = class {
	// Configure Webpack in Here
	async data() {
		return {
			permalink: `/_src/scripts/${ENTRY_FILE_NAME}`,
			eleventyExcludeFromCollections: true,
			webpackConfig: defaultWebpackConfig
		}
	}

	// render the JS file
	async render({ webpackConfig }) {
		try {
			return await compile(webpackConfig)
		} catch (err) {
			return null
		}
	}
}
