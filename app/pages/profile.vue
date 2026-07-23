<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'
import ProfileDetailsCard from '~/components/profile/ProfileDetailsCard.vue'

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

const errorActions = computed<ButtonProps[]>(() => [{
  label: t('profile.tryAgain'),
  color: 'error',
  variant: 'solid',
  onClick: () => refresh()
}])
</script>

<template>
  <div class="mx-auto w-full max-w-lg">
    <h1 class="mb-6 text-2xl font-semibold text-highlighted">
      {{ t('profile.title') }}
    </h1>

    <UCard v-if="status === 'pending'">
      <div class="flex items-center gap-4">
        <USkeleton class="size-16 shrink-0 rounded-full" />
        <div class="w-full space-y-2">
          <USkeleton class="h-4 w-1/2" />
          <USkeleton class="h-3 w-1/3" />
        </div>
      </div>
      <div class="mt-6 space-y-3">
        <USkeleton class="h-3 w-2/3" />
        <USkeleton class="h-3 w-1/2" />
      </div>
    </UCard>

    <UAlert
      v-else-if="error"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      :title="t('profile.loadFailedTitle')"
      :description="t('profile.loadFailedDescription')"
      :actions="errorActions"
    />

    <ProfileDetailsCard
      v-else-if="profile"
      :profile="profile"
    />
  </div>
</template>
