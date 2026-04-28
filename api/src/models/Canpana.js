

const mongoose = require('mongoose');

const campanaSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: true,
            trim: true
        },
        descripcion: {
            type: String,
            required: true,
            maxlength: 150
        },
        meta: {
            type: Number,
            required: true,
            min: 100
        },
        imagen: {
            type: String  // base64, igual que en el frontend
        },
        creador: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true
        },
        monto_recaudado: {
            type: Number,
            default: 0
        },
        activa: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Campana', campanaSchema);