<template>
  <AppSpinner :show="loading">
    <PageHeader theme="obras" title="Obras de Arte" subtitle="Acervo catalogado">
      <template #icon><AppIcon name="Palette" :size="28" decorative /></template>
      <template v-if="auth.canStaff" #extra>
        <button type="button" class="btn btn-primary btn-sm" @click="openCreate">+ Nova obra</button>
      </template>
    </PageHeader>

    <FilterBar>
      <input v-model="search" class="form-control" style="max-width: 240px" placeholder="Buscar título ou técnica…" autocomplete="off" @keyup.enter="load" />
      <select v-model="categoriaId" class="form-select" style="max-width: 180px" @change="load">
        <option :value="null">Todas categorias</option>
        <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nome }}</option>
      </select>
      <SubmitButton label="Buscar" @click="load" />
    </FilterBar>

    <div class="row g-3">
      <div v-for="obra in obras" :key="obra.id" class="col-sm-6 col-lg-4">
        <ObraCard
          :titulo="obra.titulo"
          :tecnica="obra.tecnica"
          :ano="obra.ano_criacao"
          :valor="obra.valor_estimado"
          @click="$router.push(`/obras/${obra.id}`)"
        />
      </div>
    </div>
    <EmptyState v-if="!loading && !obras.length" message="Nenhuma obra encontrada" />

    <FormModal v-model="showForm" title="Nova obra" size="lg" save-label="Criar" :saving="saving" @save="salvar" @hidden="resetForm">
      <FormField label="Título" required>
        <input v-model="form.titulo" class="form-control" />
      </FormField>
      <div class="row g-2 mb-3">
        <div class="col-md-6">
          <FormField label="Técnica" required inline>
            <input v-model="form.tecnica" class="form-control" />
          </FormField>
        </div>
        <div class="col-md-6">
          <FormField label="Ano" inline>
            <input v-model.number="form.ano_criacao" type="number" class="form-control" />
          </FormField>
        </div>
      </div>
      <FormField label="Valor (R$)">
        <input v-model.number="form.valor_estimado" type="number" step="0.01" class="form-control" />
      </FormField>
      <FormField label="Categoria" required>
        <div class="input-group">
          <select v-model="form.categoria" class="form-select">
            <option :value="null">Selecione</option>
            <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nome }}</option>
          </select>
          <button type="button" class="btn btn-outline-secondary" @click="showCatForm = true">+ Cat.</button>
        </div>
      </FormField>
    </FormModal>

    <FormModal v-model="showCatForm" title="Nova categoria" save-label="Criar" :saving="savingCat" @save="salvarCategoria">
      <FormField label="Nome">
        <input v-model="catForm.nome" class="form-control" />
      </FormField>
      <FormField label="Descrição">
        <textarea v-model="catForm.descricao" class="form-control" rows="2" />
      </FormField>
    </FormModal>
  </AppSpinner>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import AppSpinner from '@/components/AppSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import FilterBar from '@/components/FilterBar.vue'
import FormField from '@/components/FormField.vue'
import FormModal from '@/components/FormModal.vue'
import ObraCard from '@/components/ObraCard.vue'
import PageHeader from '@/components/PageHeader.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import { apiError, createCategoria, createObra, fetchCategorias, fetchObras } from '@/api/services'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import {
  criarFormularioVazioNovaCategoria,
  criarFormularioVazioNovaObra,
} from '@/constants/obra'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()
const loading = ref(true)
const saving = ref(false)
const savingCat = ref(false)
const obras = ref([])
const categorias = ref([])
const search = ref('')
const categoriaId = ref(null)
const showForm = ref(false)
const showCatForm = ref(false)
const form = ref(criarFormularioVazioNovaObra())
const catForm = ref(criarFormularioVazioNovaCategoria())

function openCreate() {
  form.value = criarFormularioVazioNovaObra()
  showForm.value = true
}

function resetForm() {
  form.value = criarFormularioVazioNovaObra()
}

async function load() {
  loading.value = true
  try {
    const params = {}
    if (search.value) params.search = search.value
    if (categoriaId.value) params.categoria = categoriaId.value
    obras.value = await fetchObras(Object.keys(params).length ? params : undefined)
  } finally {
    loading.value = false
  }
}

async function salvarCategoria() {
  if (!catForm.value.nome.trim()) {
    toast.warning('Informe o nome da categoria.')
    return
  }
  savingCat.value = true
  try {
    const cat = await createCategoria(catForm.value)
    categorias.value = await fetchCategorias()
    form.value.categoria = cat.id
    showCatForm.value = false
    catForm.value = criarFormularioVazioNovaCategoria()
    toast.success('Categoria criada!')
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    savingCat.value = false
  }
}

async function salvar() {
  if (!form.value.titulo.trim() || !form.value.tecnica.trim() || !form.value.categoria) {
    toast.warning('Preencha título, técnica e categoria.')
    return
  }
  saving.value = true
  try {
    const obra = await createObra({ ...form.value, valor_estimado: String(form.value.valor_estimado) })
    toast.success('Obra criada!')
    showForm.value = false
    router.push(`/obras/${obra.id}`)
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  categorias.value = await fetchCategorias()
  await load()
})
</script>
