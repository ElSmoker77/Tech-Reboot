import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ msg: "Ruta de tutoriales activa" });
});

export default router;
