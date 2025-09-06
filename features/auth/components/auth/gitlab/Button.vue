<script setup lang="ts">
defineProps<{
  loading: boolean
}>();
</script>

<template>
  <UButton
    :disabled="loading"
    block
    class="bg-gitlab-accent-yellow"
    icon="iconoir:gitlab-full"
    size="xl"
    type="button"
  >
    Gitlab
  </UButton>
</template>
