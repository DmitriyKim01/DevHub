import { z } from 'zod/v4';

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters long')
});

export type LoginSchemaType = z.output<typeof loginSchema>;