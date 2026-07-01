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

const appFirebase = initializeApp(firebaseConfig);
const db = getDatabase(appFirebase);

/* =====================================================
   BANCO DE PREGUNTAS CHAO PESCAO
===================================================== */
const preguntasPescao = [
  { categoria: "Animales", pregunta: "¿Cuántos corazones tiene un pulpo?", respuesta: "3" },
  { categoria: "Animales", pregunta: "¿Cuántos estómagos tiene una vaca?", respuesta: "4" },
  { categoria: "Animales", pregunta: "¿Cuántas patas tiene una langosta?", respuesta: "10" },
  { categoria: "Animales", pregunta: "¿Cuántos años puede vivir aproximadamente una tortuga gigante?", respuesta: "Más de 100 años" },
  { categoria: "Animales", pregunta: "¿Qué animal duerme normalmente boca abajo colgado de una rama?", respuesta: "El murciélago" },
  { categoria: "Cuerpo humano", pregunta: "¿Cuántos huesos tiene el cuerpo humano adulto?", respuesta: "206" },
  { categoria: "Cuerpo humano", pregunta: "¿Cuántos dientes suele tener un adulto contando las muelas del juicio?", respuesta: "32" },
  { categoria: "Cuerpo humano", pregunta: "¿Cuál es el órgano más grande del cuerpo humano?", respuesta: "La piel" },
  { categoria: "Ciencia", pregunta: "¿Cuántos minutos tarda aproximadamente la luz del Sol en llegar a la Tierra?", respuesta: "8 minutos" },
  { categoria: "Ciencia", pregunta: "¿Cuál es el planeta más grande del Sistema Solar?", respuesta: "Júpiter" },
  { categoria: "Ciencia", pregunta: "¿Cuál es el metal líquido a temperatura ambiente más conocido?", respuesta: "Mercurio" },
  { categoria: "Ciencia", pregunta: "¿Qué gas respiramos principalmente del aire?", respuesta: "Nitrógeno" },
  { categoria: "Geografía", pregunta: "¿Cuál es el país más grande del mundo por superficie?", respuesta: "Rusia" },
  { categoria: "Geografía", pregunta: "¿Cuál es el río más largo del mundo según la medición más habitual?", respuesta: "El Nilo" },
  { categoria: "Geografía", pregunta: "¿Cuál es el océano más grande del planeta?", respuesta: "El Pacífico" },
  { categoria: "Geografía", pregunta: "¿En qué país está la ciudad de Marrakech?", respuesta: "Marruecos" },
  { categoria: "Historia", pregunta: "¿En qué año llegó el ser humano a la Luna?", respuesta: "1969" },
  { categoria: "Historia", pregunta: "¿Cuántos años duró aproximadamente la Segunda Guerra Mundial?", respuesta: "6 años" },
  { categoria: "Historia", pregunta: "¿Qué civilización construyó Machu Picchu?", respuesta: "Los incas" },
  { categoria: "Cultura general", pregunta: "¿Cuántas teclas tiene un piano estándar?", respuesta: "88" },
  { categoria: "Cultura general", pregunta: "¿Cuántos colores tiene el arcoíris en la división tradicional?", respuesta: "7" },
  { categoria: "Cultura general", pregunta: "¿Cuántos lados tiene un dodecágono?", respuesta: "12" },
  { categoria: "Cultura general", pregunta: "¿Cuántos segundos hay en una hora?", respuesta: "3600" },
  { categoria: "Comida", pregunta: "¿De qué fruto seco se hace tradicionalmente el mazapán?", respuesta: "Almendra" },
  { categoria: "Comida", pregunta: "¿Qué país se asocia tradicionalmente con el sushi?", respuesta: "Japón" },
  { categoria: "Comida", pregunta: "¿Qué ingrediente principal tiene el guacamole?", respuesta: "Aguacate" },
  { categoria: "Deporte", pregunta: "¿Cuántos jugadores tiene un equipo de fútbol en el campo?", respuesta: "11" },
  { categoria: "Deporte", pregunta: "¿Cuántos anillos olímpicos hay en el símbolo de los Juegos Olímpicos?", respuesta: "5" },
  { categoria: "Deporte", pregunta: "¿Cuántos sets hay que ganar normalmente en un Grand Slam masculino de tenis?", respuesta: "3" },
  { categoria: "Curiosidades", pregunta: "¿Cuál es el animal terrestre más rápido?", respuesta: "El guepardo" },
  { categoria: "Curiosidades", pregunta: "¿Cuál es el ave más grande del mundo?", respuesta: "El avestruz" },
  { categoria: "Curiosidades", pregunta: "¿Qué idioma tiene más hablantes nativos en el mundo?", respuesta: "Chino mandarín" },
  { categoria: "Curiosidades", pregunta: "¿Qué planeta es conocido como el planeta rojo?", respuesta: "Marte" },
  { categoria: "Curiosidades", pregunta: "¿Cuántos continentes hay según el modelo más usado en España?", respuesta: "6" },
  { categoria: "España", pregunta: "¿Cuál es la capital de Galicia?", respuesta: "Santiago de Compostela" },
  { categoria: "España", pregunta: "¿Cuál es el río que pasa por Sevilla?", respuesta: "Guadalquivir" },
  { categoria: "España", pregunta: "¿En qué ciudad está la Alhambra?", respuesta: "Granada" },
  { categoria: "España", pregunta: "¿Cuál es la isla más grande de Canarias?", respuesta: "Tenerife" },
  { categoria: "Tecnología", pregunta: "¿Qué significa la sigla USB?", respuesta: "Universal Serial Bus" },
  { categoria: "Tecnología", pregunta: "¿Qué empresa creó el iPhone?", respuesta: "Apple" }
];

