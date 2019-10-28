const puppeteer = require('puppeteer')
const NavigateToLoginHandler = require('./handlers/NavigateToLogin/NavigateToLoginHandler')
const LoginFormHandler = require('./handlers/LoginForm/LoginFormHandler')
const NavigateToSchedulesHandler = require('./handlers/NavigateToSchedules/NavigateToSchedulesHandler')
const DatePickerHandler = require('./handlers/DatePicker/DatePickerHandler')
const SchedulePickerHandler = require('./handlers/SchedulePicker/SchedulePickerHandler')
const BookingFormHandler = require('./handlers/BookingForm/BookingFormHandler')

class PadelBooking {
  constructor(request) {
    request = request || {}
    //Date ISO 8601
    this.date = request.date

/*     //Format DD/MM/YYYY
    this.date = this.fullDate.getDateWithoutHour()

    //Format HH:mm
    this.time = this.fullDate.getHoursMinutes() */
  }

  async book(page) {
    const date = this.date
    const start = new NavigateToLoginHandler()
    const loginForm = new LoginFormHandler()
    const navigateToSchedules = new NavigateToSchedulesHandler()
    const datePicker = new DatePickerHandler(date)
    const schedulePicker = new SchedulePickerHandler(date)
    const bookingForm = new BookingFormHandler()

    start.setNext(loginForm)
    loginForm.setNext(navigateToSchedules)
    navigateToSchedules.setNext(datePicker)
    datePicker.setNext(schedulePicker)
    schedulePicker.setNext(bookingForm)

    await start.handle(page)
  }
}

module.exports = PadelBooking