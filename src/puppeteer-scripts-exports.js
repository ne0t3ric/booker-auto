const bookScript = require('./puppeteer-scripts/book')
const statusScript = require('./puppeteer-scripts/status')

module.exports = {
	book: bookScript,
	status: statusScript
}