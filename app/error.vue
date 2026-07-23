<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()

const is404 = computed(() => props.error.status === 404)

useSeoMeta({ title: () => (is404.value ? t('errorPage.notFoundTitle') : t('errorPage.genericTitle')) })

function goHome() {
  /* The global middleware sends authenticated users on to /dashboard. */
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-100 p-6 text-center dark:bg-slate-950">
    <template v-if="is404">
      <div
        class="flex select-none items-center gap-3 text-8xl font-bold text-highlighted sm:gap-5"
        aria-hidden="true"
      >
        <span>4</span>
        <span class="orbit-scene relative inline-flex size-28 items-center justify-center">
          <UIcon
            name="i-lucide-earth"
            class="size-24 text-primary"
          />
          <span class="orbit absolute -inset-2 rounded-full border border-dashed border-slate-300 dark:border-slate-700">
            <span class="satellite absolute size-3 rounded-full bg-slate-400 dark:bg-slate-500" />
          </span>
        </span>
        <span>4</span>
      </div>

      <div class="space-y-2">
        <h1 class="text-2xl font-semibold text-highlighted">
          {{ t('errorPage.notFoundTitle') }}
        </h1>
        <p class="text-muted">
          {{ t('errorPage.notFoundDescription') }}
        </p>
      </div>
    </template>

    <template v-else>
      <p class="text-6xl font-bold text-highlighted">
        {{ error.status }}
      </p>
      <div class="space-y-2">
        <h1 class="text-2xl font-semibold text-highlighted">
          {{ t('errorPage.genericTitle') }}
        </h1>
        <p class="text-muted">
          {{ t('errorPage.genericDescription') }}
        </p>
      </div>
    </template>

    <UButton
      size="lg"
      icon="i-lucide-home"
      :label="t('errorPage.backHome')"
      @click="goHome"
    />
  </div>
</template>

<style scoped>
.orbit-scene {
  animation: float 4s ease-in-out infinite;
}

.orbit {
  animation: orbit-spin 10s linear infinite;
}

.satellite {
  top: -0.375rem;
  left: 50%;
  margin-left: -0.375rem;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-0.5rem);
  }
}

@keyframes orbit-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .orbit-scene,
  .orbit {
    animation: none;
  }
}
</style>
