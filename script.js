var time = new Date();
var deltaTime = 0;

if(document.readyState ==="complete" || document.readyState ==="interactive"){
    setTimeout(Init,1);
}else{
    document.addEventListener("DOMContentLoaded", Init);
}

function Init(){
    time = new Date();
    Start();
    Loop();
}

function Loop(){
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update()
    requestAnimationFrame(Loop);
}

//** NUESTRO JUEGO VA AQUI **//

var sueloY = 22;
var velY = 0;
var impulso = 900;
var gravedad = 2500;

var monoPosX = 42;
var monoPosY = sueloY;

var sueloX = 0;
var velEscenario = 1280/3;
var gameVel = 1;
var score = 0;

var parado = false;
var saltando = false;

var tiempoHastaObstaculo = 2;
var tiempoOstaculoMin = 0.7;
var tiempoOstaculoMax = 1.8;
var obstaculoPosY = 16;
var obstaculos = [];




var contenedor;
var mono;
var textoScore;
var suelo;
var gameOver;



        function Start(){
            gameOver = document.querySelector(".game-over");
            suelo = document.querySelector(".suelo");
            contenedor = document.querySelector(".contenedor");
            textoScore = document.querySelector(".score");
            mono = document.querySelector(".mono");
            document.addEventListener("keydown", HandleKeyDown);
        }

        function HandleKeyDown(ev){
            if(ev.keyCode == 32){
                Saltar();
            }
        }

        function Saltar(){
            if(monoPosY === sueloY){
                saltando = true;
                velY = impulso;
                mono.classList.remove("mono-corriendo");
            }
        }

        function Update(){

            if(parado) return;

            MoverSuelo();
            MoverMono();
            DecidirCrearObstaculos();
            MovesObstaculos();
            DetectarColision();

            velY -= gravedad * deltaTime;

        }

        function MoverSuelo(){
            sueloX += CalcularDesplazamiento();
            suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
        }

        function CalcularDesplazamiento(){
            return velEscenario * deltaTime * gameVel;
        }

        function MoverMono(){
            monoPosY += velY * deltaTime;
            if(monoPosY < sueloY){
                TocarSuelo();
            }
            mono.style.bottom = monoPosY+"px";
        }

        function TocarSuelo(){
            monoPosY = sueloY;
            velY = 0;
            if(saltando){
                mono.classList.add("mono-corriendo");
            }
            saltando = false;
        }

        function DecidirCrearObstaculos(){
            tiempoHastaObstaculo -= deltaTime;
            if(tiempoHastaObstaculo <= 0){
                CrearObstaculo();
            }
        }

        function CrearObstaculo(){
            var obstaculo = document.createElement("div");
            contenedor.appendChild(obstaculo);
            obstaculo.classList.add("palmera");
            obstaculo.posX = contenedor.clientWidth;
            obstaculo.style.left = contenedor.clientWidth+"px";

            obstaculos.push(obstaculo);
            tiempoHastaObstaculo = tiempoOstaculoMin + Math.random() *
            (tiempoOstaculoMax-tiempoOstaculoMin) / gameVel;
        }

        function MovesObstaculos(){
            for(var i = obstaculos.length -1; i >= 0; i--) {
                if(obstaculos[i].posX < -obstaculos[i].clientWidth) {           
                    obstaculos[i].parentNode.removeChild(obstaculos[i]);
                    obstaculos.splice(i, 1);
                    GanarPuntos();
                }else{
                    obstaculos[i].posX -= CalcularDesplazamiento();
                    obstaculos[i].style.left = obstaculos[i].posX+"px";
                }
            }
        }

        function GanarPuntos() {
            score++;
            textoScore.innerText = score;
        }
        
        function DetectarColision(){
            for(var i = 0; i < obstaculos.length; i++){
                if(obstaculos[i].posX > monoPosX + mono.clientWidth) {
                    //evade;
                    break; //como esta en orden no puede chocar con mas
                }else{
                    if(IsCollision(mono, obstaculos[i], 10, 30, 15, 20)){
                        GameOver();
                    }
                }
            }

        }

        function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft){
            var aRect = a.getBoundingClientRect();
            var bRect = b.getBoundingClientRect();

            return !(
                ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
                (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
                ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
                (aRect.left + paddingLeft > (bRect.left + bRect.width))
            );
        }

        function GameOver() {
            Estrellarse();
            gameOver.style.display = "block";
            document.getElementById("restart-button").style.display = "block";
        }

        function Estrellarse() {
            mono.classList.remove("mono-corriendo");
            mono.classList.add("mono-estrellado");
            parado = true;

        }

        function RestartGame() {
            // Restablecer variables del juego
            score = 0;
            velY = 0;
            monoPosX = 42;
            monoPosY = sueloY;
            sueloX = 0;
            obstaculos = [];
            tiempoHastaObstaculo = 2;
            parado = false;
          
            // Restablecer elementos del juego
            mono.classList.add("mono-corriendo");
            gameOver.style.display = "none";
          
            // Restablecer el texto del marcador
            textoScore.innerText = score;
          
            // Eliminar todos los obstáculos del DOM
            var obstaculosElementos = document.querySelectorAll(".palmera");
            for (var i = 0; i < obstaculosElementos.length; i++) {
              obstaculosElementos[i].parentNode.removeChild(obstaculosElementos[i]);
            }
          
            // Ocultar el botón de reinicio
            document.getElementById("restart-button").style.display = "none";
          
            // Volver a iniciar el bucle del juego
            Loop();
          }
          
          