const personagem = document.getElementById("personagem")
const cenario = document.getElementById("cenario")
const bloco = document.getElementById("bloco")
const tempo = document.getElementById("tempo")
const inimigo = document.getElementById("inimigo")
const vidas = document.getElementById("vidas")
const moedas = document.getElementById("moedas")
const pontos = document.getElementById("pontos")
const botaoReiniciar = document.getElementById("reiniciar")
const botaoIniciar = document.getElementById("iniciar")

const audioJogoNormal = document.getElementById("audioJogoNormal")
const audioEsperando = document.getElementById("audioEsperando")
const audioPulo = document.getElementById("audioPulo")
const audioMoeda = document.getElementById("audioMoeda")
const audioDano = document.getElementById("audioDano")
const audioVida = document.getElementById("audioVida")
const audioGameOver = document.getElementById("audioGameOver")
const audioRapido = document.getElementById("audioRapido")
const tempoAcabando = document.getElementById("tempoAcabando")

const larguraCenario = cenario.offsetWidth
const larguraPersonagem = personagem.offsetWidth



let posicao = 0;
let direcao = 0;
let velocidade = 12;

let jogoIniciado = false

let tempoAtual = 400;

let vidasAtual = parseInt(localStorage.getItem("vidasAtual")) || 5;
vidas.textContent = vidasAtual;
let moedasAtual = parseInt(localStorage.getItem("moedasAtual")) || 0;
moedas.textContent = moedasAtual;
let pontosAtual = parseInt(localStorage.getItem("pontosAtual")) || 0;
pontos.textContent = pontosAtual;

let checarMovimentos
let checarColisaoComBloco;
let checarRelogio;
let checarColisaoComInimigo;
let checarPulo;

let colidiu = false;


function teclaPressionada(event){
    if (event.key ==="ArrowRight"){
        direcao = 1;
        personagem.style.backgroundImage = "url(./imagens/marioAndandoLadoDireito.gif)"

    } else if(event.key === "ArrowLeft"){
        direcao = -1;
        personagem.style.backgroundImage = "url(./imagens/marioAndandoLadoEsquerdo.gif)"
    } else if(event.code === "Space"){
        personagem.classList.add("puloPersonagem");
        audioPulo.play(); 
        if(colidiu){
            clearTimeout(checarPulo)
        }else
        colidiu = false;
       checarPulo = setTimeout(() => {
            personagem.classList.remove("puloPersonagem");
        }, 500)
    } 
            
}

function teclaSolta(event){
    if (event.key ==="ArrowRight"){
        direcao = 0;
        personagem.style.backgroundImage = "url(./imagens/marioParadoLadoDireito.png)"
    } else if(event.key === "ArrowLeft"){
        direcao = 0;
        personagem.style.backgroundImage = "url(./imagens/marioParadoLadoEsquerdo.png)"
    }
}
 
function atualizarMovimentos(){
    posicao += direcao * velocidade
    if (posicao < 0){
        posicao = 0;
    } else if(posicao + larguraPersonagem > larguraCenario){
        posicao = larguraCenario - larguraPersonagem
    }
    personagem.style.left = posicao + "px"
}

function colisaoComBloco(){
     
    const checarPersonagem = personagem.getBoundingClientRect();
    const checarBloco = bloco.getBoundingClientRect();

   if(
    checarBloco.left < checarPersonagem. right &&
    checarBloco.right > checarPersonagem. left &&
    checarBloco.top < checarPersonagem. bottom &&
    checarBloco.bottom > checarPersonagem.top 
   ){
    audioMoeda.play(); 
    clearInterval(checarColisaoComBloco)
    moedasAtual ++;
    moedas.textContent = moedasAtual;
    localStorage.setItem("moedasAtual", moedasAtual);
    pontosAtual += +10;
    pontos.textContent = pontosAtual
    localStorage.setItem("pontosAtual", pontosAtual);
    checarMoedas(); 
    checarPontos();
    bloco.style.top = "440px";
    setTimeout(()=>{
        checarColisaoComBloco = setInterval(colisaoComBloco,10);
        bloco.style.top = "450px";
    }, 500);
   }
}

