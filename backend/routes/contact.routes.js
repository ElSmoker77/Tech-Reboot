import express from "express";
import {
  crearMensajeContacto,
  getMensajesContacto,
} from "../Controllers/contacto.controller.js";

const router = express.Router();

// Ruta pública para enviar mensaje de contacto
router.post("/", crearMensajeContacto);

// Ruta para admin: listar todos los mensajes
router.get("/", getMensajesContacto);

export default router;
