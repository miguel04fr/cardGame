let nombresj1=document.getElementById("J1");
let nombresj2=document.getElementById("J2");
let nombresj3=document.getElementById("J3");
document.getElementById('imgCartaRobada').src = 'img/deck/deck.png';
let pilaDescartes = [];
document.getElementById("btnPasar").disabled = true;

// clase para las cartas
class Carta {
    constructor(tipo, puntuacion, src) {
        this.tipo = tipo;  // tipo de carta
        this.puntuacion = puntuacion;  // puntos de la carta
        this.src = src;  // imagen de la carta
    }
}

// clase para los jugadores
class Jugador {
    constructor(nombre) {
        this.nombre = nombre;  // nombre del jugador
        this.cartas = [];  // cartas del jugador
        this.eliminados = false;  // si está eliminado o no
        this.turno = false;  // si es su turno o no
    }

    // añade carta a la mano
    añadirCarta(carta) {
        this.cartas.push(carta);
    }

    // cuenta cuántas cartas tiene
    contarCartas() {
        return this.cartas.length;
    }

    // suma los puntos de todas las cartas
    sumarPuntos() {
        let total = 0;
        for (let i = 0; i < this.cartas.length; i++) {
            total += this.cartas[i].puntuacion;
        }
        return total;
    }

    // cuenta cartas de saltoTurno
    contarCartasSaltoTurno() {
        let contador = 0;
        for (let i = 0; i < this.cartas.length; i++) {
            if (this.cartas[i].tipo === "saltoTurno") {
                contador++;
            }
        }
        return contador;
    }

    // cuenta cartas de desactivacion
    contarCartasDesactivacion() {
        let contador = 0;
        for (let i = 0; i < this.cartas.length; i++) {
            if (this.cartas[i].tipo === "desactivacion") {
                contador++;
            }
        }
        return contador;
    }
}

// clase para el mazo
class Deck {
    constructor() {
        this.cartas = [];  // lista de cartas en el mazo
        this.generarBaraja();  // crea la baraja
    }

    // genera las cartas del mazo
    generarBaraja() {
        // añadir 6 bombas
        for (let i = 0; i < 6; i++) {
            this.cartas.push(new Carta("bomba", 0, "./img/bomba/bomba.png"));
        }

        // añadir 6 desactivaciones
        for (let i = 0; i < 6; i++) {
            this.cartas.push(new Carta("desactivacion", 0, "./img/herramienta/herramienta.png"));
        }

        // añadir 10 saltos de turno
        for (let i = 0; i < 10; i++) {
            this.cartas.push(new Carta("saltoTurno", 0, "./img/pasarTurno/pasarTurno.png"));
        }

        // añadir 33 cartas de puntos con valor aleatorio
        for (let i = 0; i < 33; i++) {
            this.cartas.push(new Carta("puntos", generarPuntosAleatorios(), getRandomPathImg()));
        }

        // mezclar el mazo
        this.shuffle(this.cartas);
    }

    // mezcla las cartas
    shuffle(cartas) {
        for (let i = cartas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cartas[i], cartas[j]] = [cartas[j], cartas[i]];  // intercambio de cartas
        }
    }

    // roba una carta del mazo
    robarCarta() {
        return this.cartas.pop();
    }
}

// obtiene la ruta de la imagen de manera aleatoria
function getRandomPathImg() {
    let random = Math.floor(Math.random() * 20) + 1;
    return random < 10 ? `./img/card/robot_0${random}.png` : `./img/card/robot_${random}.png`;
}

// genera puntos aleatorios para las cartas de puntos
function generarPuntosAleatorios() {
    return Math.floor(Math.random() * 10) + 1;  // número entre 1 y 10
}

// inicialización del juego
let deck = new Deck(); // crea el mazo
let jugadores = [
    new Jugador("Jugador 1"),  // jugador 1
    new Jugador("Jugador 2"),  // jugador 2
    new Jugador("Jugador 3")   // jugador 3
];
let turnoActual = 0;  // empieza el jugador 1

