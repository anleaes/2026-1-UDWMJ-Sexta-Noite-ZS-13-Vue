<template>
  <div class="text-center text-muted py-5">
    <AppIcon :name="icon" :size="48" klass="mb-2 d-block mx-auto opacity-50" />
    <slot>{{ message }}</slot>
  </div>
</template>

<script setup>
import AppIcon from '@/components/AppIcon.vue'

defineProps({
  message: { type: String, default: 'Nenhum item encontrado' },
  icon: { type: String, default: 'Inbox' },
})
</script>
