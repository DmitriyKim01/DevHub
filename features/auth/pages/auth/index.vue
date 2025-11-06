<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});
</script>

<template>
  <div>Hello from Protected</div>
</template>