function colisaoComInimigo(){
    const checarPersonagem = personagem.getBoundingClientRect();
    const checarInimigo = inimigo.getBoundingClientRect();

   if(
    checarInimigo.left < checarPersonagem. right &&
    checarInimigo.right > checarPersonagem. left &&
    checarInimigo.top < checarPersonagem. bottom &&
    checarInimigo.bottom > checarPersonagem.top 
   ){
    audioJogoNormal.volume = 0;
    audioDano.play();
    clearTimeout(checarMovimentos);
    clearTimeout(checarPulo);
    removerTeclas();
        clearInterval(checarRelogio);
    clearInterval(checarColisaoComInimigo);
    vidasAtual --;
    vidas.textContent = vidasAtual;
    localStorage.setItem("vidasAtual", vidasAtual);
    personagem.style.backgroundImage = "url(./imagens/marioMorto.gif)"
    inimigo.style.display = "none";
    colidiu = true
    setTimeout(()=>{
        checarJogo();
    },3100)
    
    
   }
}


botaoReiniciar.addEventListener("click", function() {
    
    moedasAtual = 0
    moedas.textContent = moedasAtual;
    localStorage.setItem("moedasAtual", moedasAtual);
    pontosAtual = 0;
    pontos.textContent = pontosAtual
    localStorage.setItem("pontosAtual", pontosAtual);
    vidasAtual = 5
    vidas.textContent = vidasAtual;
    localStorage.setItem("vidasAtual", vidasAtual);
    location.reload();
})



function checarMoedas(){
    if(moedasAtual === 20){
        moedasAtual = 0;
        moedas.textContent = moedasAtual;
        audioVida.play();
        vidasAtual ++;
        vidas.textContent = vidasAtual;
    }
}

function checarPontos (){
    if(pontosAtual === 100        ){
        pontosAtual = 0;
        pontos.textContent = pontosAtual;
        vidasAtual++;
        vidas.textContent = vidasAtual;
    }
}

function tempoDoJogo (){
    tempoAtual--;
    tempo.textContent = tempoAtual;
    if (tempoAtual === 100){
        audioJogoNormal.volume = 0
        tempoAcabando.play();

        setTimeout(()=>{
            tempoAcabando.volume = 0;
            audioJogoNormal.volume = 0;
            audioRapido.play();
        },3000)
        audioRapido.play();
    } else if(tempoAtual === 0){
        audioJogoNormal.volume = 0;
        audioRapido.volume = 0;
        audioEsperando.pause();
        audioGameOver.play();
        removerTeclas();
        clearInterval(checarRelogio);
        personagem.style.backgroundImage = "url(./imagens/marioMorto.gif)"
        inimigo.style.display = "none";
       
    }
}

function checarJogo(){
    if(vidasAtual >= 1){
        location.reload();
    }else{
        botaoReiniciar.style.display = "Block"
        audioEsperando.pause();
        audioJogoNormal.pause();
        audioRapido.pause();
        audioGameOver.play();

    }
}

function removerTeclas(){
    document.removeEventListener("keydown", teclaPressionada);
    document.removeEventListener("keyup", teclaSolta);
}






botaoIniciar.addEventListener("click", function(){
    moedasAtual = 0
    moedas.textContent = moedasAtual;
    pontosAtual = 0;
    pontos.textContent = pontosAtual
    botaoIniciar.style.display = "none"
    inimigo.classList.add("animarInimigo")
    document.addEventListener("keydown", teclaPressionada);
    document.addEventListener("keyup", teclaSolta);
    checarMovimentos = setInterval(atualizarMovimentos, 50);
    checarColisaoComBloco = setInterval(colisaoComBloco, 10);
    checarColisaoComInimigo = setInterval(colisaoComInimigo, 10);
    checarRelogio = setInterval(tempoDoJogo, 1000);
    jogoIniciado = true
    audioEsperando.volume = 0;
    audioJogoNormal.play();
})

document.addEventListener("keydown", function(){

    if(!jogoIniciado && event.key === "Enter"){
        moedasAtual = 0
        moedas.textContent = moedasAtual;
        pontosAtual = 0;
        pontos.textContent = pontosAtual
        botaoIniciar.style.display = "none"
        inimigo.classList.add("animarInimigo")
        document.addEventListener("keydown", teclaPressionada);
        document.addEventListener("keyup", teclaSolta);
        checarMovimentos = setInterval(atualizarMovimentos, 50);
        checarColisaoComBloco = setInterval(colisaoComBloco, 10);
        checarColisaoComInimigo = setInterval(colisaoComInimigo, 10);
        checarRelogio = setInterval(tempoDoJogo, 1000);
        jogoIniciado = true
        audioEsperando.volume = 0;
        audioJogoNormal.play();
    }else if(jogoIniciado && event.key === "Enter"){
        alert("jogo ja foi iniciado");
    }
})
    
