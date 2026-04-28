
const Campana = require('../models/Campana');

//* Crear campaña
const crearCampana = async (req, res) => {
    try {
        const { titulo, descripcion, meta, imagen } = req.body;

        const campana = new Campana({
            titulo,
            descripcion,
            meta,
            imagen,
            creador: req.usuario.id  // viene del middleware verifyToken
        });

        await campana.save();
        res.status(201).json({ message: 'Campaña creada', campana });

    } catch (error) {
        res.status(500).json({ message: 'Error al crear campaña', error });
    }
};

// Obtener todas las campañas
const obtenerCampanas = async (req, res) => {
    try {
        const campanas = await Campana.find({ activa: true })
            .populate('creador', 'nombre email');

        res.json(campanas);

    } catch (error) {
        res.status(500).json({ message: 'Error al obtener campañas', error });
    }
};

// Obtener una campaña por ID
const obtenerCampana = async (req, res) => {
    try {
        const campana = await Campana.findById(req.params.id)
            .populate('creador', 'nombre email');

        if (!campana) {
            return res.status(404).json({ message: 'Campaña no encontrada' });
        }

        res.json(campana);

    } catch (error) {
        res.status(500).json({ message: 'Error al obtener campaña', error });
    }
};

// Eliminar campaña
const eliminarCampana = async (req, res) => {
    try {
        const campana = await Campana.findById(req.params.id);

        if (!campana) {
            return res.status(404).json({ message: 'Campaña no encontrada' });
        }

        // Solo el creador puede eliminarla
        if (campana.creador.toString() !== req.usuario.id) {
            return res.status(403).json({ message: 'No autorizado' });
        }

        await campana.deleteOne();
        res.json({ message: 'Campaña eliminada' });

    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar campaña', error });
    }
};

module.exports = { crearCampana, obtenerCampanas, obtenerCampana, eliminarCampana };