import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    // private (server-only)
    appName: process.env.APP_NAME,
    supportEmail: process.env.SUPPORT_EMAIL,

    // public (available client-side if needed)
    public: {
      siteUrl: process.env.DEVHUB_PRODUCTION_URL,
    },
  },
  site: {
    url: process.env.DEVHUB_PRODUCTION_URL,
    name: process.env.APP_NAME,
    // ...etc
  },
  modules: [
    '@nuxthub/core',
    '@nuxtjs/seo',
    '@nuxtjs/i18n',
    '@nuxt/ui',
    'nuxt-auth-utils',
    'nuxt-nodemailer',
    '@vueuse/nuxt',
  ],
  app: {
    head: {
      titleTemplate: '%s | %siteName',
      templateParams: {
        siteName: process.env.NUXT_APP_NAME,
      },
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

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

  i18n: {
    baseUrl: process.env.DEVHUB_PRODUCTION_URL,
    defaultLocale: 'en',
    strategy: 'prefix',
    locales: [
      { code: 'en', name: 'English', language: 'en-US' },
      { code: 'fr', name: 'Français', language: 'fr-FR' },
    ],
  },
  build: {
    analyze: true,
  },
});
