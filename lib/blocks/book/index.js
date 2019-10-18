const config = require('./config.json')
const URL = config.url
const Block = require('./../block')

function foundAvailableSchedule(time, timeNext){
    var foundElement = null;
    var found = false;
    document.querySelectorAll(".contenu table td.creneaux").forEach(function(el){ 
        var libres = Array.from(el.querySelectorAll(".creneau_libre"));
        libres.pop();
        if (libres && libres.length > 0){
            var libre = Array.from(libres).filter(function(el) {
            return el.innerText === time;
            });
            if (!found && libre.length > 0){
                var nextIsNotTooClose = !(libre[0].nextElementSibling.classList.contains('creneau_ferme') && libre[0].nextElementSibling.innerText.includes(timeNext));
                if (nextIsNotTooClose){
                foundElement = libre[0];
                found = true;
                }
            }
        }
        })
    
        return foundElement
}


class Book extends Block {
    async procedure() {
        const page = this.context
        try{ // <-- wrap the whole block in try catch
            await page.setViewport({width: 1000, height: 1000}); // <-- add await here so it sets viewport after it creates the page
            await page.goto(URL);

            //foundAvailableSchedule("12:00", "12:30");

            await this.capture()
        } catch (error) {
            console.log(error);
        }
    }
}


module.exports = Book