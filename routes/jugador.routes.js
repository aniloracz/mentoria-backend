const ControladorJugador = require('../controllers/jugador.controller');

module.exports = (app) => {
    app.post('/api/jugador/nuevo', ControladorJugador.crearJugador); // crear un jugador
}