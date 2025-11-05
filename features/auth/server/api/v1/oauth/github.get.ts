export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
      },
    });
    return sendRedirect(event, '/auth');
  },
});
