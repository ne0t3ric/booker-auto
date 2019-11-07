const config = require('./config.json')
const BaseHandler = require('./../BaseHandler')
const BaseHandlerException = require('./../../exceptions/BaseHandlerException')
const ScheduleFinder = require('./helpers/ScheduleFinder')

class SchedulePickerHandler extends BaseHandler {
  constructor(requestDate) {
    super()

    this.scheduleParams = config.scheduleParams
    this.padelCourtsParams = config.padelCourtsParams
    this.bookingParams = {...config.bookingParams, requestDate}
  }

  async execute(page) {
    const padelCourtsParams = this.padelCourtsParams
    const scheduleParams = this.scheduleParams
    const bookingParams = this.bookingParams

    /**
     * Picked Schedule JSHandle
     * @type {JSHandle}
     */
    console.log('... at ', bookingParams.requestDate, ' for ' + bookingParams.period/(1000*60) + ' minutes ...')
    const scheduleFinder = new ScheduleFinder(page, padelCourtsParams, scheduleParams, bookingParams)
    const pickedScheduleHandle = await scheduleFinder.find()
    if (null === pickedScheduleHandle) {
      throw new BaseHandlerException('No schedule available ! Stop...')
    } else {
      console.log('Found schedule !...')
      await pickedScheduleHandle.click()
      await page.waitForNavigation()
    }
  }
}

module.exports = SchedulePickerHandler