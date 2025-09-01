<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import { loginSchema, type LoginSchemaType } from '../../shared/form-schemas/login';

const loginFormState = reactive<Partial<LoginSchemaType>>({
  email: '',
  password: ''
});

const loading = ref(false);
const error = ref<string | null>(null);

async function onLogin(event: FormSubmitEvent<LoginSchemaType>) {

}
</script>

<template>
  <UForm
    :schema="loginSchema"
    :state="loginFormState"
    class="mx-auto flex max-w-[400px] flex-col items-center justify-center space-y-4 rounded-md p-10 shadow-lg/30 sm:max-w-md md:max-w-lg lg:max-w-xl"
    @submit.prevent="onLogin"
  >
    <FormIcon />
    <FormSubHeader
      description="Login to continue using the app"
      title="Login"
    />
    <FormError
      v-if="error"
      :message="error"
    />
    <div class="flex w-full flex-col gap-4">
      <EmailField v-model="loginFormState.email" />
      <PasswordField
        v-model="loginFormState.password"
        label="Password"
        name="password"
      />
    </div>

    <div class="flex w-full justify-end gap-2 font-semibold">
      <NuxtLink
        class="text-accent font-semibold"
        to="/auth/password-reset/email"
      >Forgot Password?</NuxtLink>
    </div>

    <div class="flex w-full gap-2 font-semibold">
      <UCheckbox
        description="Stay signed in for 7 days on this device"
        label="Remember this device"
        size="xl"
      />
    </div>

    <div class="mt-4 flex w-full flex-col gap-4">
      <UButton
        block
        loading-auto
        size="xl"
        type="submit"
      >
        Login
      </UButton>

      <USeparator label="Or With" />

      <div class="flex w-full justify-around gap-4">
        <GitlabButton :loading="loading" />
        <GithubButton :loading="loading" />
      </div>

      <FormFooterLink
        message="Don't have an account?"
        link-message="Register"
        to="/auth/register"
      />
    </div>
  </UForm>
</template>
