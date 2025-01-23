$(document).ready(function () {
    let movimientosTotales = 0;
    let selectedTower = null;
    let juegoIniciado = false;
    let timerInterval;
    let startTime;

    const $torre1 = $("#tower1");
    const $torre2 = $("#tower2");
    const $torre3 = $("#tower3");
    const $torres = $(".tower");

    // Función para iniciar el juego
    function inicio() {
        const nombreUsuario = $('input[type="text"]').val().trim();

        if (nombreUsuario === "") {
            $("#message").text("Por favor, coloque su nombre");
            return;
        }

        clearInterval(timerInterval);
        startTime = new Date();
        timerInterval = setInterval(actualizarTiempo, 1000);

        $("#message").text("");
        $("#timer").text("Tiempo: 00:00");

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
        $("#timer").text(`Tiempo: ${minutosFormateados}:${segundosFormateados}`);
    }

    // Función para detener el juego
    function detener() {
        clearInterval(timerInterval);
        juegoIniciado = false;
    }

    // Función para resetear el juego
    function resetear() {
        clearInterval(timerInterval);
        $("#timer").text("Tiempo: 00:00");
        $("#message").text("");
        resetearTorres();
        localStorage.removeItem("estadoTorres");
        movimientosTotales = 0;
        actualizarContador();
        juegoIniciado = false;
    }

    // Función para resetear las torres
    function resetearTorres() {
        $torre1.empty();
        const discos = [
            { width: 200, alt: "Disco3" },
            { width: 150, alt: "Disco2" },
            { width: 100, alt: "Disco1" }
        ];
        discos.forEach(discoData => {
            $("<img>")
                .attr("src", "./imagenes/Disco.png")
                .attr("alt", discoData.alt)
                .attr("width", discoData.width)
                .attr("height", 50)
                .addClass("disk")
                .appendTo($torre1);
        });

        $torre2.empty();
        $torre3.empty();
        inicializarEventListeners();
    }

    // Función para guardar el estado del juego
    function guardarEstado() {
        const estado = {
            torre1: $torre1.html(),
            torre2: $torre2.html(),
            torre3: $torre3.html(),
            tiempo: $("#timer").text(),
            movimientos: movimientosTotales
        };
        localStorage.setItem("estadoTorres", JSON.stringify(estado));
        $("#message").text("Juego guardado");
    }

    // Función para restaurar el estado del juego
    function restaurarEstado() {
        const estadoGuardado = JSON.parse(localStorage.getItem("estadoTorres"));
        if (estadoGuardado) {
            $torre1.html(estadoGuardado.torre1);
            $torre2.html(estadoGuardado.torre2);
            $torre3.html(estadoGuardado.torre3);
            $("#timer").text(estadoGuardado.tiempo);
            movimientosTotales = estadoGuardado.movimientos;
            actualizarContador();
            inicializarEventListeners();
        }
    }

    // Función para mover un disco
    function moverDisco($torreOrigen, $torreDestino) {
        if (!juegoIniciado) {
            mostrarMensaje("Presiona INICIO para comenzar el juego");
            return;
        }

        const $discoAMover = $torreOrigen.children().last();
        const $discoDestino = $torreDestino.children().last();

        if ($discoAMover.length === 0) {
            mostrarMensaje("No hay disco para mover en esta torre");
            return;
        }

        if ($discoDestino.length > 0 && $discoAMover.width() > $discoDestino.width()) {
            mostrarMensaje("Movimiento inválido: No puedes colocar un disco grande sobre un disco pequeño.");
            return;
        }

        $discoAMover.css("bottom", $torreDestino.children().length * 55);
        $torreDestino.append($discoAMover);
        movimientosTotales++;
        actualizarContador();

        if ($torre3.children().length === 3) {
            mostrarMensaje(`¡Felicidades! Has completado el juego en ${movimientosTotales} movimientos.`);
            detener();
        } else {
            mostrarMensaje("Movimiento válido");
        }
    }

    // Función para actualizar el contador
    function actualizarContador() {
        $("#contadorMovimientos").text(`Movimientos: ${movimientosTotales}`);
    }

    // Función para mostrar mensajes
    function mostrarMensaje(mensaje) {
        $("#message").text(mensaje);
    }

    // Función para inicializar los event listeners
    function inicializarEventListeners() {
        $torres.off("click").on("click", function () {
            if (!juegoIniciado) {
                mostrarMensaje("Presiona INICIO para comenzar el juego");
                return;
            }

            const $this = $(this);

            if (!selectedTower) {
                if ($this.children().length > 0) {
                    selectedTower = $this;
                    $this.css("background-color", "rgb(183, 107, 255)");
                }
            } else {
                moverDisco(selectedTower, $this);
                selectedTower.css("background-color", "");
                selectedTower = null;
            }
        });
    }

    // Event listeners para botones
    $("#startButton").click(inicio);
    $("#stopButton").click(detener);
    $("#resetButton").click(resetear);
    $("#saveButton").click(guardarEstado);
    $("#loadButton").click(restaurarEstado);

    // Inicializar el juego
    resetearTorres();
});
