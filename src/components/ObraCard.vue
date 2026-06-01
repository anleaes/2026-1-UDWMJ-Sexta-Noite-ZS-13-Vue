<template>
  <button type="button" class="card w-100 text-start border-0 h-100 obra-card" @click="$emit('click', $event)">
    <div class="obra-thumb">{{ titulo.charAt(0) }}</div>
    <div class="card-body">
      <h3 class="h6 mb-1">{{ titulo }}</h3>
      <p class="small text-muted mb-1">{{ tecnica }} · {{ ano }}</p>
      <p class="fw-semibold text-warning mb-0">{{ valorFormatado }}</p>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { formatMoney } from '@/utils/format'

const props = defineProps({
  titulo: { type: String, required: true },
  tecnica: { type: String, default: '' },
  ano: { type: [String, Number], default: '' },
  valor: { type: [String, Number], required: true },
})

defineEmits(['click'])

const valorFormatado = computed(() => formatMoney(props.valor))
</script>

<style scoped>
.obra-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.obra-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.obra-thumb {
  height: 90px;
  background: linear-gradient(135deg, #fef3c7, #fbbf24);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #b45309;
}
</style>
