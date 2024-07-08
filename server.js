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
let jugador1Name  ;
let jugador2Name  ;
let jugador1Socket ;
let jugador2Socket ;

io.on("connection", (socket) => {
  console.log("Se conecto un Jugador", socket.id);
  jugadoresConectados++;

  if (!jugador1Socket) {
    console.log("entró a jugador 1 vacío")
    jugador1Socket = socket;
    jugador1Socket.emit("asignaJugador", 1);
  } else if (!jugador2Socket) {
    console.log("entró a jugador 2 vacío")
    jugador2Socket = socket;
    jugador2Socket.emit("asignaJugador", 2);
  } else {
    io.to(socket).emit("EsperarTurno", "Pestañeaste, espera tu turno.");
    console.log("entró a jugador sala de espera")
  }
  if (jugador1Socket) {
    jugador1Socket.on("JugadorNombre", (jugadorNombre) => {
      jugador1Name = jugadorNombre;
      jugador1Socket.emit('EsperandoContrincante', `!Bienvenido ${jugadorNombre}, espera tu retador!.`)
    });
  }
  if (jugador2Socket) {
    jugador2Socket.on("JugadorNombre", (jugadorNombre) => {
      console.log("llega nombre del front" +jugadorNombre)
      jugador2Name = jugadorNombre;

      jugador1Socket? jugador1Socket.emit("RetadorAsignado", `Tu retador es ${jugador2Name}`) : null;
      jugador2Socket.emit("RetadorAsignado", `Tu retador es ${jugador1Name}`);
    });
  }

    socket.on("disconnect", (reason) => {

    if (socket === jugador1Socket) {
      console.log("Se ha desconectado el jugador 1: "+ jugador1Name);
      if (jugador2Socket) {
        jugador2Socket.emit("contrincanteRetirado", `!Tu contrincante ${jugador1Name} se meo, se asustó! Ganas por desconexión`);
      }
      jugador1Socket = "";
      jugador1Name = "";
      jugadoresConectados--;
    } else if (socket === jugador2Socket) {
      console.log("Se ha desconectado el jugador 2: "+ jugador2Name);
      if (jugador1Socket) {
        jugador1Socket.emit("contrincanteRetirado", `!Tu contrincante ${jugador2Name} se meo, se asustó! Ganas por desconexión`);
      }
      jugador2Socket = "";
      jugador2Name = "";
      jugadoresConectados--;
    } else {
      console.log("Se desconecto alguien de la sala de espera. " + socket.id);
    }
    
  });
});
