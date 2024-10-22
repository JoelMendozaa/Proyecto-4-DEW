function Torre (discos, origen, destino, auxiliar, resultado){
    this.discos = discos;
    this.origen = origen;
    this.destino = destino;
    this.auxiliar = auxiliar;
    this.resultado = resultado;
}

const torre1 = new Torre ();
const torre2 = new Torre ();
const torre3 = new Torre ();

let timerInterval;
let startTime;

// Funcion del botón de inicio
function inicio(){
    
    // Reseteamos el temporizador anterior
    clearInterval(timerInterval);

    startTime = new Date();

    timerInterval = setInterval(actualizarTiempo, 1000);

    document.getElementById("message").textContent = "";
    document.getElementById("timer").textContent = "Tiempo: 00:00";
}

// Función para actualizar el temporizador
function actualizarTiempo() {
    const ahora = new Date();
    const tiempoTranscurrido = Math.floor((ahora - startTime) / 1000); // Diferencia en segundos

    const minutos = Math.floor(tiempoTranscurrido / 60);
    const segundos = tiempoTranscurrido % 60;

    // Formatear los números para que siempre tengan dos dígitos
    const minutosFormateados = minutos.toString().padStart(2, '0');
    const segundosFormateados = segundos.toString().padStart(2, '0');

    document.getElementById("timer").textContent = `Tiempo: ${minutosFormateados}:${segundosFormateados}`;
}
// Llama a la función inicio cuando se hace clic en el botón "INICIO"
document.getElementById("startButton").addEventListener("click", inicio);

// Funcion de detener
function detener(){
    // Detenemos el temportizador
    clearInterval(timerInterval);
}

// Llama a la función detener cuando se hace clic en el botón "DETENER"
document.getElementById("stopButton").addEventListener("click", detener);

//Funcion de resetear temporizador y torre

function resetear(){

     clearInterval(timerInterval);

     // Reiniciamos el tiempo en pantalla
     document.getElementById("timer").textContent = "Tiempo: 00:00";
     
     // Limpiamos cualquier mensaje
     document.getElementById("message").textContent = "";
 
     // Reiniciar las torres (volvemos los discos a la torre1)
     resetearTorres();
}

// Funcion de resetear las torres
function resetearTorres() {
    const torre1 = document.getElementById("tower1");
    const torre2 = document.getElementById("tower2");
    const torre3 = document.getElementById("tower3");

    // Vaciar las torres
    torre1.innerHTML = '';
    torre2.innerHTML = '';
    torre3.innerHTML = '';

    // Volver a poner los discos en la torre1
    torre1.innerHTML = `
        <img src="./imagenes/Disco.png" alt="Disco3" width="100" height="50" class="image">
        <img src="./imagenes/Disco.png" alt="Disco2" width="150" height="75" class="image">
        <img src="./imagenes/Disco.png" alt="Disco1" width="200" height="100" class="image">
    `;
}


// Llama a la función resetear cuando se hace clic en el botón "RESTAURAR"
document.getElementById("loadButton").addEventListener("click", resetear);