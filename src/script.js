// código destinado a gerenciar a parte lógica da página.
// html e css desenvolvidos por outros membros da equipe.
// js lida com os inputs vindos do html e a manipulação das variáveis
// ==================================================================


// declaração das classes e modelagem dos objetos a serem instanciados:

class Despesa {
    constructor(titulo, moeda, data, categoria, descricao, valor) {
        this.titulo = titulo
        this.moeda = moeda
        this.data = data
        this.categoria = categoria
        this.descricao = descricao
        this.valor = valor
    }
}

class Categoria {
    constructor(tipo, nome) {
        this.nome = nome
        this.tipo = tipo
        this.despesas = []
    }
    
    add_despesa(despesa) {
        this.despesas.push(despesa)
    }

    somar_despesas() {
        let total = 0
        for (let despesa of this.despesas) {
            if (typeof despesa.valor === 'number') {
                total += despesa.valor
            }
        }
        return total
    }
    

    listar_despesas() {
        console.log(`Despesas na categoria ${this.tipo}:`)
        for (let despesa of this.despesas) {
            console.log(`Valor: ${despesa.valor}, Data: ${despesa.data}, Descrição: ${despesa.descricao}`)
        }
    }
}

// ==================================================================
// início do módulo de funções do código:
// onde são detalhadas as funcionalidades para lidar com cada classe

function criar_categoria(nomesCategorias) {
    const categorias = []

    nomesCategorias.forEach(nome => {
        const tipoFormatado = formatar_texto(nome)
        const novaCategoria = new Categoria(tipoFormatado, nome)
        categorias.push(novaCategoria)
    })

    return categorias
}

function despesa_no_array(despesa, categorias) {
    const categoriaDespesa = despesa.categoria.toLowerCase()

    const categoriaEncontrada = categorias.find(categoria => categoria.tipo === categoriaDespesa)
    if (categoriaEncontrada) {
        categoriaEncontrada.add_despesa(despesa)
        localStorage.setItem('categorias', JSON.stringify(categorias))
    } else {
        console.log("Categoria não encontrada.")
    }
}

function criar_botao_categoria(categorias) {
    const divButtons = document.querySelector('.divButtons')
    if (!divButtons) return

    divButtons.innerHTML = ''

    const divBack = document.createElement('div')
    divBack.classList.add('backBtn')
    divButtons.appendChild(divBack)

    categorias.forEach(categoria => {
        const botao = document.createElement('button')
        botao.textContent = categoria.nome
        botao.classList.add('tabBtn')
        botao.setAttribute('id', formatar_texto(categoria.tipo))
        divButtons.appendChild(botao)

        if (botao.textContent === "Todos") {
            botao.addEventListener('click', () => {
                funcao_todos(categorias)
            })
        }

        else {
            botao.addEventListener('click', () => conteudo_despesas(categoria))
        }
        
    })
}

function funcao_todos(categorias) {
    
    const todasAsDespesas = []
        
    // Obter todas as despesas de todas as categorias
    categorias.forEach(categoria => {
        categoria.despesas.forEach(despesa => {
            todasAsDespesas.push(despesa)
        })
    })

    // Atualizar o array da categoria "Todos" no localStorage
    
    const categoriaTodosIndex = categorias.findIndex(categoria => categoria.tipo === 'todos')

    if (categoriaTodosIndex !== -1) {
        categorias[categoriaTodosIndex].despesas = []
        // Esvaziar o array da categoria "Todos" no localStorage
        localStorage.setItem('categorias', JSON.stringify(categorias))

    } else {

        const novaCategoriaTodos = new Categoria('todos', 'Todos')
        categorias.push(novaCategoriaTodos)
    }

    const todasDespesas = []
    categorias.forEach(categoria => {
        todasDespesas.push(...categoria.despesas)
    })

    categorias[categoriaTodosIndex].despesas = todasDespesas
    localStorage.setItem('categorias', JSON.stringify(categorias))

    conteudo_despesas(categorias[categoriaTodosIndex])
}

