class Despesa {
    constructor(valor, moeda, data, descricao, categoria) {
        this.valor = valor
        this.moeda = moeda
        this.data = data
        this.descricao = descricao
        this.categoria = categoria
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
            total += despesa.valor
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

function criar_categoria(nomesCategorias) {
    const categorias = []

    nomesCategorias.forEach(nome => {
        const tipoFormatado = formatar_texto(nome)
        const novaCategoria = new Categoria(tipoFormatado, nome)
        categorias.push(novaCategoria)
    })

    return categorias
}


// adiciona despesa no array vazio de cada categoria


function despesa_no_array(despesa, categorias) {
    const categoriaDespesa = despesa.categoria.toLowerCase()

    const categoriaTodos = categorias.find(categoria => categoria.tipo === "todos") || new Categoria("todos", "Todos")
    categoriaTodos.add_despesa(despesa)

    const categoriaEncontrada = categorias.find(categoria => categoria.tipo === categoriaDespesa)
    if (categoriaEncontrada) {
        categoriaEncontrada.add_despesa(despesa)

        localStorage.setItem('categorias', JSON.stringify(categorias))
    } else {
        console.log("Categoria não encontrada.")
    }
}

function add_btn_categoria(categorias) {
    const divButtons = document.querySelector('.divButtons')
    const divContents = document.querySelector('.divContents')

    if (divButtons && divContents) {
        
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

            botao.addEventListener('click', function() {
                divContents.innerHTML = ''

                const listaDespesas = document.createElement('ul')
                listaDespesas.classList.add('listaDespesas')

                categoria.despesas.forEach(despesa => {
                    const itemLista = document.createElement('li')
                    itemLista.classList.add('itemListaDespesa')
                    itemLista.textContent = `${despesa.data} - ${despesa.categoria} - ${despesa.moeda} - ${despesa.descricao}`
                    listaDespesas.appendChild(itemLista)
                })
                divContents.appendChild(listaDespesas)
            })
        })
    }
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


// ===============================================================================================================================


document.addEventListener('DOMContentLoaded', function() {

    let categorias = JSON.parse(localStorage.getItem('categorias'))

    if (categorias) {

        categorias = categorias.map(categoria => {
            const categoriaRestaurada = Object.assign(new Categoria(), categoria)
            categoriaRestaurada.despesas = categoria.despesas.map(despesa => new Despesa(despesa.valor, despesa.moeda, despesa.data, despesa.descricao, despesa.categoria))
            return categoriaRestaurada
        })

    } else {

        categorias = criar_categoria(nomesCategorias)
        localStorage.setItem('categorias', JSON.stringify(categorias))
    }

    add_btn_categoria(categorias)
    
    document.getElementById("register-button").addEventListener("click", function() {
        // document.querySelector(".form").style.display = "flex"
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
        event.preventDefault();
        
        const moeda = document.getElementById("money").value;
        const valor = parseFloat(moeda.replace(/[^\d,]/g, '').replace(',', '.'));
        const data = document.getElementById("date").value;
        const descricao = document.getElementById("description").value;
        const categoria = document.getElementById("category").value;
        
        const novaDespesa = new Despesa(valor, moeda, data, descricao, categoria);
        
        console.log("Despesa criada:", novaDespesa);
        console.log("Botão clicado: submit");
        
        despesa_no_array(novaDespesa, categorias);
        
        console.log(categorias);
    
        // Procurar pelo botão da categoria correspondente
        const botaoCategoria = document.getElementById(formatar_texto(categoria));
        if (botaoCategoria) {
            botaoCategoria.click(); // Clicar no botão da categoria
        } else {
            console.log("Botão de categoria correspondente não encontrado.");
        }
        form.reset()
    });
    
    let currentIndex = 0

    document.getElementById('left').addEventListener('click', function() {
        console.log("Botão clicado: left")
 
        currentIndex > 0 ? currentIndex--: currentIndex = categorias.length - 1
        console.log("Índice atual:", currentIndex)
    
        const categoriaAtual = categorias[currentIndex].tipo
        const botaoCategoria = document.getElementById(formatar_texto(categoriaAtual))
        botaoCategoria ? botaoCategoria.click() : console.log("Botão de categoria correspondente não encontrado.")
        
    })
    
    document.getElementById('right').addEventListener('click', function() {
        console.log("Botão clicado: right")

        currentIndex < categorias.length - 1 ? currentIndex++ : currentIndex = 0
        console.log("Índice atual:", currentIndex)
    
        const categoriaAtual = categorias[currentIndex].tipo
        const botaoCategoria = document.getElementById(formatar_texto(categoriaAtual))
        botaoCategoria ? botaoCategoria.click() : console.log("Botão de categoria correspondente não encontrado.")
    })

})