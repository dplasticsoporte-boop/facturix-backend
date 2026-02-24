import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const testMail = async (req, res) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "POS Facturix <onboarding@resend.dev>",
      to: "TU_CORREO_REAL@gmail.com",
      subject: "TEST RESEND",
      html: "<h1>Si ves este correo, Resend SÍ funciona</h1>"
    });

    if (error) {
      console.error("❌ RESEND ERROR:", error);
      return res.status(500).json(error);
    }

    console.log("✅ RESEND OK:", data);
    res.json({ ok: true, data });
  } catch (err) {
    console.error("🔥 EXCEPTION:", err);
    res.status(500).json({ error: err.message });
  }
};

export default testMail; // 👈 ESTA LÍNEA ES LA CLAVE