import { z } from 'zod/v4';
import { useDrizzle, eq } from '~~/database/client';
import { users } from '~~/database/schema';

const MAX_PASSWORD_LENGTH = 8;
const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(MAX_PASSWORD_LENGTH, 'Password must be at least 8 characters long')
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, loginSchema.parse);

  const db = useDrizzle();

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, body.email)
  });

  if (!existingUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    });
  }

  if (!existingUser.passwordHash) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User does not have a password set'
    });
  }

  const passwordVerified = await verifyPassword(existingUser.passwordHash, body.password);

  if (!passwordVerified) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid password'
    });
  }

  await setUserSession(event, {
    user: {
      id: existingUser.id,
      email: existingUser.email
    },
    lastLoggedIn: new Date()
  });

  return { success: true };
});