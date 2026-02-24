// backend/src/controllers/productos.controller.js
import {
  crearProducto,
  listarProductos,
  asignarQR,
  sumarPaquete,
  restarPaquete,
  actualizarStockExacto
} from "../services/productos.service.js";

export async function crear(req, res) {
  try {
    const uid = req.headers.uid;
    const producto = await crearProducto(uid, req.body);
    res.json(producto);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function listar(req, res) {
  const uid = req.headers.uid;
  const data = await listarProductos(uid);
  res.json(data);
}

export async function qr(req, res) {
  const uid = req.headers.uid;
  const { id } = req.params;
  const { codigoQR } = req.body;

  await asignarQR(uid, id, codigoQR);
  res.json({ ok: true });
}

// ➕ sumar 1 paquete completo
export async function sumar(req, res) {
  try {
    const uid = req.headers.uid;
    const { id } = req.params;

    const r = await sumarPaquete(uid, id);
    res.json(r);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

// ➖ restar 1 paquete completo
export async function restar(req, res) {
  try {
    const uid = req.headers.uid;
    const { id } = req.params;

    const r = await restarPaquete(uid, id);
    res.json(r);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

// 🎯 setear stock exacto
export async function actualizarStock(req, res) {
  try {
    const uid = req.headers.uid;
    const { id } = req.params;
    const { stockUnidades } = req.body;

    if (typeof stockUnidades !== "number") {
      return res.status(400).json({ error: "stockUnidades inválido" });
    }

    const r = await actualizarStockExacto(uid, id, stockUnidades);
    res.json(r);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}