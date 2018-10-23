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
    // Retorna 'false' caso não haja ganhador
    // Retorna 0 caso X tenha vencido
    // Retorna 1 caso O tenha vencido
    // retorna 'fim' caso o jogo tenha dado velha
    for( i in board){
        //Olhando Linhas onde é possivel ganhar
        if(board[i][0]==board[i][1] && board[i][0]==board[i][2] && board[i][0]!=undefined){
            return board[i][0];
        }
        //Olhando Colunas
        if(board[0][i]==board[1][i] && board[0][i]==board[2][i] && board[0][i]!=undefined){
            return board[0][i];
        }
    }
    //Olhando diagonal principal
    if(board[0][0]==board[1][1] && board[0][0]==board[2][2] && board[0][0]!=undefined){
        return board[0][0];
    }
    //Olhando diagonal Secundaria
    if(board[0][2]==board[1][1] && board[1][1]==board[2][0] && board[0][2]!=undefined){
        return board[0][2];
    }
    if(turno == 9){
        return 'fim';
    }
    else{
        return false;
    }
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

