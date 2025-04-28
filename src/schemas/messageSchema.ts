import z from "zod";

export const messageSchema = z.object({
    content : z
    .string()
    .trim()
    .min(5,{message : "content at least must be 5 characters"}),
})