/* GENERADOR WALLAPOP */
const zonas = ["Getafe", "Leganés", "Alcorcón", "Móstoles", "Fuenlabrada", "Parla", "Pinto", "Valdemoro", "Villaverde", "Usera", "Carabanchel", "Arganzuela", "Rivas", "Coslada", "Aluche"];

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
  { tipo: "móvil", emoji: "📱", base: 520, titulos: ["iPhone 12", "iPhone 13", "Samsung Galaxy S21", "Xiaomi Redmi Note", "Google Pixel 6"], detalles: ["128 GB", "256 GB", "pantalla OLED", "batería cambiada", "libre de operador"], extras: ["incluye cargador", "con funda", "sin caja", "con caja original", "protector de pantalla"] },
  { tipo: "consola", emoji: "🎮", base: 390, titulos: ["PlayStation 5", "PlayStation 4 Pro", "Nintendo Switch", "Xbox Series S", "Xbox Series X"], detalles: ["dos mandos", "un mando", "1 TB", "versión digital", "pack familiar"], extras: ["incluye juegos", "con caja", "sin caja", "mando con desgaste", "cables originales"] },
  { tipo: "bicicleta", emoji: "🚲", base: 420, titulos: ["Bicicleta de montaña", "Bicicleta urbana", "Bicicleta eléctrica", "Bici plegable", "Bicicleta de carretera"], detalles: ["rueda 29", "cuadro de aluminio", "frenos de disco", "cambio Shimano", "talla M"], extras: ["incluye casco", "con candado", "ruedas nuevas", "necesita ajuste", "usada pocos fines de semana"] },
  { tipo: "patinete", emoji: "🛴", base: 360, titulos: ["Patinete eléctrico Xiaomi", "Patinete eléctrico Cecotec", "Patinete urbano", "Patinete potente", "Patinete plegable"], detalles: ["autonomía 25 km", "ruedas antipinchazos", "plegable", "motor 350W", "con app"], extras: ["incluye cargador", "con candado", "batería cuidada", "tiene arañazos", "recién revisado"] },
  { tipo: "portátil", emoji: "💻", base: 750, titulos: ["MacBook Air", "Lenovo ThinkPad", "HP Pavilion", "Asus VivoBook", "Dell XPS"], detalles: ["16 GB RAM", "8 GB RAM", "SSD 512 GB", "pantalla 13 pulgadas", "i5"], extras: ["incluye cargador", "con funda", "batería al 85%", "teclado español", "sin caja"] },
  { tipo: "televisor", emoji: "📺", base: 520, titulos: ["Smart TV Samsung", "TV LG OLED", "Televisor Xiaomi", "Sony Bravia", "TV Philips Ambilight"], detalles: ["55 pulgadas", "65 pulgadas", "4K", "Smart TV", "HDR"], extras: ["con mando", "sin soporte", "soporte de pared", "poco uso", "pequeña marca en marco"] },
  { tipo: "sofá", emoji: "🛋️", base: 480, titulos: ["Sofá chaise longue", "Sofá cama", "Sofá de piel", "Sofá de tres plazas", "Rinconera grande"], detalles: ["color gris", "tela antimanchas", "piel sintética", "muy cómodo", "desenfundable"], extras: ["hay que recogerlo", "cabe en ascensor", "con cojines", "tiene roce lateral", "casi sin uso"] },
  { tipo: "silla gamer", emoji: "🪑", base: 210, titulos: ["Silla gaming", "Silla de escritorio", "Silla ergonómica", "Silla gamer RGB", "Silla de teletrabajo"], detalles: ["reposabrazos regulable", "reclinable", "color negro", "cojín lumbar", "base metálica"], extras: ["montada", "poco uso", "tiene desgaste", "ruedas nuevas", "se recoge en mano"] },
  { tipo: "cafetera", emoji: "☕", base: 230, titulos: ["Cafetera superautomática", "Nespresso", "Cafetera DeLonghi", "Cafetera italiana eléctrica", "Cafetera express"], detalles: ["muele café", "depósito grande", "espumador", "cápsulas", "programable"], extras: ["recién descalcificada", "con caja", "incluye cápsulas", "sin manual", "poco uso"] },
  { tipo: "cámara", emoji: "📷", base: 690, titulos: ["Canon EOS", "Sony Alpha", "Nikon réflex", "GoPro Hero", "Cámara compacta premium"], detalles: ["objetivo incluido", "4K", "pantalla abatible", "sensor grande", "estabilizador"], extras: ["con bolsa", "segunda batería", "sin caja", "tarjeta SD incluida", "muy cuidada"] },
  { tipo: "instrumento", emoji: "🎸", base: 340, titulos: ["Guitarra eléctrica", "Guitarra acústica", "Teclado Yamaha", "Bajo eléctrico", "Ukelele premium"], detalles: ["color madera", "pastillas nuevas", "88 teclas", "amplificador incluido", "funda rígida"], extras: ["con funda", "incluye cable", "necesita cuerdas", "ideal principiantes", "poco uso"] },
  { tipo: "robot de cocina", emoji: "🍳", base: 620, titulos: ["Thermomix", "Robot de cocina Cecotec", "Monsieur Cuisine", "KitchenAid", "Robot amasador"], detalles: ["varios accesorios", "pantalla táctil", "vaso grande", "recetas integradas", "alta potencia"], extras: ["con libro", "con caja", "sin báscula", "muy cuidado", "usado pocas veces"] }
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
  if (tituloBase.toLowerCase().includes("eléctrica")) precio *= 1.35;
  if (estado.nombre.includes("detalles")) precio *= 0.82;
  if (extra.includes("caja")) precio *= 1.04;
  if (extra.includes("desgaste") || extra.includes("arañazos") || extra.includes("roce")) precio *= 0.9;

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
    precio: redondearPrecio(precio)
  };
}

