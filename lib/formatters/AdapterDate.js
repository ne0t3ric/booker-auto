const defaultOptions = {
  locale: 'fr-FR',
  timeZone: 'Europe/Paris'
}

class AdapterDate extends Date {
  constructor(ISODate, options) {
    options = options || defaultOptions
    const DateWithTimeZone = new Date(ISODate).toLocaleString(options.locale, {timeZone: options.timeZone})
    super(DateWithTimeZone)
    this.separator = '/'
  }
  getDigitMonth(){
    return ("0" + (this.getMonth() + 1)).slice(-2)
  }
  getDigitDate(){
    return ("0" + this.getDate()).slice(-2)
  }
  getDigitHours(){
    return ("0" + this.getHours()).slice(-2)
  }
  getDigitMinutes(){
    return ("0" + this.getMinutes()).slice(-2)
  }
  /*
  * DD/MM/YYYY
  */
  getDateWithoutHour(){
    return this.getDigitDate() + this.separator + this.getDigitMonth() + this.separator + this.getFullYear()
  }
  /*
  * HH:mm
  */
  getHoursMinutes(){
    return this.getDigitHours() + ':' + this.getDigitMinutes()
  }
}

module.exports = AdapterDate