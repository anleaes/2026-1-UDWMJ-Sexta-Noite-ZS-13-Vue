import { watch } from 'vue'

/**
 * Sincroniza refs com ?query= — regra Navigation & State (URL reflete filtros/abas).
 * @param {import('vue-router').RouteLocationNormalizedLoaded} route
 * @param {import('vue-router').Router} router
 * @param {Array<{ ref: import('vue').Ref, key: string, parse?: Function, serialize?: Function }>} fields
 */
export function useQuerySync(route, router, fields) {
  function applyRouteToRefs() {
    fields.forEach(({ ref, key, parse = (v) => v }) => {
      const raw = route.query[key]
      if (raw !== undefined && raw !== '') ref.value = parse(raw)
    })
  }

  function applyRefsToRoute() {
    const query = { ...route.query }
    fields.forEach(({ ref, key, serialize = (v) => v }) => {
      const v = serialize(ref.value)
      if (v === '' || v == null) delete query[key]
      else query[key] = String(v)
    })
    const same = JSON.stringify(query) === JSON.stringify(route.query)
    if (!same) router.replace({ query })
  }

  applyRouteToRefs()
  watch(() => ({ ...route.query }), applyRouteToRefs)
  fields.forEach(({ ref }) => watch(ref, applyRefsToRoute))
}
