import { z } from 'zod/v4';
import { users } from '~~/database/schema';
import { eq, useDrizzle } from '~~/database/client';

const MAX_PASSWORD_LENGTH = 8;

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(MAX_PASSWORD_LENGTH, 'Password must be at least 8 characters long')
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, registerSchema.parse);
  const hashedPassword = await hashPassword(body.password);

  const db = useDrizzle();

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, body.email)
  });

  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User already exists'
    });
  }

  const [newUser] = await db.insert(users).values({
    email: body.email,
    passwordHash: hashedPassword
  }).returning();

  if (!newUser) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user'
    });
  }

  await setUserSession(event, {
    user: {
      id: newUser.id,
      email: newUser.email
    },
    lastLoggedIn: new Date()
  });

  return { success: true };
});