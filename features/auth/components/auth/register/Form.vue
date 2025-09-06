<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';
import { z } from 'zod/v4';

const MIN_FORM_PASSWORD_LENGTH = 8;
const MAX_FORM_PASSWORD_LENGTH = 64;

const registerFormSchema = z.object({
  email: z.email(),
  password: z.string()
    .min(MIN_FORM_PASSWORD_LENGTH, `Password must be at least ${MIN_FORM_PASSWORD_LENGTH} characters long`)
    .max(MAX_FORM_PASSWORD_LENGTH, `Password must be at most ${MAX_FORM_PASSWORD_LENGTH} characters long`),
  confirmPassword: z.string()
    .min(MIN_FORM_PASSWORD_LENGTH, `Confirm Password must be at least ${MIN_FORM_PASSWORD_LENGTH} characters long`)
    .max(MAX_FORM_PASSWORD_LENGTH, `Confirm Password must be at most ${MAX_FORM_PASSWORD_LENGTH} characters long`)
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match'
});

type RegisterFormSchemaType = z.output<typeof registerFormSchema>;

const registerFormState = reactive<Partial<RegisterFormSchemaType>>({
  email: '',
  password: '',
  confirmPassword: ''
});

const loading = ref(false);
const error = ref<string | null>(null);

async function onNewUserRegister(event: FormSubmitEvent<RegisterFormSchemaType>) {
  const registerFormData = event.data;

  const response = await $fetch<RegisterResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: {
      email: registerFormData.email,
      password: registerFormData.password,
      confirmPassword: registerFormData.confirmPassword
    }
  });

  if (!response.success) {
    throw createError({ statusCode: 400, statusMessage: 'Registration failed' });
  }
  await navigateTo('/auth/login');
}
</script>

<template>
  <UForm
    :schema="registerFormSchema"
    :state="registerFormState"
    class="mx-auto flex w-full flex-col items-center justify-center space-y-4 rounded-md p-10 shadow-lg/30 sm:max-w-md md:max-w-lg lg:max-w-xl"
    @submit.prevent="onNewUserRegister"
  >
    <AuthFormIcon />
    <AuthFormSubHeader
      description="Enter your personal information"
      title="Register"
    />
    <AuthFormError
      v-if="error"
      :message="error"
    />
    <div class="flex w-full flex-col gap-4">
      <AuthEmailField v-model="registerFormState.email" />
      <AuthRegisterPasswordField
        v-model="registerFormState.password"
        label="Password"
        name="password"
      />
      <AuthPasswordField
        v-model="registerFormState.confirmPassword"
        label="Confirm Password"
        name="confirmPassword"
      />
    </div>

    <div class="mt-4 flex w-full flex-col gap-8">
      <UButton
        block
        loading-auto
        size="xl"
        type="submit"
      >
        Register
      </UButton>

      <USeparator label="Or With" />

      <div class="flex w-full justify-around gap-4">
        <AuthGitlabButton :loading="loading" />
        <AuthGithubButton :loading="loading" />
      </div>

      <AuthFormFooter
        message="Have an account?"
        link-message="Sign In"
        to="/auth/login"
      />
    </div>
  </UForm>
</template>
