const puppeteer = require('puppeteer')
const NavigateToLoginHandler = require('./../lib/handlers/NavigateToLogin/NavigateToLoginHandler')
const LoginHandler = require('./../lib/handlers/Login/LoginHandler')
const NavigateToSchedulesHandler = require('./../lib/handlers/NavigateToSchedules/NavigateToSchedulesHandler')
const DayPickerHandler = require('./../lib/handlers/DayPicker/DayPickerHandler')
const SchedulePickerHandler = require('./../lib/handlers/SchedulePicker/SchedulePickerHandler')
const ScheduleBookingHandler = require('./../lib/handlers/ScheduleBooking/ScheduleBookingHandler')


;(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--proxy-bypass-list=<-loopback>']})

  try{
    const day = '25/10/2019'
    const time = '14:00'
    const start = new NavigateToLoginHandler()
    const login = new LoginHandler()
    const navigateToSchedules = new NavigateToSchedulesHandler()
    const dayPicker = new DayPickerHandler(day)
    const schedulePicker = new SchedulePickerHandler(time)
    // const validateSchedule = new ValidateScheduleHandler()

    start.setNext(login)
    login.setNext(navigateToSchedules)
    navigateToSchedules.setNext(dayPicker)
    dayPicker.setNext(schedulePicker)
    // pickSchedule.setNext(validateSchedule)

    const page = await browser.newPage()
    await page.setViewport({width: 1000, height: 1000}); // <-- add await here so it sets viewport after it creates the page
    
    await start.handle(page)
   } catch (err) {
    console.error(err.message);
  } finally {
    await browser.close();
  } 
 

/*   browser.close()
 */
  process.exit(22);
})()

setTimeout((function() {
    console.error('Timeout execeed');
    return process.exit(22);
}), 20000);