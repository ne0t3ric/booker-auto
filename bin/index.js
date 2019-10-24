const puppeteer = require('puppeteer')
const PadelBooking = require('./../lib')

;(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--proxy-bypass-list=<-loopback>']})

  try{
    const date = '2019-10-25T21:00'
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