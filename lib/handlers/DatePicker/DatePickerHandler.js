const config = require('./config.json')
const BaseHandler = require('./../BaseHandler')
const querystring = require('querystring')
const URLFormatter = require('../../formatters/UrlParametersFormatter')
/**
 * DatePicker directly from URL, because way easier than search by DOMElement in calendar picker...
 */
class DatePickerHandler extends BaseHandler {
  constructor(date) {
    super()

    this.date = date
    this.url = config.url
  }

  async execute(page) {
    const urlParameters = URLFormatter.format(config.urlParameters)
    urlParameters.date = this.date
    const url = this.url + '?' + querystring.stringify(urlParameters)
    console.log('... Looking for available schedule for ', this.date, ' ...')
    await page.goto(url, {
      waitUntil: 'networkidle0'
    })
  }
}

module.exports = DatePickerHandler