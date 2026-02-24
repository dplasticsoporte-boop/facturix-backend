// backend/src/controllers/ventas.controller.js
import { crearVenta } from "../services/ventas.service.js";

export async function crearVentaController(req, res) {
  try {
    const uid = req.user.uid; // 🔐 UID seguro desde Firebase
    const { productos } = req.body;

    if (!productos || productos.length === 0) {
      return res.status(400).json({ error: "No hay productos" });
    }

    const venta = await crearVenta(uid, productos);

    res.json({
      ok: true,
      venta
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}