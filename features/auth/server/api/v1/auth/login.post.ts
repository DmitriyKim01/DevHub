import { loginSchema } from '../../../../shared/form-schemas/login';
import * as tables from '~~/database/schema';

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, loginSchema.parse);
  const hashedPassword = await hashPassword(body.password);

  const db = useCustomDatabase();

  const [user] = await db.insert(tables.users).values({
    email: body.email,
    passwordHash: hashedPassword
  }).returning();

  if (!user) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user'
    });
  }

  await setUserSession(event, {
    id: user.id,
    email: user.email
  });

  return { success: true };
});