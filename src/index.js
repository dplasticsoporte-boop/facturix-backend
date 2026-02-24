import express from "express";
import "dotenv/config";
import cors from "cors";

import ventasRoutes from "./routes/ventas.js";
import productosRoutes from "./routes/productos.js";
import authRoutes from "./routes/auth.js";
import testMail from "./routes/test-mail.js"; // 👈 AÑADIDO
import { verifyToken } from "./middlewares/auth.middleware.js";

const app = express();

// middlewares globales
app.use(cors());
app.use(express.json());

// test público
app.get("/", (req, res) => {
  res.json({ ok: true, mensaje: "API Facturix online 🚀" });
});

// 🔥 TEST RESEND (público)
app.get("/test-mail", testMail); // 👈 AÑADIDO

// APIs
app.use("/auth", authRoutes); // 🔓 público
app.use("/ventas", verifyToken, ventasRoutes);     // 🔒 privado
app.use("/productos", verifyToken, productosRoutes); // 🔒 privado

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API corriendo en puerto", PORT);
});