function generarProductos(cantidad) {
  return Array.from({ length: cantidad }, generarProducto);
}

function generarRondasPescao(cantidad, jugadoresIds) {
  const rondas = [];

  for (let i = 0; i < cantidad; i++) {
    const pregunta = preguntasPescao[i % preguntasPescao.length];
    const pescadorId = jugadoresIds[i % jugadoresIds.length];
    const posiblesAzules = jugadoresIds.filter((id) => id !== pescadorId);
    const azulId = elegir(posiblesAzules);

    rondas.push({
      categoria: pregunta.categoria,
      pregunta: pregunta.pregunta,
      respuestaReal: pregunta.respuesta,
      pescadorId,
      azulId,
      terminada: false,
      chao: false,
      abiertas: {}
    });
  }

  return rondas;
}

/* ESTADO */
let juegoSeleccionado = "";
let codigoActual = "";
let datosPartida = null;
let soyHost = false;
let chatEscuchando = false;

let jugadorId = localStorage.getItem("jugadorId");
if (!jugadorId) {
  jugadorId = crypto.randomUUID();
  localStorage.setItem("jugadorId", jugadorId);
}

/* ELEMENTOS */
const body = document.body;
const logoApp = document.getElementById("logoApp");
const tituloApp = document.getElementById("tituloApp");
const subtituloApp = document.getElementById("subtituloApp");
const btnVolverMenu = document.getElementById("btnVolverMenu");

const pantallaLanding = document.getElementById("pantalla-landing");
const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaSala = document.getElementById("pantalla-sala");
const pantallaWallapop = document.getElementById("pantalla-wallapop");
const pantallaPescao = document.getElementById("pantalla-pescao");
const pantallaResultados = document.getElementById("pantalla-resultados");
const pantallaRanking = document.getElementById("pantalla-ranking");
const pantallaChat = document.getElementById("pantalla-chat");

const btnElegirWallapop = document.getElementById("btnElegirWallapop");
const btnElegirPescao = document.getElementById("btnElegirPescao");

