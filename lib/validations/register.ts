import { z } from "zod";

export const registerFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  phone: z
    .string()
    .regex(
      /^09\d{8}$/,
      "Please enter a valid Taiwan mobile number (e.g., 0912345678)"
    ),
  company: z.string().max(100).optional(),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
