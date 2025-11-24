<script setup lang="ts">
import { useSeoMeta } from 'nuxt/app';

const { t } = useI18n({
  useScope: 'local',
});

defineOgImageComponent('NuxtSeo', {
  title: t('meta.title'),
  description: t('meta.ogDescription'),
  theme: '#00575d',
  siteLogo: '/head/logo_light.svg',
  colorMode: 'light',
});

useSeoMeta({
  title: t('meta.title'),
  ogTitle: t('meta.ogTitle'),
  description: t('meta.description'),
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <main
    class="h-full w-screen flex flex-col items-center justify-center p-4 gap-2"
  >
    <AuthNavBar />
    <AuthConfirmEmailForm />
  </main>
</template>

<i18n lang="json">
{
  "en": {
    "meta": {
      "title": "Confirm your email",
      "ogTitle": "Verify your Devhub account",
      "description": "Please verify your email address to complete your registration on Devhub. Secure your account and start connecting.",
      "ogDescription": "Please verify your email address to complete your registration on Devhub."
    }
  },
  "fr": {
    "meta": {
      "title": "Confirmez votre email",
      "ogTitle": "Vérifiez votre compte Devhub",
      "description": "Veuillez vérifier votre adresse email pour finaliser votre inscription sur Devhub. Sécurisez votre compte et commencez à échanger.",
      "ogDescription": "Veuillez vérifier votre adresse email pour finaliser votre inscription sur Devhub."
    }
  }
}
</i18n>
