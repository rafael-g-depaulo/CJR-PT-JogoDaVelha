// strings dos id's do campo
const boardString = [
    'a1', 'a2', 'a3', 
    'b1', 'b2', 'b3', 
    'c1', 'c2', 'c3'
]

// representação em memória do campo de jogo
//   undenifed => vazio
//   0 => x
//   1 => o
let board = [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined]
]

// contador de turno
let turnCounter = 0

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

let resetGame = () => {
    // reseta a representação em memória do jogo
    for (row of board)
    for (sqr in row)
        row[sqr] = undefined

    turnCounter = 0

    // reseta os gráficos
    boardString.forEach (
        (sqr) => document.getElementById(sqr).style.backgroundImage = ''
    )
}

const setSquare = (xOr0) => {

}

// aloca os eventListeners
for (elemento of boardString)
    document.getElementById(elemento).addEventListener('click', clicarQuadrado(elemento))