// actualiza la información en la pantalla de una ia
function actualizarInterfaz() {
    jugadores.forEach((jugador, index) => {
            //index vale 0 en la funcion por tanto haciendolo asi no tiene que poner a mano j1 o j2 o j3 ya que se van incrementando de 1 en 1
    //y pilla el id y le asigna un nuevo contenido con el textContent
        document.getElementById(`J${index + 1}NumCartas`).textContent = `⚪️ Número de cartas: ${jugador.contarCartas()}`;
        document.getElementById(`J${index + 1}Puntos`).textContent = `⚪️ Puntos totales: ${jugador.sumarPuntos()}`;
        document.getElementById(`J${index + 1}saltoTurno`).textContent = `⚪️ Cartas salto turno: ${jugador.contarCartasSaltoTurno()}`;
        document.getElementById(`J${index + 1}Desactivacion`).textContent = `⚪️ Cartas desactivación: ${jugador.contarCartasDesactivacion()}`;
    });

    let jugadorActual = jugadores[turnoActual];

    // Activar/desactivar el botón "Pasar turno" basado en si el jugador tiene cartas de salto de turno
    if (jugadores[turnoActual].contarCartasSaltoTurno() > 0) {
        document.getElementById("btnPasar").disabled = false;
    } else if (jugadorActual.contarCartasSaltoTurno() === 0) {  
        console.log(`Turno actual: ${jugadores[turnoActual].nombre}`);
        document.getElementById("btnPasar").disabled = true;
        }
}

// cambia el dom de la pila de descates
function actualizarPilaDescartes() {
    const listaDescarte = document.getElementById("listaDescarte");
    listaDescarte.innerHTML = '';  
    pilaDescartes.forEach(carta => {
        let li = document.createElement('li');
        li.textContent = `${carta.tipo} (Puntos: ${carta.puntuacion})`;  
        listaDescarte.appendChild(li);
    });
}
function comprobarGanador() {
    const jugadoresNoEliminados = jugadores.filter(jugador => !jugador.eliminados);

    // si hay un jugador el gana
    if (jugadoresNoEliminados.length === 1) {
        let ganador = jugadoresNoEliminados[0];
        alert(`¡${ganador.nombre} ha ganado el juego con ${ganador.sumarPuntos()} puntos!`);
        console.log(`¡${ganador.nombre} ha ganado el juego con ${ganador.sumarPuntos()} puntos!`);
        return true;  // El juego ha terminado
    }
    return false;  // El juego sigue
}

// roobar carts y pasar el turno
function robarCartaJugador() {
    let jugador = jugadores[turnoActual];  // el jugador que roba

    // Si el jugador actual está eliminado, pasa el turno automáticamente
    while (jugador.eliminados) {
        turnoActual += 1;

        if (turnoActual >= jugadores.length) {
            turnoActual = 0;
        } // ciclo al siguiente jugador
        jugador = jugadores[turnoActual];  // actualizamos el jugador
    }

    // Si no hay cartas en el mazo
    if (deck.cartas.length === 0) {
        alert("No hay cartas en el mazo");

        // Obtenemos el jugador con más puntos
        let ganador = jugadores.reduce((maxJugador, jugador) => {
            return (jugador.sumarPuntos() > maxJugador.sumarPuntos()) ? jugador : maxJugador;
        }, jugadores[0]);

        // Mostramos el resultado
        console.log(`El ganador es ${ganador.nombre} con ${ganador.sumarPuntos()} puntos.`);
        alert(`El ganador es ${ganador.nombre} con ${ganador.sumarPuntos()} puntos.`);

        return;  // Termina el juego si no hay cartas
    }

    let cartaRobada = deck.robarCarta();  // roba una carta
    jugador.añadirCarta(cartaRobada);  // se añade la carta a su mano
    console.log(jugador);

    // mostrar la carta robada en pantalla
    document.getElementById('imgCartaRobada').src = cartaRobada.src;

    // comprobar si es una bomba la carta
    if (cartaRobada.tipo === "bomba") {
        if (jugador.contarCartasDesactivacion() > 0) {
            alert(`${jugador.nombre} ha usado una carta de desactivación para evitar la bomba.`);
            let cartaEliminada = false;

            // elimina una carta de desactivación
            for (let i = 0; i < jugador.cartas.length; i++) {
                if (jugador.cartas[i].tipo === "desactivacion" && !cartaEliminada) {
                    jugador.cartas.splice(i, 1);  // elimina la carta
                    cartaEliminada = true;
                }
            }
        } else {
            alert(`${jugador.nombre} ha sido eliminado por una bomba.`);
            jugador.eliminados = true;

            // Mover todas las cartas del jugador eliminado a la pila de descartes
            pilaDescartes = pilaDescartes.concat(jugador.cartas);
            jugador.cartas = [];  // Vaciar las cartas del jugador eliminado

            // Actualizar la pila de descartes en el DOM
            actualizarPilaDescartes();

            // Cambiar el estilo en el DOM para reflejar que el jugador ha sido eliminado
            document.getElementById(`J${turnoActual + 1}`).textContent = "ELIMINADO";
            document.getElementById(`J${turnoActual + 1}`).style.color = "red";
        }
    }

    // actualiza la interfaz
    actualizarInterfaz();

    // Comprobar si ya tenemos un ganador
    if (comprobarGanador()) {
        return;  // Termina el juego si hay un ganador
    }

    // si el jugador fue eliminado, pasamos al siguiente turno
    if (jugador.eliminados) {
        turnoActual += 1;

        if (turnoActual >= jugadores.length) {
            turnoActual = 0;
        }
    }

    // pasa el turno al siguiente jugador que no esté eliminado
    do {
        turnoActual += 1;

        if (turnoActual >= jugadores.length) {
            turnoActual = 0;
        }
    } while (jugadores[turnoActual].eliminados);

    console.log(`Turno actual: ${turnoActual}`);
}

