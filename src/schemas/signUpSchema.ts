import z from "zod";

export const usernameValidation = z
  .string()
  .trim()
  .min(3, { message: "Username must be at least 3 characters" })
  .max(20, { message: "Username must be at most 20 characters" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username must contain only letters, numbers, and underscores",
  })
  .transform((val) => val.toLowerCase())
  .refine((val) => !val.includes("__"), {
    message: "Username cannot have consecutive underscores",
  })
  .refine((val) => !val.startsWith("_") && !val.endsWith("_"), {
    message: "Username cannot start or end with an underscore",
  });

export const emailValidation = z
  .string()
  .trim()
  .email({ message: "Invalid email address" })
  .transform((val) => val.toLowerCase());

export const passwordValidation = z
  .string()
  .trim()
  .min(6, { message: "Password must be at least 6 characters" })
  .max(30, { message: "Password must be at most 30 characters" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      "Password must include uppercase, lowercase, number, and special character",
  });

export const signUpSchema = z
  .object({
    username: usernameValidation,
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