function conteudo_despesas(categoria) {
    const divContents = document.querySelector('.divContents')
    if (!divContents) return

    divContents.innerHTML = ''

    const divSoma = document.createElement('div')
    divSoma.classList.add('outsum')

    const divSumContent = document.createElement('div')
    divSumContent.classList.add('sum')

    const h2 = document.createElement('h2')
    h2.textContent = "Soma dos Valores:"

    const totalDespesas = "R$ " + categoria.somar_despesas().toFixed(2)
    
    const pTotal = document.createElement('p')
    pTotal.id = "total"
    pTotal.textContent = (totalDespesas)

    console.log(totalDespesas)

    divSumContent.appendChild(h2)
    divSumContent.appendChild(pTotal)

    divSoma.appendChild(divSumContent)

    divContents.appendChild(divSoma)

    categoria.despesas.forEach(despesa => criar_div_despesa(despesa, categoria))

    document.getElementById(formatar_texto(categoria.nome)).focus()
}

function criar_div_despesa(despesa, categoria) {
    //console.log(despesa)
    const divContents = document.querySelector('.divContents')
    if (!divContents) return

    const divDespesa = document.createElement('div')
    divDespesa.classList.add('outContent')

    // Criação dos elementos para exibir as informações da despesa

    const innerDiv = document.createElement('div')
    innerDiv.classList.add('content')

    const colorDiv = document.createElement('div')
    colorDiv.classList.add('color')
    colorDiv.id = "categoria"

    switch (despesa.categoria) {
        case 'moradia':
            colorDiv.style.backgroundColor = 'rgb(109, 0, 0)'
            break
        case 'alimentacao':
            colorDiv.style.backgroundColor = 'rgb(148, 148, 1)'
            break
        case 'saude_e_beleza':
            colorDiv.style.backgroundColor = 'rgb(0, 163, 163)'
            break
        case 'vestuario':
            colorDiv.style.backgroundColor = 'rgb(153, 0, 153)'
            break
        case 'outros':
            colorDiv.style.backgroundColor = 'rgb(92, 92, 92)'
            break
        default:
            break
    }

    const titleDateDiv = document.createElement('div')
    titleDateDiv.classList.add('titleDate')

    const titleHeading = document.createElement('h1')
    titleHeading.textContent = despesa.titulo
    titleHeading.id = "Title"

    const dateParagraph = document.createElement('p')
    dateParagraph.textContent = despesa.data
    dateParagraph.id = "Date"

    const descriptionDiv = document.createElement('div')
    descriptionDiv.classList.add('description')

    const descriptionParagraph = document.createElement('p')
    descriptionParagraph.textContent = despesa.descricao
    descriptionParagraph.id = "Description"

    const valueDiv = document.createElement('div')
    valueDiv.classList.add('value')

    const valueParagraph = document.createElement('p')
    valueParagraph.textContent = despesa.moeda
    valueParagraph.id = "Value"

    titleDateDiv.appendChild(titleHeading)
    titleDateDiv.appendChild(dateParagraph)

    descriptionDiv.appendChild(descriptionParagraph)

    valueDiv.appendChild(valueParagraph)

    innerDiv.appendChild(colorDiv)
    innerDiv.appendChild(titleDateDiv)
    innerDiv.appendChild(descriptionDiv)
    innerDiv.appendChild(valueDiv)

    divDespesa.appendChild(innerDiv)

    const deleteButton = botao_delete(despesa, categoria)
    if (deleteButton) {
        innerDiv.appendChild(deleteButton) // Adiciona o botão de exclusão dentro da div de despesa
    }

    divContents.appendChild(divDespesa)
}

function botao_delete(despesa, categoria) {
    if (categoria.tipo === 'todos') {
        return
    }

    const deleteButton = document.createElement('button')
    deleteButton.innerHTML = '<i class="material-icons">delete</i>'
    deleteButton.classList.add('deleteBtn')

    deleteButton.addEventListener('click', () => {
        categoria.despesas = categoria.despesas.filter(item => item !== despesa)
        localStorage.setItem('categorias', JSON.stringify(categorias))

        const totalDespesasAtualizado = categoria.somar_despesas().toFixed(2)
        const pTotal = document.getElementById("total")
        if (pTotal) pTotal.textContent = "R$ " + totalDespesasAtualizado

        deleteButton.parentNode.parentNode.remove()
    })

    return deleteButton
}

function formatar_texto(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_")
}

