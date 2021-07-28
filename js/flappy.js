const inicio = document.querySelector('#inicio')
const botaoIniciar = document.querySelector('#botao-iniciar')
const jogo = document.querySelector('#jogo');
const score = document.querySelector('.score');

inicio.classList.toggle('hidden')

botaoIniciar.onclick = function(e) {
    inicio.classList.toggle('hidden')
    jogo.classList.toggle('hidden')

    iteracao = 0
    iniciarJogo()
}

/* Inicializacao */
var passaroJogo = document.querySelector('#passaro-jogo')
passaroJogo.style.top = '100px'
passaroJogo.style.left = '150px'
var PASSARO_DISTANCIA_X = 150
var obstaculoTemplate = document.querySelector('#obstaculo-template')

var DISTANCIA_BOCA_OBSTACULO_X = document.querySelector('#obstaculo-template .cano-boca').clientWidth 
var DISTANCIA_BOCA_OBSTACULO_Y = document.querySelector('#obstaculo-template .cano-boca').clientHeight 
var DISTANCIA_VAO_OBSTACULO = document.querySelector('#obstaculo-template .espaco-vazio').clientWidth
var pontuacaoDom = document.querySelector('#pontuacao')
var pontuacao = 0
pontuacaoDom.innerHTML = pontuacao

var VELOCIDADE_JOGO = 0.2
var DELTA_TEMPO = 20
var TAMANHO_X = jogo.clientWidth
var TAMANHO_Y = jogo.clientHeight
var OBSTACULO_WIDTH = obstaculoTemplate.clientWidth
var DISTANCIA_ENTRE_OBSTACULOS = 1400
var OBSTACULO_OFFSET_Y = 10
var TAMANHO_POSSIVEL_OBSTACULO = TAMANHO_Y - 3*DISTANCIA_BOCA_OBSTACULO_X + OBSTACULO_OFFSET_Y
var TAMANHO_PASSARO_Y = passaroJogo.clientHeight
var TAMANHO_PASSARO_X = passaroJogo.clientWidth

var iteracao = 0
var vetorObstaculos = []
var PULO_DO_GATO = 0.08
var DECAIMENTO = 0.4
var TILT = 25

var impulso = []
for(let i=10; i>0; i--) {
    impulso.push(-i*PULO_DO_GATO + DECAIMENTO)
}
var indexImpulso = impulso.length - 1

var DIFF_OBSTACLE_X = obstaculoTemplate.clientWidth - obstaculoTemplate.children[0].clientWidth
var coordPassaroX = parseFloat(passaroJogo.style.left.slice(0,-2))

/* funcoes complementares */
const iniciarJogo = function() {
    //reinicializar()
    criarObstaculo(Math.random())
}

const reinicializar = function() {
    passaroJogo = document.querySelector('#passaro-jogo')
    passaroJogo.style.top = '100px'
    passaroJogo.style.left = '150px'
    PASSARO_DISTANCIA_X = 150
    obstaculoTemplate = document.querySelector('#obstaculo-template')
    
    DISTANCIA_BOCA_OBSTACULO_X = document.querySelector('#obstaculo-template .cano-boca').clientWidth 
    DISTANCIA_BOCA_OBSTACULO_Y = document.querySelector('#obstaculo-template .cano-boca').clientHeight 
    DISTANCIA_VAO_OBSTACULO = document.querySelector('#obstaculo-template .espaco-vazio').clientWidth
    pontuacaoDom = document.querySelector('#pontuacao')
    pontuacao = 0
    pontuacaoDom.innerHTML = pontuacao
    
    VELOCIDADE_JOGO = 0.2
    DELTA_TEMPO = 20
    TAMANHO_X = jogo.clientWidth
    TAMANHO_Y = jogo.clientHeight
    OBSTACULO_WIDTH = obstaculoTemplate.clientWidth
    DISTANCIA_ENTRE_OBSTACULOS = 1400
    OBSTACULO_OFFSET_Y = 10
    TAMANHO_POSSIVEL_OBSTACULO = TAMANHO_Y - 3*DISTANCIA_BOCA_OBSTACULO_X + OBSTACULO_OFFSET_Y
    TAMANHO_PASSARO_Y = passaroJogo.clientHeight
    TAMANHO_PASSARO_X = passaroJogo.clientWidth
    
    iteracao = 0
    vetorObstaculos = []
    PULO_DO_GATO = 0.08
    DECAIMENTO = 0.4
    TILT = 25
    
    impulso = []
    for(let i=10; i>0; i--) {
        impulso.push(-i*PULO_DO_GATO + DECAIMENTO)
    }
    indexImpulso = impulso.length - 1
    
    DIFF_OBSTACLE_X = obstaculoTemplate.clientWidth - obstaculoTemplate.children[0].clientWidth
    coordPassaroX = parseFloat(passaroJogo.style.left.slice(0,-2))
}

