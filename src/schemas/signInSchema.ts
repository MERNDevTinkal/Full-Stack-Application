import z from "zod";

export const signInSchema = z.object({
  identifier: z
    .string()
    .min(1, "Identifier is required") 
    .email("Invalid email address") 
    .or(z.string().min(3, "Username should be at least 3 characters")), 

  password: z
    .string()
    .min(6, "Password should be at least 6 characters"), 
});
