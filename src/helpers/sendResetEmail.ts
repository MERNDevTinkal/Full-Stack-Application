import { sendEmail } from "@/lib/nodemailer";
import { resetEmailHTML } from "@/lib/emailTemplates/resetPasswordEmail";

export const sendResetEmail = async (email: string, username: string, resetLink: string) => {
  try {
    await sendEmail({
      to: email,
      subject: "TrueFeedback || Reset Your Password",
      html: resetEmailHTML(username, resetLink),
    });
    return { success: true, message: "Reset password email sent successfully." };
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return { success: false, message: "Failed to send reset password email." };
  }
};
