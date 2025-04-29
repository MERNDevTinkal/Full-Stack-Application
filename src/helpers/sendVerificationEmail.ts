import { sendEmail } from "@/lib/nodemailer";
import { verificationEmailHTML } from "@/lib/emailTemplates/verificationEmail";

export const sendVerificationEmail = async (email: string, username: string, verifyCode: string) => {
  try {
    await sendEmail({
      to: email,
      subject: "TrueFeedback || Verify Your Email",
      html: verificationEmailHTML(username, verifyCode),
    });
    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Failed to send verification email" };
  }
};
