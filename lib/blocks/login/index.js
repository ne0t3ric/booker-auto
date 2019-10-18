/**
 * @name Index
 *
 * @desc Logs into Padel login page. Provide your username and password
 * 
 */
const config = require('./config.json')
const URL = config.url
const Block = require('./../block')

class Login extends Block {
    async procedure() {
        const page = this.context
        await page.goto(URL, {
            waitUntil: 'networkidle0'
        })

        await this.capture()

        /**
         * issue https://github.com/GoogleChrome/puppeteer/issues/1648
         *
         * cant use loop...
         */
        await page.type(config.user.selector, config.user.value);
        await page.type(config.password.selector, config.password.value);

        const form = await page.$(config.form.selector)
        await form.evaluate(form => form.submit())

        await page.waitForNavigation()

        await page.goto(URL, {
            waitUntil: 'networkidle0'
        })

        await this.capture()
    }
}


module.exports = Login