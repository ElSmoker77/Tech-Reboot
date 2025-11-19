import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  email: String,
  tipo: String,
  modelo: String
});

export default mongoose.model("Device", deviceSchema);
