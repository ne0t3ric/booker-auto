const config = require('./../../config')

let _captureCount = 0

class BaseHandler {
	constructor(options) {
		if (this.execute === undefined) {
			throw new TypeError('Must define execute method for class');
		}
		if (this.canExecute === undefined) {
			throw new TypeError('Must define canExecute method for class');
		}
		this.capturePath = config.screenshots.path
		this.options = options
		this.next = null
	}

	static countCaptures(){
		return _captureCount
	}

	static incrementCaptureCount(){
		_captureCount++
	}

	setNext(next){
		this.next = next
	}

	async handle(page){
		console.log(this.constructor.name)
    if (this.canExecute(page)){
			// await this.waitForNavigationEnd(page)
			await this.execute(page)
			// await this.waitForNavigationEnd(page)
			await this.capture(page)
		}
		
		if (this.next){
			await this.next.handle(page)
    }
	}
	
	canExecute(page){
		return (page === page)
	}

	async execute(page){
		
	}
	async waitForNavigationEnd(page){
		await page.waitForNavigation()
	}
	async capture(page){
		const targetPath = this.capturePath + 'flow-' + this.constructor.countCaptures() + '-' + this.constructor.name + '.png'
		await page.screenshot({path: targetPath})
		this.constructor.incrementCaptureCount()
    console.log('Logs - capture ' + targetPath)
	}
}

BaseHandler.captureCount = 0

module.exports = BaseHandler