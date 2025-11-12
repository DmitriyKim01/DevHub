import { z } from 'zod/v4';
import { eq, useDrizzle } from '~~/server/database/client';
import { users } from '~~/server/database/schema';
import {
  buildVerificationEmail,
  createEmailVerificationToken,
} from '../../../utils/verificationCode';

const registerBodySchema = z.object({
  email: z.email(),
  password: passwordSchema(z),
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

  const { token, hashedToken, tokenExpiresAt } = createEmailVerificationToken();

  const hashedPassword = await hashPassword(body.password);

  const [newUser] = await db
    .insert(users)
    .values({
      email: body.email,
      passwordHash: hashedPassword,
      authMethod: 'credentials',
      verificationToken: hashedToken,
      verificationTokenExpire: tokenExpiresAt,
      isVerified: false,
    })
    .returning();

  if (!newUser) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user',
    });
  }

  const { sendMail } = useNodeMailer();
  const config = useRuntimeConfig();

  const { subject, text, html } = buildVerificationEmail({
    code: token,
    appName: config.appName,
    expiresMinutes: 15,
    supportEmail: config.supportEmail,
  });

  return sendMail({
    to: body.email,
    subject,
    text,
    html,
  });
});
