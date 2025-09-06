<script setup lang="ts">
defineProps<{
  loading: boolean
}>();
</script>

<template>
  <UButton
    :disabled="loading"
    class="bg-github-secondary cursor-pointer text-accent"
    block
    icon="iconoir:github"
    size="xl"
    type="button"
  >
    Github
  </UButton>
</template>
