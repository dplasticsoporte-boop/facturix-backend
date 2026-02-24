import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendVerificationEmail(email, link) {
  await transporter.sendMail({
    from: `"POS Facturix" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Activa tu cuenta - POS Facturix",
    html: `
      <h2>Bienvenido a POS Facturix</h2>
      <p>Para activar tu cuenta, haz clic en el siguiente enlace:</p>
      <a href="${link}">👉 Activar cuenta</a>
      <br><br>
      <p>Si no creaste esta cuenta, ignora este mensaje.</p>
    `
  });
}