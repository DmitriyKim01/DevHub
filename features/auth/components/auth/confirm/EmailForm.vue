<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';
import { z } from 'zod/v4';

const confirmEmailFormSchema = z.object({
  email: z.string(),
  code: z.array(z.number()).length(6),
});

type ConfirmEmailFormSchemaType = z.output<typeof confirmEmailFormSchema>;

const confirmEmailFormState = reactive<Partial<ConfirmEmailFormSchemaType>>({
  email: '',
  code: [],
});

const route = useRoute();
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(() => {
  confirmEmailFormState.email = (route.query.email as string) || '';
  startTimer();
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

async function onValidateEmail(
  event: FormSubmitEvent<ConfirmEmailFormSchemaType>
) {
  loading.value = true;
  const confirmEmailFormData = event.data;
  const codeString = confirmEmailFormData.code.join('');

  await $fetch('/api/v1/auth/email/validate', {
    method: 'POST',
    body: {
      email: confirmEmailFormData.email,
      code: codeString,
    },
    onResponseError({ response }) {
      error.value = response?._data?.message || 'Email verification failed';
      loading.value = false;
      confirmEmailFormState.code = [];
    },
  });

  loading.value = false;
  await navigateTo({
    path: '/auth/',
  });
}

async function onResendValidationCode() {
  loading.value = true;

  if (!confirmEmailFormState.email || confirmEmailFormState.email === '') {
    error.value = 'Missing email address';
    return;
  }

  await $fetch('/api/v1/auth/email/resend', {
    method: 'POST',
    body: {
      email: confirmEmailFormState.email,
    },
    onResponseError() {
      error.value = 'Failed to resend an email';
      loading.value = false;
    },
  });

  loading.value = false;
}

async function onChangeEmail() {
  loading.value = true;
  if (!confirmEmailFormState.email || confirmEmailFormState.email === '') {
    await navigateTo('/auth/register');
  }

  await $fetch('/api/v1/auth/email', {
    method: 'DELETE',
    body: {
      email: confirmEmailFormState.email,
    },
    onResponseError() {
      error.value = 'Failed to change email';
      loading.value = false;
    },
  });

  await navigateTo('/auth/register');
  loading.value = false;
}

const expiresAt = ref<number | null>(null); // ms epoch
const remaining = ref(0); // seconds
let timer: ReturnType<typeof setInterval> | null = null;

function tick() {
  if (!expiresAt.value) return;
  const left = Math.max(0, Math.floor((expiresAt.value - Date.now()) / 1000));
  remaining.value = left;
  if (left === 0 && timer) {
    clearInterval(timer);
    timer = null;
    error.value =
      'Your verification code has expired. Please resend a new code.';
  }
}

function startTimer(msFromNow = 15 * 60 * 1000) {
  expiresAt.value = Date.now() + msFromNow;
  tick();
  if (timer) clearInterval(timer);
  timer = setInterval(tick, 1000);
}

const remainingMMSS = computed(() => {
  const m = Math.floor(remaining.value / 60)
    .toString()
    .padStart(2, '0');
  const s = (remaining.value % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
});
</script>

<template>
  <UForm
    :schema="confirmEmailFormSchema"
    :state="confirmEmailFormState"
    class="max-w-md border border-muted rounded-lg form-container"
    :validate-on="[]"
    @submit.prevent="onValidateEmail"
  >
    <div class="p-12">
      <div class="p-4 text-center font-light text-xl tracking-wide">
        <UIcon class="text-3xl text-primary" name="ic:baseline-email" />
        <h2>VERIFY YOUR EMAIL ADDRESS</h2>
      </div>
      <div class="p-4">
        <USeparator />
      </div>

      <div class="p-4" v-if="error">
        <UAlert
          color="error"
          icon="i-lucide-info"
          v-if="error"
          :title="error"
        />
      </div>

      <div class="p-4">
        <p class="text-center text-lg">
          A verification code has been sent to
          <span class="text-primary">{{ confirmEmailFormState.email }}</span>
        </p>
      </div>

      <div class="flex w-full flex-col items-center justify-center p-4 gap-6">
        <p>
          Please check your inbox and enter the verification code below to
          verify your email address. The code will expire in
          {{ remainingMMSS }}
        </p>

        <UPinInput
          :length="6"
          type="number"
          :disabled="remaining === 0 || loading"
          autofocus
          required
          :ui="{
            base: 'size-12 text-xl',
            root: 'justify-between w-full',
          }"
          v-model="confirmEmailFormState.code"
          otp
        />
        <UButton
          block
          loading-auto
          :disabled="remaining === 0 || loading"
          size="xl"
          class="cursor-pointer"
          type="submit"
        >
          Verify Email
        </UButton>
        <div class="w-full flex justify-around">
          <ULink as="button" @click="onResendValidationCode" :disabled="loading"
            >Resend code</ULink
          >
          <ULink as="button" @click="onChangeEmail" :disabled="loading"
            >Change email</ULink
          >
        </div>
      </div>
    </div>
  </UForm>
</template>

<style scoped>
.form-container {
  padding: 2rem;
}

h2 {
  word-spacing: 0.15em;
}
</style>
