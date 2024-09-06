const botoes = document.querySelectorAll('button')
const conteudo = document.querySelector('.conteudo')
const saveButton = document.querySelector('.save-file-section button')
const fontSize = document.getElementById('font-size')
const colorPicker = document.getElementById('color-picker')
const file = document.getElementById('arquivo')

function inicializarAlinhamento() {
    const alignLeft = document.querySelector('.align-left')
    if (alignLeft) {
        alignLeft.classList.add('botao-ativo')
        conteudo.style.textAlign = 'left'
    }
}

function alinhamento(botao) {
    if (botao.classList.contains('align-left') ||
        botao.classList.contains('align-center') ||
        botao.classList.contains('align-right')) {
        
        document.querySelectorAll('.align-left, .align-center, .align-right').forEach(b => {
            b.classList.remove('botao-ativo')
        })
        botao.classList.add('botao-ativo')
    }
}

function toggleBotaoAtivo(botao) {
    if(!botao.classList.contains('align-left') &&
       !botao.classList.contains('align-center') &&
       !botao.classList.contains('align-right')) {

        if(botao.classList.contains('botao-ativo')) {
            botao.classList.remove('botao-ativo')
        } else {
            botao.classList.add('botao-ativo')
        }
    }
}

function aplicarFormatacao(botao, conteudo) {
    if (botao.classList.contains('format-bold')) {
        conteudo.style.fontWeight = botao.classList.contains('botao-ativo') ? 'bold' : 'normal'
    } else if (botao.classList.contains('format-italic')) {
        conteudo.style.fontStyle = botao.classList.contains('botao-ativo') ? 'italic' : 'normal'
    } else if (botao.classList.contains('format-underlined')) {
        conteudo.style.textDecoration = botao.classList.contains('botao-ativo') ? 'underline' : 'none'
    } else if (botao.classList.contains('match-case')) {
        conteudo.style.textTransform = botao.classList.contains('botao-ativo') ? 'uppercase' : 'none'
    } else if (botao.classList.contains('align-left')) {
        conteudo.style.textAlign = 'left'
    } else if (botao.classList.contains('align-center')) {
        conteudo.style.textAlign = 'center'
    } else if (botao.classList.contains('align-right')) {
        conteudo.style.textAlign = 'right'
    }
}

inicializarAlinhamento()
botoes.forEach(botao => {
    botao.addEventListener('click', function(e) {
        const botaoClicado = e.currentTarget
        alinhamento(botaoClicado)
        toggleBotaoAtivo(botaoClicado)
        aplicarFormatacao(botaoClicado, conteudo)
    })
})

fontSize.addEventListener('input', function(e) {
    const value = parseInt(e.target.value, 10)

    if (value < 1) {
        fontSize.value = '1'
        conteudo.style.fontSize = '1px'
    } else if (value > 100) {
        fontSize.value = '100'
        conteudo.style.fontSize = '100px'
    } else {
        const novoTamanho = value + 'px'
        conteudo.style.fontSize = novoTamanho
    }
})

colorPicker.addEventListener('input', function(e) {
    const novaCor = e.target.value
    conteudo.style.color = novaCor
})

saveButton.addEventListener('click', () => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Conteúdo Salvo</title>
        </head>
        <body>
            <div style="
                font-size: ${fontSize.value}px;
                color: ${colorPicker.value};
                text-align: ${conteudo.style.textAlign};
                font-weight: ${conteudo.style.fontWeight};
                font-style: ${conteudo.style.fontStyle};
                text-decoration: ${conteudo.style.textDecoration};
                text-transform: ${conteudo.style.textTransform};
            ">
                ${conteudo.innerHTML}
            </div>
        </body>
        </html>
    `

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'documento.html'
    a.click()
    URL.revokeObjectURL(url)
})

file.addEventListener('change', function (event) {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = function (e) {
            const parser = new DOMParser()
            const doc = parser.parseFromString(e.target.result, 'text/html')
            const div = doc.querySelector('div')
            if (div) {
                conteudo.innerHTML = div.innerHTML;
                const style = div.getAttribute('style') || ''
                const styleProperties = style.split(';').filter(Boolean)
                styleProperties.forEach(property => {
                    const [key, value] = property.split(':').map(s => s.trim())
                    if (key === 'font-size') {
                        fontSize.value = value.replace('px', '')
                        conteudo.style.fontSize = value
                    } else if (key === 'color') {
                        colorPicker.value = value
                        conteudo.style.color = value
                    } else if (key === 'text-align') {
                        conteudo.style.textAlign = value
                    } else if (key === 'font-weight') {
                        conteudo.style.fontWeight = value
                    } else if (key === 'font-style') {
                        conteudo.style.fontStyle = value
                    } else if (key === 'text-decoration') {
                        conteudo.style.textDecoration = value
                    } else if (key === 'text-transform') {
                        conteudo.style.textTransform = value
                    }
                })
            }
        }
        reader.readAsText(file)
    }
})