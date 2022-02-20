const tracer = require('./../tracer')
const BaseHandlerException = require('./../exceptions/BaseHandlerException')

class BaseHandler {
	constructor(options) {
		if (this.execute === undefined) {
			throw new TypeError('Must define execute method for class');
		}
		if (this.canExecute === undefined) {
			throw new TypeError('Must define canExecute method for class');
		}

		this.options = options
		this.next = null
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
		await tracer.capture(page)
	}

	async handleForm(page){
		return false
	}
}

module.exports = BaseHandler