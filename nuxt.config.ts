import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    // private (server-only)
    siteName: process.env.NUXT_SITE_NAME,
    supportEmail: process.env.DEVHUB_SUPPORT_EMAIL,
    featureNodemailerEnabled: process.env.DEVHUB_FEATURE_NODEMAILER_ENABLED,
    // public (available client-side if needed)
    public: {},
  },
  modules: [
    '@nuxthub/core',
    '@nuxtjs/seo',
    '@nuxtjs/i18n',
    '@nuxt/ui',
    'nuxt-auth-utils',
    'nuxt-nodemailer',
    '@vueuse/nuxt',
    'nuxt-security',
  ],
  app: {
    head: {
      titleTemplate: '%s | %siteName',
      templateParams: {
        siteName: process.env.NUXT_SITE_NAME,
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/head/logo_dark.ico' },
      ],
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
