<template>
  <AppSpinner :show="loading">
    <PageHeader theme="perfil" title="Administração" subtitle="Funcionários e artistas — admin">
      <template #icon><AppIcon name="Shield" :size="28" decorative /></template>
    </PageHeader>

    <div class="row g-4">
      <div class="col-lg-6">
        <SectionCard :title="`Funcionários (${funcionarios.length})`">
          <template #header-action>
            <button type="button" class="btn btn-primary btn-sm" @click="abrirFuncionario()">+ Novo</button>
          </template>
          <ul class="list-group list-group-flush">
            <CrudListItem
              v-for="f in funcionarios"
              :key="f.id"
              tag="li"
              :title="`${f.first_name} ${f.last_name}`"
              :subtitle="`${f.cargo} · @${f.username}`"
            >
              <template #actions>
                <CrudActions @edit="abrirFuncionario(f)" @delete="excluirFunc(f)" />
              </template>
            </CrudListItem>
          </ul>
        </SectionCard>
      </div>

      <div class="col-lg-6">
        <SectionCard :title="`Artistas (${artistas.length})`">
          <template #header-action>
            <button type="button" class="btn btn-primary btn-sm" @click="abrirArtista()">+ Novo</button>
          </template>
          <ul class="list-group list-group-flush">
            <CrudListItem
              v-for="a in artistas"
              :key="a.id"
              tag="li"
              :title="`${a.first_name} ${a.last_name}`"
              :subtitle="`${a.estilo_artistico} · @${a.username}`"
            >
              <template #actions>
                <CrudActions @edit="abrirArtista(a)" @delete="excluirArt(a)" />
              </template>
            </CrudListItem>
          </ul>
        </SectionCard>
      </div>
    </div>

    <FormModal v-model="showModal" :title="modalTitle" size="lg" :saving="saving" @save="salvar" @hidden="resetForm">
      <div class="row g-2">
        <div class="col-md-6"><label class="form-label">Usuário *</label><input v-model="form.username" class="form-control" :disabled="!!editing" /></div>
        <div class="col-md-6"><label class="form-label">Senha {{ editing ? '(opcional)' : '*' }}</label><input v-model="form.password" type="password" class="form-control" /></div>
        <div class="col-md-6"><label class="form-label">Nome *</label><input v-model="form.first_name" class="form-control" /></div>
        <div class="col-md-6"><label class="form-label">Sobrenome</label><input v-model="form.last_name" class="form-control" /></div>
        <div class="col-md-6"><label class="form-label">E-mail</label><input v-model="form.email" type="email" class="form-control" /></div>
        <div class="col-md-6"><label class="form-label">CPF *</label><input v-model="form.cpf" class="form-control" /></div>
        <template v-if="modalType === TIPO_CADASTRO_FUNCIONARIO">
          <div class="col-md-6"><label class="form-label">Cargo</label><input v-model="form.cargo" class="form-control" /></div>
          <div class="col-md-6"><label class="form-label">Salário</label><input v-model="form.salario" class="form-control" /></div>
          <div class="col-12">
            <label class="form-label">Galeria</label>
            <select v-model="form.galeria" class="form-select">
              <option v-for="g in galerias" :key="g.id" :value="g.id">{{ g.nome }}</option>
            </select>
          </div>
        </template>
        <template v-else>
          <div class="col-md-6"><label class="form-label">Nacionalidade</label><input v-model="form.nacionalidade" class="form-control" /></div>
          <div class="col-md-6"><label class="form-label">Estilo artístico</label><input v-model="form.estilo_artistico" class="form-control" /></div>
        </template>
      </div>
    </FormModal>
  </AppSpinner>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import AppSpinner from '@/components/AppSpinner.vue'
import CrudActions from '@/components/CrudActions.vue'
import CrudListItem from '@/components/CrudListItem.vue'
import FormField from '@/components/FormField.vue'
import FormModal from '@/components/FormModal.vue'
import PageHeader from '@/components/PageHeader.vue'
import SectionCard from '@/components/SectionCard.vue'
import {
  apiError,
  createArtistaAdmin,
  createFuncionario,
  deleteArtistaAdmin,
  deleteFuncionario,
  fetchArtistasAdmin,
  fetchFuncionarios,
  fetchGalerias,
  updateArtistaAdmin,
  updateFuncionario,
} from '@/api/services'
import { confirmDialog } from '@/composables/useToast'
import { useToast } from '@/composables/useToast'
import {
  TIPO_CADASTRO_ARTISTA,
  TIPO_CADASTRO_FUNCIONARIO,
  criarFormularioVazioCadastroAdmin,
} from '@/constants/admin'
import { obterDataHojeFormatoISO } from '@/constants/datas'

