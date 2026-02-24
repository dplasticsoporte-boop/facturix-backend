import admin from "../firebase.js";
import fetch from "node-fetch";
import { sendVerificationEmail } from "../utils/mailer.js";

/* ================= HELPERS ================= */

// Sanitiza strings (defensa básica)
function sanitizeInput(input) {
  return String(input).replace(/[<>]/g, "").trim();
}

// Validar email
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ================= LOGIN ================= */

export async function login(email, password) {

  const cleanEmail = sanitizeInput(email);
  const cleanPassword = sanitizeInput(password);

  if (!validateEmail(cleanEmail))
    throw new Error("Correo inválido");

  const apiKey = process.env.FIREBASE_API_KEY;

  // 🔐 Login Firebase REST
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: cleanEmail,
        password: cleanPassword,
        returnSecureToken: true
      })
    }
  );

  const data = await res.json();

  if (!res.ok)
    throw new Error("Credenciales inválidas");

  // 🔎 Consultar usuario real en Firebase Admin
  const userRecord = await admin.auth().getUserByEmail(cleanEmail);

  // 🔒 Bloquear si no activó el correo
  if (!userRecord.emailVerified)
    throw new Error("Cuenta no activada. Revisa tu correo.");

  return {
    uid: data.localId,
    email: data.email,
    token: data.idToken
  };
}

/* ================= REGISTRO ================= */

export async function register(email, password) {

  if (!validateEmail(email))
    throw new Error("Correo inválido");

  if (!password || password.length < 6)
    throw new Error("La contraseña debe tener mínimo 6 caracteres");

  // 1️⃣ Crear usuario NO verificado
  const user = await admin.auth().createUser({
    email,
    password,
    emailVerified: false
  });

  // 2️⃣ Generar link de verificación
  const link = await admin.auth().generateEmailVerificationLink(email);

  // 3️⃣ Enviar correo REAL
  await sendVerificationEmail(email, link);

  return {
    message: "Cuenta creada. Revisa tu correo para activarla."
  };
}