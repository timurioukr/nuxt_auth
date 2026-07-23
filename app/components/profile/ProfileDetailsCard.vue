<script setup lang="ts">
import type { UserProfile } from '#shared/types/user'

interface Props {
  profile: UserProfile
}

const { profile } = defineProps<Props>()
const { t } = useI18n()

const fullName = computed(() => `${profile.firstName} ${profile.lastName}`)

/* DummyJSON returns dates like "1996-5-30" — show them human-readable. */
const birthDate = computed(() => {
  if (!profile.birthDate) {
    return ''
  }

  const parsed = new Date(profile.birthDate)
  return Number.isNaN(parsed.getTime())
    ? profile.birthDate
    : new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(parsed)
})

const location = computed(() =>
  [profile.city, profile.country].filter(Boolean).join(', ')
)

const gender = computed(() =>
  profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)
)

interface ProfileDetail {
  key: string
  icon: string
  label: string
  value: string
}

const details = computed<ProfileDetail[]>(() => [
  { key: 'email', icon: 'i-lucide-mail', label: t('profile.email'), value: profile.email },
  { key: 'phone', icon: 'i-lucide-phone', label: t('profile.phone'), value: profile.phone },
  { key: 'birthDate', icon: 'i-lucide-cake', label: t('profile.birthDate'), value: birthDate.value },
  { key: 'location', icon: 'i-lucide-map-pin', label: t('profile.location'), value: location.value },
  { key: 'gender', icon: 'i-lucide-user', label: t('profile.gender'), value: gender.value }
].filter(detail => Boolean(detail.value)))
</script>

<template>
  <UCard>
    <div class="flex items-center gap-4">
      <UAvatar
        :src="profile.image"
        :alt="fullName"
        class="size-16"
      />
      <div>
        <p class="text-lg font-semibold text-highlighted">
          {{ fullName }}
        </p>
        <p class="text-sm text-muted">
          @{{ profile.username }}
        </p>
      </div>
    </div>

    <dl class="mt-6 space-y-4 text-sm">
      <div
        v-for="detail in details"
        :key="detail.key"
        class="flex items-center gap-3"
      >
        <UIcon
          :name="detail.icon"
          class="size-4 shrink-0 text-dimmed"
        />
        <dt class="sr-only">
          {{ detail.label }}
        </dt>
        <dd class="text-default">
          {{ detail.value }}
        </dd>
      </div>
    </dl>
  </UCard>
</template>
