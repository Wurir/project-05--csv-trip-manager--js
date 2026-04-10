document.addEventListener('DOMContentLoaded', init)

const basket = []

function init() {
    const uploaderInputEl = document.querySelector('.uploader__input')
    const excursionsList = document.querySelector('.excursions')

    uploaderInputEl.addEventListener('change', uploadFiles)
    excursionsList.addEventListener('submit', addToBasket)
}

function uploadFiles(e) {
    const files = e.target.files

    if (!files) return

    for (let file of files) {

        const reader = new FileReader()
        reader.onload = function (event) {
            const result = event.target.result
            const excursionsList = formatCsvToArray(result)
            excursionsList.forEach(function (trip) {
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
            childrenPrice: text[4],
        }
        excursionsList.push(excursion)
    }

    return excursionsList
}

function cleanCsvString(value) {
    return value.replace(/^"|"$/g, "")
}

function createUserExcursion(excursionObj) {
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

    const childrenPrice = newExcursionLi.querySelector('.excursions__price-children')
    childrenPrice.innerText = excursionObj.childrenPrice

    const adultPriceContainer = newExcursionLi.querySelector('.excursions__field--adult')
    adultPriceContainer.dataset.priceAdult = excursionObj.adultPrice

    const childrenPriceContainer = newExcursionLi.querySelector('.excursions__field--children')
    childrenPriceContainer.dataset.priceChildren = excursionObj.childrenPrice

    excursionsListElement.appendChild(newExcursionLi)
}

function addToBasket(e) {
    e.preventDefault()

    const excursionListItem = e.target

    const adultPriceContainer = excursionListItem.querySelector('.excursions__field--adult')
    const childrenPriceContainer = excursionListItem.querySelector('.excursions__field--children')

    const excursionHeader = excursionListItem.previousElementSibling
    const excursionTitle = excursionHeader.querySelector('.excursions__title').textContent

    const adultPrice = Number(adultPriceContainer.dataset.priceAdult)
    const childrenPrice = Number(childrenPriceContainer.dataset.priceChildren)

    const adultsQuantity = Number(e.target.elements.adults.value)
    const childrenQuantity = Number(e.target.elements.children.value)

    const excursion = {
        title: excursionTitle,
        adultPrice,
        adultsQuantity,
        childrenPrice,
        childrenQuantity
    }
    basket.push(excursion)
    console.log(basket);
}