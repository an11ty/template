const { DateTime } = require('luxon')
const parseDate = require('./shared/parseDate.js')

module.exports = (date, locale) => parseDate(date)
	.toLocaleString(DateTime[locale])
