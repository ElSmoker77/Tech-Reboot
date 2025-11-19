// backend/controllers/componentes.controller.js
import Componente from "../models/componente.js";

// helpers
const normalizarCorreo = (value = "") => value.trim().toLowerCase();
const ADMIN_EMAIL = "admin@techreboot.cl";
const esAdmin = (correo = "") => normalizarCorreo(correo) === ADMIN_EMAIL;

// 🟢 Obtener componentes (todos o filtrados por usuarioEmail)
export const getComponentes = async (req, res) => {
  try {
    const { usuarioEmail } = req.query; // ej: /api/componentes?usuarioEmail=alguien@dominio.cl
    let componentes;

    if (usuarioEmail) {
      const correoNormalizado = normalizarCorreo(usuarioEmail);

      if (esAdmin(correoNormalizado)) {
        // 👑 ADMIN → ve TODOS los componentes, sin filtro
        componentes = await Componente.find().lean();
      } else {
        // 🙋 Usuario normal → solo sus registros
        componentes = await Componente.find({
          usuarioEmail: correoNormalizado,
        }).lean();
      }
    } else {
      // Sin usuarioEmail → todos (útil si algún día haces vistas públicas / internas)
      componentes = await Componente.find().lean();
    }

    res.json(componentes);
  } catch (err) {
    console.error("getComponentes error:", err);
    res.status(500).json({ error: "No se pudieron listar componentes" });
  }
};

// 🟢 Crear un nuevo componente
export const crearComponente = async (req, res) => {
  try {
    const { usuarioEmail, ...datos } = req.body;

    if (!usuarioEmail) {
      return res
        .status(400)
        .json({
          error: "No se pudo crear componente",
          detail: "Falta usuarioEmail",
        });
    }

    const correoNormalizado = normalizarCorreo(usuarioEmail);

    const nuevo = new Componente({
      ...datos,
      // si no mandas responsable desde el front, queda como undefined
      responsable: datos.responsable || undefined,
      usuarioEmail: correoNormalizado,
      // el resto de campos: nombre, categoria, estado, descripcion, ubicacion,
      // fechaIngreso (si no viene, usa default), pesoKg (opcional), etc.
    });

    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    console.error("crearComponente error:", err);
    res
      .status(400)
      .json({ error: "No se pudo crear componente", detail: err?.message });
  }
};

// 🟢 Obtener un componente específico
export const getComponente = async (req, res) => {
  try {
    const item = await Componente.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "No encontrado" });
    res.json(item);
  } catch (err) {
    console.error("getComponente error:", err);
    res.status(400).json({ error: "ID inválido" });
  }
};

// 🟢 Editar componente
export const editarComponente = async (req, res) => {
  try {
    if (req.body?.usuarioEmail) {
      req.body.usuarioEmail = normalizarCorreo(req.body.usuarioEmail);
    }

    const upd = await Componente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!upd) return res.status(404).json({ error: "No encontrado" });
    res.json(upd);
  } catch (err) {
    console.error("editarComponente error:", err);
    res
      .status(400)
      .json({ error: "No se pudo actualizar", detail: err?.message });
  }
};

// 🟢 Eliminar componente
export const eliminarComponente = async (req, res) => {
  try {
    const del = await Componente.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ error: "No encontrado" });
    res.json({ ok: true });
  } catch (err) {
    console.error("eliminarComponente error:", err);
    res
      .status(400)
      .json({ error: "No se pudo eliminar", detail: err?.message });
  }
};
