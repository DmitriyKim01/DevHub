import { eq, useDrizzle } from '~~/database/client';
import { users } from '~~/database/schema';

export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    const db = useDrizzle();
    const email = user.email?.toLocaleLowerCase();

    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'GitHub account has no email',
      });
    }

    const userExisting = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    let savedUser = userExisting;

    if (!savedUser) {
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          passwordHash: null,
          authMethod: 'oauth',
        })
        .returning();

      if (!newUser) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to create user',
        });
      }
      savedUser = newUser;
    }
    await setUserSession(event, {
      user: {
        id: savedUser.id,
        email: savedUser.email,
      },
    });
    return sendRedirect(event, '/auth');
  },
});
