import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email, link) {
  await resend.emails.send({
    from: `POS Facturix <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Activa tu cuenta - POS Facturix",
    html: `
      <h2>Bienvenido a POS Facturix</h2>
      <p>Para activar tu cuenta haz clic aquí:</p>
      <p>
        <a href="${link}" style="padding:10px 15px;background:#4CAF50;color:#fff;text-decoration:none;border-radius:5px;">
          Activar cuenta
        </a>
      </p>
      <p>Si no creaste esta cuenta, ignora este mensaje.</p>
    `
  });
}