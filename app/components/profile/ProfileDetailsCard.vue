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
      <div class="flex items-center gap-3">
        <UIcon
          name="i-lucide-mail"
          class="size-4 shrink-0 text-dimmed"
        />
        <dt class="sr-only">
          {{ t('profile.email') }}
        </dt>
        <dd class="text-default">
          {{ profile.email }}
        </dd>
      </div>
      <div
        v-if="profile.phone"
        class="flex items-center gap-3"
      >
        <UIcon
          name="i-lucide-phone"
          class="size-4 shrink-0 text-dimmed"
        />
        <dt class="sr-only">
          {{ t('profile.phone') }}
        </dt>
        <dd class="text-default">
          {{ profile.phone }}
        </dd>
      </div>
      <div
        v-if="birthDate"
        class="flex items-center gap-3"
      >
        <UIcon
          name="i-lucide-cake"
          class="size-4 shrink-0 text-dimmed"
        />
        <dt class="sr-only">
          {{ t('profile.birthDate') }}
        </dt>
        <dd class="text-default">
          {{ birthDate }}
        </dd>
      </div>
      <div
        v-if="location"
        class="flex items-center gap-3"
      >
        <UIcon
          name="i-lucide-map-pin"
          class="size-4 shrink-0 text-dimmed"
        />
        <dt class="sr-only">
          {{ t('profile.location') }}
        </dt>
        <dd class="text-default">
          {{ location }}
        </dd>
      </div>
      <div class="flex items-center gap-3">
        <UIcon
          name="i-lucide-user"
          class="size-4 shrink-0 text-dimmed"
        />
        <dt class="sr-only">
          {{ t('profile.gender') }}
        </dt>
        <dd class="text-default capitalize">
          {{ profile.gender }}
        </dd>
      </div>
    </dl>
  </UCard>
</template>
