<script lang="ts" setup>
import Input from './Input.vue';

defineProps<{
  label: string
  name: string
}>();

const modelValue = defineModel<string>();
</script>

<template>
  <UFormField
    :label="label"
    :name="name"
    class="w-full"
    size="xl"
  >
    <Input
      v-model="modelValue"
      :ui="{ trailing: 'pe-1' }"
      aria-describedby="password-strength"
      class="w-full"
      icon="iconoir:lock"
    />
  </UFormField>
</template>
