const config = require('./config.json')
const BaseHandler = require('./../BaseHandler')

class SchedulePickerHandler extends BaseHandler {
  constructor(options) {
    super(options)

    this.classNames = config.className
    this.padelCourtsSelector = config.padelCourtsSelector
  }

  async execute(page) {
    const padelCourtsSelector = this.padelCourtsSelector
    const time = '12:00'
    const timeNext = '12:30'
    await page.evaluate(this.pickSchedule, padelCourtsSelector, time, timeNext, this.classNames);
  }

  pickSchedule(padelCourtsSelector, time, timeNext, classNames) {
    let pickedSchedule = null;
    let found = false;
    const padelCourts = document.querySelectorAll(padelCourtsSelector)
    padelCourts.forEach(function (schedulesByCourt) {
      const availableSchedules = Array.from(schedulesByCourt.querySelectorAll('.' + classNames.available));

      //remove waiting list possibility... (pas de liste d'attente désirée)
      availableSchedules.pop();

      if (availableSchedules && availableSchedules.length > 0) {
        const pickedSchedulesByCourt = Array.from(availableSchedules).filter(function (el) {
          return el.innerText === time;
        });
        if (!found && pickedSchedulesByCourt.length > 0) {
          const nextIsNotTooClose = !(pickedSchedulesByCourt[0].nextElementSibling.classList.contains(classNames.unavailable)
            && pickedSchedulesByCourt[0].nextElementSibling.innerText.includes(timeNext));
          if (nextIsNotTooClose) {
            pickedSchedule = pickedSchedulesByCourt[0];
            found = true;
          }
        }
      }
    })
    if (pickedSchedule){
      pickedSchedule.click();
    }
  }
}

module.exports = SchedulePickerHandler