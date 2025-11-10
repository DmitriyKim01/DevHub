<script lang="ts" setup>
defineProps<{
  label: string;
  name: string;
}>();
const modelValue = defineModel<string>();

function checkStrength(str: string) {
  const requirements = [
    { regex: /.{8,}/, text: 'at least 8 characters' },
    { regex: /[A-Z]/, text: 'at least 1 uppercase letter' },
    { regex: /[@$!%*?#&]/, text: 'at least 1 special character' },
  ];

  return requirements.map(req => ({
    met: req.regex.test(str),
    text: req.text,
  }));
}

const strength = computed(() => checkStrength(modelValue.value ?? ''));
const score = computed(() => strength.value.filter(req => req.met).length);

const color = computed(() => {
  if (score.value === 0) return 'neutral';
  if (score.value <= 1) return 'error';
  if (score.value === 2) return 'warning';
  if (score.value === 3) return 'success';
  return 'neutral';
});

const text = computed(() => {
  if (score.value === 0) return 'Enter a password with';
  if (score.value === 1) return 'Weak password';
  if (score.value === 2) return 'Medium password';
  if (score.value === 3) return 'Strong password';
  return 'Weak password';
});
</script>

<template>
  <div class="space-y-4">
    <UFormField :label="label" :name="name" class="w-full" size="xl">
      <AuthPasswordInput
        v-model="modelValue"
        :aria-invalid="score < 3"
        :color="color"
        :ui="{ trailing: 'pe-1' }"
        aria-describedby="password-strength"
        class="w-full"
        icon="iconoir:lock"
      />
    </UFormField>

    <UProgress
      :color="color"
      :indicator="text"
      :max="3"
      :model-value="score"
      size="sm"
    />
    <div>
      <p id="password-strength" class="text-md font-medium mb-1">
        {{ text }}
      </p>

      <ul aria-label="Password requirements" class="space-y-1">
        <li
          v-for="(req, index) in strength"
          :key="index"
          :class="req.met ? 'text-success' : 'text-muted'"
          class="flex items-center gap-2 text-md"
        >
          <UIcon
            :name="req.met ? 'iconoir:check-circle' : 'iconoir:xmark-circle'"
            class="size-4 shrink-0"
          />

          <span class="font-light">
            {{ req.text }}
            <span class="sr-only">
              {{ req.met ? ' - Requirement met' : ' - Requirement not met' }}
            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
