<script setup lang="ts">
defineProps<{
  loading: boolean
}>();
</script>

<template>
  <UButton
    :disabled="loading"
    block
    class="bg-github-secondary"
    icon="iconoir:github"
    size="xl"
    type="button"
  >
    Github
  </UButton>
</template>
