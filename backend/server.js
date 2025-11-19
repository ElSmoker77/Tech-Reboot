import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import devicesRoutes from "./routes/devices.routes.js";
import tutorialsRoutes from "./routes/tutorials.routes.js";
import componentesRoutes from "./routes/componentes.routes.js";
import solicitudesAfiliadoRoutes from "./routes/solicitudes-afiliado.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 👈 asegura que se lean datos tipo form

// 🔌 Conexión MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.error("❌ Error al conectar MongoDB:", err));

// 🧩 Rutas
app.use("/api/auth", authRoutes);
app.use("/api/componentes", componentesRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/devices", devicesRoutes);
app.use("/api/tutorials", tutorialsRoutes);
app.use("/api/solicitudes-afiliado", solicitudesAfiliadoRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 🚀 Servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
