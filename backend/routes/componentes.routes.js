import { Router } from "express";
import {
  getComponentes,
  crearComponente,
  getComponente,
  editarComponente,
  eliminarComponente
} from "../Controllers/componentes.controller.js";

const router = Router();

// CRUD
router.get("/", getComponentes);
router.post("/", crearComponente);
router.get("/:id", getComponente);
router.put("/:id", editarComponente);
router.delete("/:id", eliminarComponente);

export default router;
