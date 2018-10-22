


// strings dos id's do campo
const boardString = [
    'a1', 'a2', 'a3', 
    'b1', 'b2', 'b3', 
    'c1', 'c2', 'c3'
]

let board = [
    // reprensentação do campo de jogo
]

// contador de turno
let qualTurnoEh = 0

// cria os eventListeners
const clicarQuadrado = (quadrado) =>
    () => {
        document.getElementById(quadrado).style.backgroundImage = 'url("x.png")'
        // logica a ser codada

        // checar vitória
        //  winCond()
    }

const winCond = () => {
    // checa se terminou o jogo
}

const resetGame = () => {
    // reseta o jogo
}

const setSquare = (xOr0) => {

}

// aloca os eventListeners
for (elemento of boardString)
    document.getElementById(elemento).addEventListener('click', clicarQuadrado(elemento))

