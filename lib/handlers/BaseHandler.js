const config = require('./../../config')
const BaseHandlerException = require('./../exceptions/BaseHandlerException')

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
		console.log('Chaining handler : ', this.constructor.name)

    if (this.canExecute(page)){
			await this.execute(page)
			await this.capture(page)
			// if instance of form handler
			await this.handleForm(page)
		}
		

		if (this.next){
			await this.next.handle(page)
    }
	}
	
	canExecute(page){
		return (page === page)
	}

	async execute(page){
		//To define for each
		throw new BaseHandlerException('Missing execute() method for ' + this.constructor.name)
	}

	async capture(page){
		const targetPath = this.capturePath + 'flow-' + this.constructor.countCaptures() + '-' + this.constructor.name + '.png'
		await page.screenshot({path: targetPath})
		this.constructor.incrementCaptureCount()
    console.log('Logs - capture ' + targetPath)
	}

	async handleForm(page){
		return false
	}
}

BaseHandler.captureCount = 0

module.exports = BaseHandler