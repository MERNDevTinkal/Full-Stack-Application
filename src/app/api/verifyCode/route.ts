import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();
        const decodedUserName = decodeURIComponent(username);

        const user = await UserModel.findOne({ username: decodedUserName });
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpire) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return NextResponse.json(
                { success: true, message: "User verified successfully" },
                { status: 200 }
            );
        } else if (!isCodeNotExpired) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Verification code expired. Please signup again.",
                },
                { status: 410 }
            );
        } else {
            return NextResponse.json(
                { success: false, message: "Verification code does not match" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error verifying code:", error);
        return NextResponse.json(
            { success: false, message: "Failed to verify code" },
            { status: 500 }
        );
    }
}
