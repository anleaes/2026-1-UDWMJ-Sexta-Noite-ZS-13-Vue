<template>
  <component :is="tag" class="list-group-item d-flex justify-content-between align-items-start gap-2">
    <div class="flex-grow-1 min-w-0">
      <slot name="content">
        <strong>{{ title }}</strong>
        <div v-if="subtitle" class="text-muted small">{{ subtitle }}</div>
      </slot>
    </div>
    <slot name="actions" />
  </component>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  tag: { type: String, default: 'div' },
})
</script>
