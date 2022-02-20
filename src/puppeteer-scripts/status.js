const Booker = require('./../Booker')
const puppeteer = require('puppeteer')

const statusScript = async function(params){
	const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox', '--proxy-bypass-list=<-loopback>'] })
	// {date : ISO date}
	//'2019-11-03T12:00' ISO 8601 format
	const sportBooker = new Booker(params)
	const page = await browser.newPage()

	await page.setViewport({ width: 1000, height: 1000 })

	const result = await sportBooker.getStatus(page)

	await browser.close()

	return result
}

module.exports = statusScript