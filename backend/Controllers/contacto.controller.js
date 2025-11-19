import ContactMessage from "../models/contacto.model.js";

// 🟢 Crear mensaje desde el formulario público
export const crearMensajeContacto = async (req, res) => {
  try {
    const { nombre, correo, mensaje } = req.body;

    if (!nombre || !correo || !mensaje) {
      return res.status(400).json({
        error: "Campos faltantes",
        detail: "Nombre, correo y mensaje son obligatorios",
      });
    }

    const nuevo = new ContactMessage({ nombre, correo, mensaje });
    await nuevo.save();

    // aquí podrías además enviar un correo si quisieras...

    return res.status(201).json({
      msg: "Mensaje recibido correctamente",
      mensaje: nuevo,
    });
  } catch (err) {
    console.error("crearMensajeContacto error:", err);
    return res
      .status(500)
      .json({ error: "No se pudo guardar el mensaje", detail: err?.message });
  }
};

// 🟢 Listar todos los mensajes (vista admin)
export const getMensajesContacto = async (req, res) => {
  try {
    const mensajes = await ContactMessage.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.json(mensajes);
  } catch (err) {
    console.error("getMensajesContacto error:", err);
    return res
      .status(500)
      .json({ error: "No se pudieron listar los mensajes" });
  }
};
