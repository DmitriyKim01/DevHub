export default defineNuxtRouteMiddleware(async () => {
  const session = useUserSession();
  const localePath = useLocalePath();

  await session.fetch();
  if (!session.loggedIn.value) {
    return navigateTo(localePath('/auth'));
  }
});
