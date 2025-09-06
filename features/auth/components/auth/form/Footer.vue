<script lang="ts" setup>
defineProps<{
  to: string
  message: string
  linkMessage: string
}>();
</script>

<template>
  <div class="flex w-full justify-center gap-2">
    <p class="text-muted">
      {{ message }}
    </p>
    <NuxtLink
      class="text-accent font-semibold"
      :to="to"
    >
      {{ linkMessage }}
    </NuxtLink>
  </div>
</template>