const nombreJugador = document.getElementById("nombreJugador");
const codigoPartida = document.getElementById("codigoPartida");
const tituloEntrada = document.getElementById("tituloEntrada");

const btnCrearPartida = document.getElementById("btnCrearPartida");
const btnUnirsePartida = document.getElementById("btnUnirsePartida");
const btnEmpezarPartida = document.getElementById("btnEmpezarPartida");

const codigoSala = document.getElementById("codigoSala");
const listaJugadores = document.getElementById("listaJugadores");
const configHost = document.getElementById("configHost");
const configWallapop = document.getElementById("configWallapop");
const configPescao = document.getElementById("configPescao");
const inputNumeroRondasWalla = document.getElementById("inputNumeroRondasWalla");
const inputNumeroRondasPescao = document.getElementById("inputNumeroRondasPescao");
const inputMaxJugadores = document.getElementById("inputMaxJugadores");

const textoRondaWalla = document.getElementById("textoRondaWalla");
const estadoPartidaWalla = document.getElementById("estadoPartidaWalla");
const productoActual = document.getElementById("productoActual");
const zonaApuesta = document.getElementById("zonaApuesta");
const inputApuesta = document.getElementById("inputApuesta");
const btnEnviarApuesta = document.getElementById("btnEnviarApuesta");
const zonaEsperaWalla = document.getElementById("zonaEsperaWalla");
const zonaHostWalla = document.getElementById("zonaHostWalla");
const btnRevelarPrecio = document.getElementById("btnRevelarPrecio");
const btnSiguienteRondaWalla = document.getElementById("btnSiguienteRondaWalla");

const textoRondaPescao = document.getElementById("textoRondaPescao");
const estadoPartidaPescao = document.getElementById("estadoPartidaPescao");
const zonaPreguntaPescao = document.getElementById("zonaPreguntaPescao");
const zonaRolPescao = document.getElementById("zonaRolPescao");
const zonaRespuestasPescao = document.getElementById("zonaRespuestasPescao");
const zonaHostPescao = document.getElementById("zonaHostPescao");
const btnSiguienteRondaPescao = document.getElementById("btnSiguienteRondaPescao");

const resultadoRonda = document.getElementById("resultadoRonda");
const ranking = document.getElementById("ranking");

const mensajesChat = document.getElementById("mensajesChat");
const inputChat = document.getElementById("inputChat");
const btnEnviarChat = document.getElementById("btnEnviarChat");

/* UTILIDADES */
function mostrar(el) { el.classList.remove("oculto"); }
function ocultar(el) { el.classList.add("oculto"); }

function ocultarTodo() {
  [pantallaLanding, pantallaInicio, pantallaSala, pantallaWallapop, pantallaPescao, pantallaResultados, pantallaRanking, pantallaChat].forEach(ocultar);
}

