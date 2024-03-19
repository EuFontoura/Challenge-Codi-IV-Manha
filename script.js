// Olá, bem vindo ao código da parte lógica de nosso projeto!

// Este é o rascunho inicial para o código do app de finanças da equipe da Manhã do CODI Challenge 2024.
// A ideia inicial é obter classes para instanciar cada registro de despesa como um objeto com as atribuições definidas pelo usuário.
// Também será criada uma classe para Categorias, permitindo que seja implementado futuramente uma forma de adicionar categorias.

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// PARTE LOGICA

// Declarar as variáveis de entry seguindo o exemplo apresentado no Figma como protótipo:

let valor
let data
let categoria
let descricao

// Declarar uma classe para os objetos de cada despesa.

class Despesa {
    constructor(valor, data, descricao) {
        this.valor = valor
        this.data = data
        this.descricao = descricao
    }
}

// Declarar uma classe para separar as despesas em categorias.
// A classe possui [] que funciona como um container vazio que irá receber as instâncias de despesa.

class Categoria {
    constructor(tipo) {
        this.tipo = tipo
        this.despesas = []
    }
}

// Declaração das categorias pré definidas seguindo o exemplo do protótipo do Figma.

let moradia = new Categoria("Moradia")
let alimentacao = new Categoria("Alimentação")
let saudebeleza = new Categoria("Saúde & Beleza")
let vestuario = new Categoria("Vestuário")

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// PARTE VISUAL E INTERATIVA

// FUNCOES
// Função para manipular as tabs de categorias.
const tabClicked = (tab) => {

    
    const contents = document.querySelectorAll('.content')
    
    // Primeiro removemos a classe show de todos os conteúdos
    contents.forEach(content => content.classList.remove('show'))

    // Adicionamos a classe show apenas para o conteúdo que tem o mesmo content-id que o botão de tab clicado
    const contentId = tab.getAttribute('content-id')
    const content = document.getElementById(contentId) //esta funcao pega o id com aquele nome e me retorna o elemento (pode ser div, h1, oq seja)
    content.classList.add('show') //adiciona a classe show para o conteudo que tem o mesmo id que o botao clicado

}


// EVENTOS
// Primeiro pegamos todos os botoes de tab que iremos manipular
const tabs = document.querySelectorAll('.tab-btn')

// Adicionamos um evento de click para cada botão de tab e chamamos uma funcao para manipular o conteudo
tabs.forEach(tab => tab.addEventListener('click', () => tabClicked(tab)))