const criarObstaculo = function(altura) {
    var indice = vetorObstaculos.length
    vetorObstaculos[indice] = new Object({
        x0: iteracao,
        node: obstaculoTemplate.cloneNode(true),
        passou: false
    })
    vetorObstaculos[indice].node.id = `Obstaculo-${iteracao}`
    vetorObstaculos[indice].node.style.display = "flex"
    vetorObstaculos[indice].node.style.left = `${TAMANHO_X}px`

    /* Setar altura */
    vetorObstaculos[indice].node.firstElementChild.style.flexGrow = "0"
    vetorObstaculos[indice].node.firstElementChild.style.height = `${altura*(TAMANHO_POSSIVEL_OBSTACULO) +  OBSTACULO_OFFSET_Y}px`

    jogo.appendChild(vetorObstaculos[indice].node)
}

const verificarNecessidadeDeInserirObstaculo = function() {
    if(vetorObstaculos.length > 0 && iteracao - vetorObstaculos[vetorObstaculos.length-1].x0 < DISTANCIA_ENTRE_OBSTACULOS) {
        return false
    } else {
        return true
    }
}

const verificarNecessidadeDeRemoverObstaculo = function() {
    var obstaculo = vetorObstaculos[0]
    if(vetorObstaculos.length > 0 && vetorObstaculos[0].node.style.left.slice(0,-2) < -OBSTACULO_WIDTH) {
        jogo.removeChild(obstaculo.node)
        vetorObstaculos = vetorObstaculos.slice(1)
    }
}

const movimentarPassaro = function() {
    passaroJogo.style.top = `${parseFloat(passaroJogo.style.top.slice(0,-2)) + impulso[indexImpulso]*DELTA_TEMPO}px`

    passaroJogo.style.transform = `rotate(-${TILT * (impulso.length - 1 - indexImpulso) / (impulso.length - 1)}deg)`
    //transform: rotate(-10deg);

    if(indexImpulso !== impulso.length -1) {
        indexImpulso++
    }
}

const verificarColisaoVertical = function() {
    if(parseFloat(passaroJogo.style.top.slice(0,-2)) < 0) {
        passaroJogo.style.top = "0px"
    }
    if(parseFloat(passaroJogo.style.top.slice(0,-2)) > (TAMANHO_Y - TAMANHO_PASSARO_Y)) {
        passaroJogo.style.top = `${TAMANHO_Y - TAMANHO_PASSARO_Y}px`
    }
}

