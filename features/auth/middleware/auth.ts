export default defineNuxtRouteMiddleware(async () => {
  const session = useUserSession();
  await session.fetch();
  if (!session.loggedIn.value) {
    return navigateTo('/auth/login');
  }
});
