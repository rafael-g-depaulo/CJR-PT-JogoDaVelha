var canvas = document.getElementById('canv');
var c = canvas.getContext('2d');
let g =0.1;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let textBox = {
    x:canvas.width/2,
    y:canvas.height/2 -100,
    width: 300,
    height: 300
}
let firstButton = {
    x:textBox.x-220,
    y:textBox.y+50,
    width:200,
    height: 40
}
let BgButton = 'green';


//Função para escrever o texto na tela
/* Botao 1: textBox.x-120 textBox.y+80 */
/* Botao 2: textBox.x+120 textBox+80*/
function WriteText(){
    c.font = "30px Comic Sans MS";
    c.textAlign = "center";
    c.fillStyle = 'black';
    var Txt = "Bem vindo ao Jogo da Velha";
    var B1 = "Começar Jogo";
    var B2 = "Começar Jogo";

    c.fillText(Txt, textBox.x, textBox.y);

    //Escrevendo primeiro Botão
    c.fillStyle = BgButton;
    c.fillRect(firstButton.x, firstButton.y,firstButton.width, firstButton.height);
    c.fillStyle ='white';
    c.font = "25px Comic Sans MS";
    c.fillText(B1,textBox.x-120 ,textBox.y+80);


    c.fillText(B2,textBox.x+120 ,textBox.y+80);
}
canvas.addEventListener('click', function(event) {
    if (
      event.x > firstButton.x && 
      event.x < firstButton.x + firstButton.width &&
      event.y > firstButton.y && 
      event.y < firstButton.y + firstButton.height
    ) {
      BgButton = 'red';
    }
    else{
        BgButton= 'black'
    }
});


    /* Parte da animação das bolas */
//Cria Variaveis e as funções que controlam a fisica dos circulos
function Circle(x,y,dx,dy,radius){
    this.x=x;
    this.y=y;
    this.dx=dx;
    this.dy=0;
    this.radius = radius;
    this.maxHeight = y;
    this.isnFreezed = true;
    this.Ec = radius*Math.pow(dy,2)/2;
    this.draw = function(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.strokeStyle = 'rgba(0,0,255,0.2)';
        c.fillStyle= 'rgba(0,0,255,0.4)';
        c.stroke();
        c.fill();
    }

    this.update = function(){
        if(this.x + this.radius > canvas.width || this.x - this.radius <0){
            this.dx= -this.dx;
        }
        if(this.y + this.radius > canvas.height && this.isnFreezed){
            this.dy= -this.dy;
        }
        if(this.dy < 0.2 && this.dy > -0.2){ //Creditos: Artur Hugo
            this.maxHeight = this.y;
        }
        if(this.maxHeight > canvas.height - 2*this.radius){
            this.isnFreezed = false;
        }
        if(this.y + this.radius > canvas.height ){
            this.dy *=0.9;        
        }
        this.x += this.dx;
        this.y += this.dy;
        this.dy +=g;
        this.draw();
    }
}

let circleArray = [];
let InitialQuant =10;
let SpawnRate = 50;
//Cria Bolas Espalhadas pela tela
for(i=0;i< InitialQuant;i++){
    var radius = (Math.random()*10)+30;
    var x = Math.random() * (canvas.width - radius *2)+ radius;
    var y = Math.random() * (canvas.height-radius *2)+ radius;
    var dx = (Math.random() -0.5) * 8;
    var dy = (Math.random() - 0.5)* 0;
    circleArray.push(new Circle(x,y,dx,dy,radius));
}
// canvas.addEventListener('mouseover', ChangeColor);
function animate(){
    requestAnimationFrame(animate);
    var Spawn;
    Spawn = Math.random() * SpawnRate;
    if(Spawn < 1){
        var radius = (Math.random()*10)+10;
        var x = Math.random() * (canvas.width - radius *2)+ radius;
        var dx = (Math.random() -0.5) * 8;
        var dy = (Math.random() - 0.5)* 0;
        circleArray.push(new Circle(x,-radius,dx,dy,radius));
    }
    c.clearRect(0,0,canvas.width,canvas.height);
    WriteText();
    for(var i = 0; i< circleArray.length;i++){
        circleArray[i].update();
        if(circleArray[i].y > canvas.height +circleArray[i].radius){
            circleArray.splice(i,1);
            console.log(circleArray.length);
        }
    }
    if(circleArray.length>50){
        g=0.2;
        SpawnRate = 70;
    }
    if(circleArray.length < 30){
        g=0.1;
        SpawnRate = 30;
    }
}
animate();
function StartGame(){
    var menu = document.getElementsByClassName('menu');
    var game = document.getElementsByClassName('wrapper');
    menu[0].style.display ='none';
    game[0].style.display ='flex';
    
}
// canvas.addEventListener('click', StartGame);
