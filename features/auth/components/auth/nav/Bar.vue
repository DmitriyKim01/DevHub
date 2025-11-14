<script lang="ts" setup>
import { en, fr } from '@nuxt/ui/locale';

const { locale, setLocale } = useI18n();

function onLocaleChange(value: string | undefined) {
  if (value === 'en' || value === 'fr') {
    setLocale(value);
  }
}
</script>

<template>
  <div
    class="w-full max-w-md md:max-w-xl lg:max-w-2xl p-4 border border-default rounded-lg flex gap-4 justify-around form-container bg-elevated"
  >
    <UColorModeSelect />
    <ULocaleSelect
      :model-value="locale"
      :locales="[en, fr]"
      @update:model-value="onLocaleChange($event)"
    />
  </div>
</template>
