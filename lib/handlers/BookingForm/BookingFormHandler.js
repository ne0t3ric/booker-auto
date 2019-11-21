const config = require('./config.json')
const FormHandler = require('../FormHandler')

class BookingFormHandler extends FormHandler {
  constructor(noValidation) {
    super()

    this.config = config
    this.form = config.form.selector
    this.noValidation = noValidation
  }

  async execute(page) {
    // fill form
    const players = this.config.players
    await page.select(players.selector, players.value.toString())
  }

  preventValidation(){
    return this.noValidation
  }
}

module.exports = BookingFormHandler