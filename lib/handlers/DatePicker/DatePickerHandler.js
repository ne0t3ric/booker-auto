const config = require('./config.json')
const BaseHandler = require('./../BaseHandler')
const querystring = require('querystring')
const URLFormatter = require('../../formatters/URLParametersFormatter')
const AdapterDate = require('../../formatters/AdapterDate')
const urlFormatter = new URLFormatter(config.urlParametersMap)
/**
 * DatePicker directly from URL, because way easier than search by DOMElement in calendar picker...
 */
class DatePickerHandler extends BaseHandler {
  constructor(requestDate, requestSport) {
    super()
    this.requestDate = requestDate
    this.requestSport = requestSport

    this.url = config.url
  }

  async execute(page) {
    let parameters = {
      date: this.requestDate,
      sport: this.requestSport
    }

    const scheduleHourAndMinute = this.setDateForUrlParameters(parameters, this.requestDate)

    const urlParameters = urlFormatter.format(parameters)

    const url = this.url + '?' + querystring.stringify(urlParameters)

    console.log('... Looking for available schedule for ', scheduleHourAndMinute, ' ...')

    await page.goto(url, {
      waitUntil: 'networkidle0'
    })
  }

  setDateForUrlParameters(parameters, date){
    console.log('date ', date)
    const adapterDate = new AdapterDate(date)
    const dateHourAndMinute = adapterDate.getDateWithoutHour()
    parameters.date = dateHourAndMinute

    return dateHourAndMinute
  }
}

module.exports = DatePickerHandler
