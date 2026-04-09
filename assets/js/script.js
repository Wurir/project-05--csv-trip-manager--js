const txt = `"1","Ogrodzieniec","Zamek Ogrodzieniec – ruiny zamku leżącego na Jurze Krakowsko-Częstochowskiej, wybudowanego w systemie tzw. Orlich Gniazd, we wsi Podzamcze w województwie śląskim, w powiecie zawierciańskim, około 2 km na wschód od Ogrodzieńca. Zamek został wybudowany w XIV – XV w. przez ród Włodków Sulimczyków.","99PLN","50PLN"
"2","Ojców","wieś w województwie małopolskim, w powiecie krakowskim, w gminie Skała, na terenie Wyżyny Krakowsko-Częstochowskiej, w Dolinie Prądnika, na Szlaku Orlich Gniazd. W Królestwie Polskim istniała gmina Ojców. W latach 1975–1998 miejscowość położona była w województwie krakowskim. W latach 1928–1966 Ojców miał status uzdrowiska posiadającego charakter użyteczności publicznej.","40PLN","15PLN`;

console.log(txt.split(/[\r\n]+/gm));

document.addEventListener('DOMContentLoaded', init)

function init() {
    const uploaderInputEl = document.querySelector('.uploader__input')

    uploaderInputEl.addEventListener('change', uploadFiles)
}

function uploadFiles(e) {
    const files = e.target.files

    if (!files) return

    for (let file of files) {

        const reader = new FileReader()
        reader.onload = function (event) {
            const result = event.target.result
            const excursionsList = formatCsvToArray(result)
            excursionsList.forEach(function(trip){
                createUserExcursion(trip)
            })
        }
        reader.readAsText(file)
    }

}

function formatCsvToArray(string) {
    const splitedStringArr = string.split(/[\r\n]+/gm)
    
    const excursionsList = []

    for (let line of splitedStringArr) {
        const text = line.split('","').map(cleanCsvString)

        const excursion = {
            id: text[0],
            title: text[1],
            description: text[2],
            adultPrice: text[3],
            childPrice: text[4],
        }
        excursionsList.push(excursion)
    }

    return excursionsList
}

function cleanCsvString(value){
    return value.replace(/^"|"$/g, "")
}

function createUserExcursion(excursionObj){
    const excursionsListElement = document.querySelector('.panel__excursions')
    const excursionLiPrototype = document.querySelector('.excursions__item--prototype')
    const newExcursionLi = excursionLiPrototype.cloneNode(true)
    newExcursionLi.classList.remove('excursions__item--prototype')

    const excursionTitle = newExcursionLi.querySelector('.excursions__title')
    excursionTitle.innerText = excursionObj.title

    const excursionDescription = newExcursionLi.querySelector('.excursions__description')
    excursionDescription.innerText = excursionObj.description

    const adultPrice = newExcursionLi.querySelector('.excursions__price-adult')
    adultPrice.innerText = excursionObj.adultPrice

    const childPrice = newExcursionLi.querySelector('.excursions__price-child')
    childPrice.innerText = excursionObj.childPrice

    excursionsListElement.appendChild(newExcursionLi)
}