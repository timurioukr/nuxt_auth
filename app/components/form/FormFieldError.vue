<script setup lang="ts">
interface Props {
  error?: string | boolean
}

const { error } = defineProps<Props>()
</script>

<template>
  <Transition name="field-error">
    <span
      v-if="error"
      class="mt-1 block"
    >{{ error }}</span>
  </Transition>
</template>

<style scoped>
.field-error-enter-active,
.field-error-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}

.field-error-enter-from,
.field-error-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem);
}
</style>
