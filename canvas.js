var canvas = document.getElementById('canv');
var c = canvas.getContext('2d');
let g =0.098;
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
    /* Parte da animação Dos objetos */
//Cria Variaveis e as funções que controlam a fisica dos X's
function Exs(x,y,dx,dy,radius){
    this.x=x;
    this.y=y;
    this.dx=dx;
    this.dy=dy;
    this.radius = radius;
    this.isnFreezed = true;
    this.draw = function(){
        let innerRadius = this.radius/2;
        let iVert = [];
        let ang = [
            [-1,-1],
            [1,1],
            [5,3],
            [3,-3]
        ];
        for(var i = 0; i< 4;i++){
            var xi = this.x+innerRadius*Math.cos(i*Math.PI/2)
            var yi = this.y+innerRadius*Math.sin(i*Math.PI/2)
            iVert[i] = {
                x: xi,
                y: yi,
                child: [{
                    x: xi + innerRadius*Math.cos(ang[i%4][0]*Math.PI/4),
                    y: yi + innerRadius*Math.sin(ang[i%4][1]*Math.PI/4)
                },
                {
                    x: xi + innerRadius*Math.cos(ang[(i+1)%4][0]*Math.PI/4),
                    y: yi + innerRadius*Math.sin(ang[(i+1)%4][1]*Math.PI/4)
                }]
            }
            
        }
        
        c.beginPath();
        c.moveTo(iVert[0].child[0].x, iVert[0].child[0].y);
        for(var point of iVert){
            c.lineTo(point.child[0].x,point.child[0].y);
            c.lineTo(point.x,point.y); 
            c.lineTo(point.child[1].x,point.child[1].y);
           
        }
        c.lineTo(iVert[0].child[0].x, iVert[0].child[0].y);
        c.strokeStyle = 'black';
        c.stroke();
        c.fillStyle= 'rgba(0,0,255,0.4)';
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
        if(this.y + 1.5*this.radius > canvas.height){
            this.dy *=0.95;        
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

//Cria Variaveis e as funções que controlam a fisica dos O's
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
        c.fillStyle= 'rgba(255,0,0,0.4)';
        c.stroke();
        c.fill();
        c.beginPath();
        c.arc(this.x,this.y,this.radius/2,0,Math.PI*2,false);
        c.fillStyle= 'white';
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

//Variaveis para Começar a Animação
let circleArray = [];
let exsArray =[];
let InitialQuant =1;
let SpawnRate = 20;

//Função para criar aleatoriamente um X e um O acima da tela
function SpawnDuble(){
	var Spawn;
    Spawn = Math.random() * SpawnRate;
    if(Spawn < 1){
        var radius = (Math.random()*10)+20;
        var x = Math.random() * (canvas.width - radius *2)+ radius;
        var dx = (Math.random() -0.5) * 8;
        var dy = (Math.random() - 0.5)* 0;
        circleArray.push(new Circle(x,-radius,dx,dy,radius));
    }
    if(Spawn < 1){
        var radius = (Math.random()*10)+20;
        var x = Math.random() * (canvas.width - radius *2)+ radius;
        var dx = (Math.random() -0.5) * 8;
        var dy = (Math.random() - 0.5)* 0;
        exsArray.push(new Exs(x,-radius,dx,dy,radius));
    }
}
let willAnimate = true;
//Função Da animação principal
function animate(){
    c.clearRect(0,0,canvas.width,canvas.height);
	SpawnDuble();
    for(var i = 0; i< circleArray.length;i++){
        circleArray[i].update();
        if(circleArray[i].y > canvas.height +circleArray[i].radius){
            circleArray.splice(i,1);
        }
    }
    for(var i = 0; i< exsArray.length;i++){
        exsArray[i].update();
        if(exsArray[i].y > canvas.height + exsArray[i].radius){
            exsArray.splice(i,1);
        }
    }
    if(circleArray.length>20){
        g=0.2;
        SpawnRate = 70;
    }
    else{
        g=0.1;
        SpawnRate = 50;
    }
    if(willAnimate)requestAnimationFrame(animate);
}
animate();  //Inicia a animação quando a tela é carregada

// Para a animação e torna a tela do jogo como foco
function StartGame(){
    var menu = document.getElementsByClassName('menu');
    var game = document.getElementsByClassName('wrapper');
    menu[0].style.display ='none';
    game[0].style.display ='flex';
    willAnimate =false;
}
function Sair(){
    var menu = document.getElementsByClassName('menu');
    var game = document.getElementsByClassName('wrapper');
    menu[0].style.display ='flex';
    game[0].style.display ='none';
    willAnimate =true;
    animate();
}

