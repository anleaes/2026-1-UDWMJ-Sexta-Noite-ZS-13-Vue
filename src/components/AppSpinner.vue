<template>
  <div class="position-relative">
    <div
      v-if="show"
      class="loading-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
    >
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
    <div :class="{ 'loading-dim': show }">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
})
</script>

<style scoped>
.loading-overlay {
  z-index: 10;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(2px);
  min-height: 120px;
  border-radius: inherit;
}

.loading-dim {
  pointer-events: none;
  opacity: 0.55;
}
</style>
