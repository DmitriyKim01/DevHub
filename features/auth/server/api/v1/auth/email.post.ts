import { z } from 'zod/v4';
import { eq, useDrizzle } from '~~/database/client';
import { users } from '~~/database/schema';
import { compareHashCode } from '../../../utils/verificationCode';

const validateEmailSchema = z.object({
  email: z.email(),
  code: z.string().length(6, 'Code must be 6 digits'),
});

export default defineEventHandler(async event => {
  const body = await readValidatedBody(event, validateEmailSchema.parse);

  const db = useDrizzle();

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, body.email),
  });

  if (!existingUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    });
  }

  if (existingUser.isVerified) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email already verified',
    });
  }

  if (
    !existingUser.verificationToken ||
    !existingUser.verificationTokenExpire
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Verification token missing',
    });
  }

  const expireDateMillis = existingUser.verificationTokenExpire.getTime();

  if (Date.now() >= expireDateMillis) {
    throw createError({
      statusCode: 410,
      statusMessage: 'Verification token expired',
    });
  }

  if (!compareHashCode(body.code, existingUser.verificationToken)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid code',
    });
  }

  await db.update(users).set({
    isVerified: true,
    verificationToken: null,
    verificationTokenExpire: null,
  });

  return {
    success: true,
  };
});
