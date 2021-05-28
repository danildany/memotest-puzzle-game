let turnos = 0;
let $primerCuadro = null;
const $tablero = document.querySelector('#cards');
const $cuadros = $tablero.querySelectorAll('.card');
var regex = /red|blue|cyan|violet|green|rose|black|brown/;
let winerMoves = 8;
let newHere = true;
const $start = document.querySelector('#start');
const $status = document.querySelector('#status');
const $blocker = document.querySelector('.blocker');


$start.addEventListener('click',()=>{
  if(newHere){
    $blocker.style.display = 'none';
    $status.innerText = 'Let\'s go!'
    configurarJuego();
    newHere = false;
  } else{
    $status.innerText = 'Here we go again.'
    winerMoves = 8;
    turnos = 0;
    reiniciar($cuadros);
    configurarJuego();
  }
})

const configurarJuego = () => {
  $start.disabled = true;
  const coloresBase = ['red','blue','cyan','violet','green','rose','black','brown'];
  const coloresRepetidos = coloresBase.concat(coloresBase);
  configurarCuadros($cuadros, coloresRepetidos);
  manejarEventos($tablero);
}
const manejarEventos = ($tablero) => {
   $cuadros.forEach(function($cuadro){
     $cuadro.onclick = function(){
       manejarClickCuadro($cuadro);
     }
   });
}

function configurarCuadros($cuadros, colores) {
  const coloresRandom = colores.sort(function() {
    return 0.5 - Math.random();
  });

  coloresRandom.forEach(function(color, i) {
    $cuadros[i].classList.add(color);
  });
}

const manejarClickCuadro = ($cuadroActual) => {
  mostrarCuadro($cuadroActual);

  if ($primerCuadro === null) {
    $primerCuadro = $cuadroActual;
  } else {
    if ($primerCuadro === $cuadroActual) {
      return;
    }

    turnos++;

    if (cuadrosSonIguales($primerCuadro, $cuadroActual)) {
      eliminarCuadro($primerCuadro);
      eliminarCuadro($cuadroActual);
      winerMoves--;
    } else {
      ocultarCuadro($primerCuadro);
      ocultarCuadro($cuadroActual);
    }
    $primerCuadro = null;
  }
}

function cuadrosSonIguales(cuadro1, cuadro2) {
  return cuadro1.className === cuadro2.className;
}

const mostrarCuadro = (cuadro) => {
  cuadro.classList.remove('color-hidden');
}

const ocultarCuadro = (cuadro) => {
  setTimeout(function() {
    cuadro.classList.add('color-hidden');
  }, 500);

}

const eliminarCuadro = (cuadro) => {
  setTimeout(function() {
    cuadro.parentElement.classList.add('completo');
    evaluarFinDeJuego();
  }, 500);
}

const evaluarFinDeJuego = () => {
  if (winerMoves===0) {
    $status.innerText = `You Win in ${turnos} moves.`;
    $start.innerText = 'Play again.'
    $start.disabled = false;
  }
}

const reiniciar = (array)=>{
  for (let i = 0; i < array.length; i++) {
    if (regex.test(array[i].className)) {
        let word = (array[i].className.match(regex)).join();
        array[i].classList.remove(word);
        array[i].classList.add('color-hidden');
        array[i].parentElement.classList.remove('completo');
      }
    }
}