import nodemailer from "nodemailer";

// Types pour une signature propre
type MailOptions = {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
};

export async function sendMail({ to, subject, text, html }: MailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // STARTTLS (pas SSL direct)
      auth: {
        user: "be1svcmail@servier.com", // l'email de l'expéditeur
        pass: "Servier57+", // le mot de passe de l'expéditeur
      },
      tls: {
        rejectUnauthorized: false, // utile pour certaines configs Azure
      },
    });

    const info = await transporter.sendMail({
      from: `"Servier BELGIUM" <be1svcmail@servier.com>`, // l'email de l'expéditeur
      to,
      subject,
      text,
      html,
    });

    console.log(`📤 Mail envoyé à ${to} (MessageID: ${info.messageId})`);
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur envoi mail:", error);
    return { success: false, error };
  }
}
