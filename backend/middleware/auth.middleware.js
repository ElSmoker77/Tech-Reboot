// backend/middleware/auth.middleware.js
import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ msg: "No se proporcionó token" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("Falta JWT_SECRET en variables de entorno");
    return res.status(500).json({ msg: "Error de configuración del servidor" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload: { id, rol, correo, ... }
    req.user = payload;
    next();
  } catch (err) {
    console.error("Error al verificar token:", err);
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
};
