import { users } from '~~/database/schema';
import { registerSchema } from '~~/features/auth/shared/form-schemas/register';
import { eq, useDrizzle } from '~~/database/client';

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