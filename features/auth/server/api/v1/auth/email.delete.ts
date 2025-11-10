import { z } from 'zod/v4';
import { eq, useDrizzle } from '~~/database/client';
import { users } from '~~/database/schema';

const registerBodySchema = z.object({
  email: z.email(),
});

export default defineEventHandler(async event => {
  const body = await readValidatedBody(event, registerBodySchema.parse);

  const db = useDrizzle();

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, body.email),
  });

  if (existingUser && !existingUser.isVerified) {
    await db.delete(users).where(eq(users.email, body.email));
  }

  return {
    success: true,
  };
});
