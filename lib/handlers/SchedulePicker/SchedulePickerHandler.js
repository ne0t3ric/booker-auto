const config = require('./config.json')
const BaseHandler = require('./../BaseHandler')
const BaseHandlerException = require('./../../exceptions/BaseHandlerException')

class SchedulePickerHandler extends BaseHandler {
  constructor(time) {
    super()

    this.classNames = config.className
    this.padelCourtsSelector = config.padelCourtsSelector
    this.period = config.bookPeriod
    this.requestedTime = time
  }

  async execute(page) {
    const padelCourtsSelector = this.padelCourtsSelector
    const time = this.requestedTime
    const timeNext = '12:30'
    const pickedSchedule = await page.evaluate(this.pickSchedule, padelCourtsSelector, time, timeNext, this.classNames)
    if (null === pickedSchedule){
      throw new BaseHandlerException('No schedule available ! Stop...')
    }
  }

  pickSchedule(padelCourtsSelector, time, timeNext, classNames) {
    let pickedSchedule = null
    let found = false
    const padelCourts = document.querySelectorAll(padelCourtsSelector)
    padelCourts.forEach(function (schedulesByCourt) {
      const availableSchedules = Array.from(schedulesByCourt.querySelectorAll('.' + classNames.available))

      //remove waiting list possibility... (pas de liste d'attente désirée)
      availableSchedules.pop()

      if (availableSchedules && availableSchedules.length > 0) {
        const pickedSchedulesByCourt = Array.from(availableSchedules).filter(function (el) {
          return el.innerText === time
        });
        if (!found && pickedSchedulesByCourt.length > 0) {
          const nextIsNotTooClose = !(pickedSchedulesByCourt[0].nextElementSibling.classList.contains(classNames.unavailable)
            && pickedSchedulesByCourt[0].nextElementSibling.innerText.includes(timeNext))
          if (nextIsNotTooClose) {
            pickedSchedule = pickedSchedulesByCourt[0]
            found = true
          }
        }
      }
    })
    if (pickedSchedule){
      pickedSchedule.click()
    }

    return pickedSchedule
  }
}

module.exports = SchedulePickerHandler