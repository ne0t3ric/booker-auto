#!/usr/bin/env node

const puppeteer = require('puppeteer')
const scripts = require('./../src/puppeteer-scripts-exports')
const cliArgumentsHelper = require('./_arguments-helper')
const runScript = require('./_run-script')
const secureMinuteDelay = 1 //m
const currentScript = __filename

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

//Start booking schedule for sport
; (async () => {
  try {
    if (params.deferDate){
      //booking is schedule from deferDate. At this date, the booking script will be
      //launched to start booking at params.date date.
      const deferDate = new Date(params.deferDate)
      const deferPeriod = Math.max(deferDate - now, 0)
      setTimeout(function(){
        runScript(currentScript, [
          params.book ? 'book' : '',
          params.status ? 'status': '',
          '--date', params.date,
          '--sport', params.sport,
          '--excludedCourts', params.excludedCourts.join(','),
          params.noValidation ? '' : '--prod'
        ]);
      }.bind(this), deferPeriod)
    } else if (now < minDate) {
       //defer booking because it is too early to book, by adding deferDate
      runScript(currentScript, [
          params.book ? 'book' : '',
          params.status ? 'status': '',
        '--date', params.date,
        '--sport', params.sport,
        '--excludedCourts', params.excludedCourts.join(','),
        '--deferDate', minDate.toISOString(),
        params.noValidation ? '' : '--prod'
      ]);
      process.exit(10)
    } else { 
      // Immediate booking
      //Security timeout
      const timeout = 90 * 1000
      setTimeout((function () {
        console.error('Timeout exceed ' + timeout / 1000 + 'seconds')
        return process.exit(22)
      }), timeout)

      if (params.book){
        await scripts.book(params)
      } else if (params.status){
        await scripts.status(params)
      }
      process.exit(0)
    }   
  } catch (err) {
    console.log(err.message)

    process.exit(err.statusCode || 1)
  }
})()
