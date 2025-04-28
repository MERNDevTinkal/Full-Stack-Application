import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";
import { El_Messiri } from "next/font/google";

export async function PODT(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        })
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "user already exists with this username",
            }, {
                status: 400,
                statusText: "Bad request",
            })
        }

        const existingUserByEamil = await UserModel.findOne({
            email,
        })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString() // 6 digit code 

        if (existingUserByEamil) {
            if (existingUserByEamil.isVerified) {
                return Response.json({
                    success : false,
                    message : " user already exist with this email",
                })
            }else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEamil.password = hashedPassword;
                existingUserByEamil.verifyCode = verifyCode;
                existingUserByEamil.verifyCodeExpire = new Date(Date.now() + 60 * 60 *1000);
                await existingUserByEamil.save();
            }

        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpire: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            })
            await newUser.save();

        }

        // send verification email 
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode,
        )
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message,
            },
                {
                    status: 500,
                    statusText: "Internal server error",
                },)
        }

        return Response.json({
            success: true,
            message: "verification email sent successfully",

        },
            {
                status: 200,
                statusText: "ok",
            })




    } catch (error) {
        console.error("Error in signup user:", error);
        return Response.json({
            success: false,
            message: "failed to signup user",

        },
            {
                status: 500,
                statusText: "Internal server error"
            },
        )
    }
}