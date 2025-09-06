<script setup lang="ts">
defineProps<{
  loading: boolean
}>();
</script>

<template>
  <UButton
    :disabled="loading"
    class="bg-gitlab-background"
    block
    icon="iconoir:github"
    size="xl"
    type="button"
  >
    Github
  </UButton>
</template>
