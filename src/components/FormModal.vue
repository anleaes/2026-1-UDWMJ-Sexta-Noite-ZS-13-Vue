<template>
  <BModal v-model="open" :title="title" :size="size || undefined" @hidden="$emit('hidden')">
    <slot />
    <template #footer>
      <slot name="footer">
        <button type="button" class="btn btn-secondary" @click="open = false">{{ cancelLabel }}</button>
        <SubmitButton :label="saveLabel" :loading="saving" @click="$emit('save')" />
      </slot>
    </template>
  </BModal>
</template>

<script setup>
import SubmitButton from '@/components/SubmitButton.vue'

defineProps({
  title: { type: String, required: true },
  size: { type: String, default: '' },
  saving: { type: Boolean, default: false },
  saveLabel: { type: String, default: 'Salvar' },
  cancelLabel: { type: String, default: 'Cancelar' },
})

defineEmits(['save', 'hidden'])

const open = defineModel({ type: Boolean, default: false })
</script>
