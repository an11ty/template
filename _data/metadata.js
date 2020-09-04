module.exports = {
	title: 'Your Blog Name',
	lang: 'en',
	locale: 'en_us',
	url: 'https://example.com/',
	description: 'I am writing about my experiences as a naval navel-gazer.',
	author: {
		name: 'Your Name Here',
		email: 'youremailaddress@example.com',
		url: 'https://example.com/about-me/'
	},
	bannerLogo: '/_src/images/favicon/favicon-192x192.png',

	// Third-party site usernames
	footer_sites: [
		{
			icon: 'github',
			title: 'GitHub',
			url: 'https://github.com/saibotsivad/'
		},{
			icon: 'linkedin',
			title: 'LinkedIn',
			url: 'https://www.linkedin.com/in/saibotsivad/'
		},{
			icon: 'npmjs',
			title: 'npmjs',
			url: 'https://www.npmjs.com/~saibotsivad'
		},{
			icon: 'keybase',
			title: 'Keybase',
			url: 'https://keybase.io/saibotsivad'
		}
	],

	feed: {
		subtitle: 'I am writing about my experiences as a naval navel-gazer.',
		filename: 'feed.xml',
		path: '/feed/feed.xml',
		id: 'https://example.com/'
	},
	json_feed: {
		path: '/feed/feed.json',
		url: 'https://example.com/feed/feed.json'
	},

	// All the SVG icons in `_src/icons/` are available to be
	// bundled up and used using `iconsprite`, but you don't
	// want to add them to your HTML if they aren't used, so
	// here you can list the icons that you want to embed and
	// only those will be included. Leave the array empty or
	// remove `icons` to not embed any, or set `icons` to `true`
	// to embed all in the folder.
	embeddedIcons: [
		'github.svg'
	]
}
