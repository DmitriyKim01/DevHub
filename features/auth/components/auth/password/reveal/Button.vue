<script lang="ts" setup>
defineProps<{
  show: boolean
}>();

const emit = defineEmits(['toggle']);
</script>

<template>
  <UButton
    class="cursor-pointer"
    :aria-label="show ? 'Hide password' : 'Show password'"
    :aria-pressed="show"
    :icon="show ? 'iconoir:eye-off' : 'iconoir:eye-solid'"
    color="neutral"
    size="md"
    variant="link"
    @click="emit('toggle')"
  />
</template>
