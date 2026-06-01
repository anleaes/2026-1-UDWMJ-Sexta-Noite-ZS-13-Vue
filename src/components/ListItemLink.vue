<template>
  <button
    type="button"
    class="list-group-item list-group-item-action d-flex align-items-center gap-3 w-100 border-0 text-start"
    @click="$emit('click', $event)"
  >
    <AvatarLetter v-if="letter" :letter="letter" :variant="avatarVariant" />
    <div class="flex-grow-1 min-w-0">
      <slot />
    </div>
    <AppIcon v-if="chevron" name="ChevronRight" klass="text-muted flex-shrink-0" decorative />
  </button>
</template>

<script setup>
import AppIcon from '@/components/AppIcon.vue'
import AvatarLetter from '@/components/AvatarLetter.vue'

defineProps({
  letter: { type: String, default: '' },
  avatarVariant: { type: String, default: 'galeria' },
  chevron: { type: Boolean, default: true },
})

defineEmits(['click'])
</script>
