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
    const uid = req.user.uid;
    const producto = await crearProducto(uid, req.body);
    res.json(producto);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function listar(req, res) {
  const uid = req.user.uid;
  const data = await listarProductos(uid);
  res.json(data);
}

export async function qr(req, res) {
  const uid = req.user.uid;
  const { id } = req.params;
  const { codigoQR } = req.body;

  await asignarQR(uid, id, codigoQR);
  res.json({ ok: true });
}

// ➕ sumar paquetes (hasta 10)
export async function sumar(req, res) {
  try {
    const uid = req.user.uid;
    const { id } = req.params;
    const { cantidad } = req.body; // Obtener la cantidad de paquetes

    // Validar que la cantidad esté entre 1 y 10
    if (typeof cantidad !== 'number' || cantidad < 1 || cantidad > 10) {
      return res.status(400).json({ error: 'La cantidad debe ser un número entre 1 y 10' });
    }

    const r = await sumarPaquete(uid, id, cantidad); // Pasar cantidad a la función de servicio
    res.json(r);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

// ➖ restar paquetes (hasta 10)
export async function restar(req, res) {
  try {
    const uid = req.user.uid;
    const { id } = req.params;
    const { cantidad } = req.body; // Obtener la cantidad de paquetes

    // Validar que la cantidad esté entre 1 y 10
    if (typeof cantidad !== 'number' || cantidad < 1 || cantidad > 10) {
      return res.status(400).json({ error: 'La cantidad debe ser un número entre 1 y 10' });
    }

    const r = await restarPaquete(uid, id, cantidad); // Pasar cantidad a la función de servicio
    res.json(r);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

// 🎯 setear stock exacto
export async function actualizarStock(req, res) {
  try {
    const uid = req.user.uid;
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