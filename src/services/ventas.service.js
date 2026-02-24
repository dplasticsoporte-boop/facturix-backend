// backend/src/services/ventas.service.js
import { db } from "../firebase.js";

export async function crearVenta(uid, productosVenta) {
  let total = 0;
  const detalle = [];

  for (const p of productosVenta) {
    const ref = db.ref(`usuarios/${uid}/productos/${p.id}`);
    const snap = await ref.get();

    if (!snap.exists()) {
      throw new Error("Producto no existe");
    }

    const producto = snap.val();

    /**
     * p viene del frontend así:
     * {
     *   id,
     *   tipo: "PAQUETE" | "UNIDAD",
     *   precio,
     *   cantidad,   // cuántos paquetes o unidades vendidas
     *   unidades    // cuántas unidades reales descuenta
     * }
     */

    if (producto.stockUnidades < p.unidades) {
      throw new Error(
        `Stock insuficiente de ${producto.nombre}. Disponible: ${producto.stockUnidades}`
      );
    }

    // 🔻 DESCONTAR UNIDADES REALES
    const stockUnidades = producto.stockUnidades - p.unidades;

    // 🔑 RECALCULAR PAQUETES DESDE STOCK REAL
    const paquetes = Math.floor(
      stockUnidades / producto.unidadesPorPaquete
    );

    // ✅ actualizar ambos
    await ref.update({
      stockUnidades,
      paquetes
    });

    const subtotal = p.precio * p.cantidad;
    total += subtotal;

    detalle.push({
      id: p.id,
      nombre: producto.nombre,
      tipo: p.tipo,
      precio: p.precio,
      cantidad: p.cantidad,
      unidades: p.unidades,
      subtotal
    });
  }

  const venta = {
    fecha: Date.now(),
    total,
    detalle
  };

  // guardar venta
  await db.ref(`usuarios/${uid}/ventas`).push(venta);

  return venta;
}