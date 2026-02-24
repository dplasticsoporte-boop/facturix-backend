import admin from "../firebase.js";
import fetch from "node-fetch";

/* ================= HELPERS ================= */

// Sanitiza strings (defensa básica)
function sanitizeInput(input) {
  return String(input).replace(/[<>]/g, "").trim();
}

// Validar email
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Verificar reCAPTCHA (opcional)
async function verifyCaptcha(token) {
  if (!token) return false;

  const res = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET,
        response: token
      })
    }
  );

  const data = await res.json();
  return data.success === true;
}

/* ================= LOGIN ================= */

export async function login(email, password) {

  const cleanEmail = sanitizeInput(email);
  const cleanPassword = sanitizeInput(password);

  if (!validateEmail(cleanEmail))
    throw new Error("Correo inválido");

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

  if (!res.ok)
    throw new Error("Credenciales inválidas");

  // 🔒 Bloqueo si no activó la cuenta
  if (!data.emailVerified)
    throw new Error("Cuenta no activada. Revisa tu correo.");

  return {
    uid: data.localId,
    email: data.email,
    token: data.idToken
  };
}

/* ================= REGISTRO ================= */

export async function register(email, password, captcha) {

  if (!validateEmail(email))
    throw new Error("Correo inválido");

  if (password.length < 6)
    throw new Error("La contraseña debe tener mínimo 6 caracteres");

  // reCAPTCHA opcional
  if (captcha) {
    const isHuman = await verifyCaptcha(captcha);
    if (!isHuman)
      throw new Error("Captcha inválido");
  }

  // 1️⃣ Crear usuario en Firebase (NO verificado)
  const user = await admin.auth().createUser({
    email,
    password,
    emailVerified: false
  });

  // 2️⃣ Generar link de verificación
  const link = await admin.auth().generateEmailVerificationLink(email);

  // 3️⃣ Enviar correo (por ahora en consola)
  console.log("🔗 LINK DE ACTIVACIÓN:", link);

  return {
    message: "Cuenta creada. Revisa tu correo para activarla."
  };
}