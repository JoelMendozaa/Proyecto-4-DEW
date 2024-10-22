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


function resetear() {
    clearInterval(timerInterval); // Detenemos el temporizador
    document.getElementById("timer").textContent = "Tiempo: 00:00"; // Reiniciamos el tiempo en pantalla
    document.getElementById("message").textContent = ""; // Limpiamos cualquier mensaje
    resetearTorres(); // Reiniciamos las torres
    localStorage.clear(); // Limpiamos el localStorage
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
document.getElementById("resetButton").addEventListener("click", resetear);


// Llama a la función resetear cuando se hace clic en el botón "RESTAURAR"
document.getElementById("loadButton").addEventListener("click", resetear);


function guardar(){
    const torre1 = Array.from(document.getElementById("tower1").children).map(img => img.alt);
    const torre2 = Array.from(document.getElementById("tower2").children).map(img => img.alt);
    const torre3 = Array.from(document.getElementById("tower3").children).map(img => img.alt);
    
    const tiempo = document.getElementById("timer").textContent;

    const estado = {
        torre1,
        torre2,
        torre3,
        tiempo
    };

    localStorage.setItem("estadoTorres", JSON.stringify(estado));

}
// Llama a la funcion guardar cuando se hace clic en el botón de "GUARDAR"
document.getElementById("saveButton").addEventListener("click", guardarEstado);


function restaurarEstado() {
    const estadoGuardado = JSON.parse(localStorage.getItem("estadoTorres"));

    if (estadoGuardado) {
        document.getElementById("timer").textContent = estadoGuardado.tiempo;

        const torre1 = document.getElementById("tower1");
        const torre2 = document.getElementById("tower2");
        const torre3 = document.getElementById("tower3");

        torre1.innerHTML = '';
        torre2.innerHTML = '';
        torre3.innerHTML = '';

        estadoGuardado.torre1.forEach(disco => {
            torre1.innerHTML += `<img src="/imagenes/Disco.png" alt="${disco}" width="${disco === 'Disco1' ? 200 : disco === 'Disco2' ? 150 : 100}" height="${disco === 'Disco1' ? 100 : disco === 'Disco2' ? 75 : 50}" class="image">`;
        });
        estadoGuardado.torre2.forEach(disco => {
            torre2.innerHTML += `<img src="/imagenes/Disco.png" alt="${disco}" width="${disco === 'Disco1' ? 200 : disco === 'Disco2' ? 150 : 100}" height="${disco === 'Disco1' ? 100 : disco === 'Disco2' ? 75 : 50}" class="image">`;
        });
        estadoGuardado.torre3.forEach(disco => {
            torre3.innerHTML += `<img src="/imagenes/Disco.png" alt="${disco}" width="${disco === 'Disco1' ? 200 : disco === 'Disco2' ? 150 : 100}" height="${disco === 'Disco1' ? 100 : disco === 'Disco2' ? 75 : 50}" class="image">`;
        });
    }
}
// Llama a la funcion restaurar cuando se hace clic en el boton de "RESTAURAR"
document.getElementById("loadButton").addEventListener("click", restaurarEstado);