function formatoEuros(numero) {
  return Number(numero).toLocaleString("es-ES") + " €";
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
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function generarCodigo() {
  const prefijo = juegoSeleccionado === "pescao" ? "PEZ" : "WALLA";
  return prefijo + Math.floor(100 + Math.random() * 900);
}

function partidaRef() { return ref(db, "partidas/" + codigoActual); }
function jugadorRef() { return ref(db, "partidas/" + codigoActual + "/jugadores/" + jugadorId); }
function apuestaRef(ronda) { return ref(db, `partidas/${codigoActual}/apuestas/${ronda}/${jugadorId}`); }
function respuestaPescaoRef(ronda) { return ref(db, `partidas/${codigoActual}/respuestasPescao/${ronda}/${jugadorId}`); }
function chatRef() { return ref(db, "partidas/" + codigoActual + "/chat"); }

function aplicarTema(juego) {
  body.classList.remove("theme-walla", "theme-pescao");

  if (juego === "wallapop") {
    body.classList.add("theme-walla");
    logoApp.textContent = "💸";
    tituloApp.textContent = "Wallapop Quiz";
    subtituloApp.textContent = "Adivina cuánto cuesta este anuncio de segunda mano";
    tituloEntrada.textContent = "Entrar a Wallapop Quiz";
  } else if (juego === "pescao") {
    body.classList.add("theme-pescao");
    logoApp.textContent = "🎣";
    tituloApp.textContent = "Chao Pescao";
    subtituloApp.textContent = "Farolea respuestas y evita pescar la real";
    tituloEntrada.textContent = "Entrar a Chao Pescao";
  } else {
    logoApp.textContent = "🎉";
    tituloApp.textContent = "Party Games";
    subtituloApp.textContent = "Juegos rápidos para móviles, amigos y risas";
  }
}

/* LANDING */
btnElegirWallapop.addEventListener("click", () => elegirJuego("wallapop"));
btnElegirPescao.addEventListener("click", () => elegirJuego("pescao"));

function elegirJuego(juego) {
  juegoSeleccionado = juego;
  aplicarTema(juego);
  ocultarTodo();
  mostrar(pantallaInicio);
  mostrar(btnVolverMenu);
}

btnVolverMenu.addEventListener("click", () => {
  location.reload();
});

/* CREAR / UNIRSE */
btnCrearPartida.addEventListener("click", async () => {
  const nombre = validarNombre();
  if (!nombre) return;

  codigoActual = normalizarCodigo(codigoPartida.value) || generarCodigo();
  soyHost = true;

  const nuevaPartida = {
    juego: juegoSeleccionado,
    estado: "esperando",
    rondaActual: 0,
    numeroRondas: juegoSeleccionado === "pescao" ? 8 : 10,
    maxJugadores: juegoSeleccionado === "pescao" ? 10 : 50,
    revelado: false,
    creada: Date.now(),
    hostId: jugadorId,
    jugadores: {
      [jugadorId]: { nombre, puntos: 0, host: true }
    },
    apuestas: {},
    chat: {}
  };

  await set(partidaRef(), nuevaPartida);
  entrarEnPartida();
});

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

  if (partida.juego !== juegoSeleccionado) {
    alert("Esa partida es de otro juego. Vuelve al menú y elige el juego correcto.");
    return;
  }

  const jugadores = partida.jugadores || {};
  const yaEstoy = Boolean(jugadores[jugadorId]);
  const totalJugadores = Object.keys(jugadores).length;

  if (!yaEstoy && partida.estado === "esperando" && partida.maxJugadores && totalJugadores >= partida.maxJugadores) {
    alert("La partida ya está llena.");
    return;
  }

  soyHost = partida.hostId === jugadorId;

  await set(jugadorRef(), {
    nombre,
    puntos: jugadores[jugadorId]?.puntos || 0,
    host: soyHost
  });

  entrarEnPartida();
});

function entrarEnPartida() {
  ocultarTodo();
  mostrar(pantallaSala);
  mostrar(pantallaRanking);
  mostrar(pantallaChat);
  mostrar(btnVolverMenu);

  codigoSala.textContent = codigoActual;
  escucharChat();

  onValue(partidaRef(), (snap) => {
    datosPartida = snap.val();

    if (!datosPartida) {
      alert("La partida ya no existe.");
      location.reload();
      return;
    }

    juegoSeleccionado = datosPartida.juego;
    aplicarTema(juegoSeleccionado);
    soyHost = datosPartida.hostId === jugadorId;

    pintarSala();
    pintarRanking();

    if (datosPartida.estado === "esperando") {
      mostrar(pantallaSala);
      ocultar(pantallaWallapop);
      ocultar(pantallaPescao);
      ocultar(pantallaResultados);
    }

    if (datosPartida.estado === "jugando") {
      ocultar(pantallaSala);

      if (juegoSeleccionado === "wallapop") {
        mostrar(pantallaWallapop);
        ocultar(pantallaPescao);
        pintarWallapop();
      }

      if (juegoSeleccionado === "pescao") {
        mostrar(pantallaPescao);
        ocultar(pantallaWallapop);
        pintarPescao();
      }
    }

    if (datosPartida.estado === "terminada") {
      ocultar(pantallaSala);
      ocultar(pantallaWallapop);
      ocultar(pantallaPescao);
      mostrar(pantallaResultados);
      resultadoRonda.innerHTML = "<p>Partida terminada.</p>";
    }
  });
}

/* SALA */
function pintarSala() {
  const jugadores = datosPartida.jugadores || {};
  listaJugadores.innerHTML = "";

  Object.entries(jugadores).forEach(([id, j]) => {
    const li = document.createElement("li");
    li.textContent = j.nombre + (j.host ? " 👑" : "") + (id === jugadorId ? " · tú" : "");
    listaJugadores.appendChild(li);
  });

  if (soyHost) {
    mostrar(configHost);

    if (juegoSeleccionado === "wallapop") {
      mostrar(configWallapop);
      ocultar(configPescao);
    } else {
      ocultar(configWallapop);
      mostrar(configPescao);
    }
  } else {
    ocultar(configHost);
  }
}

