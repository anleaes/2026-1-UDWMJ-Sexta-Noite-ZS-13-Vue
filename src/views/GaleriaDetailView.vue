<template>
  <AppSpinner :show="loading">
    <DetailBanner
      v-if="galeria"
      variant="galeria"
      :title="galeria.nome"
      :meta="galeria.endereco"
      :badge="galeria.aberta ? 'Aberta ao público' : 'Fechada'"
    >
      <template v-if="auth.canStaff" #actions>
        <button type="button" class="btn btn-light btn-sm" @click="showEdit = true">Editar</button>
        <button type="button" class="btn btn-outline-light btn-sm" @click="confirmarExclusao">Excluir</button>
      </template>
    </DetailBanner>

    <template v-if="galeria">
      <div class="card mb-4">
        <div class="card-body text-muted">{{ galeria.descricao }}</div>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="h5 mb-0">Exposições ({{ exposicoes.length }})</h3>
        <button v-if="auth.canStaff" type="button" class="btn btn-primary btn-sm" @click="novaExposicao">
          + Nova exposição
        </button>
      </div>

      <div class="list-group">
        <button
          v-for="e in exposicoes"
          :key="e.id"
          type="button"
          class="list-group-item list-group-item-action"
          @click="$router.push(`/exposicoes/${e.id}`)"
        >
          <div class="d-flex justify-content-between align-items-center">
            <strong>{{ e.titulo }}</strong>
            <span class="badge text-bg-secondary">{{ e.status }}</span>
          </div>
          <small class="text-muted">{{ e.data_inicio }} → {{ e.data_fim }}</small>
        </button>
      </div>
      <EmptyState v-if="!exposicoes.length" message="Sem exposições nesta galeria" icon="CalendarX" />
    </template>

    <FormModal v-model="showEdit" title="Editar galeria" :saving="saving" @save="salvar">
      <FormField label="Nome">
        <input v-model="form.nome" class="form-control" />
      </FormField>
      <FormField label="Endereço">
        <input v-model="form.endereco" class="form-control" />
      </FormField>
      <FormField label="Descrição">
        <textarea v-model="form.descricao" class="form-control" rows="3" />
      </FormField>
      <div class="form-check form-switch">
        <input id="edit-aberta" v-model="form.aberta" class="form-check-input" type="checkbox" />
        <label class="form-check-label" for="edit-aberta">Aberta</label>
      </div>
    </FormModal>
  </AppSpinner>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppSpinner from '@/components/AppSpinner.vue'
import DetailBanner from '@/components/DetailBanner.vue'
import EmptyState from '@/components/EmptyState.vue'
import FormField from '@/components/FormField.vue'
import FormModal from '@/components/FormModal.vue'
import {
  apiError,
  deleteGaleria,
  fetchExposicoes,
  fetchGaleria,
  updateGaleria,
} from '@/api/services'
import { confirmDialog } from '@/composables/useToast'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToast()
const loading = ref(true)
const saving = ref(false)
const galeria = ref(null)
const exposicoes = ref([])
const showEdit = ref(false)
const form = ref({})

watch(showEdit, (open) => {
  if (open && galeria.value) form.value = { ...galeria.value }
})

async function load() {
  loading.value = true
  try {
    galeria.value = await fetchGaleria(route.params.id)
    exposicoes.value = await fetchExposicoes({ galeria: route.params.id })
  } finally {
    loading.value = false
  }
}

async function salvar() {
  saving.value = true
  try {
    galeria.value = await updateGaleria(galeria.value.id, form.value)
    toast.success('Galeria atualizada!')
    showEdit.value = false
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    saving.value = false
  }
}

async function confirmarExclusao() {
  try {
    await confirmDialog('Excluir esta galeria?', 'Confirmar exclusão')
    await deleteGaleria(galeria.value.id)
    toast.success('Galeria excluída.')
    router.push({ name: 'galerias' })
  } catch (e) {
    if (e !== 'cancel') toast.error(apiError(e))
  }
}

function novaExposicao() {
  router.push({ name: 'exposicoes', query: { nova: 1, galeria: galeria.value.id } })
}

onMounted(load)
</script>
