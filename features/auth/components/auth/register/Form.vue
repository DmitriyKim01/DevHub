<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';
import { z } from 'zod/v4';

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;

const registerFormSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    )
    .max(
      MAX_PASSWORD_LENGTH,
      `Password must be at most ${MAX_PASSWORD_LENGTH} characters long`
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
  const registerFormData = event.data;

  const response = await $fetch('/api/v1/auth/register', {
    method: 'POST',
    body: {
      email: registerFormData.email,
      password: registerFormData.password,
    },
    onResponseError({ response }) {
      error.value = response?._data?.message || 'Login failed';
    },
  });

  if (!response.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Registration failed',
    });
  }
  await navigateTo({
    path: '/auth/confirm/email',
    query: {
      email: registerFormData.email,
    },
  });
}
</script>

<template>
  <UForm
    :schema="registerFormSchema"
    :state="registerFormState"
    :validate-on="[]"
    class="w-full max-w-lg md:max-w-xl lg:max-w-2xl p-4 border border-muted rounded-lg"
    @submit.prevent="onNewUserRegister"
  >
    <AuthFormIcon />
    <AuthFormSubHeader
      description="Enter your email and password"
      title="Register"
    />
    <div class="px-4">
      <UAlert color="error" icon="i-lucide-info" v-if="error" :title="error" />
    </div>
    <div class="flex w-full flex-col p-4 gap-4">
      <AuthEmailField v-model="registerFormState.email" />
      <AuthRegisterPasswordField
        label="Password"
        name="password"
        v-model="registerFormState.password"
      />
    </div>

    <div class="h-full flex flex-col gap-4 p-4">
      <UButton
        block
        loading-auto
        size="xl"
        class="cursor-pointer"
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
