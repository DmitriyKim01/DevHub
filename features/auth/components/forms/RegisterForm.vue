<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';
import { z } from 'zod/v4';

const REGISTER_FORM_PASSWORD_LENGTH = 8;

const registerFormSchema = z.object({
  email: z.email(),
  password: z.string().min(REGISTER_FORM_PASSWORD_LENGTH, 'Password must be at least 8 characters long'),
  confirmPassword: z.string().min(REGISTER_FORM_PASSWORD_LENGTH, 'Confirm Password must be at least 8 characters long')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match'
});

type RegisterSchemaType = z.output<typeof registerFormSchema>;

const registerFormState = reactive<Partial<RegisterSchemaType>>({
  email: '',
  password: '',
  confirmPassword: ''
});

const loading = ref(false);
const error = ref<string | null>(null);
const toast = useToast();

async function onNewUserRegister(event: FormSubmitEvent<RegisterSchemaType>) {
  const registerFormData = event.data;
  try {
    const response = await $fetch('/api/v1/auth/register', {
      method: 'POST',
      body: {
        email: registerFormData.email,
        password: registerFormData.password,
        confirmPassword: registerFormData.confirmPassword
      }
    });

    if (!response.success) {
      throw new Error('Register failed');
    }
    await navigateTo('/auth/login');
  }
  catch {
    toast.add({
      color: 'error',
      title: 'Failed to create an account!'
    });
  }
}
</script>

<template>
  <UForm
    :schema="registerFormSchema"
    :state="registerFormState"
    class="mx-auto flex w-full flex-col items-center justify-center space-y-4 rounded-md p-10 shadow-lg/30 sm:max-w-md md:max-w-lg lg:max-w-xl"
    @submit.prevent="onNewUserRegister"
  >
    <FormIcon />
    <FormSubHeader
      description="Enter your personal information"
      title="Register"
    />
    <FormError
      v-if="error"
      :message="error"
    />
    <div class="flex w-full flex-col gap-4">
      <EmailField v-model="registerFormState.email" />
      <NewPasswordField
        v-model="registerFormState.password"
        label="Password"
        name="password"
      />
      <PasswordField
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
        <GitlabButton :loading="loading" />
        <GithubButton :loading="loading" />
      </div>

      <FormFooterLink
        message="Have an account?"
        link-message="Sign In"
        to="/auth/login"
      />
    </div>
  </UForm>
</template>
