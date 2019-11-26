#!/usr/bin/env node

const puppeteer = require('puppeteer')
const SportBooker = require('./../lib')
const cliArgumentsHelper = require('./_arguments-helper')
const runScript = require('./_run-script')
const schedule = require('node-schedule')
const secureMinuteDelay = 1 //m

let params;
try {
  //Get bin arguments
  params = cliArgumentsHelper.extract(process.argv)
  //@TODO move screenshots as logger with singleton
} catch (err) {
  console.error(err.message)
  process.exit(1)
}

// Find out if booking needs to be differ because of the delayBeforeBooking
//'2019-11-03T11:00:00Z' ISO 8601 format
const now = new Date()
const bookingDate = new Date(params.date)
const { delayBeforeBooking } = params;
const minDate = new Date(
  bookingDate.getFullYear(),
  bookingDate.getMonth(),
  bookingDate.getDate() - delayBeforeBooking,
  bookingDate.getHours(),
  bookingDate.getMinutes() + secureMinuteDelay
); 

if (params.deferDate){
  schedule.scheduleJob(params.deferDate, function(){
    runScript('./bin/cli-sport-booker.js', [
      '--date', params.date,
      '--sport', params.sport,
      '--excludedCourts', params.excludedCourts.join(','),
      params.noValidation ? '' : '--prod'
    ]);
  })

  process.exit(0)
}
//Start booking schedule for sport
; (async () => {
  try {
    //defer booking because it is too early to book
    if (now < minDate) {
      runScript('./bin/cli-sport-booker.js', [
        '--date', params.date,
        '--sport', params.sport,
        '--excludedCourts', params.excludedCourts.join(','),
        '--deferDate', minDate,
        params.noValidation ? '' : '--prod'
      ]);
    } else { 
      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox', '--proxy-bypass-list=<-loopback>'] })
      // {date : ISO date}
      //'2019-11-03T12:00' ISO 8601 format
      const sportBooker = new SportBooker(params)

      const page = await browser.newPage()
      await page.setViewport({ width: 1000, height: 1000 })

      await sportBooker.book(page)

      await browser.close()

      process.exit(0)
    }   
  } catch (err) {
    console.log(err.message)

    process.exit(err.statusCode || 1)
  }
})()

//Security timeout
const timeout = 45 * 1000
setTimeout((function () {
  console.error('Timeout exceed')
  return process.exit(22)
}), timeout)