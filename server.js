const express = require("express");
const cors = require("cors");
const RoutesJugador = require("./routes/jugador.routes");
const app = express();
const socketIo = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

//requerimos la base de datos
require("./config/mongoose.config");

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//le pasamos la app a nuestra ruta
RoutesJugador(app);

server.listen(5000, () => {
  console.log("Activo en el puerto 8080");
});

let jugadoresConectados = 0;
let jugador1Name = "";
let jugador2Name = "";
let jugador1socket ;
let jugador2socket ;

io.on("connection", (socket) => {
  console.log("Se conecto un Jugador", socket.id);
  jugadoresConectados++;

  if (!jugador1socket) {
    jugador1socket = socket;
    jugador1socket.emit("asignaJugador", 1);
  } else if (!jugador2socket) {
    jugador2socket = socket;
    jugador2socket.emit("asignaJugador", 2);
  } else {
    io.to(socket).emit("EsperarTurno", "Pestañeaste, espera tu turno.");
  }
  if (jugador1socket) {
    jugador1socket.on("JugadorNombre", (jugadorNombre) => {
      jugador1Name = jugadorNombre;
      jugador1socket.emit('EsperandoContrincante', `!Bienvenido ${jugadorNombre}, espera tu retador!.`)
    });
  }
  if (jugador2socket) {
    jugador2socket.on("JugadorNombre", (jugadorNombre) => {
      jugador2Name = jugadorNombre;
      socketJugador1.emit("RetadorAsignado", `Tu retador es ${jugador2Name}`);
      socketJugador2.emit("RetadorAsignado", `Tu retador es ${jugador1Name}`);
    });
  }

    socket.on("disconnect", (reason) => {

    if (socket === jugador1socket) {
      console.log("Se ha desconectado el jugador 1: "+ jugador1Name);
      if (jugador2socket) {
        jugador2socket.emit("contrincanteRetirado", `!Tu contrincante ${jugador1Name} se meo, se asustó! Ganas por desconexión`);
      }
      jugador1socket = "";
      jugador1Name = "";
      jugadoresConectados--;
    } else if (socket === jugador2socket) {
      console.log("Se ha desconectado el jugador 2: "+ jugador2Name);
      if (jugador1socket) {
        jugador1socket.emit("contrincanteRetirado", `!Tu contrincante ${jugador2Name} se meo, se asustó! Ganas por desconexión`);
      }
      jugador2socket = "";
      jugador2Name = "";
      jugadoresConectados--;
    } else {
      console.log("Se desconecto alguien de la sala de espera. " + socket.id);
    }
    
  });
});
