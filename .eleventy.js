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
	const mergeableBefore = possiblyLoad('./.an11ty-before.js')

	// Plugins
	config.addPlugin(pluginRss)
	config.addPlugin(pluginNavigation)

	// Filters
	for (const { key, value } of loadThings('filters')) {
		config.addFilter(key, value)
	}

	// Transforms
	for (const { key, value } of loadThings('transforms')) {
		config.addTransform(key, value)
	}

	// Shortcodes
	for (const { key, value } of loadThings('shortcodes')) {
		config.addShortcode(key, value)
	}

	// Icon Sprite
	config.addNunjucksAsyncShortcode('iconsprite', iconsprite)

	// Asset Watch Targets
	config.addWatchTarget('./_src')

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
	const mergeableAfter = possiblyLoad('./.an11ty.js')

	// Base Config with overrides
	return Object.assign(
		{},
		mergeableBefore || {},
		{
			dir: {
				input: './',
				output: '_site',
				includes: '_src/includes',
				layouts: '_src/layouts',
				data: '_data'
			},
			templateFormats: [ 'njk', 'md', '11ty.js' ],
			htmlTemplateEngine: 'njk',
			markdownTemplateEngine: 'njk'
		},
		mergeableAfter || {}
	)
}
