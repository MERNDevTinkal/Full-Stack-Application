import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/helpers/sendWelcomeEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodedUserName = decodeURIComponent(username).trim();

    const user = await UserModel.findOne({ username: decodedUserName });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.verifyCode || !user.verifyCodeExpire) {
      return NextResponse.json(
        { success: false, message: "Verification not initialized" },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpire) > new Date();

    if (!isCodeNotExpired) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code expired. Please sign up again.",
        },
        { status: 410 }
      );
    }

    if (!isCodeValid) {
      return NextResponse.json(
        { success: false, message: "Incorrect verification code." },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verifyCode = null;
    user.verifyCodeExpire = null;

    await user.save();

    await sendWelcomeEmail({
      email: user.email,
      username: user.username,
    });

    return NextResponse.json(
      { success: true, message: "User verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
