const Jugador = require('../models/jugador.model');


// Crear Jugador.
module.exports.crearJugador = (req, res) => {
    // Se espera en body
    /*
    {
        nombre: Fulano
    }
    */
    const {nombre} = req.body;
    return Jugador.create({nombre})
        .then((jugadorCreado) => res.status(201).json(jugadorCreado))
        .catch(err => res.status(500).json({message: err.message}));
}
