import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

/* CONFIGURACIÓN FIREBASE */
const firebaseConfig = {
  apiKey: "AIzaSyB64ca3R2QZkonqGuuywrHTQm9KertiSnA",
  authDomain: "testinggame-4c6aa.firebaseapp.com",
  databaseURL: "https://testinggame-4c6aa-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "testinggame-4c6aa",
  storageBucket: "testinggame-4c6aa.firebasestorage.app",
  messagingSenderId: "1035410640464",
  appId: "1:1035410640464:web:a7e8ac6e7b0b03d8e08b55",
  measurementId: "G-FGPWCZR732"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* VIVIENDAS DE PRUEBA */
const casas = [
  {
    titulo: "Piso luminoso en Madrid",
    ciudad: "Madrid",
    zona: "Chamberí",
    metros: 82,
    habitaciones: 3,
    banos: 2,
    planta: "4ª planta",
    extras: "Ascensor, exterior, reformado",
    precio: 529000
  },
  {
    titulo: "Apartamento cerca de la playa",
    ciudad: "Valencia",
    zona: "Malvarrosa",
    metros: 64,
    habitaciones: 2,
    banos: 1,
    planta: "2ª planta",
    extras: "Terraza, luminoso, cerca del mar",
    precio: 245000
  },
  {
    titulo: "Casa familiar con jardín",
    ciudad: "Sevilla",
    zona: "Nervión",
    metros: 145,
    habitaciones: 4,
    banos: 3,
    planta: "Casa independiente",
    extras: "Jardín, garaje, aire acondicionado",
    precio: 438000
  },
  {
    titulo: "Estudio céntrico reformado",
    ciudad: "Barcelona",
    zona: "Gràcia",
    metros: 42,
    habitaciones: 1,
    banos: 1,
    planta: "1ª planta",
    extras: "Reformado, balcón, buena ubicación",
    precio: 289000
  },
  {
    titulo: "Ático con terraza",
    ciudad: "Málaga",
    zona: "Centro Histórico",
    metros: 96,
    habitaciones: 3,
    banos: 2,
    planta: "Ático",
    extras: "Terraza grande, ascensor, vistas",
    precio: 510000
  }
];

/* ESTADO LOCAL */
let codigoActual = "";
let jugadorId = localStorage.getItem("jugadorId");

if (!jugadorId) {
  jugadorId = crypto.randomUUID();
  localStorage.setItem("jugadorId", jugadorId);
}

let soyHost = false;
let datosPartida = null;

/* ELEMENTOS */
const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaSala = document.getElementById("pantalla-sala");
const pantallaJuego = document.getElementById("pantalla-juego");
const pantallaResultados = document.getElementById("pantalla-resultados");
const pantallaRanking = document.getElementById("pantalla-ranking");

const nombreJugador = document.getElementById("nombreJugador");
const codigoPartida = document.getElementById("codigoPartida");

const btnCrearPartida = document.getElementById("btnCrearPartida");
const btnUnirsePartida = document.getElementById("btnUnirsePartida");
const btnEmpezarPartida = document.getElementById("btnEmpezarPartida");
const btnEnviarApuesta = document.getElementById("btnEnviarApuesta");
const btnRevelarPrecio = document.getElementById("btnRevelarPrecio");
const btnSiguienteRonda = document.getElementById("btnSiguienteRonda");

const codigoSala = document.getElementById("codigoSala");
const listaJugadores = document.getElementById("listaJugadores");
const textoRonda = document.getElementById("textoRonda");
const estadoPartida = document.getElementById("estadoPartida");
const casaActual = document.getElementById("casaActual");
const inputApuesta = document.getElementById("inputApuesta");
const zonaApuesta = document.getElementById("zonaApuesta");
const zonaEspera = document.getElementById("zonaEspera");
const zonaHost = document.getElementById("zonaHost");
const resultadoRonda = document.getElementById("resultadoRonda");
const ranking = document.getElementById("ranking");

/* UTILIDADES */
function mostrar(elemento) {
  elemento.classList.remove("oculto");
}

function ocultar(elemento) {
  elemento.classList.add("oculto");
}

function generarCodigo() {
  return "CASA" + Math.floor(100 + Math.random() * 900);
}

function formatoEuros(numero) {
  return Number(numero).toLocaleString("es-ES") + " €";
}

function partidaRef() {
  return ref(db, "partidas/" + codigoActual);
}

function jugadorRef() {
  return ref(db, "partidas/" + codigoActual + "/jugadores/" + jugadorId);
}

function apuestaRef(ronda) {
  return ref(db, "partidas/" + codigoActual + "/apuestas/" + ronda + "/" + jugadorId);
}

function normalizarCodigo(codigo) {
  return codigo.trim().toUpperCase().replace(/\s/g, "");
}

function validarNombre() {
  const nombre = nombreJugador.value.trim();

  if (!nombre) {
    alert("Escribe tu nombre.");
    return null;
  }

  return nombre;
}

/* CREAR PARTIDA */
btnCrearPartida.addEventListener("click", async () => {
  const nombre = validarNombre();
  if (!nombre) return;

  codigoActual = normalizarCodigo(codigoPartida.value) || generarCodigo();
  soyHost = true;

  const nuevaPartida = {
    estado: "esperando",
    rondaActual: 0,
    revelado: false,
    creada: Date.now(),
    hostId: jugadorId,
    jugadores: {
      [jugadorId]: {
        nombre,
        puntos: 0,
        host: true
      }
    },
    apuestas: {}
  };

  await set(partidaRef(), nuevaPartida);
  entrarEnPartida();
});

/* UNIRSE A PARTIDA */
btnUnirsePartida.addEventListener("click", async () => {
  const nombre = validarNombre();
  if (!nombre) return;

  codigoActual = normalizarCodigo(codigoPartida.value);

  if (!codigoActual) {
    alert("Escribe el código de partida.");
    return;
  }

  const snap = await get(partidaRef());

  if (!snap.exists()) {
    alert("No existe esa partida.");
    return;
  }

  const partida = snap.val();

  soyHost = partida.hostId === jugadorId;

  await set(jugadorRef(), {
    nombre,
    puntos: partida.jugadores?.[jugadorId]?.puntos || 0,
    host: soyHost
  });

  entrarEnPartida();
});

/* ENTRAR Y ESCUCHAR CAMBIOS */
function entrarEnPartida() {
  ocultar(pantallaInicio);
  mostrar(pantallaSala);
  mostrar(pantallaRanking);

  codigoSala.textContent = codigoActual;

  onValue(partidaRef(), (snap) => {
    datosPartida = snap.val();

    if (!datosPartida) {
      alert("La partida ya no existe.");
      location.reload();
      return;
    }

    soyHost = datosPartida.hostId === jugadorId;

    pintarSala();
    pintarRanking();

    if (datosPartida.estado === "esperando") {
      mostrar(pantallaSala);
      ocultar(pantallaJuego);
      ocultar(pantallaResultados);
    }

    if (datosPartida.estado === "jugando") {
      ocultar(pantallaSala);
      mostrar(pantallaJuego);
      pintarJuego();
    }

    if (datosPartida.estado === "terminada") {
      ocultar(pantallaSala);
      ocultar(pantallaJuego);
      mostrar(pantallaResultados);
      resultadoRonda.innerHTML = "<p>Partida terminada.</p>";
    }
  });
}

/* SALA */
function pintarSala() {
  const jugadores = datosPartida.jugadores || {};

  listaJugadores.innerHTML = "";

  Object.values(jugadores).forEach((j) => {
    const li = document.createElement("li");
    li.textContent = j.nombre + (j.host ? " 👑" : "");
    listaJugadores.appendChild(li);
  });

  if (soyHost) {
    mostrar(btnEmpezarPartida);
  } else {
    ocultar(btnEmpezarPartida);
  }
}

btnEmpezarPartida.addEventListener("click", async () => {
  await update(partidaRef(), {
    estado: "jugando",
    rondaActual: 0,
    revelado: false
  });
});

/* JUEGO */
function pintarJuego() {
  const ronda = datosPartida.rondaActual;
  const casa = casas[ronda];

  if (!casa) {
    update(partidaRef(), {
      estado: "terminada"
    });
    return;
  }

  textoRonda.textContent = "Ronda " + (ronda + 1) + " de " + casas.length;
  estadoPartida.textContent = datosPartida.revelado ? "Precio revelado" : "Adivinando";

  casaActual.innerHTML = `
    <h2>${casa.titulo}</h2>
    <div class="dato"><strong>Ciudad</strong><span>${casa.ciudad}</span></div>
    <div class="dato"><strong>Zona</strong><span>${casa.zona}</span></div>
    <div class="dato"><strong>Metros</strong><span>${casa.metros} m²</span></div>
    <div class="dato"><strong>Habitaciones</strong><span>${casa.habitaciones}</span></div>
    <div class="dato"><strong>Baños</strong><span>${casa.banos}</span></div>
    <div class="dato"><strong>Planta</strong><span>${casa.planta}</span></div>
    <div class="dato"><strong>Extras</strong><span>${casa.extras}</span></div>
  `;

  const apuestasRonda = datosPartida.apuestas?.[ronda] || {};
  const yaAposto = apuestasRonda[jugadorId];

  if (datosPartida.revelado) {
    ocultar(zonaApuesta);
    ocultar(zonaEspera);
    pintarResultados();
  } else {
    ocultar(pantallaResultados);

    if (yaAposto) {
      ocultar(zonaApuesta);
      mostrar(zonaEspera);
    } else {
      mostrar(zonaApuesta);
      ocultar(zonaEspera);
      inputApuesta.value = "";
    }
  }

  if (soyHost) {
    mostrar(zonaHost);

    if (datosPartida.revelado) {
      ocultar(btnRevelarPrecio);
      mostrar(btnSiguienteRonda);
    } else {
      mostrar(btnRevelarPrecio);
      ocultar(btnSiguienteRonda);
    }
  } else {
    ocultar(zonaHost);
  }
}

btnEnviarApuesta.addEventListener("click", async () => {
  const ronda = datosPartida.rondaActual;
  const apuesta = Number(inputApuesta.value);

  if (!apuesta || apuesta <= 0) {
    alert("Escribe un precio válido.");
    return;
  }

  await set(apuestaRef(ronda), apuesta);
});

/* REVELAR Y PUNTUAR */
btnRevelarPrecio.addEventListener("click", async () => {
  if (!soyHost) return;

  const ronda = datosPartida.rondaActual;
  const jugadores = datosPartida.jugadores || {};
  const apuestasRonda = datosPartida.apuestas?.[ronda] || {};
  const casa = casas[ronda];

  const resultados = Object.entries(jugadores)
    .map(([id, jugador]) => {
      const apuesta = apuestasRonda[id];

      if (!apuesta) {
        return {
          id,
          nombre: jugador.nombre,
          apuesta: null,
          diferencia: null,
          puntosGanados: 0
        };
      }

      return {
        id,
        nombre: jugador.nombre,
        apuesta,
        diferencia: Math.abs(apuesta - casa.precio),
        puntosGanados: 0
      };
    })
    .sort((a, b) => {
      if (a.diferencia === null) return 1;
      if (b.diferencia === null) return -1;
      return a.diferencia - b.diferencia;
    });

  const puntosPorPuesto = [10, 7, 4];

  resultados.forEach((r, index) => {
    if (r.apuesta !== null) {
      r.puntosGanados = puntosPorPuesto[index] || 1;

      if (r.apuesta === casa.precio) {
        r.puntosGanados += 5;
      }
    }
  });

  const updates = {
    revelado: true,
    ["resultados/" + ronda]: resultados
  };

  resultados.forEach((r) => {
    const puntosActuales = jugadores[r.id]?.puntos || 0;
    updates["jugadores/" + r.id + "/puntos"] = puntosActuales + r.puntosGanados;
  });

  await update(partidaRef(), updates);
});

function pintarResultados() {
  const ronda = datosPartida.rondaActual;
  const casa = casas[ronda];
  const resultados = datosPartida.resultados?.[ronda] || [];

  mostrar(pantallaResultados);

  let html = `
    <div class="precio-real">${formatoEuros(casa.precio)}</div>
  `;

  resultados.forEach((r, index) => {
    html += `
      <div class="apuesta">
        <strong>${index + 1}. ${r.nombre}</strong><br>
        Apuesta: ${r.apuesta ? formatoEuros(r.apuesta) : "Sin apuesta"}<br>
        Diferencia: ${r.diferencia !== null ? formatoEuros(r.diferencia) : "-"}<br>
        Puntos: +${r.puntosGanados}
      </div>
    `;
  });

  resultadoRonda.innerHTML = html;
}

/* SIGUIENTE RONDA */
btnSiguienteRonda.addEventListener("click", async () => {
  if (!soyHost) return;

  const siguiente = datosPartida.rondaActual + 1;

  if (siguiente >= casas.length) {
    await update(partidaRef(), {
      estado: "terminada"
    });
  } else {
    await update(partidaRef(), {
      rondaActual: siguiente,
      revelado: false
    });
  }
});

/* RANKING */
function pintarRanking() {
  const jugadores = datosPartida.jugadores || {};

  const ordenados = Object.values(jugadores)
    .sort((a, b) => (b.puntos || 0) - (a.puntos || 0));

  ranking.innerHTML = "";

  ordenados.forEach((j) => {
    const li = document.createElement("li");
    li.textContent = `${j.nombre}: ${j.puntos || 0} puntos`;
    ranking.appendChild(li);
  });
}