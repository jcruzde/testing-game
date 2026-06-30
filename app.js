import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  onValue,
  push,
  query,
  limitToLast
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

/* GENERADOR WALLAPOP */
const zonas = [
  "Getafe", "Leganés", "Alcorcón", "Móstoles", "Fuenlabrada",
  "Parla", "Pinto", "Valdemoro", "Villaverde", "Usera",
  "Carabanchel", "Arganzuela", "Rivas", "Coslada", "Aluche"
];

const estados = [
  { nombre: "Como nuevo", factor: 0.88 },
  { nombre: "Muy buen estado", factor: 0.76 },
  { nombre: "Buen estado", factor: 0.64 },
  { nombre: "Con marcas de uso", factor: 0.48 },
  { nombre: "Bastante usado", factor: 0.34 },
  { nombre: "Funciona, pero tiene detalles", factor: 0.26 }
];

const colores = [
  ["#34d399", "#22d3ee"],
  ["#60a5fa", "#a78bfa"],
  ["#fb7185", "#facc15"],
  ["#f97316", "#facc15"],
  ["#2dd4bf", "#0f766e"],
  ["#c084fc", "#f472b6"],
  ["#93c5fd", "#10b981"],
  ["#fda4af", "#fb923c"]
];

const categorias = [
  {
    tipo: "móvil",
    emoji: "📱",
    base: 520,
    titulos: ["iPhone 12", "iPhone 13", "Samsung Galaxy S21", "Xiaomi Redmi Note", "Google Pixel 6"],
    detalles: ["128 GB", "256 GB", "pantalla OLED", "batería cambiada", "libre de operador"],
    extras: ["incluye cargador", "con funda", "sin caja", "con caja original", "protector de pantalla"]
  },
  {
    tipo: "consola",
    emoji: "🎮",
    base: 390,
    titulos: ["PlayStation 5", "PlayStation 4 Pro", "Nintendo Switch", "Xbox Series S", "Xbox Series X"],
    detalles: ["dos mandos", "un mando", "1 TB", "versión digital", "pack familiar"],
    extras: ["incluye juegos", "con caja", "sin caja", "mando con desgaste", "cables originales"]
  },
  {
    tipo: "bicicleta",
    emoji: "🚲",
    base: 420,
    titulos: ["Bicicleta de montaña", "Bicicleta urbana", "Bicicleta eléctrica", "Bici plegable", "Bicicleta de carretera"],
    detalles: ["rueda 29", "cuadro de aluminio", "frenos de disco", "cambio Shimano", "talla M"],
    extras: ["incluye casco", "con candado", "ruedas nuevas", "necesita ajuste", "usada pocos fines de semana"]
  },
  {
    tipo: "patinete",
    emoji: "🛴",
    base: 360,
    titulos: ["Patinete eléctrico Xiaomi", "Patinete eléctrico Cecotec", "Patinete urbano", "Patinete potente", "Patinete plegable"],
    detalles: ["autonomía 25 km", "ruedas antipinchazos", "plegable", "motor 350W", "con app"],
    extras: ["incluye cargador", "con candado", "batería cuidada", "tiene arañazos", "recién revisado"]
  },
  {
    tipo: "portátil",
    emoji: "💻",
    base: 750,
    titulos: ["MacBook Air", "Lenovo ThinkPad", "HP Pavilion", "Asus VivoBook", "Dell XPS"],
    detalles: ["16 GB RAM", "8 GB RAM", "SSD 512 GB", "pantalla 13 pulgadas", "i5"],
    extras: ["incluye cargador", "con funda", "batería al 85%", "teclado español", "sin caja"]
  },
  {
    tipo: "televisor",
    emoji: "📺",
    base: 520,
    titulos: ["Smart TV Samsung", "TV LG OLED", "Televisor Xiaomi", "Sony Bravia", "TV Philips Ambilight"],
    detalles: ["55 pulgadas", "65 pulgadas", "4K", "Smart TV", "HDR"],
    extras: ["con mando", "sin soporte", "soporte de pared", "poco uso", "pequeña marca en marco"]
  },
  {
    tipo: "sofá",
    emoji: "🛋️",
    base: 480,
    titulos: ["Sofá chaise longue", "Sofá cama", "Sofá de piel", "Sofá de tres plazas", "Rinconera grande"],
    detalles: ["color gris", "tela antimanchas", "piel sintética", "muy cómodo", "desenfundable"],
    extras: ["hay que recogerlo", "cabe en ascensor", "con cojines", "tiene roce lateral", "casi sin uso"]
  },
  {
    tipo: "silla gamer",
    emoji: "🪑",
    base: 210,
    titulos: ["Silla gaming", "Silla de escritorio", "Silla ergonómica", "Silla gamer RGB", "Silla de teletrabajo"],
    detalles: ["reposabrazos regulable", "reclinable", "color negro", "cojín lumbar", "base metálica"],
    extras: ["montada", "poco uso", "tiene desgaste", "ruedas nuevas", "se recoge en mano"]
  },
  {
    tipo: "cafetera",
    emoji: "☕",
    base: 230,
    titulos: ["Cafetera superautomática", "Nespresso", "Cafetera DeLonghi", "Cafetera italiana eléctrica", "Cafetera express"],
    detalles: ["muele café", "depósito grande", "espumador", "cápsulas", "programable"],
    extras: ["recién descalcificada", "con caja", "incluye cápsulas", "sin manual", "poco uso"]
  },
  {
    tipo: "cámara",
    emoji: "📷",
    base: 690,
    titulos: ["Canon EOS", "Sony Alpha", "Nikon réflex", "GoPro Hero", "Cámara compacta premium"],
    detalles: ["objetivo incluido", "4K", "pantalla abatible", "sensor grande", "estabilizador"],
    extras: ["con bolsa", "segunda batería", "sin caja", "tarjeta SD incluida", "muy cuidada"]
  },
  {
    tipo: "instrumento",
    emoji: "🎸",
    base: 340,
    titulos: ["Guitarra eléctrica", "Guitarra acústica", "Teclado Yamaha", "Bajo eléctrico", "Ukelele premium"],
    detalles: ["color madera", "pastillas nuevas", "88 teclas", "amplificador incluido", "funda rígida"],
    extras: ["con funda", "incluye cable", "necesita cuerdas", "ideal principiantes", "poco uso"]
  },
  {
    tipo: "robot de cocina",
    emoji: "🍳",
    base: 620,
    titulos: ["Thermomix", "Robot de cocina Cecotec", "Monsieur Cuisine", "KitchenAid", "Robot amasador"],
    detalles: ["varios accesorios", "pantalla táctil", "vaso grande", "recetas integradas", "alta potencia"],
    extras: ["con libro", "con caja", "sin báscula", "muy cuidado", "usado pocas veces"]
  },
  {
    tipo: "reloj",
    emoji: "⌚",
    base: 360,
    titulos: ["Apple Watch", "Samsung Galaxy Watch", "Garmin Forerunner", "Huawei Watch", "Amazfit GTR"],
    detalles: ["GPS", "correa deportiva", "pantalla grande", "medición sueño", "resistente al agua"],
    extras: ["con cargador", "sin caja", "correa extra", "batería buena", "marcas leves"]
  },
  {
    tipo: "aspiradora",
    emoji: "🧹",
    base: 330,
    titulos: ["Dyson inalámbrica", "Roomba", "Conga robot", "Aspiradora Bosch", "Aspiradora sin cable"],
    detalles: ["gran potencia", "varios cepillos", "mapea la casa", "batería extraíble", "depósito grande"],
    extras: ["con accesorios", "filtro cambiado", "sin caja", "ruedas gastadas", "funciona perfecto"]
  }
];

