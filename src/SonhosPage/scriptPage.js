// ===== DECLARAÇÃO DAS CLASSES E CHAVE DE ACESSO

const chave = 'lista_de_sonhos'

class Sonho {
    constructor(objetivo, data_sonho, moeda_sonho, descricao_sonho, valor_sonho, chave_objeto) {

        this.objetivo = objetivo
        this.data_sonho = data_sonho
        this.moeda_sonho = moeda_sonho
        this.descricao_sonho = descricao_sonho
        this.valor_sonho = valor_sonho
        this.chave_objeto = chave_objeto
        
    }
}

class Historico {
    constructor(operacao, moeda_historico, data_historico, descricao_historico, quantia) {
        this.operacao = operacao
        this.moeda_historico = moeda_historico
        this.data_historico = data_historico
        this.descricao_historico = descricao_historico
        this.quantia = quantia
    }
}

// funções de implementação

function preencher_sonho(dadosObjeto) {
    //console.log('preenchendo um sonho')

    const dadosSonho = {
        objetivo: dadosObjeto[0],
        data_sonho: dadosObjeto[1],
        moeda_sonho: dadosObjeto[2],
        descricao_sonho: dadosObjeto[3],
    }

    const valor_sonho = dinheiro_float(dadosSonho.moeda_sonho)
    const chave_objeto = formatar_texto(dadosSonho.objetivo)

    var sonho = new Sonho(
        dadosSonho.objetivo,
        dadosSonho.data_sonho,
        dadosSonho.moeda_sonho,
        dadosSonho.descricao_sonho,
        valor_sonho,
        chave_objeto
    )

    enviar_storage(sonho, chave)
    return sonho
}

function preencher_historico(dadosObjeto, dreamSelected) {
    //console.log('preenchendo um histórico')

    const { operacao } = definir_formSelected(formSelected)

    const dadosHistorico = {
        operacao: operacao,
        moeda_historico: dadosObjeto[0],
        data_historico: dadosObjeto[1],
        descricao_historico: dadosObjeto[2]
    }

    quantia = dinheiro_float(dadosHistorico.moeda_historico)

    const historico = new Historico(
        dadosHistorico.operacao,
        dadosHistorico.moeda_historico,
        dadosHistorico.data_historico,
        dadosHistorico.descricao_historico,
        dadosHistorico.quantia
    )
    enviar_storage(historico, dreamSelected)
    return historico
}

// funções de formatação

function formatar_texto(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_")
}

