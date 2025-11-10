<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import { z } from 'zod/v4';

const MIN_FORM_PASSWORD_LENGTH = 8;
const MAX_FORM_PASSWORD_LENGTH = 64;

const loginFormSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(
      MIN_FORM_PASSWORD_LENGTH,
      `Password must be at least ${MIN_FORM_PASSWORD_LENGTH} characters long`
    )
    .max(
      MAX_FORM_PASSWORD_LENGTH,
      `Password must be at most ${MAX_FORM_PASSWORD_LENGTH} characters long`
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
  const response = await $fetch('/api/v1/auth/login', {
    method: 'POST',
    body: {
      email: loginFormData.email,
      password: loginFormData.password,
    },
    onResponseError({ response }) {
      error.value = response?._data?.message || 'Login failed';
    },
  });

  const session = useUserSession();
  await session.fetch();
  await navigateTo('/auth');
}
</script>

<template>
  <UForm
    :schema="loginFormSchema"
    :state="loginFormState"
    :validate-on="[]"
    class="w-full max-w-md md:max-w-xl lg:max-w-2xl form-container border border-muted rounded-lg"
    @submit.prevent="onUserLogin"
  >
    <AuthFormSubHeader
      description="Login to continue using the app"
      title="Login"
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
        label="Password"
        name="password"
      />
      <div>
        <ULink class="text-left block cursor-pointer">Forgot password?</ULink>
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
        Login
      </UButton>

      <USeparator label="Or With" />

      <div class="flex w-full justify-around gap-4">
        <AuthGitlabButton :loading="loading" />
        <AuthGithubButton :loading="loading" />
      </div>

      <AuthFormFooter
        message="Don't have an account?"
        link-message="Register"
        to="/auth/register"
      />
    </div>
  </UForm>
</template>

<style scoped>
.form-container {
  padding: 2rem;
}
</style>
