const fs = require('fs')
const globModuleFile = require('glob-module-file')
const MemoryFileSystem = require('memory-fs')
const mkdirp = require('mkdirp')
const path = require('path')
const webpack = require('webpack')

const isProd = process.env.ELEVENTY_ENV === 'production'
const mfs = new MemoryFileSystem()

const ENTRY_FILE_NAME = 'main.js'
const ENTRY_FILE_MAP_NAME = 'main.js.map'

// Compile JS with Webpack, write the result to Memory Filesystem.
// this brilliant idea is taken from Mike Riethmuller / Supermaya
// @see https://github.com/MadeByMike/supermaya/blob/master/site/utils/compile-webpack.js
const compile = async webpackConfig => {
	await globModuleFile({
		format: 'es',
		// relative to the path where the `eleventy` command is run
		pattern: 'modules/*.js',
		outputPath: './_src/scripts/globbed.js',
	}, {
		cwd: __dirname,
		ignore: 'modules/*.test.js'
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

			const mapOutputPath = path.resolve(__dirname, '../../_site/_src/scripts/')
			mkdirp.sync(mapOutputPath)
			fs.writeFileSync(
				path.join(mapOutputPath, ENTRY_FILE_MAP_NAME),
				assets[ENTRY_FILE_MAP_NAME].source(),
				'utf8'
			)

			resolve(assets[ENTRY_FILE_NAME].source())
		})
	})
}

module.exports = class {
	async data() {
		return {
			permalink: `/_src/scripts/${ENTRY_FILE_NAME}`,
			eleventyExcludeFromCollections: true,
			webpackConfig: {
				mode: isProd
					? 'production'
					: 'development',
				entry: path.join(__dirname, `/${ENTRY_FILE_NAME}`),
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
						append: '\n//# sourceMappingURL=/_src/scripts/[url]',
						filename: '[name].js.map'
					}),
					new webpack.EnvironmentPlugin({
						ELEVENTY_ENV: process.env.ELEVENTY_ENV
					})
				]
			}
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
