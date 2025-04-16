import nodemailer from "nodemailer";

interface ISendEmail {
  email: string;
  html: string;
  subject: string;
}

const emailVerificationHTML = (link: string) => {
  return `<h1>Email verification link</h1>
    <p>Click here to verify your email:<br>
    <a href="${link}">${link}</a>. Please, don't share this link
    </p>`;
};

async function sendEmail(options: ISendEmail) {
  const transporter = nodemailer.createTransport({
    host: import.meta.env.SMTP_HOST || import.meta.env.PUBLIC_SMTP_HOST,
    port: import.meta.env.SMTP_PORT || import.meta.env.PUBLIC_SMTP_PORT,
    auth: {
      user:
        import.meta.env.SMTP_USERNAME || import.meta.env.PUBLIC_SMTP_USERNAME,
      pass:
        import.meta.env.SMTP_PASSWORD || import.meta.env.PUBLIC_SMTP_PASSWORD,
    },
  });

  const message = {
    from: import.meta.env.SMTP_USERNAME || import.meta.env.PUBLIC_SMTP_USERNAME,
    to: options.email,
    subject: options.subject,
    name: "Quiz App",
    html: options.html,
  };

  const info = await transporter.sendMail(message);

  return info;
}

export { sendEmail, emailVerificationHTML };
