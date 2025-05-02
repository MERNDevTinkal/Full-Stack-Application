import z from "zod";
import { passwordValidation } from "./signUpSchema";

export const signInSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, "Identifier is required") 
    .email("Invalid email address") 
    .or(z.string().trim().min(3, "Username should be at least 3 characters")), 

  password:passwordValidation,
  //confirmPasswod : passwordValidation,
});
