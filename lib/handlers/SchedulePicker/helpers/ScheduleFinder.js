class ScheduleFinder {
  constructor(page, padelCourtsParams, scheduleParams, bookingParams) {
    this.page = page
    this.padelCourtsParams = padelCourtsParams
    this.availableScheduleSelector = '.' + scheduleParams.available.classname
    this.unavailableScheduleSelector = '.' + scheduleParams.unavailable.classname
    this.time = bookingParams.time
    this.bookedPeriod = bookingParams.period
  }
  async findAsync(arr, asyncCallback) {
    const promises = arr.map(asyncCallback);
    const results = await Promise.all(promises);
    const index = results.findIndex(result => result);
    return arr[index];
  }
  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
  async _findPadelCourts(padelCourtsParams) {
    const fullPadelCourts = await this.page.$$(padelCourtsParams.selector)
    const padelCourts = this._filterPadelCourts(fullPadelCourts, padelCourtsParams.excludes)
    return padelCourts
  }
  _filterPadelCourts(fullPadelCourts, excludes) {
    return [...fullPadelCourts].filter(function (_dom, index) {
      return (excludes.indexOf(index + 1) < 0)
    })
  }
  async _findAvailableSchedulesByCourt(allSchedulesByCourtHandle, availableScheduleSelector) {
    return await allSchedulesByCourtHandle.$$(availableScheduleSelector)
  }
  async _pickScheduleByTime(availableSchedulesHandles, time) {
    return await this.findAsync(availableSchedulesHandles, async function (availableSchedulesHandle) {
      const keepSchedule = await availableSchedulesHandle.evaluate(function(schedule, time){
        return schedule.innerText.includes(time)
      }, time)
      return keepSchedule
    });
  }
  _checkPeriodAvailable(scheduleHandle, period) {
    let isNextSchdeduleOverlap = true
    if (scheduleHandle){
      //@TODO: check if next schedule is not crossing over picked scheduleHandle
      return isNextSchdeduleOverlap
    }
    return false
  }
  async find() {
    const padelCourts = await this._findPadelCourts(this.padelCourtsParams)
    const availableScheduleSelector = this.availableScheduleSelector
    const time = this.time
    const bookingPeriod = this.bookedPeriod

    let foundSchedule = null
    let foundFlag = false

    await this.asyncForEach(padelCourts, async function (schedulesByCourtHandle) {
      if (foundFlag)
        return

      const availableSchedulesHandles = await this._findAvailableSchedulesByCourt(schedulesByCourtHandle, availableScheduleSelector)
      const pickedScheduleHandle = await this._pickScheduleByTime(availableSchedulesHandles, time)
      const check = this._checkPeriodAvailable(pickedScheduleHandle, bookingPeriod)
      if (check) {
        foundSchedule = pickedScheduleHandle
        foundFlag = true
      }
    }.bind(this))

    return foundSchedule
  }
}

module.exports = ScheduleFinder