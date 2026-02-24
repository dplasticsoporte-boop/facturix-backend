import { auth } from "../firebase.js";

export async function verifyToken(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ error: "Authorization header requerido" });
    }

    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ error: "Formato Bearer inválido" });
    }

    const decoded = await auth.verifyIdToken(token, true);

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role || "user"
    };

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ error: "No autorizado" });
  }
}