btnEmpezarPartida.addEventListener("click", async () => {
  if (!soyHost) return;

  if (juegoSeleccionado === "wallapop") {
    let numeroRondas = Number(inputNumeroRondasWalla.value) || 10;
    numeroRondas = Math.max(1, Math.min(50, numeroRondas));

    await update(partidaRef(), {
      estado: "jugando",
      rondaActual: 0,
      numeroRondas,
      productos: generarProductos(numeroRondas),
      revelado: false
    });
  }

  if (juegoSeleccionado === "pescao") {
    const jugadoresIds = Object.keys(datosPartida.jugadores || {});

    if (jugadoresIds.length < 3) {
      alert("Chao Pescao necesita al menos 3 jugadores.");
      return;
    }

    let numeroRondas = Number(inputNumeroRondasPescao.value) || 8;
    numeroRondas = Math.max(1, Math.min(50, numeroRondas));

    let maxJugadores = Number(inputMaxJugadores.value) || 10;
    maxJugadores = Math.max(3, Math.min(30, maxJugadores));

    await update(partidaRef(), {
      estado: "jugando",
      rondaActual: 0,
      numeroRondas,
      maxJugadores,
      rondasPescao: generarRondasPescao(numeroRondas, jugadoresIds)
    });
  }
});

/* WALLAPOP */
function pintarWallapop() {
  const ronda = datosPartida.rondaActual;
  const totalRondas = datosPartida.numeroRondas || 10;
  const producto = datosPartida.productos?.[ronda];

  if (!producto || ronda >= totalRondas) {
    update(partidaRef(), { estado: "terminada" });
    return;
  }

  textoRondaWalla.textContent = "Ronda " + (ronda + 1) + " de " + totalRondas;
  estadoPartidaWalla.textContent = datosPartida.revelado ? "Precio revelado" : "Adivinando";

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
    ocultar(zonaEsperaWalla);
    pintarResultadosWallapop();
  } else {
    ocultar(pantallaResultados);

    if (yaAposto) {
      ocultar(zonaApuesta);
      mostrar(zonaEsperaWalla);
    } else {
      mostrar(zonaApuesta);
      ocultar(zonaEsperaWalla);
      inputApuesta.value = "";
    }
  }

  if (soyHost) {
    mostrar(zonaHostWalla);
    datosPartida.revelado ? mostrar(btnSiguienteRondaWalla) : ocultar(btnSiguienteRondaWalla);
    datosPartida.revelado ? ocultar(btnRevelarPrecio) : mostrar(btnRevelarPrecio);
  } else {
    ocultar(zonaHostWalla);
  }
}

btnEnviarApuesta.addEventListener("click", async () => {
  const apuesta = Number(inputApuesta.value);
  if (!apuesta || apuesta <= 0) {
    alert("Escribe un precio válido.");
    return;
  }
  await set(apuestaRef(datosPartida.rondaActual), apuesta);
});

btnRevelarPrecio.addEventListener("click", async () => {
  if (!soyHost) return;

  const ronda = datosPartida.rondaActual;
  const jugadores = datosPartida.jugadores || {};
  const apuestasRonda = datosPartida.apuestas?.[ronda] || {};
  const producto = datosPartida.productos?.[ronda];

  const resultados = Object.entries(jugadores)
    .map(([id, jugador]) => {
      const apuesta = apuestasRonda[id];
      return {
        id,
        nombre: jugador.nombre,
        apuesta: apuesta || null,
        diferencia: apuesta ? Math.abs(apuesta - producto.precio) : null,
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
      if (r.apuesta === producto.precio) r.puntosGanados += 5;
    }
  });

  const updates = {
    revelado: true,
    ["resultados/" + ronda]: resultados
  };

  resultados.forEach((r) => {
    updates["jugadores/" + r.id + "/puntos"] = (jugadores[r.id]?.puntos || 0) + r.puntosGanados;
  });

  await update(partidaRef(), updates);
});

function pintarResultadosWallapop() {
  const ronda = datosPartida.rondaActual;
  const producto = datosPartida.productos?.[ronda];
  const resultados = datosPartida.resultados?.[ronda] || [];

  mostrar(pantallaResultados);

  let html = `<div class="precio-real">${formatoEuros(producto.precio)}</div>`;

  resultados.forEach((r, index) => {
    html += `
      <div class="apuesta">
        <strong>${index + 1}. ${escaparHTML(r.nombre)}</strong><br>
        Apuesta: ${r.apuesta ? formatoEuros(r.apuesta) : "Sin apuesta"}<br>
        Diferencia: ${r.diferencia !== null ? formatoEuros(r.diferencia) : "-"}<br>
        Puntos: +${r.puntosGanados}
      </div>
    `;
  });

  resultadoRonda.innerHTML = html;
}

