<script lang="ts" setup>
defineProps<{
  label: string;
  name: string;
}>();

const { t } = useI18n({
  useScope: 'local',
});

const modelValue = defineModel<string>();

function checkStrength(str: string) {
  const requirements = [
    { regex: /.{8,}/, text: 'password.requirements.8chars' },
    { regex: /[A-Z]/, text: 'password.requirements.uppercase' },
    { regex: /[@$!%*?#&]/, text: 'password.requirements.special' },
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
  if (score.value === 0) return 'password.strength.enter';
  if (score.value === 1) return 'password.strength.weak';
  if (score.value === 2) return 'password.strength.medium';
  if (score.value === 3) return 'password.strength.strong';
  return 'password.strength.weak';
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
      :indicator="t(text)"
      :max="3"
      :model-value="score"
      size="sm"
    />
    <div>
      <p id="password-strength" class="text-md font-medium mb-1">
        {{ t(text) }}
      </p>

      <ul :aria-label="t('password.requirements.title')" class="space-y-1">
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
            {{ t(req.text) }}
            <span class="sr-only">
              {{
                req.met
                  ? t('password.requirements.met')
                  : t('password.requirements.notMet')
              }}
            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "password": {
      "strength": {
        "enter": "Enter a password with",
        "weak": "Weak password",
        "medium": "Medium password",
        "strong": "Strong password"
      },
      "requirements": {
        "title": "Password requirements",
        "8chars": "At least 8 characters",
        "uppercase": "At least 1 uppercase letter",
        "special": "At least 1 special character",
        "met": " - Requirement met",
        "notMet": " - Requirement not met"
      }
    }
  },
  "fr": {
    "password": {
      "strength": {
        "enter": "Entrez un mot de passe avec",
        "weak": "Mot de passe faible",
        "medium": "Mot de passe moyen",
        "strong": "Mot de passe fort"
      },
      "requirements": {
        "title": "Exigences du mot de passe",
        "8chars": "Au moins 8 caractères",
        "uppercase": "Au moins 1 lettre majuscule",
        "special": "Au moins 1 caractère spécial",
        "met": " - Exigence remplie",
        "notMet": " - Exigence non remplie"
      }
    }
  }
}
</i18n>
