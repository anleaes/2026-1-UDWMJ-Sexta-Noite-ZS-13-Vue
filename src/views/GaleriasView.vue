<template>
  <AppSpinner :show="loading">
    <PageHeader theme="galerias" title="Galerias" subtitle="Museus e espaços expositivos">
      <template #icon><AppIcon name="Building2" :size="28" decorative /></template>
      <template #extra>
        <span class="badge text-bg-success tabular-nums">{{ abertas }} abertas</span>
        <button v-if="auth.canStaff" type="button" class="btn btn-primary btn-sm" @click="openCreate">
          + Nova galeria
        </button>
      </template>
    </PageHeader>

    <FilterBar>
      <label class="visually-hidden" for="galerias-search">Buscar galerias</label>
      <input
        id="galerias-search"
        v-model="search"
        name="q"
        class="form-control"
        style="max-width: 280px"
        placeholder="Buscar nome ou endereço…"
        autocomplete="off"
        @input="load"
      />
      <FilterButtonGroup v-model="filtroAberta" :options="OPCOES_FILTRO_GALERIA_ABERTA" small @change="load" />
    </FilterBar>

    <div class="list-group list-group-flush">
      <MotionReveal v-for="(g, i) in galerias" :key="g.id" :delay="40 + i * 45" :y="12" tag="div">
        <ListItemLink :letter="g.nome.charAt(0)" @click="$router.push(`/galerias/${g.id}`)">
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <strong>{{ g.nome }}</strong>
            <span class="badge" :class="g.aberta ? 'text-bg-success' : 'text-bg-secondary'">
              {{ g.aberta ? 'Aberta' : 'Fechada' }}
            </span>
          </div>
          <small class="text-success d-flex align-items-center gap-1">
            <AppIcon name="MapPin" :size="14" decorative /> {{ g.endereco }}
          </small>
          <div class="text-muted small text-truncate">{{ g.descricao }}</div>
        </ListItemLink>
      </MotionReveal>
    </div>

    <EmptyState v-if="!loading && !galerias.length" message="Nenhuma galeria encontrada" />

    <FormModal v-model="showForm" title="Nova galeria" save-label="Criar galeria" :saving="saving" @save="salvar" @hidden="resetForm">
      <FormField label="Nome" required :error="formErrors.nome">
        <template #default="{ inputId, invalid, describedBy }">
          <input
            :id="inputId"
            v-model="form.nome"
            name="nome"
            class="form-control"
            :class="{ 'is-invalid': invalid }"
            autocomplete="organization"
            :aria-invalid="invalid ? 'true' : undefined"
            :aria-describedby="describedBy"
          />
        </template>
      </FormField>
      <FormField label="Endereço" required :error="formErrors.endereco">
        <template #default="{ inputId, invalid, describedBy }">
          <input
            :id="inputId"
            v-model="form.endereco"
            name="endereco"
            class="form-control"
            :class="{ 'is-invalid': invalid }"
            autocomplete="street-address"
            :aria-invalid="invalid ? 'true' : undefined"
            :aria-describedby="describedBy"
          />
        </template>
      </FormField>
      <FormField label="Descrição">
        <template #default="{ inputId, describedBy }">
          <textarea :id="inputId" v-model="form.descricao" name="descricao" class="form-control" rows="3" :aria-describedby="describedBy" />
        </template>
      </FormField>
      <div class="form-check form-switch">
        <input id="galeria-aberta" v-model="form.aberta" name="aberta" class="form-check-input" type="checkbox" />
        <label class="form-check-label" for="galeria-aberta">Galeria aberta ao público</label>
      </div>
    </FormModal>
  </AppSpinner>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import AppSpinner from '@/components/AppSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import FilterBar from '@/components/FilterBar.vue'
import FilterButtonGroup from '@/components/FilterButtonGroup.vue'
import FormField from '@/components/FormField.vue'
import FormModal from '@/components/FormModal.vue'
import ListItemLink from '@/components/ListItemLink.vue'
import MotionReveal from '@/components/MotionReveal.vue'
import PageHeader from '@/components/PageHeader.vue'
import { apiError, createGaleria, fetchGalerias } from '@/api/services'
import { useFieldErrors } from '@/composables/useFieldErrors'
import { useQuerySync } from '@/composables/useQuerySync'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import { OPCOES_FILTRO_GALERIA_ABERTA, criarFormularioVazioNovaGaleria } from '@/constants/galeria'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const { errors: formErrors, clear: clearFormErrors, set: setFormError, focusFirstError } = useFieldErrors()
const loading = ref(true)
const saving = ref(false)
const galerias = ref([])
const allGalerias = ref([])
const search = ref('')
const filtroAberta = ref('')
const showForm = ref(false)
const form = ref(criarFormularioVazioNovaGaleria())

useQuerySync(route, router, [
  { ref: search, key: 'q' },
  { ref: filtroAberta, key: 'aberta' },
])

watch([search, filtroAberta], () => load())

const abertas = computed(() => allGalerias.value.filter((g) => g.aberta).length)

function openCreate() {
  form.value = criarFormularioVazioNovaGaleria()
  clearFormErrors()
  showForm.value = true
}

function resetForm() {
  form.value = criarFormularioVazioNovaGaleria()
  clearFormErrors()
}

async function load() {
  loading.value = true
  try {
    const params = {}
    if (filtroAberta.value !== '') params.aberta = filtroAberta.value
    allGalerias.value = await fetchGalerias(params)
    galerias.value = allGalerias.value
    if (search.value) {
      const q = search.value.toLowerCase()
      galerias.value = galerias.value.filter(
        (g) => g.nome.toLowerCase().includes(q) || g.endereco.toLowerCase().includes(q),
      )
    }
  } finally {
    loading.value = false
  }
}

async function salvar() {
  clearFormErrors()
  if (!form.value.nome.trim()) setFormError('nome', 'Informe o nome da galeria.')
  if (!form.value.endereco.trim()) setFormError('endereco', 'Informe o endereço.')
  if (Object.keys(formErrors).length) {
    focusFirstError()
    return
  }
  saving.value = true
  try {
    const g = await createGaleria(form.value)
    toast.success('Galeria criada!')
    showForm.value = false
    router.push(`/galerias/${g.id}`)
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>
