const PadelDate = require('../../../formatters/PadelDate')

class ScheduleFinder {
  constructor(page, padelCourtsParams, scheduleParams, bookingParams) {
    this.page = page
    this.padelCourtsParams = padelCourtsParams
    this.availableScheduleSelector = '.' + scheduleParams.available.classname
    this.unavailableScheduleSelector = '.' + scheduleParams.unavailable.classname
    this.bookingParams = bookingParams
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
  async _checkPeriodAvailable(scheduleHandle, bookingParams) {
    const now = new Date()
    const maxBookingTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate() + bookingParams.maxBookingDelay, now.getHours(), now.getMinutes());
    let validSchedule = false

    // Case 1 : picked schedule is too cloose to next already booked schedule
    if (scheduleHandle){
      let isNextSchdeduleOverlap = true

      //@TODO: check if next schedule is not crossing over picked scheduleHandle
      isNextSchdeduleOverlap = await scheduleHandle.evaluate(this.findIfNextBookedScheduleOverlapsPickedSchedule, 
        this.unavailableScheduleSelector, 
        bookingParams,
        maxBookingTimestamp)
        if (isNextSchdeduleOverlap){
          console.log('Found schedule, but booking period is overlaping next booked schedule (too close)...')
          console.log('Search next available...')
        }

        validSchedule = !isNextSchdeduleOverlap
    } 

    return validSchedule
  }
  findIfNextBookedScheduleOverlapsPickedSchedule(scheduleElement, unavailableScheduleSelector, bookingParams, maxBookingTimestamp){
    const getNextSibling = function(element, selector) {

      // Get the next sibling element
      let sibling = element.nextElementSibling;
    
      // If there's no selector, return the first sibling
      if (!selector) return sibling;
    
      // If the sibling matches our selector, use it
      // If not, jump to the next sibling and continue the loop
      while (sibling) {
        if (sibling.matches(selector)) return sibling;
        sibling = sibling.nextElementSibling
      }
    }
  
    const nextSibling = getNextSibling(scheduleElement, unavailableScheduleSelector)
    let isNextSchdeduleOverlap = true

    if (nextSibling){
      const regexHourMinutes = /(\d+)\:(\d+)/ //HH:mm
      const matches = nextSibling.innerText.match(regexHourMinutes)
      if (null !== matches){
        const nextBookedSchedule = {
          hour: matches[1],
          minutes: matches[2]
        }
        const pickedTime = new Date(bookingParams.requestDate)
        const nextBookedScheduleTime = new Date(bookingParams.requestDate)
        nextBookedScheduleTime.setHours(nextBookedSchedule.hour, nextBookedSchedule.minutes)
        const maxBookingDate = new Date(maxBookingTimestamp)

        // Case 2 : next booked schedule is not really booked, it is just a schedule belonging to the non bookable period ( > one week after now)
        const isNextSiblingInBookablePeriod  = ( nextBookedScheduleTime < maxBookingDate )
        if (!isNextSiblingInBookablePeriod){
          return false
        }

        const diff = Math.abs(nextBookedScheduleTime - pickedTime);
        if (diff > bookingParams.period){
          //nextBookedSchedule is further than pickedDate + period
          isNextSchdeduleOverlap = false
        }
      }
    } else {
      isNextSchdeduleOverlap = false
    }

    return isNextSchdeduleOverlap
  }
  async find() {
    const padelCourts = await this._findPadelCourts(this.padelCourtsParams)
    const availableScheduleSelector = this.availableScheduleSelector
    const bookingParams = this.bookingParams
    const padelDate = new PadelDate(bookingParams.requestDate)
    const time = padelDate.getHoursMinutes()

    let foundSchedule = null
    let foundFlag = false

    await this.asyncForEach(padelCourts, async function (schedulesByCourtHandle) {
      if (foundFlag)
        return

      const availableSchedulesHandles = await this._findAvailableSchedulesByCourt(schedulesByCourtHandle, availableScheduleSelector)
      const pickedScheduleHandle = await this._pickScheduleByTime(availableSchedulesHandles, time)
      const check = await this._checkPeriodAvailable(pickedScheduleHandle, bookingParams)
      if (check) {
        foundSchedule = pickedScheduleHandle
        foundFlag = true
      }
    }.bind(this))

    return foundSchedule
  }
}

module.exports = ScheduleFinder