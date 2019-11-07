const cliArgumentsHelper = {
    extract: function (processArgv) {
        //Get bin arguments
        const [,, ...args] = processArgv

        // 1st argument => date
        const date = args[0]

        return {
            date: this.extractDate(date)
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