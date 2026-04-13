document.addEventListener('DOMContentLoaded', init)

let basket = []

function init() {
    const uploaderInputEl = document.querySelector('.uploader__input')
    const excursionsList = document.querySelector('.excursions')
    const summaryPanel = document.querySelector('.summary')
    const orderForm = document.querySelector('.order')

    uploaderInputEl.addEventListener('change', uploadFiles)
    excursionsList.addEventListener('submit', addToBasket)
    summaryPanel.addEventListener('click', removeFromSummary)
    orderForm.addEventListener('submit', submitOrder)
}

function uploadFiles(e) {
    const files = e.target.files

    if (!files || files[0].type !=='text/csv') return

    for (let file of files) {

        const reader = new FileReader()
        reader.onload = function (event) {
            const result = event.target.result
            const excursionsList = formatCsvToArray(result)
            excursionsList.forEach(function (trip) {
                createUserExcursion(trip)
            })
        }
        reader.readAsText(file, 'UTF-8')
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

    if(isEmpty(adultsQuantityEl.value) && isEmpty(childrenQuantityEl.value)) {
        alert('Wybierz ilość osób')
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
        const totalPriceText = targetEl.previousElementSibling.textContent
        const totalPrice = parseFloat(totalPriceText)
        
        updateSummaryPrice(totalPrice)
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
    const currentPrice = parseFloat(priceAsText)
    
    totalPriceEl.textContent = currentPrice - excursionPrice + 'PLN'
}

function submitOrder(e){
    e.preventDefault()

    let errors = []

    const price = e.currentTarget.querySelector('.order__total-price-value').textContent
    const nameEl = e.currentTarget.elements.name
    const emailEl = e.currentTarget.elements.email
    const nameRegex = /^[A-Za-zÀ-ž]+(?:-[A-Za-zÀ-ž]+)?\s+[A-Za-zÀ-ž]+(?:-[A-Za-zÀ-ž]+)?$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
    if(parseFloat(price) <= 0){
        errors.push('Nie wybrano wycieczki')
    }
    if(!nameRegex.test(nameEl.value)){
        errors.push('Imię i nazwisko jest wymagane')
    }
    if(!emailRegex.test(emailEl.value)){
        errors.push('Niepoprawny email')
    }
    if(errors.length > 0){
        displayErrors(errors)
        errors = []
    }else {
        clearErrors()
        alert('Dziękujemy za złożenie zamówienia o wartości '+ price +'. Szczegóły zamówienia zostały wysłane na adres e-mail: ' + emailEl.value)
        nameEl.value = ''
        emailEl.value = ''
    }

}

function displayErrors(errorsList){
    const errorsListElement = document.querySelector('.order__errors-list')
    clearErrors()

    errorsList.forEach(function(error){
        const liEl = document.createElement('li')
        liEl.style.color = 'red'
        liEl.innerText = error
        errorsListElement.appendChild(liEl)
    })
}

function clearErrors(){
    const errorsListElement = document.querySelector('.order__errors-list')
    errorsListElement.innerHTML = ''
}


function isEmpty(value){
    return value === ''
}