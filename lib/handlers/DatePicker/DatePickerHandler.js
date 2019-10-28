const config = require('./config.json')
const BaseHandler = require('./../BaseHandler')
const querystring = require('querystring')
const URLFormatter = require('../../formatters/UrlParametersFormatter')
const PadelDate = require('../../formatters/PadelDate')

/**
 * DatePicker directly from URL, because way easier than search by DOMElement in calendar picker...
 */
class DatePickerHandler extends BaseHandler {
  constructor(requestDate) {
    super()
    this.requestDate = requestDate
    this.url = config.url
  }

  async execute(page) {
    let parameters = config.urlParameters

    const scheduleHourAndMinute = this.setDateForUrlParameters(parameters, this.requestDate)

    const urlParameters = URLFormatter.format(parameters)

    const url = this.url + '?' + querystring.stringify(urlParameters)

    console.log('... Looking for available schedule for ', scheduleHourAndMinute, ' ...')

    await page.goto(url, {
      waitUntil: 'networkidle0'
    })
  }

  setDateForUrlParameters(parameters, date){
    const padelDate = new PadelDate(date)
    const dateHourAndMinute = padelDate.getDateWithoutHour()
    parameters.date = dateHourAndMinute

    return dateHourAndMinute
  }
}

module.exports = DatePickerHandler