function elegir(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function numero(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function redondearPrecio(precio) {
  if (precio < 100) return Math.max(5, Math.round(precio / 5) * 5);
  return Math.max(10, Math.round(precio / 10) * 10);
}

function generarProducto() {
  const categoria = elegir(categorias);
  const estado = elegir(estados);
  const tituloBase = elegir(categoria.titulos);
  const detalle1 = elegir(categoria.detalles);
  const detalle2 = elegir(categoria.detalles);
  const extra = elegir(categoria.extras);
  const zona = elegir(zonas);
  const antiguedad = numero(1, 8);
  const color = elegir(colores);

  const rareza = 0.88 + Math.random() * 0.32;
  const factorAntiguedad = Math.max(0.42, 1 - antiguedad * 0.055);
  const ruido = 0.88 + Math.random() * 0.24;

  let precio = categoria.base * estado.factor * factorAntiguedad * rareza * ruido;

  if (tituloBase.toLowerCase().includes("iphone 13")) precio *= 1.25;
  if (tituloBase.toLowerCase().includes("playstation 5")) precio *= 1.25;
  if (tituloBase.toLowerCase().includes("macbook")) precio *= 1.35;
  if (tituloBase.toLowerCase().includes("thermomix")) precio *= 1.45;
  if (tituloBase.toLowerCase().includes("dyson")) precio *= 1.25;
  if (tituloBase.toLowerCase().includes("eléctrica")) precio *= 1.35;
  if (estado.nombre.includes("detalles")) precio *= 0.82;
  if (extra.includes("caja")) precio *= 1.04;
  if (extra.includes("desgaste") || extra.includes("arañazos") || extra.includes("roce")) precio *= 0.9;

  precio = redondearPrecio(precio);

  return {
    titulo: tituloBase,
    tipo: categoria.tipo,
    emoji: categoria.emoji,
    detalle1,
    detalle2,
    extra,
    estado: estado.nombre,
    antiguedad,
    zona,
    color1: color[0],
    color2: color[1],
    descripcion: `${detalle1}, ${detalle2}. ${extra}. Vendo por no usar.`,
    precio
  };
}

function generarProductos(cantidad) {
  const productos = [];

  for (let i = 0; i < cantidad; i++) {
    productos.push(generarProducto());
  }

  return productos;
}

/* ESTADO LOCAL */
let codigoActual = "";
let jugadorId = localStorage.getItem("jugadorId");

if (!jugadorId) {
  jugadorId = crypto.randomUUID();
  localStorage.setItem("jugadorId", jugadorId);
}

let soyHost = false;
let datosPartida = null;
let chatEscuchando = false;

/* ELEMENTOS */
const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaSala = document.getElementById("pantalla-sala");
const pantallaJuego = document.getElementById("pantalla-juego");
const pantallaResultados = document.getElementById("pantalla-resultados");
const pantallaRanking = document.getElementById("pantalla-ranking");
const pantallaChat = document.getElementById("pantalla-chat");

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
const productoActual = document.getElementById("productoActual");
const inputApuesta = document.getElementById("inputApuesta");
const zonaApuesta = document.getElementById("zonaApuesta");
const zonaEspera = document.getElementById("zonaEspera");
const zonaHost = document.getElementById("zonaHost");
const resultadoRonda = document.getElementById("resultadoRonda");
const ranking = document.getElementById("ranking");

const mensajesChat = document.getElementById("mensajesChat");
const inputChat = document.getElementById("inputChat");
const btnEnviarChat = document.getElementById("btnEnviarChat");

/* UTILIDADES */
function mostrar(elemento) {
  elemento.classList.remove("oculto");
}

function ocultar(elemento) {
  elemento.classList.add("oculto");
}

function generarCodigo() {
  return "WALLA" + Math.floor(100 + Math.random() * 900);
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

function chatRef() {
  return ref(db, "partidas/" + codigoActual + "/chat");
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

function escaparHTML(texto) {
  return texto
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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
    apuestas: {},
    chat: {}
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
  mostrar(pantallaChat);
  escucharChat();

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

    if (!inputNumeroRondas.value) {
      inputNumeroRondas.value = 10;
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

  if (numeroRondas > 50) {
    numeroRondas = 50;
  }

  const productos = generarProductos(numeroRondas);

  await update(partidaRef(), {
    estado: "jugando",
    rondaActual: 0,
    numeroRondas,
    productos,
    revelado: false
  });
});

/* JUEGO */
function pintarJuego() {
  const ronda = datosPartida.rondaActual;
  const totalRondas = datosPartida.numeroRondas || 10;
  const productos = datosPartida.productos || [];
  const producto = productos[ronda];

  if (!producto || ronda >= totalRondas) {
    update(partidaRef(), {
      estado: "terminada"
    });
    return;
  }

  textoRonda.textContent = "Ronda " + (ronda + 1) + " de " + totalRondas;
  estadoPartida.textContent = datosPartida.revelado ? "Precio revelado" : "Adivinando";

  productoActual.innerHTML = `
    <article class="anuncio">
      <div class="anuncio-img" style="--color1:${producto.color1}; --color2:${producto.color2};">
        <div class="badge">${producto.estado}</div>
        <div class="badge badge-derecha">${producto.zona}</div>
        <div class="emoji-producto">${producto.emoji}</div>
      </div>

      <div class="anuncio-body">
        <h2>${producto.titulo}</h2>
        <p class="descripcion">${producto.descripcion}</p>

        <div class="dato"><strong>Categoría</strong><span>${producto.tipo}</span></div>
        <div class="dato"><strong>Estado</strong><span>${producto.estado}</span></div>
        <div class="dato"><strong>Antigüedad</strong><span>${producto.antiguedad} años</span></div>
        <div class="dato"><strong>Zona</strong><span>${producto.zona}</span></div>
        <div class="dato"><strong>Detalle</strong><span>${producto.detalle1}</span></div>
        <div class="dato"><strong>Incluye</strong><span>${producto.extra}</span></div>
      </div>
    </article>
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
  const producto = datosPartida.productos?.[ronda];

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
        diferencia: Math.abs(apuesta - producto.precio),
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

      if (r.apuesta === producto.precio) {
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
  const producto = datosPartida.productos?.[ronda];
  const resultados = datosPartida.resultados?.[ronda] || [];

  mostrar(pantallaResultados);

  let html = `
    <div class="precio-real">${formatoEuros(producto.precio)}</div>
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
  const totalRondas = datosPartida.numeroRondas || 10;

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

/* CHAT */
function escucharChat() {
  if (chatEscuchando) return;
  chatEscuchando = true;

  const ultimosMensajes = query(chatRef(), limitToLast(60));

  onValue(ultimosMensajes, (snap) => {
    const mensajes = snap.val() || {};
    const lista = Object.values(mensajes).sort((a, b) => (a.creado || 0) - (b.creado || 0));

    mensajesChat.innerHTML = "";

    lista.forEach((m) => {
      const div = document.createElement("div");
      div.className = "chat-msg" + (m.jugadorId === jugadorId ? " yo" : "");

      const hora = m.creado
        ? new Date(m.creado).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
        : "";

      div.innerHTML = `
        <div class="chat-nombre">${escaparHTML(m.nombre || "Jugador")}</div>
        <div class="chat-texto">${escaparHTML(m.texto || "")}</div>
        <div class="chat-hora">${hora}</div>
      `;

      mensajesChat.appendChild(div);
    });

    mensajesChat.scrollTop = mensajesChat.scrollHeight;
  });
}

async function enviarChat() {
  const texto = inputChat.value.trim();

  if (!texto) return;
  if (!datosPartida) return;

  const jugador = datosPartida.jugadores?.[jugadorId];
  const nombre = jugador?.nombre || nombreJugador.value.trim() || "Jugador";

  inputChat.value = "";

  await push(chatRef(), {
    jugadorId,
    nombre,
    texto: texto.slice(0, 160),
    creado: Date.now()
  });
}

btnEnviarChat.addEventListener("click", enviarChat);

inputChat.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    enviarChat();
  }
});