## sport-booker
`sport-booker` allows a bad-ass padel or squash player to book its desired schedule to play with his friends (or ennemies). There is more : you can choose your sport and it can be used automatically

This project is just an example of automated booking procedure, but it can be extended to other purposes.

## Motivation
Competitive booking at Toulouse Padel Club, generally schedules are all booked at 12:00 within less than 30mn.

## Screenshots
Incoming screenshots

## Technology
<b>Built with</b>
- [NodeJS](https://nodejs.org/)
- [Puppeteer](https://developers.google.com/web/tools/puppeteer)

## Features
- Book a specified date 
- Configure the desired options (excluded courts)
- Anticipate your booking by a delayed booking execution


## Installation

You need [NodeJS](https://nodejs.org/) to use this library


Install packages
```
npm install
```

Install binary
```
npm link
```

Then generate config env file from the example template, and replace the values
```
cp .env.example .env
```

## Tests
There is no tests yet in this project

## How to use?
After installation above, you can run two commands (CLI) in your terminal


Book your schedule directly : `booker-auto-cli`
```
booker-auto-cli --date 2019-12-05T11:00:00.000Z --sport padel (optional) --excludedCourts 1,9,10,11,12 --prod
```

It will automatically anticipate your booking at a given schedule if the demand is too early. It is possible to launch the booking command at a specific date (as a scheduled job) with `--deferDate <deferDate>` options
```
booker-auto-cli --date 2019-12-05T11:00:00.000Z  --deferDate
```


## Contribute
All the Padel team can contribute to this project ! :)


## License
Private © [Hang Eric]()
