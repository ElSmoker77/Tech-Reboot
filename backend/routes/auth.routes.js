// backend/routes/auth.routes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { verificarToken } from "../middleware/auth.middleware.js";

const router = express.Router();

const normalizarCorreo = (value = "") => value.trim().toLowerCase();

// 🔒 Admin fijo en código (DEV)
const ADMIN_EMAIL = "admin@techreboot.cl";
const ADMIN_PASSWORD = "abc123";

const esCorreoAdmin = (correo = "") => {
  return normalizarCorreo(correo) === ADMIN_EMAIL;
};

// 🟢 Registro
router.post("/register", async (req, res) => {
  try {
    const { nombre, password } = req.body;
    const correo = normalizarCorreo(req.body.correo || req.body.email);

    console.log("📝 [REGISTER] Intento de registro:", { nombre, correo });

    if (!nombre || !correo || !password) {
      console.log("📝 [REGISTER] Faltan campos");
      return res.status(400).json({ msg: "Faltan campos obligatorios" });
    }

    // 🔒 No permitir registrar el correo del admin fijo
    if (esCorreoAdmin(correo)) {
      console.log("📝 [REGISTER] Intento de registrar correo ADMIN, bloqueado");
      return res.status(403).json({
        msg: "No se permite el registro de la cuenta de administrador.",
      });
    }

    const userExistente = await User.findOne({ correo });
    if (userExistente) {
      console.log("📝 [REGISTER] Usuario ya existe:", correo);
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    const hash = await bcrypt.hash(password, 10);
    const nuevoUsuario = new User({ nombre, correo, password: hash });
    await nuevoUsuario.save();

    console.log("✅ [REGISTER] Usuario registrado:", correo);

    res.status(201).json({
      msg: "Usuario registrado correctamente",
      correo,
    });
  } catch (err) {
    console.error("❌ [REGISTER] Error en /register:", err);
    res.status(500).json({
      msg: "Error al registrar usuario",
      error: err.message,
    });
  }
});

// 🟢 Login
router.post("/login", async (req, res) => {
  try {
    const { password } = req.body;
    const correo = normalizarCorreo(req.body.correo || req.body.email);

    console.log("🔐 [LOGIN] Intento de login con:", correo);

    if (!correo || !password) {
      console.log("🔐 [LOGIN] Credenciales incompletas");
      return res.status(400).json({ msg: "Credenciales incompletas" });
    }

    // 🔑 Login especial para ADMIN fijo
    if (esCorreoAdmin(correo)) {
      console.log("🔐 [LOGIN] Login ADMIN detectado");

      // Validar password contra la fija
      if (password !== ADMIN_PASSWORD) {
        console.log("🔐 [LOGIN] Password ADMIN incorrecta");
        return res.status(401).json({ msg: "Contraseña incorrecta" });
      }

      if (!process.env.JWT_SECRET) {
        console.error("❌ [LOGIN] Falta JWT_SECRET en variables de entorno");
        return res
          .status(500)
          .json({ msg: "Configuración de servidor incompleta" });
      }

      // Token para admin (id virtual)
      const token = jwt.sign(
        {
          id: "admin-fixed",
          rol: "admin",
          correo: ADMIN_EMAIL,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      console.log("✅ [LOGIN] Admin autenticado, enviando token");

      return res.json({
        msg: "Login exitoso (admin)",
        token,
        correo: ADMIN_EMAIL,
        rol: "admin",
        esAdmin: true,
      });
    }

    // 🔐 Login normal para usuarios registrados en BD
    console.log("🔐 [LOGIN] Login de usuario normal");

    const user = await User.findOne({ correo });
    if (!user) {
      console.log("🔐 [LOGIN] Usuario no encontrado:", correo);
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const passwordCorrecta = await bcrypt.compare(password, user.password);
    if (!passwordCorrecta) {
      console.log("🔐 [LOGIN] Password incorrecta para:", correo);
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ [LOGIN] Falta JWT_SECRET en variables de entorno");
      return res
        .status(500)
        .json({ msg: "Configuración de servidor incompleta" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        rol: "user",
        correo: user.correo,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ [LOGIN] Usuario autenticado, enviando token:", user.correo);

    res.json({
      msg: "Login exitoso",
      token,
      correo: user.correo,
      rol: "user",
      esAdmin: false,
    });
  } catch (err) {
    console.error("❌ [LOGIN] Error en /login:", err);
    res.status(500).json({
      msg: "Error al iniciar sesión",
      error: err.message,
    });
  }
});

// 🟢 Obtener datos del usuario actual (desde token)
router.get("/me", verificarToken, async (req, res) => {
  try {
    console.log("👤 [ME] Payload del token:", req.user);

    // Si es el admin fijo (id "admin-fixed" que usas en el login)
    if (req.user.id === "admin-fixed") {
      console.log("👤 [ME] Es admin fijo");
      return res.json({
        id: "admin-fixed",
        correo: ADMIN_EMAIL,
        rol: "admin",
        esAdmin: true,
      });
    }

    // Usuario normal → buscar en la BD
    const user = await User.findById(req.user.id).select("nombre correo rol");

    if (!user) {
      console.log("👤 [ME] Usuario no encontrado en BD:", req.user.id);
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Si no tienes campo rol en el schema, esto asegura algo por defecto
    const rol = user.rol || "user";

    console.log("✅ [ME] Usuario encontrado:", {
      id: user._id,
      correo: user.correo,
      rol,
    });

    res.json({
      id: user._id,
      nombre: user.nombre,
      correo: user.correo,
      rol,
      esAdmin: rol === "admin",
    });
  } catch (err) {
    console.error("❌ [ME] Error en /auth/me:", err);
    res.status(500).json({
      msg: "Error al obtener datos del usuario",
      error: err.message,
    });
  }
});

export default router;
