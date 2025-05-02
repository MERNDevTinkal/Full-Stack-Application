import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Parse the request body
    const { newPassword, token } = await req.json();

    // Validate token
    const user = await UserModel.findOne({ resetPasswordToken: token });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid reset token.' },
        { status: 400 }
      );
    }

    // Check if the token has expired
    if (user.resetPasswordExpire < new Date()) {
      return NextResponse.json(
        { success: false, message: 'Reset token has expired.' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the user's password and clear the token
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    // Save updated user document
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Password reset successful.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in password reset:', error);

    return NextResponse.json(
      { success: false, message: 'Something went wrong during password reset.' },
      { status: 500 }
    );
  }
}
