const Usuario = require('../models/Usuario');

const subirFotoPerfil = async (req, res) => {
  try {
    // Multer ya procesó el archivo y lo guardó en uploads/
    if (!req.file) {
      return res.status(400).json({ message: 'No se envió ninguna imagen' });
    }

    const urlFoto = `/uploads/${req.file.filename}`;

    // Actualiza el usuario que está en el token
    await Usuario.findByIdAndUpdate(req.usuario.id, { foto: urlFoto });

    res.json({ message: 'Foto actualizada', foto: urlFoto });

  } catch (error) {
    res.status(500).json({ message: 'Error al subir foto', error });
  }
};

const obtenerPerfil = async (req, res) => {
  try {
    // Busca el usuario pero no devuelve el password
    const usuario = await Usuario.findById(req.usuario.id).select('-password');

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil', error });
  }
};

module.exports = { subirFotoPerfil, obtenerPerfil };