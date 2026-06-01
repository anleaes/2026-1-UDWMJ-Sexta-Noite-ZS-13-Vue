<template>
  <div class="btn-group btn-group-sm">
    <button v-if="showEdit" type="button" class="btn btn-outline-primary" @click="$emit('edit')">
      {{ editLabel }}
    </button>
    <button v-if="showDelete" type="button" class="btn btn-outline-danger" @click="$emit('delete')">
      {{ deleteLabel }}
    </button>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  showEdit: { type: Boolean, default: true },
  showDelete: { type: Boolean, default: true },
  editLabel: { type: String, default: 'Editar' },
  deleteLabel: { type: String, default: 'Excluir' },
})

defineEmits(['edit', 'delete'])
</script>
