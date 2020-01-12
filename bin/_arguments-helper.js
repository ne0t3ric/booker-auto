const parseArgs  = require('minimist')
const defaultConfig = require('./config')

const cliArgumentsHelper = {
    extract: function (processArgv) {
        /* Get bin arguments
        --date 2019-11-10T12:00 
        --sport padel (optionnal, see defaultConfig value)
        --excludedCourts 1,,9,10,11,12 (optionnal, see defaultConfig value)
        --deferDate 2019-11-10T12:00
        --prod
        */
        const args = parseArgs(processArgv.slice(2), {
            string: ['date','sport','excludedCourts', 'deferDate'],
            boolean: ['prod'], // --prod
            alias: { d: 'date' }
        });


        args._.splice(1)
        const action = args._[0]

        return {
            book: action === 'book' || false,
            status: action === 'status' || false,
            date: action === 'book' ? this.extractDate(args.date) : '',
            deferDate: action === 'book' ? this.extractDeferDate(args.deferDate) : '',
            noValidation: 'undefined' !== typeof args.prod ? !args.prod : defaultConfig.noValidation,
            sport: args.sport || defaultConfig.sport,
            excludedCourts: 'undefined' !== typeof args.excludedCourts ? args.excludedCourts.split(',') : defaultConfig.excludedCourts,
            delayBeforeBooking: args.delayBeforeBooking || defaultConfig.delayBeforeBooking
        }
    },
    extractDeferDate(deferDate){
        if ('undefined' !== typeof deferDate){
            if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(deferDate)) {
                throw new Error('Misformatted date given. ISO 8601 format in UTC needed')
            } else {
                return deferDate
            }
        } else {
            return null
        }
    },

    extractDate(date) {
        if (date === undefined) {
            throw new Error('Missing argument (date as ISO 8601 Date in UTC)')
        }
        
        if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(date)) {
            throw new Error('Misformatted date given. ISO 8601 format in UTC needed')
        }

        return date
    }
}
module.exports = cliArgumentsHelper