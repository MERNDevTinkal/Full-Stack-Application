import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_PROVIDER!,
    pass: process.env.MAIL_PASSWORD!,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM!,
    to,
    subject,
    html,
  });
};
