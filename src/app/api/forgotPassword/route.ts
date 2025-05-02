import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendResetEmail } from "@/helpers/sendResetEmail";
import crypto from "crypto";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { email } = await req.json();

    // Check if user exists and is verified
    const user = await UserModel.findOne({ email });
    if (!user || !user.isVerified) {
      return NextResponse.json(
        { success: false, message: "Email not registered or verified." },
        { status: 404 }
      );
    }

    // Generate secure reset token and expiry time
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token and expiry to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpire;
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_URL}/reset-password/${resetToken}`;

    // Send reset email
    const result = await sendResetEmail(user.email, user.username, resetUrl);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Reset link sent to your email." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot password route:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
