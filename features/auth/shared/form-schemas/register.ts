import { z } from 'zod/v4';

const MAX_PASSWORD_LENGTH = 8;

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(MAX_PASSWORD_LENGTH, 'Password must be at least 8 characters long'),
  confirmPassword: z.string().min(MAX_PASSWORD_LENGTH, 'Confirm Password must be at least 8 characters long')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match'
});

export type RegisterSchemaType = z.output<typeof registerSchema>;