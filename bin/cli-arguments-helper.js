const parseArgs  = require('minimist')
const defaultConfig = require('./config')

const cliArgumentsHelper = {
    extract: function (processArgv) {
        //Get bin arguments
        const args = parseArgs(processArgv.slice(2), {
            string: ['date','sport','excludedCourts'], // --date 2019-11-10T12:00 --sport padel (opt., default)
            boolean: ['defer', 'prod'], // --defer
            alias: { d: 'defer' }
        });

        // 1st argument => date
        const date = args[0]

        return {
            date: this.extractDate(args.date || undefined),
            defer: args.defer || false,
            noValidation: 'undefined' !== typeof args.prod ? !args.prod : defaultConfig.noValidation,
            sport: args.sport || defaultConfig.sport,
            excludedCourts: 'undefined' !== typeof args.excludedCourts ? args.excludedCourts.split(',') : defaultConfig.excludedCourts,
            delayBeforeBooking: args.delayBeforeBooking || defaultConfig.delayBeforeBooking
        }
    },
    extractDate(date) {
        if (date === undefined) {
            throw new Error('Missing argument (date as ISO 8601 Date)')
        }

        if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(date)) {
            throw new Error('Misformatted date given. ISO 8601 format needed')
        }

        return date
    }
}
module.exports = cliArgumentsHelper