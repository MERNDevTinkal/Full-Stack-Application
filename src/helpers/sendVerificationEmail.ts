import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/apiRespoce";

export async function sendVerificationEmail(
    email : string,
    username  : string,
    verifyCode : string,

): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'noreply@onresend.dev',
            to: email,
            subject: 'TrueFeedback || Verification Code ',
            react: VerificationEmail({username,otp : verifyCode}),
          });
        return{
            success : true,
            message : "verification email sent successfully",
        }
    } catch (error) {
        console.error("Error sending verification email:", error);
        return{
            success : false,
            message : "failed to send verification email"
        }
    }
}