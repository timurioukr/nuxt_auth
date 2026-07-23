<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

interface Props {
  collapsed?: boolean
  isLoggingOut: boolean
}

const { collapsed = false, isLoggingOut } = defineProps<Props>()

const emit = defineEmits<{
  logout: []
}>()

const { t } = useI18n()

const navigationItems = computed<NavigationMenuItem[]>(() => [
  { label: t('nav.dashboard'), icon: 'i-lucide-layout-dashboard', to: '/dashboard' },
  { label: t('nav.profile'), icon: 'i-lucide-user', to: '/profile' }
])

const logoutItems = computed<NavigationMenuItem[]>(() => [
  {
    label: t('nav.logout'),
    icon: isLoggingOut ? 'i-lucide-loader-circle' : 'i-lucide-log-out',
    disabled: isLoggingOut,
    onSelect: () => emit('logout')
  }
])

/* Collapsed keeps w-full links but hides labels — without justify-center
   the icon sits on the left edge of the active pill. */
const collapsedLinkUi = computed(() => (
  collapsed ? { link: 'justify-center' } : undefined
))

const logoutUi = computed(() => ({
  link: collapsed ? 'cursor-pointer justify-center' : 'cursor-pointer',
  ...(isLoggingOut ? { linkLeadingIcon: 'animate-spin' } : {})
}))
</script>

<template>
  <UNavigationMenu
    orientation="vertical"
    :items="navigationItems"
    :collapsed="collapsed"
    class="px-3"
    :ui="collapsedLinkUi"
  />

  <div class="mt-auto border-t border-slate-200 p-3 dark:border-slate-800">
    <UNavigationMenu
      orientation="vertical"
      :items="logoutItems"
      :collapsed="collapsed"
      :ui="logoutUi"
    />
  </div>
</template>
