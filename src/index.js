import express from "express";
import "dotenv/config";
import cors from "cors";

import ventasRoutes from "./routes/ventas.js";
import productosRoutes from "./routes/productos.js";
import authRoutes from "./routes/auth.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// test
app.get("/", (req, res) => {
  res.json({ ok: true, mensaje: "API Facturix online 🚀" });
});

// APIs
app.use("/auth", authRoutes);
app.use("/ventas", ventasRoutes);
app.use("/productos", productosRoutes);

// 🔑 PUERTO DINÁMICO (CLAVE)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API corriendo en puerto", PORT);
});