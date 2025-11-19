import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const contactMessageSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    correo: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Correo inválido"],
    },
    mensaje: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    collection: "contact_messages",
    versionKey: false,
  }
);

const ContactMessage =
  models.ContactMessage || model("ContactMessage", contactMessageSchema);

export default ContactMessage;
