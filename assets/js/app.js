let radius = 340;           // l'angolo di rotazione delle carte alla divisione
let autoRotate = true;
let rotateSpeed = 100;      // la velocità di rotazione
let imgWidth = 190;         // la larghezza delle card
let imgHeight = 230         // l'altezza delle card

// creo le costanti per ogni elemento nella DOM
let odrag = document.getElementById('drag');
let ospin = document.getElementById('spin');
let aImg = ospin.getElementsByTagName('img');
// array di tutte le immagini
let aEle = [...aImg]

// dichiaro le dimensione delle immagini in px
ospin.style.width = imgWidth + 'px';
ospin.style.height = imgHeight + 'px';

// le dimensioni del terreno
let ground = document.getElementById('ground');
ground.style.width = radius * 20 + 'px';
ground.style.height = radius * 20 + 'px';

// timing di partenza della divisione delle card
setTimeout(init, 1000)

// funzione per la divisione del contenitore delle carte in base alla loro quantità
function init(delayTime){
    for (let i = 0; i < aEle.length; i++){
        aEle[i].style.transform = 'rotateY(' + (i * (360 / aEle.length)) +'deg)translateZ(' + radius + 'px)';
        aEle[i].style.transition = 'transform 1s';
        aEle[i].style.transitionDelay = delayTime || (aEle.length-i) / 4 + 's';
    }
};

// funzione per impostare limite all'inizio e alla fine dell'asse Y
function applyTransform(obj){
    if(tY > 180) tY = 180;
    if(tY < 0) tY = 0;

    obj.style.transform = 'rotateX(' + (-tY) + 'deg) rotateY(' + (tX) + 'deg)';
}

// funzione per bloccare il movimento di @keyframes durante lo spostamento del contenuto
function playSpin(yes){
    ospin.style.animationPlayState = (yes ? 'running' : 'paused');
};

let sX, sY, nX, nY, desX = 0;
let desY = 0;
let tX = 0;     // l'asse X
let tY = 10;    // l'asse Y

// condizione che in base alla velocità della rotazione prende il verso della stessa
// se la velocità è maggiore di 0 allora gira in un senso altrimento nell'altro
if(autoRotate){
    let animationName = (rotateSpeed > 0 ? 'spin' : 'spinReverse');
    ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}

document.onpointerdown = function (e){
    clearInterval(odrag.timer);
    e = e || window.event;
    let sX = e.clientX,
        sY = e.clientY;

    // transizione al trascinamento del mouse
    this.onpointermove = function(e){
        e = e || window.event;
        let nX = e.clientX,
            nY = e.clientY;

            desX = nX - sX;
            desY = nY - sY;
            // velocità della transizione
            tX += desX * 0.15;
            tY += desY * 0.15;

            // funzione richiamata per bloccare l'asse X e Y ad una posizione preimpostata 
            applyTransform(odrag);
    
            sX = nX
            sY = nY
    };


    this.onpointerup = function (e){
        odrag.timer = setInterval(function (){
            // velocità di movimento degli assi
            desX *= 0.9;
            desY *= 0.9;
            // durata del movimento degli assi
            tX += desX * 0.15;
            tY += desY * 0.15;

            applyTransform(odrag);

            playSpin(false);

            if(Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5){
                clearInterval(odrag.timer);
                playSpin(true);
            }
        }, 11);
        // reset della posizione del pointer
        this.onpointermove = this.onpointerup = null;
    };
    return false;
};


