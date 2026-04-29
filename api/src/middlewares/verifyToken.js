// src/middlewares/verifyToken.js

const jwt = require("jsonwebtoken");

//* Funcion middleware
const verifyToken = (req, res, next) => {
    //  Leer el header
    const authHeader = req.headers["authorization"];

    //  Si no existe, bloquear

    if (!authHeader) {
        return res.status(401).json({ message: "Token requerido" });
    }

    //Extraer el token (quitar el prefijo "Bearer ")

    const token = authHeader.split(" ")[1];
    //    Verificar y decodificar
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //Adjuntar el payload al request para usarlo después
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token inválido o expirado" });
    }
};

module.exports = verifyToken;