btnSiguienteRondaWalla.addEventListener("click", async () => {
  if (!soyHost) return;

  const siguiente = datosPartida.rondaActual + 1;
  const totalRondas = datosPartida.numeroRondas || 10;

  if (siguiente >= totalRondas) {
    await update(partidaRef(), { estado: "terminada" });
  } else {
    await update(partidaRef(), {
      rondaActual: siguiente,
      revelado: false
    });
  }
});

/* CHAO PESCAO */
function pintarPescao() {
  const rondaIndex = datosPartida.rondaActual;
  const totalRondas = datosPartida.numeroRondas || 8;
  const ronda = datosPartida.rondasPescao?.[rondaIndex];

  if (!ronda || rondaIndex >= totalRondas) {
    update(partidaRef(), { estado: "terminada" });
    return;
  }

  const jugadores = datosPartida.jugadores || {};
  const pescador = jugadores[ronda.pescadorId];
  const azul = jugadores[ronda.azulId];
  const soyPescador = jugadorId === ronda.pescadorId;
  const soyAzul = jugadorId === ronda.azulId;

  textoRondaPescao.textContent = "Ronda " + (rondaIndex + 1) + " de " + totalRondas;
  estadoPartidaPescao.textContent = ronda.terminada ? "Ronda terminada" : "En juego";

  zonaPreguntaPescao.innerHTML = `
    <div class="mar-card">
      <div class="mar-categoria">🌊 ${escaparHTML(ronda.categoria)}</div>
      <h2>${escaparHTML(ronda.pregunta)}</h2>
      <p>Pescador de la ronda: <strong>${escaparHTML(pescador?.nombre || "Pescador")}</strong> 🎣</p>
    </div>
  `;

  pintarRolPescao(ronda, soyPescador, soyAzul);
  pintarRespuestasPescao(ronda, soyPescador, azul);

  if (soyHost && ronda.terminada) {
    mostrar(zonaHostPescao);
    mostrar(btnSiguienteRondaPescao);
  } else {
    ocultar(zonaHostPescao);
    ocultar(btnSiguienteRondaPescao);
  }
}

function pintarRolPescao(ronda, soyPescador, soyAzul) {
  const rondaIndex = datosPartida.rondaActual;
  const respuestas = datosPartida.respuestasPescao?.[rondaIndex] || {};
  const yaRespondio = respuestas[jugadorId];

  if (soyPescador) {
    zonaRolPescao.innerHTML = `
      <div class="rol-box rol-pescador">
        <h3>🎣 Eres el pescador</h3>
        <p>No escribes respuesta. Espera a que los peces respondan y luego abre respuestas una a una.</p>
      </div>
    `;
    return;
  }

  if (ronda.terminada) {
    zonaRolPescao.innerHTML = "";
    return;
  }

  if (yaRespondio) {
    zonaRolPescao.innerHTML = `
      <div class="espera-box">
        Respuesta enviada. Esperando al pescador...
      </div>
    `;
    return;
  }

  if (soyAzul) {
    zonaRolPescao.innerHTML = `
      <div class="rol-box rol-azul">
        <h3>🐟🔵 Eres pescado azul</h3>
        <p>Tienes que disimular. Escribe como si estuvieras inventando una respuesta, pero usa la respuesta real.</p>
        <div class="respuesta-real">Respuesta real: ${escaparHTML(ronda.respuestaReal)}</div>
        <textarea id="inputRespuestaPescao" placeholder="Escribe la respuesta real de forma natural..."></textarea>
        <button id="btnEnviarRespuestaPescao">Enviar respuesta</button>
      </div>
    `;
  } else {
    zonaRolPescao.innerHTML = `
      <div class="rol-box rol-rojo">
        <h3>🐟🔴 Eres pescado rojo</h3>
        <p>Invéntate una respuesta falsa que parezca creíble. Intenta engañar al pescador.</p>
        <textarea id="inputRespuestaPescao" placeholder="Escribe una respuesta falsa..."></textarea>
        <button id="btnEnviarRespuestaPescao">Enviar respuesta</button>
      </div>
    `;
  }

  document.getElementById("btnEnviarRespuestaPescao").addEventListener("click", () => enviarRespuestaPescao(soyAzul));
}

async function enviarRespuestaPescao(esReal) {
  const input = document.getElementById("inputRespuestaPescao");
  const texto = input.value.trim();

  if (!texto) {
    alert("Escribe una respuesta.");
    return;
  }

  const jugador = datosPartida.jugadores?.[jugadorId];

  await set(respuestaPescaoRef(datosPartida.rondaActual), {
    jugadorId,
    nombre: jugador?.nombre || "Jugador",
    texto: texto.slice(0, 180),
    tipo: esReal ? "real" : "falsa",
    creado: Date.now()
  });
}

