<script setup lang="ts">
definePageMeta({ layout: 'authenticated' })

const { t } = useI18n()

useSeoMeta({ title: () => t('profile.title') })

const { clearSession } = useAuth()

/* The page owns its loading / error states, so it fetches the profile
   itself instead of reusing the session snapshot from the middleware.
   lazy: navigation is instant and the skeleton communicates progress. */
const { data: profile, status, error, refresh } = useFetch('/api/auth/me', { lazy: true })

/* Token expired mid-session: drop the client state and send the user
   back to the login page. */
watchEffect(() => {
  if (error.value?.status === 401) {
    clearSession()
    navigateTo('/')
  }
})
</script>

<template>
  <div class="mx-auto w-full max-w-lg">
    <h1 class="mb-6 text-2xl font-semibold text-highlighted">
      {{ t('profile.title') }}
    </h1>

    <div
      v-if="status === 'pending'"
      class="space-y-4"
    >
      <USkeleton class="h-4 w-1/2" />
      <USkeleton class="h-3 w-1/3" />
      <USkeleton class="h-3 w-2/3" />
    </div>

    <UAlert
      v-else-if="error"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      :title="t('profile.loadFailedTitle')"
      :description="t('profile.loadFailedDescription')"
      :actions="[{
        label: t('profile.tryAgain'),
        color: 'error',
        variant: 'solid',
        onClick: () => refresh()
      }]"
    />

    <p
      v-else-if="profile"
      class="text-muted"
    >
      {{ profile.firstName }} {{ profile.lastName }}
    </p>
  </div>
</template>
