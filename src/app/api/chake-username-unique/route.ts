import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import z from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username")
        }
        // validation with zod 
        const result = UsernameQuerySchema.safeParse(queryParam)
     //   console.log("result from userNameQuerySchema",result);
        if (!result.success) {
            const userNameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: userNameErrors?.length > 0
                    ? userNameErrors.join(", ")
                    : "Invalid query parameters"
            }, {
                status: 400,
            }
            )
        }

     const {username}  = result.data;
     const existingVerifieduser = await UserModel.findOne({username, isVerified : true})

     if(existingVerifieduser){
        return Response.json({
            success : false,
            message : "username is already taken"
        },{
            status : 400,
        })
     }
     return Response.json({
        success : true,
        message : "username is avilable"
    },{
        status : 200,
    })

    } catch (error) {
        console.error("Error chaking username", error);
        return Response.json({
            success: false,
            message: "Error in chaking username"
        }, {
            status: 500,
        }
        )
    }
}