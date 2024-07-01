const express = require("express");
const cors = require("cors");
const RoutesJugador = require('./routes/jugador.routes')
const app = express();
const socketIo= require('socket.io')
const server= require('http').createServer(app)
const io= socketIo(server, { cors: { origin: '*' } })

//requerimos la base de datos
require('./server/config/baseDato');



//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//le pasamos la app a nuestra ruta
RoutesJugador(app);





server.listen(8080, () => {
  console.log("Activo en el puerto 8080");
});


io.on('connection', (socket)=> {
  console.log("Se conecto un usuario", socket)
  socket.broadcast.emit("Anuncio", "Llegó alguien mas")
});