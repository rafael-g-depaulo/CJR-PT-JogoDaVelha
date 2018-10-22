// const board = [
//     document.getElementById("a1"), document.getElementById("a2"), document.getElementById("a3"),
//     document.getElementById("b1"), document.getElementById("b2"), document.getElementById("b3"),
//     document.getElementById("c1"), document.getElementById("c2"), document.getElementById("c3"),
// ]

const board = [
    'a1', 'a2', 'a3', 
    'b1', 'b2', 'b3', 
    'c1', 'c2', 'c3'
]

for (elemento of board) {
    document.getElementById(elemento).addEventListener('click', clicarQuadrado(elemento))
}

function clicarQuadrado(quadrado) {
    return () => {
        document.getElementById(quadrado).style.backgroundImage = 'url("x.png")'
    }
}