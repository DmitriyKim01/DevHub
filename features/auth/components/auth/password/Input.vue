<script lang="ts" setup>
const modelValue = defineModel<string>();
const show = ref(false);
</script>

<template>
  <UInput
    v-model="modelValue"
    :type="show ? 'text' : 'password'"
    :ui="{ trailing: 'pe-1' }"
    class="w-full"
    icon="iconoir:lock"
  >
    <template #trailing>
      <AuthPasswordRevealButton
        :show="show"
        @toggle="show = !show"
      />
    </template>
  </UInput>
</template>
