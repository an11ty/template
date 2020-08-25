const { DateTime } = require('luxon')

const DATE_NUM = /^\d{13}$/

module.exports = (date, format) => DateTime
	.fromJSDate(
		typeof date === 'string'
			? new Date(DATE_NUM.test(date) ? parseInt(date, 10) : date)
			: date,
		{ zone: 'utc' }
	)
	.toFormat(String(format))
