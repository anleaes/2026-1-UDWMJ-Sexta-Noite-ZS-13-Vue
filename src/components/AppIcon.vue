<template>
  <component
    :is="componenteIconeLucide"
    :size="size"
    :stroke-width="strokeWidth"
    :class="klass"
    :aria-hidden="decorative ? 'true' : undefined"
    :aria-label="decorative ? undefined : label"
    :role="decorative ? undefined : 'img'"
  />
</template>

<script setup>
import { computed } from 'vue'
import { MAPA_COMPONENTES_ICONE_LUCIDE } from '@/constants/icones'
import { Image } from 'lucide-vue-next'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 20 },
  strokeWidth: { type: Number, default: 2 },
  klass: { type: String, default: '' },
  /** true = decorativo (aria-hidden). false = ícone com significado → passe label */
  decorative: { type: Boolean, default: true },
  label: { type: String, default: '' },
})

/** Resolve o nome lógico (ex.: "Home") para o componente Lucide correspondente */
const componenteIconeLucide = computed(() => MAPA_COMPONENTES_ICONE_LUCIDE[props.name] || Image)
</script>
