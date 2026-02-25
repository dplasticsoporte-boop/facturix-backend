import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendVerificationEmail(email, link) {
  await transporter.sendMail({
    from: "POS Facturix <dplastic.soporte@gmail.com>",
    to: email,
    subject: "Activa tu cuenta - POS Facturix",
    html: `
      <h2>Bienvenido a POS Facturix</h2>
      <p>Para activar tu cuenta haz clic aquí:</p>
      <a href="${link}">Activar cuenta</a>
    `,
  });
}