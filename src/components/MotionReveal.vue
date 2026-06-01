<template>
  <component
    :is="tag"
    v-motion
    :initial="motionInitial"
    :enter="motionEnter"
    :class="klass"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'

const props = defineProps({
  tag: { type: String, default: 'div' },
  delay: { type: Number, default: 0 },
  y: { type: Number, default: 18 },
  duration: { type: Number, default: 450 },
  klass: { type: String, default: '' },
})

const reduced = usePreferredReducedMotion()

const motionInitial = computed(() =>
  reduced.value === 'reduce' ? false : { opacity: 0, y: props.y },
)

const motionEnter = computed(() =>
  reduced.value === 'reduce'
    ? false
    : {
        opacity: 1,
        y: 0,
        transition: {
          duration: props.duration,
          delay: props.delay,
          ease: [0.22, 1, 0.36, 1],
        },
      },
)
</script>
