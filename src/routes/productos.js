// backend/src/routes/productos.js
import { Router } from "express";
import {
  crear,
  listar,
  qr,
  sumar,
  restar,
  actualizarStock
} from "../controllers/productos.controller.js";

const router = Router();

// 🔎 DEBUG
router.get("/debug", (req, res) => {
  res.json({ mensaje: "Ruta productos viva" });
});

// CRUD
router.post("/", crear);
router.get("/", listar);
router.put("/:id/qr", qr);

// STOCK
router.put("/:id/sumar", sumar);           // +1 paquete
router.put("/:id/restar", restar);         // -1 paquete
router.put("/:id/stock", actualizarStock); // set exacto

export default router;