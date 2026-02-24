import express from "express";
import { login, register } from "../services/auth.service.js";

const router = express.Router();

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Datos incompletos" });

    const user = await login(email, password);
    res.json(user);

  } catch (e) {
    // 🔥 DEVOLVER EL ERROR REAL
    res.status(401).json({ error: e.message });
  }
});

/* ================= REGISTRO ================= */
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Datos incompletos" });

    const result = await register(email, password);
    res.json(result);

  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;