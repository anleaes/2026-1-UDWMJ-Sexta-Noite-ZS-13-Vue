<template>
  <span class="avatar-letter rounded-3" :class="`variant-${variant}`">{{ letter }}</span>
</template>

<script setup>
defineProps({
  letter: { type: String, required: true },
  variant: {
    type: String,
    default: 'galeria',
    validator: (v) => ['galeria', 'obra', 'default'].includes(v),
  },
})
</script>

<style scoped>
.avatar-letter {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
  flex-shrink: 0;
}

.variant-galeria {
  background: #ecfdf5;
  color: #059669;
}

.variant-obra {
  background: #fef3c7;
  color: #b45309;
}

.variant-default {
  background: #eef2ff;
  color: var(--mg-primary);
}
</style>
