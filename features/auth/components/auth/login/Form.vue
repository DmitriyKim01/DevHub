<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import { z } from 'zod/v4';

const localePath = useLocalePath();
const { t } = useI18n({
  useScope: 'local',
});

const loginFormSchema = z.object({
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

type LoginFormSchemaType = z.output<typeof loginFormSchema>;

const loginFormState = reactive<Partial<LoginFormSchemaType>>({
  email: '',
  password: '',
});

const loading = ref(false);
const error = ref<string | null>(null);

async function onUserLogin(event: FormSubmitEvent<LoginFormSchemaType>) {
  const loginFormData = event.data;
  await $fetch('/api/v1/auth/login', {
    method: 'POST',
    body: {
      email: loginFormData.email,
      password: loginFormData.password,
    },
    onResponseError({ response }) {
      error.value = response?._data?.message || t('error.loginFailed');
    },
  });

  const session = useUserSession();
  await session.fetch();
  await navigateTo(localePath('/auth'));
}
</script>

<template>
  <UForm
    :schema="loginFormSchema"
    :state="loginFormState"
    :validate-on="[]"
    class="w-full max-w-md md:max-w-xl lg:max-w-2xl border border-default rounded-lg form-container bg-elevated"
    @submit.prevent="onUserLogin"
  >
    <AuthFormSubHeader
      :description="t('login.description')"
      :title="t('login.title')"
    />

    <div class="p-4">
      <USeparator />
    </div>
    <div class="px-4">
      <UAlert color="error" icon="i-lucide-info" v-if="error" :title="error" />
    </div>
    <div class="flex w-full flex-col gap-4 p-4">
      <AuthEmailField v-model="loginFormState.email" />
      <AuthPasswordField
        v-model="loginFormState.password"
        :label="t('login.passwordLabel')"
        name="password"
      />
      <div>
        <ULink class="text-left block cursor-pointer">{{
          t('login.forgotPassword')
        }}</ULink>
      </div>
    </div>

    <div class="flex w-full flex-col gap-4 p-4">
      <UButton
        block
        loading-auto
        size="xl"
        class="cursor-pointer"
        type="submit"
      >
        {{ t('login.submit') }}
      </UButton>

      <USeparator :label="t('login.or')" />

      <div class="flex w-full justify-around gap-4">
        <AuthGitlabButton :loading="loading" />
        <AuthGithubButton :loading="loading" />
      </div>

      <AuthFormFooter
        :message="t('login.footer.message')"
        :link-message="t('login.footer.link')"
        :to="localePath('/auth/register')"
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
    "login": {
      "title": "Login",
      "description": "Login to continue using the app",
      "passwordLabel": "Password",
      "forgotPassword": "Forgot password?",
      "submit": "Login",
      "or": "Or With",
      "footer": {
        "message": "Don't have an account?",
        "link": "Register"
      }
    },
    "error": {
      "loginFailed": "Login failed",
      "emailInvalid": "Please enter a valid email address"
    },
    "password": {
      "error": {
        "minLength": "Password must be at least {min} characters long",
        "maxLength": "Password must be at most {max} characters long"
      }
    }
  },

  "fr": {
    "login": {
      "title": "Connexion",
      "description": "Connectez-vous pour continuer à utiliser l’application",
      "passwordLabel": "Mot de passe",
      "forgotPassword": "Mot de passe oublié ?",
      "submit": "Connexion",
      "or": "Ou avec",
      "footer": {
        "message": "Vous n’avez pas de compte ?",
        "link": "Créer un compte"
      }
    },
    "error": {
      "loginFailed": "Échec de la connexion",
      "emailInvalid": "Veuillez entrer une adresse e-mail valide"
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
