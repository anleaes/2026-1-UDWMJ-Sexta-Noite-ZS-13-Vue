<template>
  <MotionReveal :y="18">
    <div class="detail-banner rounded-4 text-white mb-4 shadow" :class="`banner-${variant}`">
      <div class="p-4">
        <button type="button" class="btn btn-sm btn-light btn-back mb-3" aria-label="Voltar à página anterior" @click="$router.back()">
          <AppIcon name="ArrowLeft" :size="16" klass="me-1" decorative /> Voltar
        </button>
        <span v-if="badge" class="badge rounded-pill bg-white bg-opacity-25 mb-2">{{ badge }}</span>
        <h1 class="h2 font-display mb-1">{{ title }}</h1>
        <p v-if="meta" class="mb-0 opacity-90">{{ meta }}</p>
        <div v-if="$slots.actions" class="mt-3 d-flex flex-wrap gap-2">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </MotionReveal>
</template>

<script setup>
import AppIcon from '@/components/AppIcon.vue'
import MotionReveal from '@/components/MotionReveal.vue'

defineProps({
  title: { type: String, required: true },
  meta: { type: String, default: '' },
  badge: { type: String, default: '' },
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'galeria', 'obra', 'exposicao'].includes(v),
  },
})
</script>

<style scoped>
.font-display {
  font-family: var(--font-display);
  font-weight: 400;
  text-wrap: balance;
}

.btn-back {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.35);
  color: #fff;
}

.banner-galeria { background: linear-gradient(135deg, #047857, #10b981); }
.banner-obra { background: linear-gradient(135deg, #b45309, #fbbf24); }
.banner-exposicao { background: linear-gradient(135deg, #6d28d9, #c084fc); }
.banner-default { background: linear-gradient(135deg, #1e3a5f, #3b82f6); }
</style>
