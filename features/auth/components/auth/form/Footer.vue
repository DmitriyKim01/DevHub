<script lang="ts" setup>
defineProps<{
  to: string;
  message: string;
  linkMessage: string;
}>();
</script>

<template>
  <div class="flex w-full justify-center gap-2">
    <p class="text-muted">
      {{ message }}
    </p>
    <ULink :to="to" class="text-primary">
      {{ linkMessage }}
    </ULink>
  </div>
</template>
