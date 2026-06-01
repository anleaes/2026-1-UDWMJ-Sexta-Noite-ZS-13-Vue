<template>
  <MotionReveal :delay="delay" :y="y">
    <div class="card shadow border-0 mx-auto" :style="{ maxWidth }">
      <div class="card-body p-4" :class="{ 'p-md-5': largePadding }">
        <h1 class="h4 mb-1">{{ title }}</h1>
        <p v-if="subtitle" class="text-muted small mb-4">{{ subtitle }}</p>
        <slot />
        <p v-if="$slots.footer" class="text-center text-muted small mt-4 mb-0">
          <slot name="footer" />
        </p>
      </div>
    </div>
  </MotionReveal>
</template>

<script setup>
import MotionReveal from '@/components/MotionReveal.vue'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  maxWidth: { type: String, default: '560px' },
  largePadding: { type: Boolean, default: false },
  delay: { type: Number, default: 0 },
  y: { type: Number, default: 24 },
})
</script>
