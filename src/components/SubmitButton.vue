<template>
  <button
    :type="type"
    class="btn btn-primary"
    :class="{ 'w-100': block, [`btn-${size}`]: size }"
    :disabled="loading || disabled"
    :aria-busy="loading ? 'true' : undefined"
    @click="$emit('click')"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm me-2" aria-hidden="true" />
    <span v-if="loading">{{ loadingLabel }}</span>
    <slot v-else>{{ label }}</slot>
  </button>
</template>

<script setup>
defineProps({
  label: { type: String, default: 'Salvar' },
  loadingLabel: { type: String, default: 'Salvando…' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  size: { type: String, default: '' },
  type: { type: String, default: 'button' },
})

defineEmits(['click'])
</script>
