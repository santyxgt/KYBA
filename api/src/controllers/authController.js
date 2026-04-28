const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTRO
const registro = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Verificar si el email ya existe
        const usuarioExiste = await Usuario.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ mensaje: "El email ya está registrado" });
        }

        //Encriptar la contraseña con bcrypt
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        // Crear el usuario
        const nuevoUsuario = new Usuario({
            nombre,
            email,
            password: passwordEncriptada,
            rol,
        });

        await nuevoUsuario.save();

        res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor", error });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar el usuario por email
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ mensaje: "Credenciales incorrectas" });
        }

        // Comparar la contraseña con bcrypt
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(400).json({ mensaje: "Credenciales incorrectas" });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: "24h" },
        );

        res.json({
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
            },
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor", error });
    }
};

module.exports = { registro, login };
