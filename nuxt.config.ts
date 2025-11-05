import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxthub/core', '@nuxt/ui', 'nuxt-auth-utils'],
  css: ['./app/assets/css/main.css'],
  extends: ['features/users', 'features/conversations', 'features/auth'],
  nitro: {
    experimental: {
      openAPI: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  hub: {
    database: true,
  },
});
