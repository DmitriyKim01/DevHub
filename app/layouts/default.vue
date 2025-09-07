<script setup lang="ts">
async function logout() {
  const session = useUserSession();
  await session.clear();
  await navigateTo('/auth/login');
}
</script>

<template>
  <div class="w-full h-full">
    <nav class="h-14 px-10 flex align-center justify-between">
      <h2>NAU</h2>
      <AuthState>
        <template #default="{ loggedIn }">
          <button
            v-if="loggedIn"
            @click="logout"
          >
            Logout
          </button>
          <NuxtLink
            v-else
            to="/auth/login"
          >
            Login
          </NuxtLink>
        </template>
      </AuthState>
    </nav>
    <slot />
  </div>
</template>