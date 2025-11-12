import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    // private (server-only)
    appName: process.env.NUXT_APP_NAME,
    supportEmail: process.env.NUXT_SUPPORT_EMAIL,

    // public (available client-side if needed)
    public: {},
  },
  modules: ['@nuxthub/core', '@nuxt/ui', 'nuxt-auth-utils', 'nuxt-nodemailer'],
  css: ['./app/assets/css/main.css'],
  extends: ['features/users', 'features/conversations', 'features/auth'],
  nitro: {
    experimental: {
      openAPI: true,
    },
  },
  hub: {
    database: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  nodemailer: {
    from: '',
    host: '',
    port: 999,
    secure: true,
    auth: {
      user: '',
      pass: '',
    },
  },
});
