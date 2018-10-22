var canvas = document.getElementById('canv');
var c = canvas.getContext('2d');
let g =0.98;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Interações com o mouse
let mouse = {
    x:undefined,
    y:undefined,
    dx:0,
    dy:0
}
var timestamp = Date.now();
canvas.addEventListener('mousemove',
    function(event){
	var now = Date.now();
	mouse.dx = (event.x - mouse.x)/(now-timestamp);
	mouse.dy = (event.y - mouse.y)/(now-timestamp);
    mouse.x = event.x;
	mouse.y = event.y;
	timestamp = now;
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
        if(this.x + this.radius > canvas.width || this.x - this.radius < 0){
            this.dx= -this.dx;
            this.dx *=0.8;
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
		else{
			this.isnFreezed = true;
		}
        if(this.y + this.radius > canvas.height){
            this.dy *=0.9;        
        }
		if( mouse.x > this.x - this.radius &&
			mouse.x < this.x + this.radius &&
			mouse.y < this.y + this.radius &&
			mouse.y > this.y - this.radius
        ){
			this.dx+=mouse.dx;
			this.dy+=mouse.dy;
			// this.x=mouse.x;
			// this.y=mouse.y;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.dy += g;
        this.draw();
    }
}
//
let circleArray = [];
let InitialQuant =1;
let SpawnRate = 50;
//Cria Bolas Espalhadas pela tela
for(i=0;i< InitialQuant;i++){
    var radius = (Math.random()*10)+300;
    var x = Math.random() * (canvas.width - radius *2)+ radius;
    var y = Math.random() * (canvas.height-radius *2)+ radius;
    var dx = (Math.random() -0.5) * 8;
    var dy = (Math.random() - 0.5)* 0;
    circleArray.push(new Circle(x,y,dx,dy,radius));
}
function SpawnCircle(){
	var Spawn;
    Spawn = Math.random() * SpawnRate;
    if(Spawn < 1){
        var radius = (Math.random()*10)+20;
        var x = Math.random() * (canvas.width - radius *2)+ radius;
        var dx = (Math.random() -0.5) * 8;
        var dy = (Math.random() - 0.5)* 0;
        circleArray.push(new Circle(x,-radius,dx,dy,radius));
    }
}
function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height);
	SpawnCircle();
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

