#!/usr/bin/env node

const puppeteer = require('puppeteer')
const PadelBooker = require('./../lib')
const cliArgumentsHelper = require('./cli-arguments-helper')
const defaultConfig = require('./../config')

//Start booking padel schedule
;(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--proxy-bypass-list=<-loopback>']})
  let isPadelCourtForScheduleBooked;

  try{   
    //Get bin arguments
    const cliParams = cliArgumentsHelper.extract(process.argv)

    //@TODO move screenshots as logger with singleton
    const params = Object.assign({}, defaultConfig.book, cliParams)

    // {date : ISO date}
    //'2019-11-03T12:00' ISO 8601 format
    const padelBooker = new PadelBooker(params)
    
    const page = await browser.newPage()
    await page.setViewport({ width: 1000, height: 1000 })
  
    await padelBooker.book(page)

    isPadelCourtForScheduleBooked = true;
   } catch (err) {
    console.error(err.message)
    isPadelCourtForScheduleBooked = false;
  } finally {
    await browser.close()
  } 

  if (isPadelCourtForScheduleBooked){
    process.exit(0)
  } else {
    process.exit(1)
  }
})()

//Security timeout
const timeout = 45*1000
setTimeout((function() {
    console.error('Timeout exceed')
    return process.exit(22)
}), timeout)