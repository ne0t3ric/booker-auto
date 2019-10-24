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
    /**
     * Picked Schedule JSHandle
     * @type {JSHandle}
     */
    console.log('... at ', time, ' ...')
    const pickedScheduleHandle = await page.evaluateHandle(this.pickSchedule, padelCourtsSelector, time, timeNext, this.classNames)
    if (null === pickedScheduleHandle.asElement()) {
      throw new BaseHandlerException('No schedule available ! Stop...')
    } else {
      console.log('Found schedule')
      await pickedScheduleHandle.asElement().click()
      await page.waitForNavigation()
    }
  }

  pickSchedule(padelCourtsSelector, time, timeNext, classNames) {
    let pickedSchedule = null
    let found = false
    const padelCourts = document.querySelectorAll(padelCourtsSelector)

    //remove waiting list possibility... (pas de liste d'attente désirée)
    const bookablePadelCourts = Array.from(padelCourts)
    bookablePadelCourts.pop()
    bookablePadelCourts.forEach(function (schedulesByCourt) {
      const availableSchedules = Array.from(schedulesByCourt.querySelectorAll('.' + classNames.available))
      if (availableSchedules && availableSchedules.length > 0) {
        const pickedSchedulesByCourt = Array.from(availableSchedules).filter(function (el) {
          return el.innerText === time
        });
        if (!found && pickedSchedulesByCourt.length > 0) {
          let nextIsNotTooClose = true
          if (null !== pickedSchedulesByCourt[0].nextElementSibling){
            nextIsNotTooClose = !(pickedSchedulesByCourt[0].nextElementSibling.classList.contains(classNames.unavailable)
            && pickedSchedulesByCourt[0].nextElementSibling.innerText.includes(timeNext))
          }

          if (nextIsNotTooClose) {
            pickedSchedule = pickedSchedulesByCourt[0]
            found = true
          }
        }
      }
    })

    return pickedSchedule
  }
}

module.exports = SchedulePickerHandler