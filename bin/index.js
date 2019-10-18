const puppeteer = require('puppeteer')
const Login = require('./../lib/blocks/login')
const Block = require('./../lib/blocks/book')
const config = require('./../config')
const blockConfig = {
  capture: {
    path: config.logs.path
  }
}

;(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--proxy-bypass-list=<-loopback>']})
  const page = await browser.newPage()
  await page.setViewport({width: 1000, height: 1000}); // <-- add await here so it sets viewport after it creates the page

  const login = new Login('login', page, blockConfig)
  await login.execute()

  const book = new Block('book', page, blockConfig)
  await book.execute()

  browser.close()

  process.exit(22);
})()

setTimeout((function() {
    return process.exit(22);
}), 10000);