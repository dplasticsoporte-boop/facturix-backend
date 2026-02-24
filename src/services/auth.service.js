import admin from "../firebase.js";
import fetch from "node-fetch";

/* ===== LOGIN REAL ===== */
export async function login(email, password) {
  const apiKey = process.env.FIREBASE_API_KEY;

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Credenciales inválidas");
  }

  return {
    uid: data.localId,
    email: data.email,
    token: data.idToken
  };
}

/* ===== REGISTRO ===== */
export async function register(email, password) {
  const user = await admin.auth().createUser({
    email,
    password
  });

  return {
    uid: user.uid,
    email: user.email
  };
}