// backend/controllers/solicitudes-afiliado.controller.js
import SolicitudAfiliado from "../models/solicitud-afiliado.js";

// 🟢 Crear una nueva solicitud de afiliado
export const crearSolicitud = async (req, res) => {
  try {
    const {
      nombreCompleto,
      correo,
      telefono,
      direccion,
      ciudad,
      region,
      tipoOrganizacion,
      descripcionOrganizacion,
      capacidadAlmacenamiento,
      experienciaReciclaje,
      certificaciones,
      compromisoAmbiental,
      disponibilidadHoraria,
      mensajeAdicional,
      requisitosAceptados
    } = req.body;

    // Validar campos requeridos
    if (!nombreCompleto || !correo || !telefono || !direccion || !ciudad || !region) {
      return res.status(400).json({
        error: "Campos requeridos faltantes",
        detail: "Debes completar todos los campos obligatorios"
      });
    }

    if (!tipoOrganizacion || !descripcionOrganizacion || !capacidadAlmacenamiento) {
      return res.status(400).json({
        error: "Información de organización incompleta",
        detail: "Debes completar la información de tu organización"
      });
    }

    if (experienciaReciclaje === undefined || compromisoAmbiental === undefined) {
      return res.status(400).json({
        error: "Debes confirmar tu experiencia y compromiso ambiental"
      });
    }

    if (!disponibilidadHoraria) {
      return res.status(400).json({
        error: "Debes indicar tu disponibilidad horaria"
      });
    }

    // Validar que todos los requisitos estén aceptados
    if (requisitosAceptados && Array.isArray(requisitosAceptados)) {
      const todosAceptados = requisitosAceptados.every(r => r.aceptado === true);
      if (!todosAceptados) {
        return res.status(400).json({
          error: "Debes aceptar todos los requisitos para ser afiliado"
        });
      }
    }

    const nuevaSolicitud = new SolicitudAfiliado({
      nombreCompleto: nombreCompleto.trim(),
      correo: correo.toLowerCase().trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim(),
      ciudad: ciudad.trim(),
      region: region.trim(),
      tipoOrganizacion,
      descripcionOrganizacion: descripcionOrganizacion.trim(),
      capacidadAlmacenamiento,
      experienciaReciclaje: Boolean(experienciaReciclaje),
      certificaciones: certificaciones ? certificaciones.trim() : "",
      compromisoAmbiental: Boolean(compromisoAmbiental),
      disponibilidadHoraria: disponibilidadHoraria.trim(),
      mensajeAdicional: mensajeAdicional ? mensajeAdicional.trim() : "",
      requisitosAceptados: requisitosAceptados || [],
      estado: "pendiente"
    });

    await nuevaSolicitud.save();

    console.log("✅ Nueva solicitud de afiliado recibida:", {
      nombre: nombreCompleto,
      correo: correo,
      ciudad: ciudad
    });

    res.status(201).json({
      msg: "Solicitud enviada correctamente. Te contactaremos pronto.",
      solicitud: nuevaSolicitud
    });
  } catch (err) {
    console.error("crearSolicitud error:", err);
    res.status(400).json({
      error: "No se pudo crear la solicitud",
      detail: err?.message
    });
  }
};

// 🟢 Obtener todas las solicitudes (para administradores)
export const getSolicitudes = async (req, res) => {
  try {
    const { estado } = req.query;
    let query = {};

    if (estado) {
      query.estado = estado;
    }

    const solicitudes = await SolicitudAfiliado.find(query)
      .sort({ fechaSolicitud: -1 })
      .lean();

    res.json(solicitudes);
  } catch (err) {
    console.error("getSolicitudes error:", err);
    res.status(500).json({ error: "No se pudieron listar las solicitudes" });
  }
};

// 🟢 Obtener una solicitud específica
export const getSolicitud = async (req, res) => {
  try {
    const solicitud = await SolicitudAfiliado.findById(req.params.id);
    if (!solicitud) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }
    res.json(solicitud);
  } catch (err) {
    console.error("getSolicitud error:", err);
    res.status(400).json({ error: "ID inválido" });
  }
};

// 🟢 Actualizar estado de una solicitud (para administradores)
export const actualizarEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const estadosValidos = ["pendiente", "en_revision", "aprobada", "rechazada"];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        error: "Estado inválido",
        detail: `El estado debe ser uno de: ${estadosValidos.join(", ")}`
      });
    }

    const solicitud = await SolicitudAfiliado.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true, runValidators: true }
    );

    if (!solicitud) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    res.json({
      msg: "Estado actualizado correctamente",
      solicitud
    });
  } catch (err) {
    console.error("actualizarEstado error:", err);
    res.status(400).json({
      error: "No se pudo actualizar el estado",
      detail: err?.message
    });
  }
};

