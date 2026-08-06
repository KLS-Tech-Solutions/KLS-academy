import { z } from "zod";
import { email, fullName, password, phone } from "./common";

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});
export type LoginValues = z.input<typeof loginSchema>;

export const registerSchema = z
  .object({
    full_name: fullName,
    email,
    phone,
    password,
    confirm_password: z.string().min(1, "Confirm your password"),
    accept_terms: z.literal(true, {
      error: "Accept the terms and privacy policy to continue",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });
export type RegisterValues = z.input<typeof registerSchema>;

export const forgotPasswordSchema = z.object({ email });
export type ForgotPasswordValues = z.input<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password,
    confirm_password: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });
export type ResetPasswordValues = z.input<typeof resetPasswordSchema>;
