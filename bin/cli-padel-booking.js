/* #!/usr/bin/env node

const puppeteer = require('puppeteer')
const SportBooker = require('./../lib')
const cliArgumentsHelper = require('./cli-arguments-helper')
const defaultConfig = require('./../config')

//Start booking schedule for sport
;(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--proxy-bypass-list=<-loopback>']})
  let isScheduleBooked;

  try{   
    //Get bin arguments
    const cliParams = cliArgumentsHelper.extract(process.argv)

    //@TODO move screenshots as logger with singleton
    const params = Object.assign({}, defaultConfig.book, cliParams)

    // {date : ISO date}
    //'2019-11-03T12:00' ISO 8601 format
    const sportBooker = new SportBooker(params)
    
    const page = await browser.newPage()
    await page.setViewport({ width: 1000, height: 1000 })
  
    await sportBooker.book(page)

    isScheduleBooked = true;
   } catch (err) {
    console.error(err.message)
    isScheduleBooked = false;
  } finally {
    await browser.close()
  } 

  if (isScheduleBooked){
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
}), timeout) */