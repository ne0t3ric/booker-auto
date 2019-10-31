#!/usr/bin/env node

//Get bin arguments
const [,, ...args] = process.argv

const puppeteer = require('puppeteer')
const PadelBooking = require('./../lib')
const PadelDate = require('./../lib/formatters/PadelDate')

//Start booking padel schedule
;(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--proxy-bypass-list=<-loopback>']})

  try{   
    if (args[0] === undefined){
      throw new Error('Missing argument (date as ISO 8601 Date)')
    }
    if (!PadelDate.isISO(args[0])){
      throw new Error ('Misformatted date given. ISO 8601 format needed')
    }

    //'2019-11-03T12:00' ISO 8601 format
    const date = args[0]
    const padelBooking = new PadelBooking({
      date: date
    })
    const page = await browser.newPage()
    await page.setViewport({ width: 1000, height: 1000 })
  
    await padelBooking.book(page)
   } catch (err) {
    console.error(err.message);
  } finally {
    await browser.close();
  } 
 
  process.exit(22);
})()

//Security timeout
const timeout = 20*1000
setTimeout((function() {
    console.error('Timeout execeed');
    return process.exit(22);
}), timeout);