<template>
  <div ref="rootRef" :class="wrapperClass">
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }}<span v-if="required" class="text-danger" aria-hidden="true"> *</span>
      <span v-if="required" class="visually-hidden"> (obrigatório)</span>
    </label>
    <slot :input-id="inputId" :error-id="errorId" :invalid="!!error" :described-by="describedBy" />
    <div
      v-if="error"
      :id="errorId"
      class="invalid-feedback d-block"
      role="alert"
    >
      {{ error }}
    </div>
    <div v-else-if="hint" :id="hintId" class="form-text">{{ hint }}</div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, useId, watch } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  required: { type: Boolean, default: false },
  inline: { type: Boolean, default: false },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  id: { type: String, default: '' },
})

const generatedId = useId()
const rootRef = ref(null)
const inputId = computed(() => props.id || `field-${generatedId}`)
const errorId = computed(() => `${inputId.value}-error`)
const hintId = computed(() => `${inputId.value}-hint`)
const describedBy = computed(() => {
  const ids = []
  if (props.error) ids.push(errorId.value)
  else if (props.hint) ids.push(hintId.value)
  return ids.length ? ids.join(' ') : undefined
})

const wrapperClass = computed(() => (props.inline ? 'mb-0' : 'mb-3'))

function bindControl() {
  const root = rootRef.value
  if (!root) return
  const control = root.querySelector('input, textarea, select')
  if (!control) return
  if (!control.id) control.id = inputId.value
  if (props.error) {
    control.setAttribute('aria-invalid', 'true')
    control.classList.add('is-invalid')
    control.setAttribute('aria-describedby', errorId.value)
  } else {
    control.removeAttribute('aria-invalid')
    control.classList.remove('is-invalid')
    if (describedBy.value) control.setAttribute('aria-describedby', describedBy.value)
    else control.removeAttribute('aria-describedby')
  }
}

onMounted(() => nextTick(bindControl))
watch(() => props.error, () => nextTick(bindControl))
</script>
