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

/* VIVIENDAS DE PRUEBA - FICTICIAS, INSPIRADAS EN ZONA SUR DE MADRID */
const casas = [
  {
    titulo: "Piso reformado junto a Renfe",
    ciudad: "Getafe",
    zona: "Centro",
    metros: 78,
    habitaciones: 3,
    banos: 1,
    planta: "3ª planta",
    extras: "Ascensor, exterior, cocina reformada",
    precio: 238000
  },
  {
    titulo: "Ático con terraza amplia",
    ciudad: "Leganés",
    zona: "Zarzaquemada",
    metros: 92,
    habitaciones: 3,
    banos: 2,
    planta: "Ático",
    extras: "Terraza, garaje, trastero",
    precio: 319000
  },
  {
    titulo: "Piso familiar cerca del metro",
    ciudad: "Alcorcón",
    zona: "Parque Lisboa",
    metros: 88,
    habitaciones: 3,
    banos: 2,
    planta: "5ª planta",
    extras: "Ascensor, calefacción central, exterior",
    precio: 275000
  },
  {
    titulo: "Vivienda luminosa con balcón",
    ciudad: "Móstoles",
    zona: "Pradillo",
    metros: 81,
    habitaciones: 3,
    banos: 1,
    planta: "4ª planta",
    extras: "Balcón, ascensor, buena comunicación",
    precio: 229000
  },
  {
    titulo: "Piso amplio en avenida principal",
    ciudad: "Fuenlabrada",
    zona: "Centro-Arroyo",
    metros: 97,
    habitaciones: 4,
    banos: 2,
    planta: "2ª planta",
    extras: "Exterior, terraza cerrada, ascensor",
    precio: 252000
  },
  {
    titulo: "Chalet adosado con patio",
    ciudad: "Pinto",
    zona: "La Tenería",
    metros: 168,
    habitaciones: 4,
    banos: 3,
    planta: "Chalet adosado",
    extras: "Patio, garaje, buhardilla",
    precio: 435000
  },
  {
    titulo: "Piso económico para entrar a vivir",
    ciudad: "Parla",
    zona: "Reyes",
    metros: 72,
    habitaciones: 3,
    banos: 1,
    planta: "1ª planta",
    extras: "Reformado, exterior, cerca de comercios",
    precio: 154000
  },
  {
    titulo: "Dúplex moderno con garaje",
    ciudad: "Valdemoro",
    zona: "Hospital",
    metros: 118,
    habitaciones: 3,
    banos: 2,
    planta: "Dúplex",
    extras: "Garaje, piscina comunitaria, trastero",
    precio: 286000
  },
  {
    titulo: "Piso con vistas despejadas",
    ciudad: "Getafe",
    zona: "El Bercial",
    metros: 95,
    habitaciones: 3,
    banos: 2,
    planta: "7ª planta",
    extras: "Urbanización, garaje, piscina",
    precio: 342000
  },
  {
    titulo: "Apartamento coqueto reformado",
    ciudad: "Leganés",
    zona: "San Nicasio",
    metros: 56,
    habitaciones: 2,
    banos: 1,
    planta: "Bajo",
    extras: "Patio, reforma reciente, metro cercano",
    precio: 187000
  },
  {
    titulo: "Piso exterior con terraza",
    ciudad: "Alcorcón",
    zona: "San José de Valderas",
    metros: 84,
    habitaciones: 3,
    banos: 1,
    planta: "6ª planta",
    extras: "Terraza, ascensor, orientación sur",
    precio: 244000
  },
  {
    titulo: "Casa baja con mucho potencial",
    ciudad: "Móstoles",
    zona: "Centro",
    metros: 110,
    habitaciones: 3,
    banos: 1,
    planta: "Casa baja",
    extras: "Patio, posibilidad de reforma, sin comunidad",
    precio: 268000
  },
  {
    titulo: "Piso seminuevo en urbanización",
    ciudad: "Fuenlabrada",
    zona: "Loranca",
    metros: 89,
    habitaciones: 3,
    banos: 2,
    planta: "3ª planta",
    extras: "Piscina, garaje, zonas verdes",
    precio: 265000
  },
  {
    titulo: "Chalet pareado con jardín",
    ciudad: "Aranjuez",
    zona: "La Montaña",
    metros: 184,
    habitaciones: 5,
    banos: 3,
    planta: "Chalet pareado",
    extras: "Jardín, garaje doble, terraza",
    precio: 398000
  },
  {
    titulo: "Piso junto a estación",
    ciudad: "Pinto",
    zona: "Centro",
    metros: 76,
    habitaciones: 3,
    banos: 1,
    planta: "2ª planta",
    extras: "Ascensor, balcón, cerca de Renfe",
    precio: 218000
  },
  {
    titulo: "Vivienda con reforma integral",
    ciudad: "Parla",
    zona: "Fuentebella",
    metros: 83,
    habitaciones: 3,
    banos: 2,
    planta: "4ª planta",
    extras: "Reformado, aire acondicionado, ascensor",
    precio: 181000
  },
  {
    titulo: "Piso moderno con piscina",
    ciudad: "Valdemoro",
    zona: "El Restón",
    metros: 101,
    habitaciones: 3,
    banos: 2,
    planta: "1ª planta",
    extras: "Piscina, garaje, trastero",
    precio: 298000
  },
  {
    titulo: "Piso amplio junto a universidad",
    ciudad: "Getafe",
    zona: "Juan de la Cierva",
    metros: 90,
    habitaciones: 4,
    banos: 2,
    planta: "4ª planta",
    extras: "Ascensor, exterior, buena rentabilidad",
    precio: 255000
  },
  {
    titulo: "Bajo con patio privado",
    ciudad: "Leganés",
    zona: "El Carrascal",
    metros: 74,
    habitaciones: 2,
    banos: 1,
    planta: "Bajo",
    extras: "Patio, urbanización, calefacción",
    precio: 229000
  },
  {
    titulo: "Piso alto muy luminoso",
    ciudad: "Alcorcón",
    zona: "Ensanche Sur",
    metros: 102,
    habitaciones: 3,
    banos: 2,
    planta: "8ª planta",
    extras: "Garaje, trastero, urbanización moderna",
    precio: 329000
  },
  {
    titulo: "Vivienda lista para entrar",
    ciudad: "Móstoles",
    zona: "El Soto",
    metros: 79,
    habitaciones: 3,
    banos: 1,
    planta: "3ª planta",
    extras: "Reformado, ascensor, zona tranquila",
    precio: 236000
  },
  {
    titulo: "Piso familiar con dos terrazas",
    ciudad: "Fuenlabrada",
    zona: "El Naranjo",
    metros: 106,
    habitaciones: 4,
    banos: 2,
    planta: "5ª planta",
    extras: "Dos terrazas, ascensor, exterior",
    precio: 249000
  },
  {
    titulo: "Chalet independiente con piscina",
    ciudad: "Griñón",
    zona: "Residencial",
    metros: 245,
    habitaciones: 5,
    banos: 4,
    planta: "Chalet independiente",
    extras: "Piscina privada, parcela, garaje",
    precio: 548000
  },
  {
    titulo: "Piso compacto bien ubicado",
    ciudad: "Humanes de Madrid",
    zona: "Centro",
    metros: 68,
    habitaciones: 2,
    banos: 1,
    planta: "2ª planta",
    extras: "Ascensor, exterior, cerca de transporte",
    precio: 169000
  },
  {
    titulo: "Dúplex con terraza superior",
    ciudad: "Ciempozuelos",
    zona: "Centro",
    metros: 112,
    habitaciones: 3,
    banos: 2,
    planta: "Dúplex",
    extras: "Terraza, garaje, trastero",
    precio: 229000
  },
  {
    titulo: "Piso señorial reformado",
    ciudad: "Aranjuez",
    zona: "Centro",
    metros: 124,
    habitaciones: 4,
    banos: 2,
    planta: "2ª planta",
    extras: "Edificio clásico, balcón, techos altos",
    precio: 312000
  },
  {
    titulo: "Piso con urbanización cerrada",
    ciudad: "Getafe",
    zona: "Los Molinos",
    metros: 104,
    habitaciones: 3,
    banos: 2,
    planta: "6ª planta",
    extras: "Piscina, garaje, trastero",
    precio: 365000
  },
  {
    titulo: "Piso junto al parque",
    ciudad: "Leganés",
    zona: "Leganés Norte",
    metros: 98,
    habitaciones: 3,
    banos: 2,
    planta: "4ª planta",
    extras: "Garaje, trastero, zonas verdes",
    precio: 309000
  },
  {
    titulo: "Vivienda exterior con ascensor",
    ciudad: "Parla",
    zona: "Centro",
    metros: 77,
    habitaciones: 3,
    banos: 1,
    planta: "5ª planta",
    extras: "Ascensor, balcón, buena ubicación",
    precio: 166000
  },
  {
    titulo: "Piso grande para familia",
    ciudad: "Valdemoro",
    zona: "Centro",
    metros: 116,
    habitaciones: 4,
    banos: 2,
    planta: "3ª planta",
    extras: "Ascensor, terraza, plaza de garaje",
    precio: 272000
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

const configHost = document.getElementById("configHost");
const inputNumeroRondas = document.getElementById("inputNumeroRondas");

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
    numeroRondas: 10,
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
    mostrar(configHost);
    inputNumeroRondas.max = casas.length;

    if (!inputNumeroRondas.value) {
      inputNumeroRondas.value = Math.min(10, casas.length);
    }
  } else {
    ocultar(configHost);
  }
}

btnEmpezarPartida.addEventListener("click", async () => {
  let numeroRondas = Number(inputNumeroRondas.value);

  if (!numeroRondas || numeroRondas < 1) {
    numeroRondas = 1;
  }

  if (numeroRondas > casas.length) {
    numeroRondas = casas.length;
  }

  await update(partidaRef(), {
    estado: "jugando",
    rondaActual: 0,
    numeroRondas,
    revelado: false
  });
});

/* JUEGO */
function pintarJuego() {
  const ronda = datosPartida.rondaActual;
  const totalRondas = datosPartida.numeroRondas || casas.length;
  const casa = casas[ronda];

  if (!casa || ronda >= totalRondas) {
    update(partidaRef(), {
      estado: "terminada"
    });
    return;
  }

  textoRonda.textContent = "Ronda " + (ronda + 1) + " de " + totalRondas;
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
  const totalRondas = datosPartida.numeroRondas || casas.length;

  if (siguiente >= totalRondas) {
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