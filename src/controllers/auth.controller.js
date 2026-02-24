import { auth } from "../firebase.js";

export async function register(req, res) {
  try {
    const { email, password } = req.body;

    const user = await auth.createUser({
      email,
      password
    });

    res.json({
      uid: user.uid,
      email: user.email
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function login(req, res) {
  res.status(400).json({
    error: "Login se hace desde frontend con Firebase Auth"
  });
}