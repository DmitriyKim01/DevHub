import { z } from 'zod/v4';
import { eq, useDrizzle } from '~~/database/client';
import { users } from '~~/database/schema';

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;

const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    )
    .max(
      MAX_PASSWORD_LENGTH,
      `Password must be at most ${MAX_PASSWORD_LENGTH} characters long`
    ),
});

export default defineEventHandler(async event => {
  const body = await readValidatedBody(event, loginSchema.parse);

  const db = useDrizzle();

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, body.email),
  });

  if (!existingUser || !existingUser.passwordHash) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    });
  }

  if (!existingUser.isVerified) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Email not verified',
    });
  }

  const passwordVerified = await verifyPassword(
    existingUser.passwordHash,
    body.password
  );

  if (!passwordVerified) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    });
  }

  await setUserSession(event, {
    user: {
      id: existingUser.id,
      email: existingUser.email,
    },
    lastLoggedIn: new Date(),
  });

  return { success: true };
});
