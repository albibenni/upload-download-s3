import { z } from "zod/v4";

export const LoginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username max length reached"),
  password: z.string().min(6, "Password min length is 6 characters"),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
