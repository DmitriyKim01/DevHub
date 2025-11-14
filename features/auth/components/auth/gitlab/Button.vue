<script setup lang="ts">
defineProps<{
  loading: boolean;
}>();
</script>

<template>
  <div
    style="--ui-primary: var(--color-gitlab-secondary)"
    class="w-full h-full"
  >
    <UButton
      :disabled="loading"
      color="primary"
      class="cursor-pointer"
      variant="solid"
      block
      icon="iconoir:gitlab-full"
      size="xl"
      type="button"
      href="/api/v1/oauth/github"
      external
    >
      Gitlab
    </UButton>
  </div>
</template>
