import express from "express";
import {
  crearSolicitud,
  getSolicitudes,
  getSolicitud,
  actualizarEstado
} from "../Controllers/solicitudes-afiliado.controller.js";

const router = express.Router();

// Ruta pública para crear solicitudes
router.post("/", crearSolicitud);

// Rutas para administradores (puedes agregar middleware de autenticación aquí)
router.get("/", getSolicitudes);
router.get("/:id", getSolicitud);
router.patch("/:id/estado", actualizarEstado);

export default router;

