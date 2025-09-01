<script lang="ts" setup>
const modelValue = defineModel<string>();
</script>

<template>
  <UFormField
    class="w-full"
    label="Email"
    name="email"
    required
    size="xl"
  >
    <UInput
      v-model="modelValue"
      class="w-full"
      icon="iconoir:at-sign"
    />
  </UFormField>
</template>
