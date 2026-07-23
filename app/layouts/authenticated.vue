<script setup lang="ts">
const { t } = useI18n()
const { logout } = useAuth()
const toast = useToast()
const route = useRoute()

/* Cookie instead of localStorage so SSR renders the sidebar in the
   right state — no width jump on hydration. Desktop only. */
const isCollapsed = useCookie<boolean>('sidebar-collapsed', { default: () => false })
const isMobileMenuOpen = ref(false)
const isLoggingOut = ref(false)
const iconButtonUi = { leadingIcon: 'size-5 text-dimmed' }

watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})

function toggleSidebar(event: MouseEvent) {
  isCollapsed.value = !isCollapsed.value
  if (event.detail > 0) {
    (event.currentTarget as HTMLElement).blur()
  }
}

async function onLogout() {
  isLoggingOut.value = true
  try {
    await logout()
    await navigateTo('/')
  } catch {
    toast.add({
      title: t('nav.logoutFailed'),
      color: 'error',
      icon: 'i-lucide-circle-alert'
    })
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen bg-slate-100 dark:bg-slate-950">
    <!-- Desktop sidebar -->
    <aside
      class="hidden shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-300 ease-out md:flex dark:border-slate-800 dark:bg-slate-900"
      :class="isCollapsed ? 'w-[72px]' : 'w-64'"
    >
      <div
        class="flex items-center py-5"
        :class="isCollapsed ? 'flex-col gap-3 px-3' : 'gap-2.5 px-5'"
      >
        <AppBrand :show-name="!isCollapsed" />
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          :icon="isCollapsed ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close'"
          :aria-label="isCollapsed ? t('nav.expand') : t('nav.collapse')"
          :class="['cursor-pointer', { 'ms-auto': !isCollapsed }]"
          :ui="iconButtonUi"
          @click="toggleSidebar"
        />
      </div>

      <AppNavigationMenu
        :collapsed="isCollapsed"
        :is-logging-out="isLoggingOut"
        @logout="onLogout"
      />
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <!-- Mobile top bar -->
      <header class="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 md:hidden dark:border-slate-800 dark:bg-slate-900">
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-menu"
          class="cursor-pointer"
          :aria-label="t('nav.openMenu')"
          :ui="iconButtonUi"
          @click="isMobileMenuOpen = true"
        />
        <AppBrand size="sm" />
      </header>

      <main class="flex-1 p-4 sm:p-6 lg:p-10">
        <slot />
      </main>
    </div>

    <!-- Mobile drawer -->
    <USlideover
      v-model:open="isMobileMenuOpen"
      side="left"
      :title="t('app.name')"
      :ui="{ content: 'w-72 max-w-[80vw]' }"
    >
      <template #content>
        <div class="flex h-full flex-col bg-white dark:bg-slate-900">
          <div class="flex items-center gap-2.5 px-5 py-5">
            <AppBrand />
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              icon="i-lucide-x"
              class="ms-auto cursor-pointer"
              :aria-label="t('nav.closeMenu')"
              :ui="iconButtonUi"
              @click="isMobileMenuOpen = false"
            />
          </div>

          <AppNavigationMenu
            :is-logging-out="isLoggingOut"
            @logout="onLogout"
          />
        </div>
      </template>
    </USlideover>
  </div>
</template>
