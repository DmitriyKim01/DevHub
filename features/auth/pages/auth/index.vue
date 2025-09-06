<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
});
const session = useUserSession();

onMounted(() => {
  console.log('User session:', session);
})
</script>

<template>
  <div>
    Hello from Protected
  </div>
</template>