
const multer = require('multer');
const path = require('path');

// Donde y como guardar el archivo
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // carpeta donde se guardan
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const nombre = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, nombre + extension); // nombre único para evitar colisiones
    }

});

// Filtro solo imágenes
const fileFilter = (req, file, cb) => {
    const permitidos = /jpeg|jpg|png|webp/;
    const esValido = permitidos.test(
        path.extname(file.originalname).toLowerCase()
    );

    if (esValido) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes jpg, png o webp'));
    }
};

// Límite de tamaño 5MB
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;