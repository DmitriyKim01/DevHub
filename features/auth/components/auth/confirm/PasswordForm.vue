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
  console.log(event.data.code);
}
</script>

<template>
  <UForm
    :schema="confirmEmailFormSchema"
    :state="confirmEmailFormState"
    :validate-on="[]"
    :ui="{
      base: 'w-full max-w-lg md:max-w-xl lg:max-w-2xl p-4 border border-muted rounded-lg',
    }"
    @submit.prevent="onValidateEmail"
  >
    <div class="p-4 text-center font-light text-xl">
      <h2>VERIFY YOUR EMAIL ADDRESS</h2>
    </div>
    <div class="p-12">
      <USeparator />
    </div>

    <div>
      <p>A verification code has been sent to test@test.com</p>
      <p>
        Please check your inbox and enter the verification code below to verify
        your email address. The code will expire in 14:48
      </p>
    </div>
    <div class="px-4">
      <UAlert color="error" icon="i-lucide-info" v-if="error" :title="error" />
    </div>
    <div class="flex w- flex-col items-center p-4 gap-4">
      <UPinInput
        :length="6"
        size="xl"
        type="number"
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
    </div>
    <!-- <div class="flex w-full flex-col items-center p-4 gap-4"></div>
    <div class="h-full flex flex-col gap-4 p-4"></div> -->
  </UForm>
</template>
