const glob = require('glob')
const markdownIt = require('markdown-it')
const path = require('path')
const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginNavigation = require('@11ty/eleventy-navigation')

const iconsprite = require('./_src/iconsprite.js')

const possiblyLoad = name => {
	try {
		return require(name)
	} catch (ignore) {
		return undefined
	}	
}

const loadThings = folder => glob
	.sync('*.js', {
		ignore: '*.test.js',
		cwd: path.join('_src', folder)
	})
	.map(file => ({
		key: file.replace(/\.js$/, ''),
		value: require('./' + path.join('_src', folder, file))
	}))

module.exports = config => {
	// Overrides: before
	const an11tyBefore = possiblyLoad('./.an11ty-before.js')
	const mergeableBefore = an11tyBefore && an11tyBefore(config)

	// Plugins
	config.addPlugin(pluginRss)
	config.addPlugin(pluginNavigation)

	// Auto-globbed functions. Add your own or overwrite
	// one in the related folder and it'll get auto-added
	// without needing to set it in `.eleventy.js`
	for (const { key, value } of loadThings('filters')) {
		config.addFilter(key, value)
	}
	for (const { key, value } of loadThings('transforms')) {
		config.addTransform(key, value)
	}
	for (const { key, value } of loadThings('shortcodes')) {
		config.addShortcode(key, value)
	}
	for (const { key, value } of loadThings('collections')) {
		config.addCollection(key, value)
	}

	// Icon Sprite
	config.addNunjucksAsyncShortcode('iconsprite', iconsprite)

	// Asset Watch Targets
	// NOTE: It would be cooler if you could pass glob syntax
	// to the `addWatchTarget` function, but that does not
	// appear to be possible at this point.
	glob
		.sync('./_src/styles/*/*.scss')
		.forEach(file => {
			config.addWatchTarget(file)
		})

	// Markdown
	config.setLibrary(
		'md',
		markdownIt({
			html: true,
			breaks: true,
			linkify: true,
			typographer: true
		})
	)
	// let markdownLibrary = markdownIt({
	// 	html: true,
	// 	breaks: true,
	// 	linkify: true
	// }).use(markdownItAnchor, {
	// 	permalink: true,
	// 	permalinkClass: 'direct-link',
	// 	permalinkSymbol: '#'
	// })
	// eleventyConfig.setLibrary('md', markdownLibrary)

	// Browsersync Overrides
	// eleventyConfig.setBrowserSyncConfig({
	// 	callbacks: {
	// 		ready: (err, browserSync) => {
	// 			const content_404 = fs.readFileSync('_site/404.html')

	// 			browserSync.addMiddleware('*', (req, res) => {
	// 				// Provides the 404 content without redirect.
	// 				res.write(content_404)
	// 				res.end()
	// 			});
	// 		},
	// 	},
	// 	ui: false,
	// 	ghostMode: false
	// })

	// Layouts
	config.addLayoutAlias('base', 'base.njk')
	config.addLayoutAlias('home', 'home.njk')
	config.addLayoutAlias('post', 'post.njk')

	// Pass-through files
	config.addPassthroughCopy('_src/images')
	config.addPassthroughCopy('_src/fonts')

	// Deep-Merge
	config.setDataDeepMerge(true)

	// Overrides: after
	const an11tyAfter = possiblyLoad('./.an11ty.js')
	const mergeableAfter = an11tyAfter && an11tyAfter(config)

	// Base Config with overrides
	return Object.assign(
		{},
		mergeableBefore || {},
		{
			dir: {
				input: './',
				output: './_site',
				includes: './_src/includes',
				layouts: './_src/layouts',
				data: './_data'
			},
			templateFormats: [ 'njk', 'md', '11ty.js' ],
			htmlTemplateEngine: 'njk',
			markdownTemplateEngine: 'njk'
		},
		mergeableAfter || {}
	)
}
