<template>
  <AppSpinner :show="loading">
    <PageHeader theme="obras" title="Categorias de Obra" subtitle="CRUD de categorias — funcionário/admin">
      <template #icon><AppIcon name="Folder" :size="28" decorative /></template>
      <template #extra>
        <button type="button" class="btn btn-primary btn-sm" @click="openForm()">+ Nova categoria</button>
      </template>
    </PageHeader>

    <div class="list-group">
      <CrudListItem
        v-for="categoria in listaCategorias"
        :key="categoria.id"
        :title="categoria.nome"
        :subtitle="categoria.descricao || 'Sem descrição'"
      >
        <template #actions>
          <CrudActions @edit="openForm(categoria)" @delete="confirmarExclusao(categoria)" />
        </template>
      </CrudListItem>
    </div>

    <EmptyState v-if="!loading && !listaCategorias.length" message="Nenhuma categoria" icon="FolderX" />

    <FormModal
      v-model="showForm"
      :title="categoriaEmEdicao ? 'Editar categoria' : 'Nova categoria'"
      :saving="saving"
      @save="salvar"
      @hidden="resetForm"
    >
      <FormField label="Nome" required>
        <input v-model="nomeCategoria" class="form-control" />
      </FormField>
      <FormField label="Descrição">
        <textarea v-model="descricaoCategoria" class="form-control" rows="2" />
      </FormField>
    </FormModal>
  </AppSpinner>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import AppSpinner from '@/components/AppSpinner.vue'
import CrudActions from '@/components/CrudActions.vue'
import CrudListItem from '@/components/CrudListItem.vue'
import EmptyState from '@/components/EmptyState.vue'
import FormField from '@/components/FormField.vue'
import FormModal from '@/components/FormModal.vue'
import PageHeader from '@/components/PageHeader.vue'
import {
  apiError,
  createCategoria,
  deleteCategoria,
  fetchCategorias,
  updateCategoria,
} from '@/api/services'
import { confirmDialog, useToast } from '@/composables/useToast'

const toast = useToast()
const loading = ref(true)
const saving = ref(false)
const listaCategorias = ref([])
const showForm = ref(false)
const categoriaEmEdicao = ref(null)
const nomeCategoria = ref('')
const descricaoCategoria = ref('')

async function load() {
  loading.value = true
  try {
    listaCategorias.value = await fetchCategorias()
  } finally {
    loading.value = false
  }
}

function openForm(categoria) {
  categoriaEmEdicao.value = categoria || null
  nomeCategoria.value = categoria?.nome ?? ''
  descricaoCategoria.value = categoria?.descricao ?? ''
  showForm.value = true
}

function resetForm() {
  categoriaEmEdicao.value = null
  nomeCategoria.value = ''
  descricaoCategoria.value = ''
}

async function salvar() {
  if (!nomeCategoria.value.trim()) {
    toast.warning('Informe o nome.')
    return
  }
  saving.value = true
  try {
    const payload = { nome: nomeCategoria.value.trim(), descricao: descricaoCategoria.value }
    if (categoriaEmEdicao.value) {
      await updateCategoria(categoriaEmEdicao.value.id, payload)
      toast.success('Categoria atualizada!')
    } else {
      await createCategoria(payload)
      toast.success('Categoria criada!')
    }
    showForm.value = false
    await load()
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    saving.value = false
  }
}

async function confirmarExclusao(categoria) {
  try {
    await confirmDialog(`Remover "${categoria.nome}"?`, 'Excluir categoria')
    await deleteCategoria(categoria.id)
    toast.success('Categoria excluída.')
    await load()
  } catch (e) {
    if (e !== 'cancel') toast.error(apiError(e))
  }
}

onMounted(load)
</script>