function formatar_dinheiro(input) {
    var num = input.value.replace(/\D/g, '')
    input.value = (num / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function dinheiro_float(moeda) {
    const valor = (parseFloat(moeda.replace(/[^\d,]/g, '').replace(',', '.')))
    return valor
}

function float_dinheiro(float) {
    const moeda = float.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    return moeda
}

function formatar_data (dataObjeto) {
    const partesData = dataObjeto.split('-')
    const data = `${partesData[2]}/${partesData[1]}/${partesData[0]}`
    return data

}

// ===== INTERAÇÃO COM LOCAL STORAGE

function enviar_storage(objeto, chaveObjeto) {

    var listaObjetos = JSON.parse(localStorage.getItem(chaveObjeto)) || []
    
    listaObjetos.push(objeto)
    
    const listaJSON = JSON.stringify(listaObjetos)
    
    localStorage.setItem(chaveObjeto, listaJSON)
}

function buscar_chave_storage(chave) {

    const listaJSON = localStorage.getItem(chave)

    if (listaJSON) {
        const listaObjetos = JSON.parse(listaJSON)
        return listaObjetos

    } else {
        return []
    }
    
}

function buscar_objeto_storage(chave, chaveObjeto) {

    const listaJSON = localStorage.getItem(chave)

    if (listaJSON) {

        const listaObjetos = JSON.parse(listaJSON)
        const objetoEncontrado = listaObjetos.find(objeto => objeto.chave_objeto === chaveObjeto)
        return objetoEncontrado || null

    } else {
        return null
    }
}

function apaga_objeto_storage(chave, chaveObjeto) {
    const listaJSON = localStorage.getItem(chave)

    if (listaJSON) {
        var listaObjetos = JSON.parse(listaJSON)
        
        const index = listaObjetos.findIndex(objeto => objeto.chave_objeto === chaveObjeto)
        
        if (index !== -1) {
            listaObjetos.splice(index, 1)
            localStorage.setItem(chave, JSON.stringify(listaObjetos))
            localStorage.removeItem(chaveObjeto)
        }
    }
}

// CRIAÇÃO DE ELEMENTOS HTML

function criar_elemento_html(tipo, config, conteudo) {
    const elemento = document.createElement(tipo)
    
    for (var propriedade in config) {
        elemento.setAttribute(propriedade, config[propriedade])
    }

    if (conteudo !== null && conteudo !== undefined) {
        elemento.innerHTML = conteudo
    }

    return elemento
}

function hierarquia_html(lista) {
    if (!Array.isArray(lista) || lista.length === 0) {
        return null
    }

    const elementoTipo = lista[0]
    const elementoConfig = lista[1]
    const elementoConteudo = lista[2]

    const elementoHTML = criar_elemento_html(elementoTipo, elementoConfig, null)

    if (Array.isArray(elementoConteudo)) {
        elementoConteudo.forEach(item => {
            const filho = hierarquia_html(item)
            if (filho !== null) {
                elementoHTML.appendChild(filho)
            }
        })
    } else if (elementoConteudo !== null && elementoConteudo !== undefined) {
        const texto = document.createTextNode(elementoConteudo)
        elementoHTML.appendChild(texto)
    }

    return elementoHTML
}

// -- RECEBE DADOS CONFIGURANDO O HTML DINÂMICO

function abrir_div_botao(divBotoes) {
    //console.log('abrir_div_botao')

    const elementoHTML = hierarquia_html(divBotoes)
    const contentDiv = document.querySelector('.dreamList')
    const addDreamButton = document.getElementById('addDream')
    
    contentDiv.insertBefore(elementoHTML, addDreamButton)
}

function abrir_div(divSonho, classe) {
    const dreamContentDiv = document.querySelector('.dreamContent')
    dreamContentDiv.innerHTML = ''

    const elementoHTML = hierarquia_html(divSonho)
    dreamContentDiv.appendChild(elementoHTML)

    document.querySelector("." + classe).style = "display: flex"
}

function abrir_lista_historico(historico) {
    return historico.map(item => {
        var id
        if (item.operacao === 'Saque') {
            id = 'sacarValor'
        } else if (item.operacao === 'Depósito') {
            id = 'adicionarValor'
        }

        data = formatar_data(item.data_historico)
        quantia = dinheiro_float(item.moeda_historico)
        
        return ['li', { 'id': id }, `${item.operacao} - ${item.moeda_historico} - ${data}`]
    })
}

// -- USANDO OS DADOS DO FORM

function preencher_div_botoes() {
    //console.log('preencher_div_botoes')

    var dreamListDiv = document.querySelector('.dreamList')
    var elementsToRemove = dreamListDiv.querySelectorAll('.dream')
    
    elementsToRemove.forEach(function(element) {
        // não é 'reserva'?
        if (element.id !== 'reserva') {
            element.parentNode.removeChild(element)
        }
    })

    const listaDeSonhos = buscar_chave_storage(chave)

    listaDeSonhos.forEach(sonho => {
        const divBotoes = ['div', { 'class': 'dream', 'id': sonho.chave_objeto }, [
            ['h3', { 'id': 'dreamName' }, sonho.objetivo],
            ['i', { 'class': 'material-icons', 'id': 'trash'}, 'delete']
        ]]

        abrir_div_botao(divBotoes)
    })

    if (!preencher_div_botoes.hasEventListener) {
        document.addEventListener('click', function(event) {
            if (event.target && event.target.id === 'trash') {
                const dreamElement = event.target.closest('.dream')
                
                if (dreamElement) {
                    dreamSelected = dreamElement.id
                    apaga_objeto_storage(chave, dreamSelected)
                    preencher_div_botoes()
                    preencher_div_sonho('inicial')

                } else {
                    return
                }
            }

            if (event.target && event.target.id === 'dreamName') {
                const dreamElement = event.target.closest('.dream')

                if (dreamElement) {
                    dreamSelected = dreamElement.id
                    preencher_div_sonho(dreamSelected)
                } else {
                    return
                }
                
            }
        })

        preencher_div_botoes.hasEventListener = true
    }
}

function preencher_div_sonho(dreamSelected) {
    //console.log('preencher_div_sonho')
    
    const sonho = buscar_objeto_storage(chave, dreamSelected)
    const historico = buscar_chave_storage(dreamSelected)
    const listaSaques = []
    const listaDepositos = []

    if (dreamSelected === 'inicial') {
        const divSonho = ['div', { 'class': 'dreamContentHide' }, [
                ['span', { 'class': 'material-icons', 'id': 'coin' }, 'monetization_on'],
                ['span', { 'class': 'material-icons', 'id': 'pig' }, 'savings'],
                ['h3', {}, 'Bem vindo a página de sonhos!'],
                ['h2', {}, 'Clique em algum sonho para ver informações!'],
                ['h2', {}, 'Crie novos Sonhos através do botão \'+\'']
            ]
        ]

        abrir_div(divSonho, 'dreamContentHide')
    }

    if (dreamSelected === 'reserva') {
        const listaHistorico = abrir_lista_historico(historico)

        //console.log(listaHistorico)

        historico.forEach(item => {
            const quantia = dinheiro_float(item.moeda_historico)

            if (item.operacao === 'Saque') {
                listaSaques.push(quantia)
            } else if (item.operacao === 'Depósito') {
                listaDepositos.push(quantia)
            }
        })
        
        const somaDepositos = listaDepositos.reduce((acc, curr) => acc + curr, 0)
        const somaSaques = listaSaques.reduce((acc, curr) => acc + curr, 0)

        var somaTotalHistorico = (somaDepositos - somaSaques)
        valorAcumulado = float_dinheiro(somaTotalHistorico)

        const divSonho = ['div', { 'class': 'dreamContentIn' , 'id':'reserva' }, [
            ['div', { 'class': 'reserveContentTitle' }, [
                ['h2', { 'id': 'reserveTitle' }, 'Reserva']
            ]],
            ['div', { 'class': 'reserveValues' }, [
                ['div', { 'class': 'inValue' }, [
                    ['h4', {}, 'Total Reservado'],
                    ['p', { 'id': 'totalReserve' }, valorAcumulado]
                ]]
            ]],

            // Histórico
            ['div', { 'class': 'history' }, [
                ['h3', {}, 'Histórico'],
                ['ul', {}, listaHistorico]
            ]],
            
            // Botões
            ['div', { 'class': 'dreamContentButtons' }, [
                ['button', { 'class': 'addButton', 'id': 'addButton' }, 'Adicionar Valor'],
                ['button', { 'class': 'removeButton', 'id': 'removeButton' }, 'Retirar Valor']
            ]]
        ]]

        abrir_div(divSonho, 'dreamContentIn')

        const addButton = document.querySelector('.addButton')
        addButton.addEventListener('click', function() {
            formSelected = '.addValue'
            formulario_ativo(formSelected)
            abrir_formulario(formSelected)
        })

        const removeButton = document.querySelector('.removeButton')
        removeButton.addEventListener('click', function() {
            formSelected = '.removeValue'
            formulario_ativo(formSelected)
            abrir_formulario(formSelected)
        })
    }

    if (sonho && sonho.chave_objeto === dreamSelected) {
        const listaHistorico = abrir_lista_historico(historico)
        
        historico.forEach(item => {
            const quantia = dinheiro_float(item.moeda_historico)

            if (item.operacao === 'Saque') {
                listaSaques.push(quantia)
            } else if (item.operacao === 'Depósito') {
                listaDepositos.push(quantia)
            }
        })

        const somaDepositos = listaDepositos.reduce((acc, curr) => acc + curr, 0)
        const somaSaques = listaSaques.reduce((acc, curr) => acc + curr, 0)

        var somaTotalHistorico = (somaDepositos - somaSaques)
        valorAcumulado = float_dinheiro(somaTotalHistorico)

        var diferencaTotal = (sonho.valor_sonho - somaTotalHistorico)
        valorDiferenca = float_dinheiro(diferencaTotal)

        const divSonho = ['div', { 'class' : 'dreamContentIn', 'id' : sonho.chave_objeto }, [
            ['div', { 'class': 'dreamContentTitle' }, [
                ['h2', { 'id': 'dreamTitle' }, sonho.objetivo]
            ]],
            ['div', { 'class': 'dreamContentDescription' }, [
                ['p', { 'id': 'dreamDescription' }, sonho.descricao_sonho]
            ]],
            ['div', { 'class': 'values' }, [
                ['div', { 'class': 'inValue' }, [
                    ['h4', {}, 'Você deseja:'],
                    ['p', { 'id': 'finalValue' }, sonho.moeda_sonho]
                ]],
                ['div', { 'class': 'inValue' }, [
                    ['h4', {}, 'Você já tem:'],
                    ['p', { 'id': 'haveValue' }, valorAcumulado]
                ]],
                ['div', { 'class': 'inValue' }, [
                    ['h4', {}, 'Ainda faltam:'],
                    ['p', { 'id': 'diferenceValue' }, valorDiferenca]
                ]]
            ]],

            // Histórico
            ['div', { 'class': 'history' }, [
                ['h3', {}, 'Histórico'],
                ['ul', {}, listaHistorico]
            ]],

            // Botões
            ['div', { 'class': 'dreamContentButtons' }, [
                ['button', { 'class': 'addButton', 'id': 'addButton' }, 'Adicionar Valor'],
                ['button', { 'class': 'removeButton', 'id': 'removeButton' }, 'Retirar Valor']
            ]]
        ]]
        
        abrir_div(divSonho, 'dreamContentIn')

        const addButton = document.querySelector('.addButton')
        addButton.addEventListener('click', function() {
            formSelected = '.addValue'
            formulario_ativo(formSelected)
            abrir_formulario(formSelected)
        })

        const removeButton = document.querySelector('.removeButton')
        removeButton.addEventListener('click', function() {
            formSelected = '.removeValue'
            formulario_ativo(formSelected)
            abrir_formulario(formSelected)
        })

    } else {
        //console.log('Objeto não encontrado no Local Storage.')
        return null
    }
}


function atualizar_historico(dreamSelected) {
    const historico = buscar_chave_storage(dreamSelected)
    const listaHistorico = abrir_lista_historico(historico)

    const ulElement = document.querySelector('.history ul')
    ulElement.innerHTML = ''

    listaHistorico.forEach(item => {
        const liElement = document.createElement('li')
        liElement.setAttribute('id', item[1].id)
        liElement.textContent = item[2]
        ulElement.appendChild(liElement)
    })

}

// -- PROCESSAMENTO DO FORMULÁRIO

function abrir_formulario(formSelected) {
    document.querySelector(formSelected).style.display = 'flex'
    document.querySelector('*').style.overflow = 'hidden'
}

function fechar_formulario(formSelected) {
    document.querySelector(formSelected).style.display = 'none'
    document.querySelector('*').style.overflow = 'visible'
}

function filtro_valores_formulario(formSelected, valoresFormulario) {

    if (formSelected === '.createDream') {
        preencher_sonho(valoresFormulario)
        preencher_div_botoes()
        preencher_div_sonho('inicial')

    } else if (formSelected === '.addValue' || formSelected === '.removeValue') {
        const dreamElement = document.querySelector('.dreamContentIn')

        if (dreamElement) {
            var dreamSelected = dreamElement.id
            preencher_historico(valoresFormulario, dreamSelected)
            atualizar_historico(dreamSelected)
            
        } else {

            return
        }

        preencher_div_sonho(dreamSelected)
    }
}

// ====== FORMULÁRIOS

// Objeto que mapeia os formulários aos seus campos obrigatórios


function valores_formulario(event, formSelected) {
    event.preventDefault()

    const camposObrigatorios = {
        '.createDream': ['dreamName', 'dreamDate', 'dreamMoney'],
        '.addValue': ['addValueMoney', 'addValueDate'],
        '.removeValue': ['removeValuaMoney', 'removeValueDate']
    }
    
    const formulario = document.querySelector(formSelected)
    const valores = []
    
    const Obrigatorios = camposObrigatorios[formSelected]

    var camposVazios = false

    formulario.querySelectorAll('input, textarea').forEach((campo) => {
        if (campo.name !== '') {
            valores.push(campo.value)
            
            // Verifica se o campo é obrigatório e está vazio
            if (Obrigatorios && Obrigatorios.includes(campo.name) && campo.value.trim() === '') {
                camposVazios = true
            }
        }
    })

    if (camposVazios) {
        window.alert("Preencha todos os campos obrigatórios!")
        return []
    }

    return valores
}

function definir_formSelected(formSelected) {
    var formInfoDiv
    var operacao

    switch (formSelected) {
        case '.createDream':
            formInfoDiv = 'createDreamInfo'
            operacao = ''
            break
        case '.addValue':
            formInfoDiv = 'addValueInfo'
            operacao = 'Depósito'
            break
        case '.removeValue':
            formInfoDiv = 'removeValueInfo'
            operacao = 'Saque'
            break
        default:
            console.error('Opção inválida para formSelected')
            break
    }

    return { formInfoDiv: formInfoDiv, operacao: operacao }
}

function formulario_ativo(formSelected) {
    //console.log('Formulário ativo:', formSelected)

    const { formInfoDiv } = definir_formSelected(formSelected)
    const formInfo = document.getElementById(formInfoDiv)

    const cancelButton = document.querySelector(formSelected + ' .cancel')
    const closeButton = document.querySelector(formSelected + ' .close')
    const submitButton = document.querySelector(formSelected + ' .submit')

    if (!submitButton.hasEventListener) {
        submitButton.addEventListener('click', function (event) {
            //console.log('submit clicado')

            const confirmacao = window.confirm("Por favor confirme o comando executado.")
            if (confirmacao) {
                //console.log("Ação confirmada")

                // Chamada para a função valores_formulario()
                const valoresFormulario = valores_formulario(event, formSelected)
                if (valoresFormulario.length > 0) {
                    filtro_valores_formulario(formSelected, valoresFormulario)
                    formInfo.reset()
                }

            } else {
                //console.log("Ação cancelada")
                formInfo.reset()
            }
        })
        submitButton.hasEventListener = true
    }

    if (!closeButton.hasEventListener) {
        closeButton.addEventListener('click', function () {
            //console.log('close clicado')
            formInfo.reset()
            fechar_formulario(formSelected)
        })
        closeButton.hasEventListener = true
    }

    if (!cancelButton.hasEventListener) {
        cancelButton.addEventListener('click', function () {
            window.alert("Aviso: Saindo sem salvar os dados.")
            //console.log('cancel clicado')
            formInfo.reset()
            fechar_formulario(formSelected)
        })
        cancelButton.hasEventListener = true
    }
}


// ====== Evento de carregamento do DOM

document.addEventListener('DOMContentLoaded', function() {

    preencher_div_botoes()

    const addDreamButton = document.querySelector('.addDream')
    addDreamButton.addEventListener('click', function() {
        formSelected = '.createDream'
        formulario_ativo(formSelected)
        abrir_formulario(formSelected)
    })
    
})
