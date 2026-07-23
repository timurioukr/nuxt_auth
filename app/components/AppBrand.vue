<script setup lang="ts">
interface Props {
  /** `sm` is the compact variant for the mobile top bar. */
  size?: 'sm' | 'md'
  showName?: boolean
}

const { size = 'md', showName = true } = defineProps<Props>()

const { t } = useI18n()

const iconClass = computed(() => (size === 'sm' ? 'size-6' : 'size-7'))
const nameClass = computed(() => (size === 'sm' ? 'text-base' : 'text-lg'))
</script>

<template>
  <UIcon
    name="i-lucide-earth"
    class="shrink-0 text-primary"
    :class="iconClass"
  />
  <span
    v-if="showName"
    class="truncate font-semibold text-highlighted"
    :class="nameClass"
  >{{ t('app.name') }}</span>
</template>
