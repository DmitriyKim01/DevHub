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
    <AuthRegisterForm />
  </main>
</template>

<i18n lang="json">
{
  "en": {
    "meta": {
      "title": "Create your account",
      "ogTitle": "Join Devhub - The Social Network for Developers",
      "description": "Join Devhub to showcase your coding projects, publish technical blogs, and network with other developers. Build your tech portfolio today.",
      "ogDescription": "Join Devhub to showcase your coding projects, publish technical blogs, and network with other developers."
    }
  },
  "fr": {
    "meta": {
      "title": "Créez votre compte",
      "ogTitle": "Rejoignez Devhub - Le réseau social pour développeurs",
      "description": "Rejoignez Devhub pour présenter vos projets, publier des articles techniques et développer votre réseau. Créez votre portfolio de développeur dès maintenant.",
      "ogDescription": "Rejoignez Devhub pour présenter vos projets, publier des articles techniques et développer votre réseau."
    }
  }
}
</i18n>
