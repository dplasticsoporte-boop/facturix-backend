import { Router } from "express";
import { crearVentaController } from "../controllers/ventas.controller.js";

const router = Router();

/**
 * GET /ventas
 * Solo informativo (para navegador)
 */
router.get("/", (req, res) => {
  res.json({
    mensaje: "Usa POST /ventas para crear una venta"
  });
});

/**
 * POST /ventas
 * Crear venta
 */
router.post("/", crearVentaController);

export default router;