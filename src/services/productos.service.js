// backend/src/services/productos.service.js
import { db } from "../firebase.js";

/* ==============================
   CREAR PRODUCTO
================================ */
export async function crearProducto(uid, data) {
  const id = "PROD_" + Date.now();

  const {
    nombre,
    precioPaquete,
    precioUnidad,
    paquetes,
    unidadesPorPaquete
  } = data;

  const stockUnidades = paquetes * unidadesPorPaquete;

  const precios = [precioPaquete];
  if (precioUnidad > 0) precios.push(precioUnidad);

  const producto = {
    nombre,
    precioPaquete,
    precioUnidad: precioUnidad || 0,
    precios,
    paquetes,
    unidadesPorPaquete,
    stockUnidades,
    codigoQR: ""
  };

  await db.ref(`usuarios/${uid}/productos/${id}`).set(producto);
  return { id, ...producto };
}

/* ==============================
   LISTAR PRODUCTOS
================================ */
export async function listarProductos(uid) {
  const snap = await db.ref(`usuarios/${uid}/productos`).get();
  return snap.exists() ? snap.val() : {};
}

/* ==============================
   ASIGNAR QR
================================ */
export async function asignarQR(uid, id, codigoQR) {
  await db.ref(`usuarios/${uid}/productos/${id}`).update({ codigoQR });
  return true;
}

/* ==============================
   SUMAR PAQUETE
================================ */
export async function sumarPaquete(uid, id) {
  const ref = db.ref(`usuarios/${uid}/productos/${id}`);
  const snap = await ref.get();
  if (!snap.exists()) throw new Error("Producto no existe");

  const p = snap.val();

  const stockUnidades =
    (p.stockUnidades || 0) + p.unidadesPorPaquete;

  const paquetes = Math.floor(
    stockUnidades / p.unidadesPorPaquete
  );

  await ref.update({ stockUnidades, paquetes });
  return { stockUnidades, paquetes };
}

/* ==============================
   RESTAR PAQUETE
================================ */
export async function restarPaquete(uid, id) {
  const ref = db.ref(`usuarios/${uid}/productos/${id}`);
  const snap = await ref.get();
  if (!snap.exists()) throw new Error("Producto no existe");

  const p = snap.val();

  if ((p.stockUnidades || 0) < p.unidadesPorPaquete) {
    throw new Error("No hay stock suficiente para restar un paquete");
  }

  const stockUnidades =
    p.stockUnidades - p.unidadesPorPaquete;

  const paquetes = Math.floor(
    stockUnidades / p.unidadesPorPaquete
  );

  await ref.update({ stockUnidades, paquetes });
  return { stockUnidades, paquetes };
}

/* ==============================
   ACTUALIZAR STOCK EXACTO
================================ */
export async function actualizarStockExacto(uid, id, stockUnidades) {
  const ref = db.ref(`usuarios/${uid}/productos/${id}`);
  const snap = await ref.get();

  if (!snap.exists()) throw new Error("Producto no existe");
  if (stockUnidades < 0) throw new Error("Stock no puede ser negativo");

  const p = snap.val();

  const paquetes = Math.floor(
    stockUnidades / p.unidadesPorPaquete
  );

  await ref.update({ stockUnidades, paquetes });
  return { stockUnidades, paquetes };
}