const verificarColisaoParede = function() {
    for(let i=0; i<vetorObstaculos.length; i++) {
        let obstaculo = vetorObstaculos[i]
        let coordX0Base = parseFloat(obstaculo.node.style.left.slice(0,-2)) + DIFF_OBSTACLE_X/2
        let coordX1Base = coordX0Base + OBSTACULO_WIDTH
        let coordX0Boca = parseFloat(obstaculo.node.style.left.slice(0,-2))
        let coordX1Boca = coordX0Base + OBSTACULO_WIDTH
        
        let altura = parseFloat(obstaculo.node.firstElementChild.style.height.slice(0,-2))
        
        let coordY0_Cima = parseFloat(altura)
        let coordY1_Cima = parseFloat(altura + DISTANCIA_BOCA_OBSTACULO_Y)
        let coordY1_Baixo = parseFloat(altura + DISTANCIA_VAO_OBSTACULO + DISTANCIA_BOCA_OBSTACULO_Y + TAMANHO_PASSARO_Y)
        let coordY0_Baixo = parseFloat(altura + DISTANCIA_VAO_OBSTACULO + 2*DISTANCIA_BOCA_OBSTACULO_Y + TAMANHO_PASSARO_Y)
        
        //let coordPassaroX = parseFloat(passaroJogo.style.left.slice(0,-2))
        let coordPassaroY = parseFloat(passaroJogo.style.top.slice(0,-2))
       
        /* Colisao lateral - baseCano */
        if((coordPassaroX + TAMANHO_PASSARO_X) > coordX0Base &&
        (coordPassaroX) < coordX0Base &&
        ((coordPassaroY) < coordY0_Cima ||
        (coordPassaroY + TAMANHO_PASSARO_Y) > coordY0_Baixo)) {
           //console.log('colisao1')
           return true;
        }
        
        /* Colisao lateral - bocaCano */
        if((coordPassaroX + TAMANHO_PASSARO_X) > coordX0Boca &&
            (coordPassaroX) < coordX0Boca &&
            (((coordPassaroY + TAMANHO_PASSARO_Y) > coordY0_Cima &&
            (coordPassaroY) < coordY1_Cima) ||
            ((coordPassaroY + TAMANHO_PASSARO_Y) > coordY1_Baixo &&
            (coordPassaroY) < coordY0_Baixo))) {
            //console.log('colisao2')
            return true;
        }
        
        /* Colisao interna - bocaCano */
        if(
            (coordPassaroX + TAMANHO_PASSARO_X) > coordX0Boca &&
            (coordPassaroX) < coordX1Boca &&
            (
                (((coordPassaroY + TAMANHO_PASSARO_Y) > coordY1_Cima) &&
                ((coordPassaroY) < coordY1_Cima)) ||
                (((coordPassaroY + TAMANHO_PASSARO_Y) > coordY1_Baixo) &&
                ((coordPassaroY) < coordY1_Baixo))
            )) {
            //console.log('colisao3')
            return true;
        }
    }
    return false;
}

const calcularPontuacao = function() {
    vetorObstaculos.forEach(obstaculo => {
        let coordX = parseFloat(obstaculo.node.style.left.slice(0,-2))
        if(!obstaculo.passou && coordX < PASSARO_DISTANCIA_X - OBSTACULO_WIDTH/2 + TAMANHO_PASSARO_X/2) {
            obstaculo.passou = true
            pontuacao++
            pontuacaoDom.innerHTML = pontuacao
        }
    })
}

const gameOver = function() {
    jogo.classList.toggle('hidden')
    inicio.classList.toggle('hidden')

    /* EXIBIR PONTUACAO */
    score.innerHTML = `Game Over ${pontuacao}`
    pontuacao = 0
    pontuacaoDom.innerHTML = pontuacao
    
    /* EXCLUIR OBSTACULOS */
    while(vetorObstaculos.length !== 0) {
        jogo.removeChild(vetorObstaculos[0].node)
        vetorObstaculos = vetorObstaculos.slice(1)
    }
}

/* Movimento do Passaro */
document.addEventListener("keydown", event => {
    indexImpulso = 0
});

/* Executar Jogo */
const executarJogo = function() {
    /* NAO EXECUTAR SE ESTIVER NA TELA INICIAL */
    if(jogo.classList.contains('hidden')) {
        return 0;
    }

    vetorObstaculos.forEach(obstaculo => {
        obstaculo.node.style.left = `${TAMANHO_X - (iteracao-obstaculo.x0)*VELOCIDADE_JOGO}px`
    })
    
    verificarNecessidadeDeRemoverObstaculo()
    
    if(verificarNecessidadeDeInserirObstaculo()) {
        criarObstaculo(Math.random())
    }

    movimentarPassaro()

    verificarColisaoVertical()

    if(verificarColisaoParede()) {
        gameOver()
    }

    calcularPontuacao()

    iteracao += DELTA_TEMPO
}

/* Inicio do jogo */

inicio.classList.toggle('hidden')
jogo.classList.toggle('hidden')

obstaculoTemplate.style.display = "none"
setInterval(executarJogo, DELTA_TEMPO)