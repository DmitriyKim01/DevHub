<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';
import { z } from 'zod/v4';

const localePath = useLocalePath();
const { t } = useI18n({
  useScope: 'local',
});

const registerFormSchema = z.object({
  email: z.email({ error: t('error.emailInvalid') }),
  password: z
    .string()
    .min(
      PASSWORD_POLICY.MIN,
      t('password.error.minLength', { min: PASSWORD_POLICY.MIN })
    )
    .max(
      PASSWORD_POLICY.MAX,
      t('password.error.maxLength', { max: PASSWORD_POLICY.MAX })
    ),
});

type RegisterFormSchemaType = z.output<typeof registerFormSchema>;

const registerFormState = reactive<Partial<RegisterFormSchemaType>>({
  email: '',
  password: '',
});

const loading = ref(false);
const error = ref<string | null>(null);

async function onNewUserRegister(
  event: FormSubmitEvent<RegisterFormSchemaType>
) {
  loading.value = true;
  const registerFormData = event.data;

  const response = await $fetch('/api/v1/auth/register', {
    method: 'POST',
    body: {
      email: registerFormData.email,
      password: registerFormData.password,
    },
    onResponseError({ response }) {
      loading.value = false;
      error.value = response?._data?.message || 'Login failed';
    },
  });

  loading.value = false;
  await navigateTo({
    path: localePath('/auth/confirm/email'),
    query: {
      email: registerFormData.email,
      expireAt: response.verificationTokenExpiresAt,
    },
  });
}
</script>

<template>
  <UForm
    :schema="registerFormSchema"
    :state="registerFormState"
    :validate-on="[]"
    class="w-full max-w-md md:max-w-xl lg:max-w-2xl border border-default rounded-lg form-container bg-elevated"
    @submit.prevent="onNewUserRegister"
  >
    <AuthFormSubHeader
      :description="t('register.description')"
      :title="t('register.title')"
    />

    <div class="px-4">
      <USeparator />
    </div>
    <div class="px-4">
      <UAlert color="error" icon="i-lucide-info" v-if="error" :title="error" />
    </div>
    <div class="flex w-full flex-col p-4 gap-4">
      <AuthEmailField v-model="registerFormState.email" />
      <AuthRegisterPasswordField
        :label="t('register.passwordLabel')"
        name="password"
        v-model="registerFormState.password"
      />
    </div>

    <div class="h-full flex flex-col gap-4 p-4">
      <UButton
        block
        loading-auto
        :disabled="loading"
        size="xl"
        class="cursor-pointer"
        type="submit"
      >
        {{ t('register.submit') }}
      </UButton>

      <USeparator :label="t('register.or')" />

      <div class="flex w-full justify-around gap-4">
        <AuthGitlabButton :loading="loading" />
        <AuthGithubButton :loading="loading" />
      </div>

      <AuthFormFooter
        :message="t('register.footer.message')"
        :link-message="t('register.footer.link')"
        :to="localePath('/auth/login')"
      />
    </div>
  </UForm>
</template>

<style scoped>
.form-container {
  padding: 2rem;
}
</style>

<i18n lang="json">
{
  "en": {
    "register": {
      "title": "Register",
      "description": "Enter your email and password",
      "passwordLabel": "Password",
      "submit": "Register",
      "or": "Or With",
      "footer": {
        "message": "Have an account?",
        "link": "Sign In"
      }
    },
    "error": {
      "loginFailed": "Login failed",
      "emailInvalid": "Please enter a valid email address",
      "passwordRequired": "Password is required"
    },
    "password": {
      "error": {
        "minLength": "Password must be at least {min} characters long",
        "maxLength": "Password must be at most {max} characters long"
      }
    }
  },

  "fr": {
    "register": {
      "title": "Créer un compte",
      "description": "Entrez votre email et mot de passe",
      "passwordLabel": "Mot de passe",
      "submit": "S'inscrire",
      "or": "Ou avec",
      "footer": {
        "message": "Vous avez déjà un compte ?",
        "link": "Se connecter"
      }
    },
    "error": {
      "loginFailed": "Échec de la connexion",
      "emailInvalid": "Veuillez entrer une adresse e-mail valide",
      "passwordRequired": "Le mot de passe est obligatoire"
    },
    "password": {
      "error": {
        "minLength": "Le mot de passe doit contenir au moins {min} caractères",
        "maxLength": "Le mot de passe doit contenir au maximum {max} caractères"
      }
    }
  }
}
</i18n>