const toast = useToast()
const loading = ref(true)
const saving = ref(false)
const funcionarios = ref([])
const artistas = ref([])
const galerias = ref([])
const showModal = ref(false)
const modalType = ref(TIPO_CADASTRO_FUNCIONARIO)
const editing = ref(null)
const form = ref(criarFormularioVazioCadastroAdmin())

const modalTitle = computed(() => {
  const tipo = modalType.value === TIPO_CADASTRO_FUNCIONARIO ? 'funcionário' : 'artista'
  return editing.value ? `Editar ${tipo}` : `Novo ${tipo}`
})

async function load() {
  loading.value = true
  try {
    ;[funcionarios.value, artistas.value, galerias.value] = await Promise.all([
      fetchFuncionarios(),
      fetchArtistasAdmin(),
      fetchGalerias(),
    ])
    if (!form.value.galeria && galerias.value[0]) form.value.galeria = galerias.value[0].id
  } finally {
    loading.value = false
  }
}

function resetForm() {
  editing.value = null
  form.value = criarFormularioVazioCadastroAdmin()
  if (galerias.value[0]) form.value.galeria = galerias.value[0].id
}

function abrirFuncionario(f) {
  modalType.value = TIPO_CADASTRO_FUNCIONARIO
  editing.value = f || null
  resetForm()
  if (f) {
    Object.assign(form.value, {
      username: f.username,
      first_name: f.first_name,
      last_name: f.last_name,
      email: f.email,
      cpf: f.cpf,
      cargo: f.cargo,
      salario: f.salario,
      galeria: f.galeria,
    })
  }
  showModal.value = true
}

function abrirArtista(a) {
  modalType.value = TIPO_CADASTRO_ARTISTA
  editing.value = a || null
  resetForm()
  if (a) {
    Object.assign(form.value, {
      username: a.username,
      first_name: a.first_name,
      last_name: a.last_name,
      email: a.email,
      cpf: a.cpf,
      nacionalidade: a.nacionalidade,
      estilo_artistico: a.estilo_artistico,
    })
  }
  showModal.value = true
}

async function salvar() {
  if (!form.value.username.trim() || !form.value.first_name.trim() || !form.value.cpf.trim()) {
    toast.warning('Preencha usuário, nome e CPF.')
    return
  }
  saving.value = true
  try {
    if (modalType.value === TIPO_CADASTRO_FUNCIONARIO) {
      const base = {
        username: form.value.username.trim(),
        first_name: form.value.first_name.trim(),
        last_name: form.value.last_name.trim(),
        email: form.value.email.trim(),
        cpf: form.value.cpf.trim(),
        cargo: form.value.cargo,
        salario: form.value.salario,
        data_admissao: obterDataHojeFormatoISO(),
        galeria: form.value.galeria,
      }
      if (editing.value) {
        await updateFuncionario(editing.value.id, form.value.password ? { ...base, password: form.value.password } : base)
      } else {
        if (!form.value.password) {
          toast.warning('Informe a senha.')
          return
        }
        await createFuncionario({ ...base, password: form.value.password })
      }
    } else {
      const base = {
        username: form.value.username.trim(),
        first_name: form.value.first_name.trim(),
        last_name: form.value.last_name.trim(),
        email: form.value.email.trim(),
        cpf: form.value.cpf.trim(),
        nacionalidade: form.value.nacionalidade.trim(),
        estilo_artistico: form.value.estilo_artistico.trim(),
      }
      if (editing.value) {
        await updateArtistaAdmin(editing.value.id, form.value.password ? { ...base, password: form.value.password } : base)
      } else {
        if (!form.value.password) {
          toast.warning('Informe a senha.')
          return
        }
        await createArtistaAdmin({ ...base, password: form.value.password })
      }
    }
    toast.success('Salvo com sucesso!')
    showModal.value = false
    await load()
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    saving.value = false
  }
}

async function excluirFunc(f) {
  try {
    await confirmDialog(`Remover ${f.username}?`, 'Excluir funcionário')
    await deleteFuncionario(f.id)
    toast.success('Funcionário removido.')
    await load()
  } catch (e) {
    if (e !== 'cancel') toast.error(apiError(e))
  }
}

async function excluirArt(a) {
  try {
    await confirmDialog(`Remover ${a.username}?`, 'Excluir artista')
    await deleteArtistaAdmin(a.id)
    toast.success('Artista removido.')
    await load()
  } catch (e) {
    if (e !== 'cancel') toast.error(apiError(e))
  }
}

onMounted(load)
</script>
