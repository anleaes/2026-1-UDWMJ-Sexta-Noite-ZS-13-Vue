<template>
  <MotionReveal :y="14">
    <div class="page-header card border-0 mb-4 overflow-hidden" :class="`theme-${theme}`">
      <div class="card-body d-flex flex-wrap align-items-start gap-3">
        <div v-if="$slots.icon" class="header-icon rounded-3 d-flex align-items-center justify-content-center">
          <slot name="icon" />
        </div>
        <div class="flex-grow-1 min-w-0">
          <h1 class="h3 mb-1 font-display">{{ title }}</h1>
          <p v-if="subtitle" class="text-muted mb-0 small">{{ subtitle }}</p>
        </div>
        <div v-if="$slots.extra" class="d-flex flex-wrap gap-2 align-items-center">
          <slot name="extra" />
        </div>
      </div>
    </div>
  </MotionReveal>
</template>

<script setup>
import MotionReveal from '@/components/MotionReveal.vue'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  theme: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'home', 'galerias', 'obras', 'exposicoes', 'perfil'].includes(v),
  },
})
</script>

<style scoped>
.font-display {
  font-family: var(--font-display);
  font-weight: 400;
  text-wrap: balance;
}

.header-icon {
  width: 52px;
  height: 52px;
  font-size: 1.5rem;
}

.theme-home { background: linear-gradient(135deg, #eef2ff, var(--mg-surface)); }
.theme-home .header-icon { background: rgba(30, 58, 95, 0.1); color: var(--mg-primary); }

.theme-galerias { background: linear-gradient(135deg, #ecfdf5, var(--mg-surface)); }
.theme-galerias .header-icon { background: rgba(16, 185, 129, 0.12); color: #059669; }

.theme-obras { background: linear-gradient(135deg, #fef3c7, var(--mg-surface)); }
.theme-obras .header-icon { background: rgba(201, 162, 39, 0.15); color: #b8860b; }

.theme-exposicoes { background: linear-gradient(135deg, #fae8ff, var(--mg-surface)); }
.theme-exposicoes .header-icon { background: rgba(168, 85, 247, 0.12); color: #7c3aed; }

.theme-perfil { background: linear-gradient(135deg, #f1f5f9, var(--mg-surface)); }
.theme-perfil .header-icon { background: rgba(100, 116, 139, 0.12); color: #475569; }

@media (prefers-color-scheme: dark) {
  .theme-home { background: linear-gradient(135deg, #1e293b, var(--mg-surface)); }
  .theme-galerias { background: linear-gradient(135deg, #064e3b33, var(--mg-surface)); }
  .theme-obras { background: linear-gradient(135deg, #78350f33, var(--mg-surface)); }
  .theme-exposicoes { background: linear-gradient(135deg, #581c8733, var(--mg-surface)); }
  .theme-perfil { background: linear-gradient(135deg, #33415533, var(--mg-surface)); }
}
</style>
