const NavigateToLoginHandler = require('./handlers/NavigateToLogin/NavigateToLoginHandler')
const LoginFormHandler = require('./handlers/LoginForm/LoginFormHandler')
const NavigateToBookPageHandler = require('./handlers/NavigateToSchedules/NavigateToBookPageHandler')
const DatePickerHandler = require('./handlers/DatePicker/DatePickerHandler')
const SchedulePickerHandler = require('./handlers/SchedulePicker/SchedulePickerHandler')
const BookingFormHandler = require('./handlers/BookingForm/BookingFormHandler')

class Booker {
  constructor(request) {
    request = request || {}
    //Date ISO 8601
    this.date = request.date
    this.sport = request.sport
    this.noValidation = request.noValidation
  }

  async book(page) {
    const date = this.date
    const sport = this.sport
    const noValidation = this.noValidation

    const start = new NavigateToLoginHandler()
    const loginForm = new LoginFormHandler()
    const navigateToBookPage = new NavigateToBookPageHandler()
    const datePicker = new DatePickerHandler(date, sport)
    const schedulePicker = new SchedulePickerHandler(date)
    const bookingForm = new BookingFormHandler(noValidation)

    start.setNext(loginForm)
    loginForm.setNext(navigateToBookPage)
    navigateToBookPage.setNext(datePicker)
    datePicker.setNext(schedulePicker)
    schedulePicker.setNext(bookingForm)

    await start.handle(page)
  }

  /*
    @TODO: status return
  */
  async getStatus(page){
    return 'json status'
  }
}

module.exports = Booker