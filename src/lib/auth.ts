import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(5, {
    message: 'Password is required.',
  }),
  rememberMe: z.boolean().optional(),
});

export const SignupSchema = z.object({
  fullName: z.string().min(1, {
    message: 'Full name is required.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long.',
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // Set the error on the confirmPassword field
});
