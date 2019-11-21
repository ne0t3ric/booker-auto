#!/usr/bin/env node

const puppeteer = require('puppeteer')
const SportBooker = require('./../lib')
const cliArgumentsHelper = require('./cli-arguments-helper')
const schedule = require('node-schedule')
const childProcess = require('child_process');
const secureMinuteDelay = 1 //m


function runScript(scriptPath, args, callback) {

  // keep track of whether callback has been invoked to prevent multiple invocations
  let invoked = false;

  const process = childProcess.fork(scriptPath, args);

  // listen for errors as they may prevent the exit event from firing
  process.on('error', function (err) {
    if (invoked) return;
    invoked = true;
    callback(err);
  });

  // execute the callback once the process has finished running
  process.on('exit', function (code) {
    if (invoked) return;
    invoked = true;
    let err = code === 0 ? null : new Error('exit code ' + code);
    callback(err);
  });

}

//Start booking schedule for sport
; (async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox', '--proxy-bypass-list=<-loopback>'] })
  let isScheduleBooked, params;
  try {
    //Get bin arguments
    params = cliArgumentsHelper.extract(process.argv)
    //@TODO move screenshots as logger with singleton
  } catch (err) {
    console.error(err.message)
    process.exit(2)
  }

  try {
    if (params.defer) {
      //'2019-11-03T12:00' ISO 8601 format
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

      const execute = function (params) {
        runScript('./bin/cli-sport-booker.js', [
          '--date', params.date,
          '--sport', params.sport,
          '--excludedCourts', params.excludedCourts.join(','),
          params.noValidation ? '' : '--prod'
        ], function (err) {
          if (err) throw err;
          console.log('Finished running sport booker script');
        });
      }.bind(null, params)

      if (now < minDate) {
        console.log('differ')
        schedule.scheduleJob(minDate, execute)
      } else {
        console.log('do it now')
        execute(params)
      }
    } else {
      // {date : ISO date}
      //'2019-11-03T12:00' ISO 8601 format
      const sportBooker = new SportBooker(params)

      const page = await browser.newPage()
      await page.setViewport({ width: 1000, height: 1000 })

      await sportBooker.book(page)

      isScheduleBooked = true;
    }
  } catch (err) {
    console.error(err.message)
    isScheduleBooked = false;
  } finally {
    await browser.close()
  }

  if (isScheduleBooked) {
    process.exit(0)
  } else {
    process.exit(1)
  }
})()

//Security timeout
const timeout = 45 * 1000
setTimeout((function () {
  console.error('Timeout exceed')
  return process.exit(22)
}), timeout)