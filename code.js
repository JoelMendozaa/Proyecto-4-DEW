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

function resetearTorres() {
    torre1.innerHTML = ''; // Vaciar torre1 antes de añadir discos

    // Crear discos como imágenes y agregarlos a torre1
    const discos = [
        { width: 200, bottom: 0, alt: "Disco3" },   // Disco más grande en la base
        { width: 150, bottom: 55, alt: "Disco2" },  // Disco medio encima del anterior
        { width: 100, bottom: 110, alt: "Disco1" }  // Disco más pequeño arriba
    ];

    discos.forEach(discoData => {
        const disco = document.createElement("img");
        disco.src = "./imagenes/Disco.png";
        disco.alt = discoData.alt;
        disco.width = discoData.width;
        disco.height = 50;
        disco.className = "disk";
        disco.style.bottom = `${discoData.bottom}px`;
        torre1.appendChild(disco);
    });

    torre2.innerHTML = ''; // Asegurar que torre2 esté vacía
    torre3.innerHTML = ''; // Asegurar que torre3 esté vacía
    
    inicializarEventListeners(); // Reiniciar eventos
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

// Función para mover un disco de una torre a otra
function moverDisco(torreOrigen, torreDestino) {
    if (!juegoIniciado) {
        mostrarMensaje("Presiona INICIO para comenzar el juego");
        return;
    }

    const discoAMover = torreOrigen.lastElementChild;
    const discoDestino = torreDestino.lastElementChild;

    if (!discoAMover) {
        mostrarMensaje("No hay disco para mover en esta torre");
        return;
    }

    // Verificar que no se coloque un disco grande sobre uno más pequeño
    if (discoDestino && parseInt(discoAMover.width) > parseInt(discoDestino.width)) {
        mostrarMensaje("Movimiento inválido: No puedes colocar un disco grande sobre un disco pequeño.");
        return;
    }

    // Calcular la nueva posición del disco
    const nuevaPosicion = torreDestino.children.length * 55;
    discoAMover.style.bottom = `${nuevaPosicion}px`;

    // Mover el disco a la torre de destino
    torreDestino.appendChild(discoAMover);
    movimientosTotales++;
    actualizarContador();

    if (torre3.children.length === 3) {
        mostrarMensaje(`¡Felicidades! Has completado el juego en ${movimientosTotales} movimientos.`);
        detener();
    } else {
        mostrarMensaje("Movimiento válido");
    }
}

// Función para actualizar el contador de movimientos en la interfaz
function actualizarContador() {
    document.getElementById("contadorMovimientos").textContent = `Movimientos: ${movimientosTotales}`;
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje) {
    document.getElementById("message").textContent = mensaje;
}

// Función para inicializar los event listeners
function inicializarEventListeners() {
    torres.forEach(torre => {
        torre.onclick = function() {
            if (!juegoIniciado) {
                mostrarMensaje("Presiona INICIO para comenzar el juego");
                return;
            }
            
            if (selectedTower === null) {
                if (this.lastElementChild) {
                    selectedTower = this;
                    this.style.backgroundColor = 'rgb(183, 107, 255)';
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