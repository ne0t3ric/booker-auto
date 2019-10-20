const config = require('./config.json')
const BaseHandler = require('./../BaseHandler')
const querystring = require('querystring')
const formatter = require('../../formatters/urlParametersFormatter')
/**
 * DayPicker directly from URL, because way easier than search by DOMElement in calendar picker...
 */
class DayPickerHandler extends BaseHandler {
  constructor(day) {
    super()

    this.day = day
    this.url = config.url
  }

  async execute(page) {
    const urlParameters = formatter.format(config.urlParameters)
    urlParameters.date = this.day
    const url = this.url + '?' + querystring.stringify(urlParameters)
    
    await page.goto(url, {
      waitUntil: 'networkidle0'
    })
  }
}

module.exports = DayPickerHandler