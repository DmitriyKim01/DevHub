import { z } from 'zod/v4';

const MAX_PASSWORD_LENGTH = 8;

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(MAX_PASSWORD_LENGTH, 'Password must be at least 8 characters long')
});

export type LoginSchemaType = z.output<typeof loginSchema>;