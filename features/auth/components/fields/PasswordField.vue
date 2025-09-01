<script lang="ts" setup>
import PasswordInput from './inputs/PasswordInput.vue';

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
    required
    size="xl"
  >
    <PasswordInput
      v-model="modelValue"
      :ui="{ trailing: 'pe-1' }"
      aria-describedby="password-strength"
      class="w-full"
      icon="iconoir:lock"
    />
  </UFormField>
</template>
