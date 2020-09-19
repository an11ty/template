const { DateTime } = require('luxon')
const parseDate = require('./shared/parseDate.js')

module.exports = (date, format) => parseDate(date)
	.toFormat(String(format))
