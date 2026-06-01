<template>
  <div class="card" :class="{ 'mb-3': spacing }">
    <div v-if="title || $slots['header-action']" class="card-header d-flex justify-content-between align-items-center">
      <span><slot name="title">{{ title }}</slot></span>
      <slot name="header-action" />
    </div>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  spacing: { type: Boolean, default: true },
})
</script>
