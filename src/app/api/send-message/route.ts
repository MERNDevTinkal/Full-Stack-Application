import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
    await dbConnect();

    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "user not found",
            },
                { status: 404 },
            )
        }

       // is User Accepting Messages

       if (! user.isAcceptingMessage) {
        return NextResponse.json({
            success: false,
            message: "user not accepting messages",
        },
            { status: 403 },
        )
       }

       const newMessage = {content,createdAt: new Date()}
       user.messages.push(newMessage as Message);
       await user.save();
       return NextResponse.json({
        success: true,
        message: "Message sent successfully",
    },
        { status: 403 },
    )
    } catch (error) {
        console.error("Error in sending messages" , error);
        return NextResponse.json({
            success: false,
            message: "Error in sending message",
        },
            { status: 500 },
        )
    }
}