<template>
  <FormField :label="label" :required="required" :error="error" :hint="hint" :inline="inline">
    <template #default="{ inputId, invalid, describedBy }">
      <input
        :id="inputId"
        v-model="model"
        :type="type"
        :name="name"
        :class="inputClass(invalid)"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :spellcheck="spellcheck"
        :required="required"
        :disabled="disabled"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="describedBy"
        v-bind="$attrs"
      />
    </template>
  </FormField>
</template>

<script setup>
import FormField from '@/components/FormField.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  label: { type: String, default: '' },
  name: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  autocomplete: { type: String, default: '' },
  inputmode: { type: String, default: undefined },
  spellcheck: { type: [Boolean, String], default: undefined },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  inline: { type: Boolean, default: false },
  size: { type: String, default: '' },
})

const model = defineModel({ type: [String, Number], default: '' })

function inputClass(invalid) {
  return ['form-control', { 'form-control-lg': props.size === 'lg', 'is-invalid': invalid }]
}
</script>
