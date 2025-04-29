import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async (request: Request) => {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return NextResponse.json(
            { success: false, message: "Not Authenticated" },
            { status: 401 }
        );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$messages" },
                },
            },
        ]);

        if (!user || user.length === 0) {
            return NextResponse.json(
                { success: false, message: "user data not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            messages: user[0]?.messages || [],
        }, { status: 200 },);
    } catch (error) {
        console.error("Aggregation error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch messages" },
            { status: 500 }
        );
    }
};
