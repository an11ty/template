module.exports = async () => ({
	env: process.env.ELEVENTY_ENV,
	timestamp: new Date().getTime().toString()
})
