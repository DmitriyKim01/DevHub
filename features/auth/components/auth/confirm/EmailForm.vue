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
});

async function onValidateEmail(
  event: FormSubmitEvent<ConfirmEmailFormSchemaType>
) {
  const confirmEmailFormData = event.data;
  const codeString = confirmEmailFormData.code.join('');

  await $fetch('/api/v1/auth/email', {
    method: 'POST',
    body: {
      email: confirmEmailFormData.email,
      code: codeString,
    },
    onResponseError({ response }) {
      error.value = response?._data?.message || 'Email verification failed';
    },
  });
}
</script>

<template>
  <UForm
    :schema="confirmEmailFormSchema"
    :state="confirmEmailFormState"
    class="max-w-md border border-muted rounded-lg p-8"
    :validate-on="[]"
    @submit.prevent="onValidateEmail"
  >
    <div class="p-12">
      <div class="p-4 text-center font-light text-xl">
        <UIcon class="text-3xl text-primary" name="ic:baseline-email" />
        <h2>VERIFY YOUR EMAIL ADDRESS</h2>
      </div>
      <div class="p-4">
        <USeparator />
      </div>

      <div class="p-4">
        <p class="text-center">
          A verification code has been sent to
          <span>{{ confirmEmailFormState.email }}</span>
        </p>
      </div>
      <div class="p-4" v-if="error">
        <UAlert
          color="error"
          icon="i-lucide-info"
          v-if="error"
          :title="error"
        />
      </div>
      <div class="flex w-full flex-col items-center justify-center p-4 gap-6">
        <p>
          Please check your inbox and enter the verification code below to
          verify your email address. The code will expire in 14:48
        </p>
        <UPinInput
          :length="6"
          type="number"
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
          size="xl"
          class="cursor-pointer"
          type="submit"
        >
          Verify Email
        </UButton>
        <div class="w-full flex justify-around">
          <ULink>Resend code</ULink>
          <ULink>Change email</ULink>
        </div>
      </div>
      <!-- <div class="flex w-full flex-col items-center p-4 gap-4"></div>
    <div class="h-full flex flex-col gap-4 p-4"></div> -->
    </div>
  </UForm>
</template>
