import { reactive } from 'vue'

/** Erros inline por campo — regra: feedback ao lado do input, não só toast */
export function useFieldErrors() {
  const errors = reactive({})

  function clear(...keys) {
    if (keys.length) keys.forEach((k) => delete errors[k])
    else Object.keys(errors).forEach((k) => delete errors[k])
  }

  function set(field, message) {
    if (message) errors[field] = message
    else delete errors[field]
  }

  function focusFirstError() {
    const first = document.querySelector('.is-invalid, [aria-invalid="true"]')
    first?.focus()
  }

  return { errors, clear, set, focusFirstError }
}
