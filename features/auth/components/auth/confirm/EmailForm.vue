<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';
import { z } from 'zod/v4';

const loading = ref(false);
const error = ref<string | null>(null);

const localePath = useLocalePath();
const { t } = useI18n({
  useScope: 'local',
});

const route = useRoute();
const router = useRouter();
const DEFAULT_SECONDS = 15 * 60;

const { remaining, start } = useCountdown(DEFAULT_SECONDS, {
  onComplete() {
    error.value = t('auth.verifyEmail.errors.codeExpired');
  },
});

const remainingMMSS = computed(() => {
  const m = Math.floor(remaining.value / 60)
    .toString()
    .padStart(2, '0');
  const s = (remaining.value % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
});

const confirmEmailFormSchema = z.object({
  email: z.string(),
  code: z.array(z.number()).length(6),
});

onMounted(() => {
  confirmEmailFormState.email = (route.query.email as string) || '';
  const expiresAtMsQuery = (route.query.expireAt as string) || undefined;

  if (!expiresAtMsQuery) {
    start(DEFAULT_SECONDS);
  } else {
    const now = Date.now();
    const expiresMs = Number(expiresAtMsQuery);
    const initialSeconds = !Number.isNaN(expiresMs)
      ? Math.max(0, Math.floor((expiresMs - now) / 1000))
      : DEFAULT_SECONDS;
    start(initialSeconds);
  }
});

type ConfirmEmailFormSchemaType = z.output<typeof confirmEmailFormSchema>;

const confirmEmailFormState = reactive<Partial<ConfirmEmailFormSchemaType>>({
  email: '',
  code: [],
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
      error.value =
        response?._data?.message ||
        t('auth.verifyEmail.errors.verificationFailed');
      loading.value = false;
      confirmEmailFormState.code = [];
    },
  });

  loading.value = false;
  await navigateTo(localePath('/auth'));
}

async function onResendValidationCode() {
  loading.value = true;
  error.value = null;

  if (!confirmEmailFormState.email || confirmEmailFormState.email === '') {
    error.value = t('auth.verifyEmail.errors.missingEmail');
    return;
  }

  const response = await $fetch('/api/v1/auth/email/resend', {
    method: 'POST',
    body: {
      email: confirmEmailFormState.email,
    },
    onResponseError() {
      error.value = t('auth.verifyEmail.errors.resendFailed');
      loading.value = false;
    },
  });

  router.replace({
    query: {
      ...route.query,
      expireAt: response.verificationTokenExpiresAt,
    },
  });
  const now = Date.now();
  const expiresMs = Number(response.verificationTokenExpiresAt);

  const initialSeconds = !Number.isNaN(expiresMs)
    ? Math.max(0, Math.floor((expiresMs - now) / 1000))
    : DEFAULT_SECONDS;

  start(initialSeconds);
  loading.value = false;
}

async function onChangeEmail() {
  loading.value = true;
  if (!confirmEmailFormState.email || confirmEmailFormState.email === '') {
    await navigateTo(localePath('/auth/register'));
  }

  await $fetch('/api/v1/auth/email', {
    method: 'DELETE',
    body: {
      email: confirmEmailFormState.email,
    },
    onResponseError() {
      error.value = t('auth.verifyEmail.errors.changeEmailFailed');
      loading.value = false;
    },
  });

  await navigateTo(localePath('/auth/register'));
  loading.value = false;
}
</script>

<template>
  <UForm
    :schema="confirmEmailFormSchema"
    :state="confirmEmailFormState"
    class="w-full max-w-md md:max-w-xl lg:max-w-2xl border border-default rounded-lg form-container bg-elevated"
    :validate-on="[]"
    @submit.prevent="onValidateEmail"
  >
    <div class="p-12">
      <div class="p-4 text-center font-light text-xl tracking-wide">
        <UIcon class="text-3xl text-primary" name="ic:baseline-email" />
        <h2>{{ t('auth.verifyEmail.title') }}</h2>
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
          {{ t('auth.verifyEmail.sentTo') }}
          <span class="text-secondary">{{ confirmEmailFormState.email }}</span>
        </p>
      </div>

      <div class="flex w-full flex-col items-center justify-center p-4 gap-6">
        <div class="flex flex-col gap-2 leading-relaxed">
          <p>
            {{ t('auth.verifyEmail.instructions') }}
          </p>
          <p>
            {{
              t('auth.verifyEmail.time_remainging', {
                time: remainingMMSS,
              })
            }}
          </p>
        </div>

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
          :loading="loading"
          :disabled="remaining === 0 || loading"
          size="xl"
          class="cursor-pointer"
          type="submit"
        >
          {{ t('auth.verifyEmail.actions.verify') }}
        </UButton>
        <div class="w-full flex justify-around">
          <ULink
            as="button"
            @click="onResendValidationCode"
            :disabled="loading"
            class="cursor-pointer"
            >{{ t('auth.verifyEmail.actions.resend') }}</ULink
          >
          <ULink
            as="button"
            @click="onChangeEmail"
            :disabled="loading"
            class="cursor-pointer"
            >{{ t('auth.verifyEmail.actions.changeEmail') }}</ULink
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

<i18n lang="json">
{
  "en": {
    "auth": {
      "verifyEmail": {
        "title": "VERIFY YOUR EMAIL ADDRESS",
        "sentTo": "A verification code has been sent to {email}",
        "instructions": "Please check your inbox and enter the verification code below to verify your email address.",
        "time_remainging": "The code will expire in {time}.",
        "actions": {
          "verify": "Verify Email",
          "resend": "Resend code",
          "changeEmail": "Change email"
        },
        "errors": {
          "verificationFailed": "Email verification failed",
          "missingEmail": "Missing email address",
          "resendFailed": "Failed to resend an email",
          "changeEmailFailed": "Failed to change email",
          "codeExpired": "Your verification code has expired. Please resend a new code."
        }
      }
    }
  },

  "fr": {
    "auth": {
      "verifyEmail": {
        "title": "VÉRIFIEZ VOTRE ADRESSE E-MAIL",
        "sentTo": "Un code de vérification a été envoyé à {email}",
        "instructions": "Veuillez vérifier votre boîte de réception et entrer le code de vérification ci-dessous pour valider votre adresse e-mail.",
        "time_remainging": "Le code expirera dans {time}.",
        "actions": {
          "verify": "Vérifier l’email",
          "resend": "Renvoyer le code",
          "changeEmail": "Changer d’e-mail"
        },
        "errors": {
          "verificationFailed": "La vérification de l’e-mail a échoué",
          "missingEmail": "Adresse e-mail manquante",
          "resendFailed": "Échec de l’envoi du nouvel e-mail",
          "changeEmailFailed": "Échec de la modification de l’e-mail",
          "codeExpired": "Votre code de vérification a expiré. Veuillez renvoyer un nouveau code."
        }
      }
    }
  }
}
</i18n>