function pintarRespuestasPescao(ronda, soyPescador, azul) {
  const rondaIndex = datosPartida.rondaActual;
  const jugadores = datosPartida.jugadores || {};
  const respuestas = datosPartida.respuestasPescao?.[rondaIndex] || {};
  const respuestasArray = Object.values(respuestas).sort((a, b) => a.jugadorId.localeCompare(b.jugadorId));
  const numeroNecesario = Object.keys(jugadores).length - 1;
  const todasEnviadas = respuestasArray.length >= numeroNecesario;

  if (!todasEnviadas) {
    zonaRespuestasPescao.innerHTML = `
      <div class="espera-box">
        Faltan respuestas: ${respuestasArray.length}/${numeroNecesario}
      </div>
    `;
    return;
  }

  let html = "";

  if (ronda.chao) {
    html += `<div class="chao">🐟 CHAO PESCAO 🐟</div>`;
  }

  html += `<div class="respuestas-grid">`;

  respuestasArray.forEach((r) => {
    const abierta = Boolean(ronda.abiertas?.[r.jugadorId]);
    const esReal = r.tipo === "real";

    if (abierta) {
      html += `
        <div class="respuesta-card abierta ${esReal ? "real" : "falsa"}">
          <strong>${esReal ? "🚨 Respuesta real" : "✅ Respuesta falsa"}</strong>
          <div>${escaparHTML(r.texto)}</div>
          <small>La escribió: <strong>${escaparHTML(r.nombre)}</strong></small>
        </div>
      `;
    } else if (soyPescador && !ronda.terminada) {
      html += `
        <button class="respuesta-card" data-abrir="${r.jugadorId}">
          <strong>Respuesta sin abrir</strong>
          Toca para pescar esta respuesta
        </button>
      `;
    } else {
      html += `
        <div class="respuesta-card">
          <strong>Respuesta sin abrir</strong>
          Esperando al pescador...
        </div>
      `;
    }
  });

  html += `</div>`;
  zonaRespuestasPescao.innerHTML = html;

  document.querySelectorAll("[data-abrir]").forEach((btn) => {
    btn.addEventListener("click", () => abrirRespuestaPescao(btn.dataset.abrir));
  });
}

async function abrirRespuestaPescao(respondedorId) {
  const rondaIndex = datosPartida.rondaActual;
  const ronda = datosPartida.rondasPescao?.[rondaIndex];

  if (!ronda || ronda.terminada) return;
  if (jugadorId !== ronda.pescadorId) return;

  const respuestas = datosPartida.respuestasPescao?.[rondaIndex] || {};
  const respuesta = respuestas[respondedorId];
  if (!respuesta) return;

  const jugadores = datosPartida.jugadores || {};
  const updates = {};
  updates[`rondasPescao/${rondaIndex}/abiertas/${respondedorId}`] = true;

  if (respuesta.tipo === "real") {
    updates[`rondasPescao/${rondaIndex}/terminada`] = true;
    updates[`rondasPescao/${rondaIndex}/chao`] = true;
  } else {
    const puntosActuales = jugadores[ronda.pescadorId]?.puntos || 0;
    updates[`jugadores/${ronda.pescadorId}/puntos`] = puntosActuales + 1;

    const abiertas = { ...(ronda.abiertas || {}), [respondedorId]: true };
    const falsas = Object.values(respuestas).filter((r) => r.tipo === "falsa");
    const falsasAbiertas = falsas.filter((r) => abiertas[r.jugadorId]);

    if (falsas.length === falsasAbiertas.length) {
      updates[`rondasPescao/${rondaIndex}/terminada`] = true;
      updates[`rondasPescao/${rondaIndex}/chao`] = false;
    }
  }

  await update(partidaRef(), updates);
}

btnSiguienteRondaPescao.addEventListener("click", async () => {
  if (!soyHost) return;

  const siguiente = datosPartida.rondaActual + 1;
  const totalRondas = datosPartida.numeroRondas || 8;

  if (siguiente >= totalRondas) {
    await update(partidaRef(), { estado: "terminada" });
  } else {
    await update(partidaRef(), { rondaActual: siguiente });
  }
});

/* RANKING */
function pintarRanking() {
  const jugadores = datosPartida?.jugadores || {};
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
  if (!texto || !datosPartida) return;

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