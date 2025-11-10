<script lang="ts" setup>
defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <div class="w-full pt-12 leading-8 text-center sm:text-start p-4">
    <UIcon class="text-3xl text-primary" name="iconoir:cube" />
    <h2 class="font-semibold text-2xl sm:text-2xl">
      {{ title }}
    </h2>
    <p class="text-dimmed">
      {{ description }}
    </p>
  </div>
</template>
