<script setup lang="ts">
definePageMeta({ layout: 'authenticated' })

const { t } = useI18n()

useSeoMeta({ title: () => t('dashboard.title') })
</script>

<template>
  <div class="flex min-h-[70vh] items-center justify-center">
    <h1 class="text-3xl font-semibold text-highlighted">
      {{ t('dashboard.welcome') }}
    </h1>
  </div>
</template>
