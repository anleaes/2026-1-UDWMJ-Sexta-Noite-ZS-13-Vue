<template>
  <AppSpinner :show="loading">
    <PageHeader theme="exposicoes" title="Exposições" subtitle="Mostras em cartaz">
      <template #icon><AppIcon name="Calendar" :size="28" decorative /></template>
      <template v-if="auth.canStaff" #extra>
        <button type="button" class="btn btn-primary btn-sm" @click="openCreate">+ Nova exposição</button>
      </template>
    </PageHeader>

    <FilterBar>
      <FilterButtonGroup v-model="statusFilter" label="Status:" :options="OPCOES_FILTRO_STATUS_EXPOSICAO" small @change="load" />
    </FilterBar>

    <div class="list-group">
      <button
        v-for="e in exposicoes"
        :key="e.id"
        type="button"
        class="list-group-item list-group-item-action"
        @click="$router.push(`/exposicoes/${e.id}`)"
      >
        <div class="d-flex justify-content-between align-items-start">
          <strong>{{ e.titulo }}</strong>
          <span class="badge" :class="exposicaoBadgeClass(e.status)">{{ exposicaoStatusLabel(e.status) }}</span>
        </div>
        <small class="text-primary">{{ formatDate(e.data_inicio) }} — {{ formatDate(e.data_fim) }}</small>
        <div class="small text-muted text-truncate">{{ e.descricao }}</div>
      </button>
    </div>
    <EmptyState v-if="!loading && !exposicoes.length" message="Nenhuma exposição" icon="CalendarX" />

    <FormModal v-model="showForm" title="Nova exposição" size="lg" save-label="Criar" :saving="saving" @save="salvar" @hidden="resetForm">
      <FormField label="Título" required>
        <input v-model="form.titulo" class="form-control" />
      </FormField>
      <FormField label="Galeria" required>
        <select v-model="form.galeria" class="form-select">
          <option :value="null">Selecione</option>
          <option v-for="g in galerias" :key="g.id" :value="g.id">{{ g.nome }}</option>
        </select>
      </FormField>
      <div class="row g-2 mb-3">
        <div class="col-md-6">
          <FormField label="Início" required inline>
            <input v-model="form.data_inicio" type="date" class="form-control" />
          </FormField>
        </div>
        <div class="col-md-6">
          <FormField label="Fim" required inline>
            <input v-model="form.data_fim" type="date" class="form-control" />
          </FormField>
        </div>
      </div>
      <FormField label="Status">
        <select v-model="form.status" class="form-select">
          <option value="planejada">Planejada</option>
          <option value="em_andamento">Em andamento</option>
          <option value="encerrada">Encerrada</option>
        </select>
      </FormField>
      <FormField label="Descrição">
        <textarea v-model="form.descricao" class="form-control" rows="3" />
      </FormField>
    </FormModal>
  </AppSpinner>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import AppSpinner from '@/components/AppSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import FilterBar from '@/components/FilterBar.vue'
import FilterButtonGroup from '@/components/FilterButtonGroup.vue'
import FormField from '@/components/FormField.vue'
import FormModal from '@/components/FormModal.vue'
import PageHeader from '@/components/PageHeader.vue'
import { apiError, createExposicao, fetchExposicoes, fetchGalerias } from '@/api/services'
import { useQuerySync } from '@/composables/useQuerySync'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import { exposicaoBadgeClass, exposicaoStatusLabel, formatDate } from '@/utils/format'
import {
  OPCOES_FILTRO_STATUS_EXPOSICAO,
  criarFormularioVazioNovaExposicao,
} from '@/constants/exposicao'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const loading = ref(true)
const saving = ref(false)
const exposicoes = ref([])
const galerias = ref([])
const statusFilter = ref('')
const showForm = ref(false)
const form = ref(criarFormularioVazioNovaExposicao())

useQuerySync(route, router, [{ ref: statusFilter, key: 'status' }])
watch(statusFilter, () => load())

function openCreate() {
  form.value = criarFormularioVazioNovaExposicao()
  if (route.query.galeria) form.value.galeria = Number(route.query.galeria)
  showForm.value = true
}

function resetForm() {
  form.value = criarFormularioVazioNovaExposicao()
}

async function load() {
  loading.value = true
  try {
    exposicoes.value = await fetchExposicoes(statusFilter.value ? { status: statusFilter.value } : undefined)
  } finally {
    loading.value = false
  }
}

async function salvar() {
  if (!form.value.titulo.trim() || !form.value.galeria || !form.value.data_inicio || !form.value.data_fim) {
    toast.warning('Preencha título, galeria e datas.')
    return
  }
  saving.value = true
  try {
    const exp = await createExposicao(form.value)
    toast.success('Exposição criada!')
    showForm.value = false
    router.push(`/exposicoes/${exp.id}`)
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  galerias.value = await fetchGalerias()
  await load()
  if (route.query.nova === '1' && auth.canStaff) openCreate()
})
</script>
