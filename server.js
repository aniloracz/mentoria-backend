// TODO: Se agrego, ruta, controlador y modelo de Jugador. 

// Imports
const express = require("express");
const cors = require('cors');
const app = express();
const port = 8000;
const RutaJugador = require('./routes/jugador.routes')

// Filtros y bypass
app.use( cors() );
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

// Rutas de llamada
RutaJugador(app);

// Encender Servidor
app.listen( port, () => console.log(`Servidor encendido en el puerto: ${port}`) );