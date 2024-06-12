const mongoose = require('mongoose');

// Jugador, nombre, score, partidas jugadas.
const JugadorSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre del jugador no debe estar vacío"],
        minLength: [3, "El nombre debe tener minimo 3 carácteres."]
    },
    score: {
        type: Number,
        defaultValue: 0,
    }
})

const Jugador = mongoose.model('Jugador', JugadorSchema); // Estaba al revez.

module.exports = Jugador;