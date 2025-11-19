import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const solicitudAfiliadoSchema = new Schema(
  {
    nombreCompleto: { type: String, required: true, trim: true },
    correo: { 
      type: String, 
      required: true, 
      lowercase: true, 
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Por favor ingresa un correo válido"]
    },
    telefono: { type: String, required: true, trim: true },
    direccion: { type: String, required: true, trim: true },
    ciudad: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    tipoOrganizacion: { 
      type: String, 
      required: true,
      enum: ["comunidad", "empresa", "institucion", "municipalidad", "otro"]
    },
    descripcionOrganizacion: { type: String, required: true },
    capacidadAlmacenamiento: { 
      type: String, 
      required: true,
      enum: ["pequeño", "mediano", "grande"]
    },
    experienciaReciclaje: { type: Boolean, required: true },
    certificaciones: { type: String, default: "" },
    compromisoAmbiental: { type: Boolean, required: true },
    disponibilidadHoraria: { type: String, required: true },
    mensajeAdicional: { type: String, default: "" },
    requisitosAceptados: [{
      id: { type: String, required: true },
      aceptado: { type: Boolean, required: true }
    }],
    estado: {
      type: String,
      enum: ["pendiente", "en_revision", "aprobada", "rechazada"],
      default: "pendiente"
    },
    fechaSolicitud: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "solicitudes_afiliado",
  }
);

const SolicitudAfiliado =
  models.SolicitudAfiliado || model("SolicitudAfiliado", solicitudAfiliadoSchema);

export default SolicitudAfiliado;

