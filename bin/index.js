const puppeteer = require('puppeteer')
const NavigateToLoginHandler = require('./../lib/handlers/NavigateToLogin/NavigateToLoginHandler')
const LoginFormHandler = require('./../lib/handlers/LoginForm/LoginFormHandler')
const NavigateToSchedulesHandler = require('./../lib/handlers/NavigateToSchedules/NavigateToSchedulesHandler')
const DayPickerHandler = require('./../lib/handlers/DayPicker/DayPickerHandler')
const SchedulePickerHandler = require('./../lib/handlers/SchedulePicker/SchedulePickerHandler')
const BookingFormHandler = require('../lib/handlers/BookingForm/BookingFormHandler')

;(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--proxy-bypass-list=<-loopback>']})

  try{
    const day = '25/10/2019'
    const time = '14:00'
    const start = new NavigateToLoginHandler()
    const loginForm = new LoginFormHandler()
    const navigateToSchedules = new NavigateToSchedulesHandler()
    const dayPicker = new DayPickerHandler(day)
    const schedulePicker = new SchedulePickerHandler(time)
    const bookingForm = new BookingFormHandler()

    start.setNext(loginForm)
    loginForm.setNext(navigateToSchedules)
    navigateToSchedules.setNext(dayPicker)
    dayPicker.setNext(schedulePicker)
    schedulePicker.setNext(bookingForm)

    const page = await browser.newPage()
    await page.setViewport({width: 1000, height: 1000}); // <-- add await here so it sets viewport after it creates the page
    
    await start.handle(page)
   } catch (err) {
    console.error(err.message);
  } finally {
    await browser.close();
  } 
 
  process.exit(22);
})()

setTimeout((function() {
    console.error('Timeout execeed');
    return process.exit(22);
}), 20000);