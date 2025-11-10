import { z } from 'zod/v4';
import { eq, useDrizzle } from '~~/database/client';
import { users } from '~~/database/schema';
import {
  buildVerificationEmail,
  createEmailVerificationToken,
} from '../../../utils/verificationCode';

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
