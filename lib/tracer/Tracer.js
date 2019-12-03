const fs = require('fs');
const mkdirp = require('mkdirp');

let _captureCount = 0

class Tracer {
  constructor(config) {
    this.capturePath = config.path
    this.enable = config.enable

    if (this.enable) {
      //create directory
      mkdirp.sync(this.capturePath)
    }
  }

  async capture(page) {
    if (this.enable) {
      const targetPath = this.capturePath + 'flow-' + this.constructor.countCaptures() + '-' + this.constructor.name + '.png'
      await page.screenshot({ path: targetPath })
      this.constructor.incrementCaptureCount()
      console.log('Logs - capture ' + targetPath)
    }
  }

  static countCaptures() {
    return _captureCount
  }

  static incrementCaptureCount() {
    _captureCount++
  }
}

Tracer.captureCount = 0


module.exports = Tracer