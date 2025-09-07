<script lang="ts" setup>
defineProps<{
  message: string
}>();
</script>

<template>
  <div
    class="border-error text-error flex w-full items-center gap-2 rounded-md border-1 p-2"
  >
    <AuthFormErrorIcon />
    <p>
      {{ message }}
    </p>
  </div>
</template>
