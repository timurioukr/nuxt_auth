<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { FetchError } from 'ofetch'
import FormFieldError from '~/components/form/FormFieldError.vue'

const { t } = useI18n()

const { login } = useAuth()

const { defineField, handleSubmit, errors, isSubmitting, setFieldError } = useForm({
  validationSchema: toTypedSchema(createLoginSchema(key => t(key))),
  initialValues: { rememberMe: false }
})

const lazyEagerValidation = (state: { errors: string[] }) => ({
  validateOnModelUpdate: state.errors.length > 0
})

const [username, usernameAttrs] = defineField('username', lazyEagerValidation)
const [password, passwordAttrs] = defineField('password', lazyEagerValidation)
const [rememberMe, rememberMeAttrs] = defineField('rememberMe')

const showPassword = ref(false)

const fieldUi = { error: 'text-xs' }

const inputUi = {
  base: 'rounded-2xl text-sm ring-slate-300 focus-visible:ring-2 focus-visible:ring-primary'
}

function loginErrorMessage(error: unknown): string {
  const status = error instanceof FetchError ? error.status : undefined
  if (status === 401) {
    return t('login.errors.invalidCredentials')
  }
  if (status === 502) {
    return t('login.errors.serviceUnavailable')
  }
  return t('login.errors.generic')
}

function setCredentialErrors(message: string) {
  setFieldError('password', message)
}

/* The redirect stays inside handleSubmit so isSubmitting covers it and the
   button cannot be re-submitted between login and the route change. */
const onSubmit = handleSubmit(async (credentials) => {
  try {
    await login(credentials)
    await navigateTo('/dashboard')
  } catch (error) {
    setCredentialErrors(loginErrorMessage(error))
  }
})
</script>

<template>
  <form
    class="space-y-5"
    novalidate
    @submit="onSubmit"
  >
    <UFormField
      :label="t('login.username')"
      name="username"
      :error="errors.username"
      :ui="fieldUi"
    >
      <UInput
        v-model="username"
        v-bind="usernameAttrs"
        class="w-full"
        size="lg"
        :placeholder="t('login.usernamePlaceholder')"
        autocomplete="username"
        :disabled="isSubmitting"
        :ui="inputUi"
      />
      <template #error="{ error }">
        <FormFieldError :error="error" />
      </template>
    </UFormField>

    <UFormField
      :label="t('login.password')"
      name="password"
      :error="errors.password"
      :ui="fieldUi"
    >
      <UInput
        v-model="password"
        v-bind="passwordAttrs"
        class="w-full"
        size="lg"
        :placeholder="t('login.passwordPlaceholder')"
        autocomplete="current-password"
        :type="showPassword ? 'text' : 'password'"
        :disabled="isSubmitting"
        :ui="{ ...inputUi, trailing: 'pe-1' }"
      >
        <template #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            class="cursor-pointer"
            :icon="showPassword ? 'i-lucide-eye' : 'i-lucide-eye-off'"
            :aria-label="showPassword ? t('login.hidePassword') : t('login.showPassword')"
            :aria-pressed="showPassword"
            @click="showPassword = !showPassword"
          />
        </template>
      </UInput>
      <template #error="{ error }">
        <FormFieldError :error="error" />
      </template>
    </UFormField>

    <UCheckbox
      v-model="rememberMe"
      v-bind="rememberMeAttrs"
      :label="t('login.rememberMe')"
      :disabled="isSubmitting"
      :ui="{ base: 'cursor-pointer', label: 'cursor-pointer' }"
    />

    <UButton
      type="submit"
      block
      size="lg"
      class="cursor-pointer rounded-full"
      :label="isSubmitting ? undefined : t('login.submit')"
      :loading="isSubmitting"
      :ui="{ leadingIcon: isSubmitting ? 'mx-auto' : undefined }"
    />
  </form>
</template>
