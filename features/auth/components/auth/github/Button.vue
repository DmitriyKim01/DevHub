<script setup lang="ts">
defineProps<{
  loading: boolean;
}>();
</script>

<template>
  <div style="--ui-primary: var(--color-github-primary)" class="w-full h-full">
    <UButton
      color="primary"
      class="cursor-pointer text-accent"
      variant="solid"
      block
      icon="iconoir:github"
      size="xl"
      type="button"
      href="/api/v1/oauth/github"
      external
    >
      Github
    </UButton>
  </div>
</template>
