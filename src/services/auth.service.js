import admin from "../firebase.js";
import fetch from "node-fetch";
import { sendVerificationEmail } from "./email.service.js";

/* ================= HELPERS ================= */

// Sanitizar input (básico)
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

  if (!validateEmail(cleanEmail)) {
    throw new Error("Correo inválido");
  }

  const apiKey = process.env.FIREBASE_API_KEY;

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

  if (!res.ok) {
    throw new Error("Credenciales inválidas");
  }

  // 🔓 PERMITIR LOGIN AUNQUE NO ESTÉ VERIFICADO
  return {
    uid: data.localId,
    email: data.email,
    token: data.idToken,
    emailVerified: data.emailVerified ?? false // 👈 info para el frontend
  };
}

/* ================= REGISTRO ================= */

export async function register(email, password) {
  const cleanEmail = sanitizeInput(email);

  if (!validateEmail(cleanEmail)) {
    throw new Error("Correo inválido");
  }

  if (!password || password.length < 6) {
    throw new Error("La contraseña debe tener mínimo 6 caracteres");
  }

  // 1️⃣ Crear usuario en Firebase (NO verificado)
  await admin.auth().createUser({
    email: cleanEmail,
    password,
    emailVerified: false
  });

  // 2️⃣ Generar link de activación
  const link = await admin.auth().generateEmailVerificationLink(cleanEmail);

  // 3️⃣ Enviar correo de verificación
  await sendVerificationEmail(cleanEmail, link);

  return {
    message: "Cuenta creada. Revisa tu correo para activarla."
  };
}