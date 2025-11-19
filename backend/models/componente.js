import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const componenteSchema = new Schema(
  {
    nombre: { type: String, required: true },

    categoria: {
      type: String,
      enum: [
        "placa",
        "batería",
        "pantalla",
        "cable",
        "periférico",
        "electrodoméstico",
        "otro",
      ],
      required: true,
      lowercase: true,
    },

    estado: {
      type: String,
      enum: ["reacondicionable", "reutilizable", "desecho"],
      required: true,
      lowercase: true,
    },

    descripcion: { type: String },

    ubicacion: { type: String },

    // 🗓️ Fecha en que se registró el componente
    fechaIngreso: { type: Date, default: Date.now },

    // 🧍 Responsable (nombre, o nombre + algo más que quieras guardar)
    responsable: { type: String },

    // ⚖️ Peso aproximado en kilos (opcional)
    pesoKg: {
      type: Number,
      min: 0,
    },

    // 📧 Correo del usuario asociado a este componente
    usuarioEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "componentes",
  }
);

const Componente =
  models.Componente || model("Componente", componenteSchema);

export default Componente;
