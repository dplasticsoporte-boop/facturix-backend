import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function testMail(req, res) {
  try {
    const { data, error } = await resend.emails.send({
      from: "POS Facturix <onboarding@resend.dev>",
      to: "dplastic.soporte@gmail.com", // ← cámbialo
      subject: "TEST RESEND",
      html: "<h1>Si ves esto, Resend FUNCIONA</h1>"
    });

    if (error) {
      console.error("❌ RESEND ERROR:", error);
      return res.status(500).json(error);
    }

    console.log("✅ RESEND OK:", data);
    res.json(data);
  } catch (e) {
    console.error("🔥 EXCEPTION:", e);
    res.status(500).json(e);
  }
}