function formatar_dinheiro(input) {
    let num = input.value.replace(/\D/g, '')
    input.value = (num / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const nomesCategorias = ["Todos", "Moradia", "Alimentação", "Saúde e Beleza", "Vestuário", "Outros"]
const categorias = criar_categoria(nomesCategorias)


// ======================================================================
// início do módulo executivo do código:
// onde o DOM foi todo carregado e as funcionalidades podem ser ativadas.

document.addEventListener('DOMContentLoaded', function() {
    let categorias = JSON.parse(localStorage.getItem('categorias'))

    if (categorias) {
        categorias = categorias.map(categoria => {
            const categoriaRestaurada = Object.assign(new Categoria(), categoria)
            categoriaRestaurada.despesas = categoria.despesas.map(despesa => new Despesa(despesa.titulo, despesa.moeda, despesa.data, despesa.categoria, despesa.descricao, despesa.valor))
            return categoriaRestaurada
        })
    } else {
        categorias = criar_categoria(nomesCategorias)
        localStorage.setItem('categorias', JSON.stringify(categorias))
    }

    criar_botao_categoria(categorias)
    
    document.getElementById("register-button").addEventListener("click", function() {
        document.querySelector(".form").style = "display: flex"
        document.querySelector("*").style.overflow = "hidden"
    })

    const form = document.getElementById('formInfo')
    const closeButton = document.getElementById('close')

    document.querySelector(".close").addEventListener("click", function() {
        document.querySelector(".form").style.display = "none"
        document.querySelector("*").style.overflow = "visible"
    })

    document.getElementById("cancel").addEventListener("click", function() {
        document.querySelector(".form").style.display = "none"
        document.querySelector("*").style.overflow = "visible"
    })

    closeButton.addEventListener('click', function() {
        form.reset()
    })

    document.getElementById('submit').addEventListener('click', function(event) {
        // console.log("Botão clicado: submit")
        
        event.preventDefault()

        const titulo = document.getElementById("subcategory").value.trim()
        const moeda = document.getElementById("money").value.trim()
        let dataSt = document.getElementById("date").value.trim()        
        const categoria = document.getElementById("category").value.trim()
        const descricao = document.getElementById("description").value.trim()
    
        // Verificando se algum campo obrigatório está vazio
        if (!titulo || !moeda || !dataSt || !categoria) {
            alert("Por favor, preencha os campos do formulário.")
            return
        }
    
        // data para o formato dd/mm/yyyy
        const partesData = dataSt.split('-')
        const data = `${partesData[2]}/${partesData[1]}/${partesData[0]}`
    
        // valor da moeda
        const valor = parseFloat(moeda.replace(/[^\d,]/g, '').replace(',', '.'))
    
        const novaDespesa = new Despesa(titulo, moeda, data, categoria, descricao, valor)
        
        // console.log("Despesa criada:", novaDespesa)
        
        despesa_no_array(novaDespesa, categorias)
        
        // console.log(categorias)

        const botaoCategoria = document.getElementById(formatar_texto(categoria))
        if (botaoCategoria) {

            botaoCategoria.click() 
            botaoCategoria.focus()

        } else {
            console.log("Botão de categoria correspondente não encontrado.")
        }
        form.reset()
        document.querySelector(".form").style.display = "none"
    })

    // funções das setas que navegam entre as categorias existentes:

    let currentIndex = 0

    document.getElementById('left').addEventListener('click', function() {
        //console.log("Botão clicado: left")

        currentIndex > 0 ? currentIndex--: currentIndex = categorias.length - 1
        //console.log("Índice atual:", currentIndex)
    
        const categoriaAtual = categorias[currentIndex].tipo
        const botaoCategoria = document.getElementById(formatar_texto(categoriaAtual))
        botaoCategoria ? botaoCategoria.click() : console.log("Botão de categoria correspondente não encontrado.")
        
    })
    
    document.getElementById('right').addEventListener('click', function() {
        //console.log("Botão clicado: right")

        currentIndex < categorias.length - 1 ? currentIndex++ : currentIndex = 0
        //console.log("Índice atual:", currentIndex)
    
        const categoriaAtual = categorias[currentIndex].tipo
        const botaoCategoria = document.getElementById(formatar_texto(categoriaAtual))
        botaoCategoria ? botaoCategoria.click() : console.log("Botão de categoria correspondente não encontrado.")
    })

})
