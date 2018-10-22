var canvas = document.getElementById('canv');
var c = canvas.getContext('2d');
let g =1;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let textBox = {
    x:canvas.width/2,
    y:canvas.height/2,
    width: 300,
    height: 300

}

function Circle(x,y,dx,dy,radius){
    this.x=x;
    this.y=y;
    this.dx=dx;
    this.dy=0;
    this.radius = radius;
    this.Ec = radius*Math.pow(dy,2)/2;
    this.draw = function(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.strokeStyle = 'rgba(0,0,255,0.5)';
        c.fillStyle= 'rgba(0,0,255,0.8)';
        c.stroke();
        c.fill();
    }

    this.update = function(){
        if(this.x + this.radius > canvas.width || this.x - this.radius <0){
            this.dx= -this.dx;
        }
        if(this.y + this.radius > canvas.height){
            this.dy= -this.dy;
        }
        if(this.y + this.radius > canvas.height ){
            this.dy *=0.9;
            console.log("Bateu no chão");
        }
        this.x += this.dx;
        this.y += this.dy;
        this.dy +=0.2;
        this.draw();
    }
}
var circleArray = [];
for(i=0;i<100;i++){
    var radius = (Math.random()*10)+30;
    var x = Math.random() * (canvas.width - radius *2)+ radius;
    var y = Math.random() * (canvas.height-radius *2)+ radius;
    var dx = (Math.random() -0.5) * 8;
    var dy = (Math.random() - 0.5)* 0;
    circleArray.push(new Circle(x,y,dx,dy,radius));
}
function WriteText(){
    c.font = "30px Comic Sans MS";
    c.fillStyle = "red";
    c.textAlign = "center";
    c.fillStyle = 'black';
    c.fillText("Bem vindo ao Jogo da Velha", textBox.x, textBox.y);
}
function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height);
    WriteText();
    for(var i = 0; i< circleArray.length;i++){
        circleArray[i].update();
    }
}
animate();
function StartGame(){
    var menu = document.getElementsByClassName('menu');
    var game = document.getElementsByClassName('wrapper');
    menu[0].style.display ='none';
    game[0].style.display ='flex';
}
canvas.addEventListener('click', StartGame,false);
