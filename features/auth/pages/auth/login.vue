<script setup lang="ts">
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
    <AuthLoginForm />
  </main>
</template>

<i18n lang="json">
{
  "en": {
    "meta": {
      "title": "Log in to your account",
      "ogTitle": "Log in to Devhub - The Social Network for Developers",
      "description": "Access your Devhub account to manage your developer portfolio, write technical blogs, and connect with the community. Welcome back!",
      "ogDescription": "Access your Devhub account to manage your developer portfolio and connect with the community."
    }
  },
  "fr": {
    "meta": {
      "title": "Connectez-vous à votre compte",
      "ogTitle": "Connexion Devhub - Le réseau social pour développeurs",
      "description": "Accédez à votre compte Devhub pour gérer votre portfolio de développeur, publier des articles techniques et vous connecter avec la communauté. Bon retour !",
      "ogDescription": "Accédez à votre compte Devhub pour gérer votre portfolio de développeur et vous connecter avec la communauté."
    }
  }
}
</i18n>
