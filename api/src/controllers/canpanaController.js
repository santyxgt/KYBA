
const Campana = require('../models/Canpana');

//* Crear campaña
const crearCampana = async (req, res) => {
    try {
        const { titulo, descripcion, meta } = req.body;

        const campana = new Campana({
            titulo,
            descripcion,
            meta,
            imagen: req.file ? `/uploads/${req.file.filename}` : null,
            creador: req.usuario.id
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

const donar = async (req, res) => {
    try {
        const { monto } = req.body;
        if (!monto || monto <= 0) {
            return res.status(400).json({ message: 'Monto inválido' });
        }

        const campana = await Campana.findByIdAndUpdate(
            req.params.id,
            { $inc: { monto_recaudado: monto } },
            { new: true }
        );

        if (!campana) {
            return res.status(404).json({ message: 'Campaña no encontrada' });
        }

        res.json({ message: 'Donación registrada', campana });

    } catch (error) {
        res.status(500).json({ message: 'Error al donar', error });
    }
};

module.exports = { crearCampana, obtenerCampanas, obtenerCampana, eliminarCampana, donar };