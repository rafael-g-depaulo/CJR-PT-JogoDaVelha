// strings dos id's do campo
const boardString = [
    'a1', 'a2', 'a3', 
    'b1', 'b2', 'b3', 
    'c1', 'c2', 'c3'
]

// representação em memória do campo de jogo
//   undefined => vazio
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
        var foiJogado;

        // Variavel para armazenar informação a jogada foi feita efetivamente
        foiJogado = changeBG(quadrado);

        // Caso a jogada tenha sido feita
        if(foiJogado){
            changeBoard(quadrado);      //O armazanemento da memória do Tabuleiro é alterado
            turnCounter+=1;             //Turno é incrementado
            var won = winCond();         
            if(won != false){           //É checado se alguém ganhou
                winAlert(won);
                resetGame();
            }
        }
    }
    

// Faz um alerta diferente dependendo da forma de fim do jogo
const winAlert = (winformat) => {
    if(winformat == 'velha'){
        alert(' Deu Velha :( ');
        return;
    }
    if(winformat.player == 1){
        alert('Parabéns, O ganhou!');
    }
    if(winformat.player == 0){
        alert('Parabéns, X ganhou!');
    }
}

//Tenta trocar o Background de algum quadrado
const changeBG = (quadrado) => {
    //Retorna true se o fundo tiver sido trocado corretamente
    //Retorna false caso contrário

    var bg = document.getElementById(quadrado).style.backgroundImage;

    //Checa se já existe a imagem no local que está sendo jogado
    if(bg == 'url("o.png")' ||bg == 'url("x.png")'){
        return false;
    }
    else{
        if(turnCounter%2 == 0){
            document.getElementById(quadrado).style.backgroundImage = 'url("x.png")';
        }
        else{
            document.getElementById(quadrado).style.backgroundImage = 'url("o.png")';
        }
        return true;
    }
}

//Muda a informação na memoria de como está o campo
const changeBoard = (quadrado) => {
    var Idx;                                
    Idx = boardString.indexOf(quadrado);    // Pega o index do quadrado
    // Muda o armazenamento da memoria do tabuleiro usando o index do array dos ids como base
    board[parseInt(Idx/board.length)][Idx%board.length] = turnCounter%2;
}

// Checa se o jogo acabou ou não
const winCond = () => {
    // checa se terminou o jogo

    // vitória horizontal
    for (row in board)
    // se todos os elementos da array são iguais
    if (board[row].filter(x => x === board[row][0] && x !== undefined).length === board[row].length)
        return {
            win: 'hor',
            num: row,
            player: board[row][0]
        }

    // vitória vertical
    for (col in board) {
        let colFirst = board[0][col]

        // se algum quadrado da coluna for diferente do primeiro quadrado da coluna, ou for undefined,
        // va para a próxima coluna
        for (row in board)
        if (board[row][col] !== colFirst || board[row][col] === undefined)
            break
        else if (row == board.length-1)
            return {
                win: 'ver',
                num: col,
                player: board[0][col]
            }
    }

    // vitória diagonal principal (\)
    for (i in board) {
        // se algum quadrado for diferente do primeiro, break
        if (board[i][i] !== board[0][0]) {
          break
        }
        // se chegou no ultimo quadrado e não deu break, é diagonal principal
        if (i == board.length)
            return {
                win: 'dia',
                num: 1,
                player: board[0][0]
            }
    }

    // vitória diagonal secundaria (/)
    for (i in board) {
        const blen = board.length - 1
        // se algum quadrado for diferente do ultimo da primeira linha, break
        if (board[i][blen-i] !== board[0][blen])
            break
        // se chegou no ultimo quadrado e não deu break, é diagonal principal
        if (i == board.length)
            return {
                win: 'dia',
                num: 2,
                player: board[0][blen]
            }
    }

    // jogo ainda em andamento
    for (row of board)
    for (sqr of row)
        if (sqr === undefined) return false
    
    // velha
    return 'velha';
}

const resetGame = () => {
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

// aloca os eventListeners
for (elemento of boardString)
    document.getElementById(elemento).addEventListener('click', clicarQuadrado(elemento))