function pasarTurno() {
    let jugador = jugadores[turnoActual];

    if (jugador.contarCartasSaltoTurno() > 0) {
        // Resta una carta de salto de turno
        jugador.cartas = jugador.cartas.filter(carta => carta.tipo !== "saltoTurno" || (carta.tipo === "saltoTurno" && --jugador.cartas.length < 1));

        // Pasa el turno al siguiente jugador no eliminado
        do {
            turnoActual += 1;

            if (turnoActual >= jugadores.length) {
                turnoActual = 0;
            }
        } while (jugadores[turnoActual].eliminados);

        actualizarInterfaz();

        // Verifica si solo queda un jugador no eliminado
        if (jugadoresActivos() === 1) {
            let ganador = jugadores.find(jugador => !jugador.eliminados);
            alert(`El juego ha terminado. El ganador es ${ganador.nombre}.`);
           
            return; // Termina el juego
        }
    } else {
        alert("No tienes cartas de salto de turno.");
    }
}
function jugadoresActivos() {
    return jugadores.filter(jugador => !jugador.eliminados).length;
}
function comprobarGanador() {
    const jugadoresNoEliminados = jugadores.filter(jugador => !jugador.eliminados);

    // si solo hay un jugador no eliminado, él gana
    if (jugadoresNoEliminados.length === 1) {
        let ganador = jugadoresNoEliminados[0];
        alert(`¡${ganador.nombre} ha ganado el juego con ${ganador.sumarPuntos()} puntos!`);
       

        // Cambiar el botón de robar por uno de reiniciar
        const btnRobar = document.getElementById("btnRobar");
        btnRobar.textContent = "Reiniciar partida";  
        btnRobar.removeEventListener("click", robarCartaJugador);  
        btnRobar.addEventListener("click", reiniciarJuego);      

        return true;  // El juego ha terminado
    }
    return false;  // El juego sigue
}

function reiniciarJuego() {
    // reinicia el mazo
    deck = new Deck(); 

    // Reiniciar jugadores
    jugadores.forEach((jugador, index) => {
        jugador.cartas = [];  
        jugador.eliminados = false; 
        jugador.turno = false;      

        // reiniciar el DOM y los colores
        document.getElementById(`J${index + 1}`).textContent = `Jugador ${index + 1}`;
        document.getElementById(`J${index + 1}`).style.color = "white";  
    });

    pilaDescartes = [];
    actualizarPilaDescartes();  

    turnoActual = 0;
    actualizarInterfaz();

  
    let btnRobar = document.getElementById("btnRobar");
    btnRobar.textContent = "Robar carta"; 
    btnRobar.removeEventListener("click", reiniciarJuego); 
    btnRobar.addEventListener("click", robarCartaJugador);  

    
    alert("otro comienzo de partida");
}
function pasarTurnoConCarta() {
    let jugadorActual = jugadores[turnoActual];

    if (jugadorActual.contarCartasSaltoTurno() > 0) {
        for (let i = 0; i < jugadorActual.cartas.length; i++) {
            if (jugadorActual.cartas[i].tipo === "saltoTurno") {
                jugadorActual.cartas.splice(i, 1);
                break;
            }
        }

        do {
            turnoActual += 1;
            if (turnoActual >= jugadores.length) {
                turnoActual = 0;
            }
        } while (jugadores[turnoActual].eliminados);

        actualizarInterfaz();
        console.log(`Turno actual: ${jugadores[turnoActual].nombre}`);
    } else {
        alert("No tienes cartas de salto de turno.");
    }
}


// click y te manda al robar carta
document.getElementById("btnRobar").addEventListener("click", robarCartaJugador);
// click y te manda al pasar el turno
document.getElementById("btnPasar").addEventListener("click", pasarTurnoConCarta);
