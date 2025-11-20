<script setup lang="ts">
const { t } = useI18n({
  useScope: 'local',
});

useSeoMeta({
  title: t('meta.title'),
  ogTitle: t('meta.title'),
  description: t('meta.description'),
  ogDescription: t('meta.description'),
  ogImage: 'https://example.com/image.png',
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
      "description": "Register for Devhub."
    }
  },
  "fr": {
    "meta": {
      "title": "Creer votre compte",
      "description": "Inscrivez vous pour Devhub"
    }
  }
}
</i18n>
