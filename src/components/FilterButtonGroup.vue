<template>
  <span v-if="label" class="text-muted small">{{ label }}</span>
  <div class="btn-group" :class="{ 'btn-group-sm': small }">
    <button
      v-for="opt in options"
      :key="String(opt.val)"
      type="button"
      class="btn"
      :class="modelValue === opt.val ? 'btn-primary' : 'btn-outline-secondary'"
      @click="select(opt.val)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [String, Number, Boolean, null], default: '' },
  options: { type: Array, required: true },
  label: { type: String, default: '' },
  small: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'change'])

function select(val) {
  emit('update:modelValue', val)
  emit('change', val)
}
</script>
