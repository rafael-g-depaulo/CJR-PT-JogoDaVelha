var canvas = document.getElementById('canv');
var c = canvas.getContext('2d');
let g =0.098;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Cores:
let CorDefundo = '#125567';

//Interações com o mouse
let mouse = {
    x:undefined,
    y:undefined,
    dx:0,
    dy:0
}
window.addEventListener('resize', function (){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
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

//Variaveis para Começar a Animação
let Objects = [];        //Armazena todos os Objetos X e O 's
let SpawnRate = 20;      //Spawn rate dos X e O's todo frame. Quanto maior o valor, menor será o rate de spawn

// Função para calculo de distancia:
function dist(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}

    /* Parte da animação Dos objetos */
//Cria Variaveis e as funções que controlam a fisica dos X's
function Exs(x,y,dx,dy,radius){
    this.x=x;
    this.y=y;
    this.dx=dx;
    this.dy=dy;
    this.radius = radius;
    this.isnFreezed = true;
    //Função para desenhar os X's
    this.draw = function(){
        let innerRadius = this.radius/2;    //Tamano do raio interior do X
        let iVert = [];                     //Vetor com os filhos de cada vertice
        //Constante contendo os valores que cada filho deve ser multiplicado para o X ser formado
        const ang = [
            [-1,-1],
            [1,1],
            [5,3],
            [3,-3]
        ];          

        for(var i = 0; i< 4;i++){
            // Primeiro é Formado 4 xi/yi que representam os vértices pai
            var xi = this.x+innerRadius*Math.cos(i*Math.PI/2)
            var yi = this.y+innerRadius*Math.sin(i*Math.PI/2)
            iVert[i] = {
                x: xi,
                y: yi,
                //Para cada um dos 4 vértices pai a dois filhos com multiplo do angulo de 45
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
        //Feito o desenho efetivamente usando os pontos calculados
        c.beginPath();
        c.moveTo(iVert[0].child[0].x, iVert[0].child[0].y);
        for(var point of iVert){
            c.lineTo(point.child[0].x,point.child[0].y);
            c.lineTo(point.x,point.y); 
            c.lineTo(point.child[1].x,point.child[1].y);
           
        }
        c.lineTo(iVert[0].child[0].x, iVert[0].child[0].y);
        //Linha preta
        c.strokeStyle = 'black';
        c.stroke();

        //Fundo azul para o X
        c.fillStyle= 'rgba(0,0,255,0.4)';
        c.fill();
    }    

    //Função para atualizar os dados de cada X
    this.update = function(){

        //Se ele bater nos cantos da tela, sua velocidade horizontal é invertida e ele perde 20% da mesma
        if(this.x + this.radius > canvas.width || this.x - this.radius < 0){
            this.dx= -this.dx;
            this.dx *=0.8;
        }

        // Se bater no chão a velocidade vertical é trocada e perde 10% dela
        if(this.y + this.radius > canvas.height && this.isnFreezed){
            this.dy= -this.dy;
            this.dy *=0.9;
        }

        //Armazena a altura maxima atingida
        if(this.dy < 0.2 && this.dy > -0.2){ //Creditos: Artur Hugo
            this.maxHeight = this.y;
        }

        //Se a altura maxima atingida for baixa, ele poderá afundar para fora do mapa
        if(this.maxHeight > canvas.height - 2*this.radius){
            this.isnFreezed = false;
		}
		else{
			this.isnFreezed = true;
        }
        
        //Cuida das colisões entre os objetos
        for(cir of Objects){
            //Calcula a distancia de cada objeto na tela, e caso tenham colidido, suas velocidades são trocadas
            if(dist(this.x,this.y,cir.x,cir.y) < this.radius + cir.radius){
                var swap = this.dx;
                this.dx = cir.dx;
                cir.dx = swap;
                swap = this.dy;
                this.dy = cir.dy;
                cir.dy = swap;
            }
        }

        //Posição é incrementada de acordo com a velocidade
        this.x += this.dx;
        this.y += this.dy;
        // Velocidade vertical é incrementada de acordo com a gravidade
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

    //Desenha o circulo na tela usando suas especificações
    this.draw = function(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.strokeStyle = 'rgba(0,0,255,0.2)';
        c.fillStyle= 'rgba(255,0,0,0.4)';
        c.stroke();
        c.fill();
        c.beginPath();
        c.arc(this.x,this.y,this.radius/2,0,Math.PI*2,false);
        c.fillStyle= CorDefundo;
        c.fill();
    }

    //Função para atualizar os dados de cada X
    this.update = function(){

        //Se ele bater nos cantos da tela, sua velocidade horizontal é invertida e ele perde 20% da mesma
        if(this.x + this.radius > canvas.width || this.x - this.radius < 0){
            this.dx= -this.dx;
            this.dx *=0.8;
        }

        // Se bater no chão a velocidade vertical é trocada e perde 10% dela
        if(this.y + this.radius > canvas.height && this.isnFreezed){
            this.dy= -this.dy;
            this.dy *=0.9;
        }

        //Armazena a altura maxima atingida
        if(this.dy < 0.2 && this.dy > -0.2){ //Creditos: Artur Hugo
            this.maxHeight = this.y;
        }

        //Se a altura maxima atingida for baixa, ele poderá afundar para fora do mapa
        if(this.maxHeight > canvas.height - 2*this.radius){
            this.isnFreezed = false;
		}
		else{
			this.isnFreezed = true;
        }
        
        //Cuida das colisões entre os objetos
        for(cir of Objects){
            //Calcula a distancia de cada objeto na tela, e caso tenham colidido, suas velocidades são trocadas
            if(dist(this.x,this.y,cir.x,cir.y) < this.radius + cir.radius){
                var swap = this.dx;
                this.dx = cir.dx;
                cir.dx = swap;
                swap = this.dy;
                this.dy = cir.dy;
                cir.dy = swap;
            }
        }

        //Posição é incrementada de acordo com a velocidade
        this.x += this.dx;
        this.y += this.dy;
        // Velocidade vertical é incrementada de acordo com a gravidade
        this.dy += g;
        this.draw();
    }
}

//Função para criar aleatoriamente um X e um O acima da tela
function SpawnDuble(){
	var Spawn;
    Spawn = Math.random() * SpawnRate;
    //Cria um novo Circulo
    if(Spawn < 1){
        var radius1 = (Math.random()*10)+20;
        var x1 = Math.random() * (canvas.width - radius1 *2)+ radius1;
        var dx = (Math.random() -0.5) * 8;
        var dy = (Math.random() - 0.5)* 0;
        Objects.push(new Circle(x1,-radius1,dx,dy,radius1));
    }
    //Cria um novo X,não deixando que ele nasça em cima do circulo anterior
    if(Spawn < 1){
        do{
            var radius2 = (Math.random()*10)+20;
            var x2 = Math.random() * (canvas.width - radius2 *2)+ radius2;
            var dx = (Math.random() -0.5) * 8;
            var dy = (Math.random() - 0.5)* 0;
        }while(dist(x1,0,x2,0) < radius1 + radius2);
        Objects.push(new Exs(x2, -radius2, dx, dy, radius2));
    }
}
let willAnimate = true;
//Função Da animação principal
function animate(){
    //Paga tudo na tela
    c.clearRect(0,0,canvas.width,canvas.height);

    //Troca a cor de fundo do canvas
    c.fillStyle = CorDefundo;
    c.fillRect(0,0,window.innerWidth,window.innerHeight);

    //Tenta spawnar um X e um O todo frame
    SpawnDuble();
    
    //Da update nas posições de todos os Objetos ( X e O )'s
    for(var i = 0; i< Objects.length;i++){
        Objects[i].update();
    }

    //Confere se existe algum deles fora da tela, e caso exista, apaga-os do armazenamento
    for(var i = 0; i< Objects.length;i++){
        if( Objects[i].y > canvas.height + Objects[i].radius ||
            Objects[i].x + Objects[i].radius < 0 ||
            Objects[i].x - Objects[i].radius > canvas.width
            ){
            Objects.splice(i,1);
        }
    }

    //Aumenta a gravidade e diminui spawnRate caso tenham muitos objetos
    if(Objects.length>30){
        g=0.2;
        SpawnRate = 70;
    }
    //Volta ao normal
    else{
        g=0.1;
        SpawnRate = 50;
    }

    //Se a animação ainda dever acontecer, ela é feita
    if(willAnimate)requestAnimationFrame(animate);
}

// Para a animação e torna a tela do jogo como foco
function StartGame(){
    var menu = document.getElementsByClassName('menu');
    var game = document.getElementsByClassName('wrapper');
    menu[0].style.display ='none';
    game[0].style.display ='flex';
    willAnimate =false;
}

//Sai do jogo e volta ao menu
function Sair(){
    var menu = document.getElementsByClassName('menu');
    var game = document.getElementsByClassName('wrapper');
    menu[0].style.display ='flex';
    game[0].style.display ='none';
    willAnimate =true;
    animate();
}

Sair();  //Inicia a animação quando a tela é carregada