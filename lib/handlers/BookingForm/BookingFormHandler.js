const config = require('./config.json')
const FormHandler = require('../FormHandler')

class BookingFormHandler extends FormHandler {
  constructor(options) {
    super(options)

    this.config = config
    this.form = config.form.selector
  }

  async execute(page) {
    // fill form
    const players = this.config.players
    await page.select(players.selector, players.value.toString())
  }

  preventValidation(){
    return (this.config.form.stopValidation)
  }
}

module.exports = BookingFormHandler