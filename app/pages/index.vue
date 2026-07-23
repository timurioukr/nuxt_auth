<script setup lang="ts">
import LoginForm from '~/components/auth/LoginForm.vue'

const { t } = useI18n()

useSeoMeta({ title: () => t('login.title') })
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100 p-4 dark:bg-slate-950">
    <UCard
      class="w-full max-w-md rounded-3xl shadow-sm"
      :ui="{ body: 'p-6 sm:p-10' }"
    >
      <div class="mb-8 flex flex-col items-center gap-4">
        <UIcon
          name="i-lucide-earth"
          class="size-12 text-primary"
        />
        <h1 class="text-2xl font-semibold text-highlighted">
          {{ t('login.title') }}
        </h1>
      </div>

      <LoginForm />
    </UCard>
  </div>
</template>
