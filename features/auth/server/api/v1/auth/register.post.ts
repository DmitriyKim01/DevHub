import { z } from 'zod/v4';
import { users } from '~~/database/schema';
import { eq, useDrizzle } from '~~/database/client';

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;

const registerBodySchema = z.object({
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
  const body = await readValidatedBody(event, registerBodySchema.parse);

  const db = useDrizzle();

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, body.email),
  });

  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: 'User already exists',
    });
  }

  const hashedPassword = await hashPassword(body.password);

  const [newUser] = await db
    .insert(users)
    .values({
      email: body.email,
      passwordHash: hashedPassword,
    })
    .returning();

  if (!newUser) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user',
    });
  }

  return {
    success: true,
  };
});
