// Torre object constructor
function Torre(discos, origen, destino, auxiliar, resultado) {
    this.discos = discos;
    this.origen = origen;
    this.destino = destino;
    this.auxiliar = auxiliar;
    this.resultado = resultado;
}

const torre1 = document.getElementById("tower1");
const torre2 = document.getElementById("tower2");
const torre3 = document.getElementById("tower3");
const torres = [torre1, torre2, torre3];

let timerInterval;
let startTime;
let movimientosTotales = 0;
let selectedTower = null;
let juegoIniciado = false;

// Función del botón de inicio
function inicio() {
    const nombreUsuario = document.querySelector('input[type="text"]').value.trim();
    
    if (nombreUsuario === "") {
        document.getElementById("message").textContent = "Por favor, coloque su nombre";
        return;
    }

    clearInterval(timerInterval);
    startTime = new Date();
    timerInterval = setInterval(actualizarTiempo, 1000);

    document.getElementById("message").textContent = "";
    document.getElementById("timer").textContent = "Tiempo: 00:00";
    
    juegoIniciado = true;
    inicializarEventListeners();
}

// Función para actualizar el temporizador
function actualizarTiempo() {
    const ahora = new Date();
    const tiempoTranscurrido = Math.floor((ahora - startTime) / 1000);
    const minutos = Math.floor(tiempoTranscurrido / 60);
    const segundos = tiempoTranscurrido % 60;
    const minutosFormateados = minutos.toString().padStart(2, '0');
    const segundosFormateados = segundos.toString().padStart(2, '0');
    document.getElementById("timer").textContent = `Tiempo: ${minutosFormateados}:${segundosFormateados}`;
}

// Función de detener
function detener() {
    clearInterval(timerInterval);
    juegoIniciado = false;
}

// Función de resetear temporizador y torre
function resetear() {
    clearInterval(timerInterval);
    document.getElementById("timer").textContent = "Tiempo: 00:00";
    document.getElementById("message").textContent = "";
    resetearTorres();
    localStorage.removeItem("estadoTorres");
    movimientosTotales = 0;
    actualizarContador();
    juegoIniciado = false;
}

// Función de resetear las torres
function resetearTorres() {
    torre1.innerHTML = `
        <img src="./imagenes/Disco.png" alt="Disco1" width="100" height="50" class="image">
        <img src="./imagenes/Disco.png" alt="Disco2" width="150" height="50" class="image">
        <img src="./imagenes/Disco.png" alt="Disco3" width="200" height="50" class="image">

    `;
    torre2.innerHTML = '';
    torre3.innerHTML = '';
    inicializarEventListeners();
}

// Función para guardar el estado del juego
function guardarEstado() {
    const estado = {
        torre1: Array.from(torre1.children).map(img => img.outerHTML),
        torre2: Array.from(torre2.children).map(img => img.outerHTML),
        torre3: Array.from(torre3.children).map(img => img.outerHTML),
        tiempo: document.getElementById("timer").textContent,
        movimientos: movimientosTotales
    };
    localStorage.setItem("estadoTorres", JSON.stringify(estado));
    document.getElementById("message").textContent = "Juego guardado";
}

// Función para restaurar el estado del juego
function restaurarEstado() {
    const estadoGuardado = JSON.parse(localStorage.getItem("estadoTorres"));
    if (estadoGuardado) {
        torre1.innerHTML = estadoGuardado.torre1.join('');
        torre2.innerHTML = estadoGuardado.torre2.join('');
        torre3.innerHTML = estadoGuardado.torre3.join('');
        document.getElementById("timer").textContent = estadoGuardado.tiempo;
        movimientosTotales = estadoGuardado.movimientos;
        actualizarContador();
        inicializarEventListeners();
    }
}

// Función para mover un disco
function moverDisco(torreOrigen, torreDestino) {
    if (!juegoIniciado) {
        document.getElementById("message").textContent = "Presiona INICIO para comenzar el juego";
        return;
    }

    const discoAMover = torreOrigen.lastElementChild;
    const discoDestino = torreDestino.lastElementChild;

    if (!discoAMover) {
        document.getElementById("message").textContent = "No hay disco para mover en esta torre";
        return;
    }

    if (discoDestino && parseInt(discoAMover.width) > parseInt(discoDestino.width)) {
        document.getElementById("message").textContent = "Movimiento inválido: No puedes colocar un disco grande sobre un disco pequeño.";
        return;
    }

    torreDestino.appendChild(discoAMover);
    movimientosTotales++;
    actualizarContador();

    if (torre3.children.length === 3) {
        document.getElementById("message").textContent = `¡Felicidades! Has completado el juego en ${movimientosTotales} movimientos.`;
        detener();
    } else {
        document.getElementById("message").textContent = "Movimiento válido";
    }
}

// Función para actualizar el contador de movimientos en la interfaz
function actualizarContador() {
    document.getElementById("contadorMovimientos").textContent = `Movimientos: ${movimientosTotales}`;
}

// Función para inicializar los event listeners
function inicializarEventListeners() {
    torres.forEach(torre => {
        torre.onclick = function() {
            if (!juegoIniciado) {
                document.getElementById("message").textContent = "Presiona INICIO para comenzar el juego";
                return;
            }
            
            if (selectedTower === null) {
                if (this.lastElementChild) {
                    selectedTower = this;
                    this.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
                }
            } else {
                moverDisco(selectedTower, this);
                selectedTower.style.backgroundColor = '';
                selectedTower = null;
            }
        };
    });
}

// Event Listeners
document.getElementById("startButton").addEventListener("click", inicio);
document.getElementById("stopButton").addEventListener("click", detener);
document.getElementById("resetButton").addEventListener("click", resetear);
document.getElementById("saveButton").addEventListener("click", guardarEstado);
document.getElementById("loadButton").addEventListener("click", restaurarEstado);

// Inicializar el juego
document.addEventListener('DOMContentLoaded', () => {
    resetearTorres();
});