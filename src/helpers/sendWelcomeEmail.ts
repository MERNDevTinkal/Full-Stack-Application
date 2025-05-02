import { sendEmail } from "@/lib/nodemailer";
import { welcomeEmailHTML } from "@/lib/emailTemplates/welcomeEmail";

export const sendWelcomeEmail = async ({
  email,
  username,
}: {
  email: string;
  username: string;
}) => {
  try {
    await sendEmail({
      to: email,
      subject: "Welcome to TrueFeedback!",
      html: welcomeEmailHTML(username),
    });
    return { success: true, message: "Welcome email sent successfully" };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, message: "Failed to send welcome email" };
  }
};

