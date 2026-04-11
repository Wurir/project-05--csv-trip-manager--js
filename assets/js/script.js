document.addEventListener('DOMContentLoaded', init)

let basket = []

function init() {
    const uploaderInputEl = document.querySelector('.uploader__input')
    const excursionsList = document.querySelector('.excursions')
    const summaryPanel = document.querySelector('.summary')

    uploaderInputEl.addEventListener('change', uploadFiles)
    excursionsList.addEventListener('submit', addToBasket)
    summaryPanel.addEventListener('click', removeFromSummary)
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

    newExcursionLi.dataset.id = excursionObj.id

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

    const excursionId = excursionListItem.parentElement.dataset.id

    const excursionHeader = excursionListItem.previousElementSibling
    const excursionTitle = excursionHeader.querySelector('.excursions__title').textContent

    const adultPrice = Number(adultPriceContainer.dataset.priceAdult)
    const childrenPrice = Number(childrenPriceContainer.dataset.priceChildren)

    const adultsQuantityEl = e.target.elements.adults
    const adultsQuantity = Number(adultsQuantityEl.value)

    const childrenQuantityEl = e.target.elements.children
    const childrenQuantity = Number(childrenQuantityEl.value)

    if(adultsQuantityEl.value === '' && childrenQuantityEl.value === ''){
        return
    }

    const totalPrice = (adultPrice * adultsQuantity) + (childrenPrice * childrenQuantity)
    const excursion = {
        id: excursionId,
        title: excursionTitle,
        adultPrice,
        adultsQuantity,
        childrenPrice,
        childrenQuantity,
        totalPrice
    }

    basket.push(excursion)
    updateBasket(excursion)
    showTotalOrderPrice()

    adultsQuantityEl.value = ''
    childrenQuantityEl.value = ''
 
}

function updateBasket(excursion) {
    const summaryListEl = document.querySelector('.summary')

    const summaryItemPrototype = summaryListEl.querySelector('.summary__item--prototype')
    const newSummaryItem = summaryItemPrototype.cloneNode(true)
    newSummaryItem.classList.remove('summary__item--prototype')
    newSummaryItem.dataset.id = excursion.id

    const summaryName = newSummaryItem.querySelector('.summary__name')
    summaryName.innerText = excursion.title

    const summaryTotalPrice = newSummaryItem.querySelector('.summary__total-price')

    summaryTotalPrice.innerText = excursion.totalPrice + 'PLN'

    const summaryPrices = newSummaryItem.querySelector('.summary__prices')
    summaryPrices.innerText = 'dorośli: ' + excursion.adultsQuantity + ' x ' + excursion.adultPrice + 'PLN, dzieci: ' + excursion.childrenQuantity + ' x ' + excursion.childrenPrice + 'PLN'

    summaryListEl.appendChild(newSummaryItem)

}

function showTotalOrderPrice(){
    const totalPriceEl = document.querySelector('.order__total-price-value')

    let totalPrice = 0

    basket.forEach(function(excursion){
        totalPrice += excursion.totalPrice
    })

    totalPriceEl.innerText = totalPrice +'PLN'
}

function removeFromSummary(e){
    e.preventDefault()
    
    const targetEl = e.target

    if(targetEl.classList.contains('summary__btn-remove')){
        const parentEl = targetEl.parentElement
        const liEl = parentEl.parentElement
        const idOfExcursion = liEl.dataset.id
        const totalPriceText = document.querySelector('.order__total-price-value').textContent
        const totalPrice = parseFloat()
        
        updateSummaryPrice()
        removeFromBasket(idOfExcursion)
        liEl.remove()
    }
}

function removeFromBasket(idToRemove){
    basket = basket.filter(function(excursion){
        return excursion.id !== idToRemove
    })
}

function updateSummaryPrice(excursionPrice){
    const totalPriceEl = document.querySelector('.order__total-price-value')

    const priceAsText = totalPriceEl.textContent
    const totalPrice = parseFloat(priceAsText)
    
    totalPriceEl.textContent = totalPrice - excursionPrice + 'PLN'
}