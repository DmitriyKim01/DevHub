import { z } from 'zod/v4';
import { eq, useDrizzle } from '~~/database/client';
import { users } from '~~/database/schema';
import { createEmailVerificationToken } from '../../../../utils/verificationCode';

const validateEmailSchema = z.object({
  email: z.email(),
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

  const { token, hashedToken, tokenExpiresAt } = createEmailVerificationToken();

  await db.update(users).set({
    verificationToken: hashedToken,
    verificationTokenExpire: tokenExpiresAt,
  });

  const { sendMail } = useNodeMailer();

  const { subject, text, html } = buildVerificationEmail({
    code: token,
    appName: 'DevHub',
    expiresMinutes: 15,
    supportEmail: 'support@devhub.com',
  });

  return sendMail({
    to: body.email,
    subject,
    text,
    html,
  });
});
