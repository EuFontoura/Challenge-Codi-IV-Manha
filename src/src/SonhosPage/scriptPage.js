function formatar_dinheiro(input) {
    let num = input.value.replace(/\D/g, '')
    input.value = (num / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

document.getElementById("addDream").addEventListener("click", function() {
    document.querySelector(".createDream").style = "display: flex"
    document.querySelector("*").style.overflow = "hidden"
})

const createDreamInfo = document.getElementById('createDreamInfo')
const closeButton = document.querySelector('.close')

// Tentando colocar todos os eventos de fechar pelo botão close em um único evento
document.querySelector(".close").addEventListener("click", function() {

    if (document.querySelector(".createDream").style.display === "flex") {
        document.querySelector(".createDream").style.display = "none"
        document.querySelector("*").style.overflow = "visible"
    }

    if (document.querySelector(".addValue").style.display === "flex") {
        document.querySelector(".addValue").style.display = "none"
        document.querySelector("*").style.overflow = "visible"
    }

    if (document.querySelector(".removeValue").style.display === "flex") {
        document.querySelector(".removeValue").style.display = "none"
        document.querySelector("*").style.overflow = "visible"
    }
})

// Tentando colocar todos os eventos de fechar pelo botão cancel em um único evento
document.querySelector(".cancel").addEventListener("click", function() {

    if (document.querySelector(".createDream").style.display === "flex") {
        document.querySelector(".createDream").style.display = "none"
        document.querySelector("*").style.overflow = "visible"
    }

    if (document.querySelector(".addValue").style.display === "flex") {
        document.querySelector(".addValue").style.display = "none"
        document.querySelector("*").style.overflow = "visible"
    }

    if (document.querySelector(".removeValue").style.display === "flex") {
        document.querySelector(".removeValue").style.display = "none"
        document.querySelector("*").style.overflow = "visible"
    }
})

closeButton.addEventListener('click', function() {
    createDreamInfo.reset()
})


document.getElementById("addButton").addEventListener("click", function() {
    document.querySelector(".addValue").style = "display: flex"
    document.querySelector("*").style.overflow = "hidden"
})

const addValueInfo = document.getElementById('addValueInfo')

closeButton.addEventListener('click', function() {
    addValueInfo.reset()
})


document.getElementById("removeButton").addEventListener("click", function() {
    document.querySelector(".removeValue").style = "display: flex"
    document.querySelector("*").style.overflow = "hidden"
})

const removeValueInfo = document.getElementById('removeValueInfo')

closeButton.addEventListener('click', function() {
    removeValueInfo.reset()
})

// Função temporaria so para a visualização da logica de ligar uma contentIn e desligar contentHide
const dream = document.querySelector(".dream")
dream.addEventListener("click", function() {
    document.querySelector(".dreamContentIn").style = "display: flex"
    document.querySelector(".dreamContentHide").style = "display: none"
})