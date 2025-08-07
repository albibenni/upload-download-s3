import { z } from "zod/v4";

export const LoginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username max length reached"),
  password: z.string().min(6, "Password min length is 6 characters"),
});

export const UploadSchema = z.object({
  filename: z
    .string()
    .min(1, "Filename is required")
    .max(255, "Filename is too long")
    .regex(/^[^<>:"/\\|?*]+$/, "Filename contains invalid characters"),
});
export const UploadFileSchema = z.object({
  id: z.uuid(),
  filename: z.string(),
  presignedUrl: z.string("Presigned url missing"),
  username: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type LoginFormData = z.infer<typeof LoginSchema>;
export type UploadFormData = z.infer<typeof UploadSchema>;
