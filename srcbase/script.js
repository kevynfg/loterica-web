let arrayTeste = []
let novoArray = []

const ulNumbers = document.querySelector('.ul-numbers')

window.addEventListener('load', gerarNumeros)

function gerarNumeros() {
    
    let i = 0
    do {
        arrayTeste.push(generateRandomNumber(1, 25))
    
    i++
    } while (i <= 26)

    arrayTeste.forEach((number) => {
    let novali = document.createElement('li')
    novali.innerHTML = number.toString().padStart(2, '0')
    let novoconteudo = novali.toString()
    ulNumbers.appendChild(novoconteudo)       
    })

    
}

function generateRandomNumber(from = 1, to) {
    return Math.max(from, Math.ceil(Math.random() * to));
}