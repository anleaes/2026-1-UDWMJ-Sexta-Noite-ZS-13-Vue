<template>
  <AppSpinner :show="loading">
    <DetailBanner v-if="obra" variant="obra" :title="obra.titulo" :meta="`${obra.tecnica} · ${obra.ano_criacao}`" :badge="categoria?.nome">
      <template v-if="auth.canStaff" #actions>
        <button type="button" class="btn btn-light btn-sm" @click="showEdit = true">Editar</button>
        <button type="button" class="btn btn-outline-light btn-sm" @click="confirmarExclusao">Excluir</button>
      </template>
    </DetailBanner>

    <div v-if="obra" class="row g-4">
      <div class="col-lg-8">
        <div class="card card-body">
          <p class="h4 text-warning">{{ formatMoney(obra.valor_estimado) }}</p>
          <table class="table table-sm">
            <tbody>
              <tr><th>Técnica</th><td>{{ obra.tecnica }}</td></tr>
              <tr><th>Ano</th><td>{{ obra.ano_criacao }}</td></tr>
              <tr><th>Categoria</th><td>{{ categoria?.nome || '—' }}</td></tr>
            </tbody>
          </table>
          <div class="d-flex justify-content-between align-items-center mt-3 mb-2">
            <h3 class="h6 mb-0">Artistas</h3>
            <button v-if="auth.canStaff" type="button" class="btn btn-sm btn-outline-primary" @click="showArtista = true">+ Vincular</button>
          </div>
          <ul v-if="artistas.length" class="list-group">
            <li v-for="a in artistas" :key="a.id" class="list-group-item d-flex justify-content-between">
              <div><strong>{{ a.artista_nome }}</strong><div class="small text-muted">{{ a.funcao }} · {{ formatDate(a.data_participacao) }}</div></div>
              <button v-if="auth.canStaff" type="button" class="btn btn-sm btn-outline-danger" @click="removerArtista(a)">Remover</button>
            </li>
          </ul>
          <p v-else class="text-muted small">Nenhum artista vinculado.</p>
        </div>
      </div>
      <div class="col-lg-4 d-flex flex-column gap-3">
        <div v-if="certificado" class="card card-body bg-warning bg-opacity-10">
          <div class="d-flex justify-content-between"><h3 class="h6">Certificado</h3>
            <button v-if="auth.canStaff" type="button" class="btn btn-sm btn-link" @click="editarCertificado">Editar</button></div>
          <p class="small mb-1"><strong>Código:</strong> {{ certificado.codigo }}</p>
          <p class="small mb-1"><strong>Emissão:</strong> {{ formatDate(certificado.data_emissao) }}</p>
          <span v-if="certificadoValido" class="badge text-bg-success">Válido</span>
        </div>
        <div v-else-if="auth.canStaff" class="card card-body text-center">
          <p class="small text-muted">Sem certificado</p>
          <button type="button" class="btn btn-primary btn-sm" @click="showCert = true">Emitir certificado</button>
        </div>
        <div v-if="auth.isFuncionario" class="card card-body bg-success bg-opacity-10">
          <h3 class="h6">Restauração</h3>
          <button type="button" class="btn btn-sm btn-outline-success" @click="showRestauracao = true">Registrar</button>
        </div>
      </div>
    </div>

    <FormModal v-model="showEdit" title="Editar obra" :saving="saving" @save="salvarObra">
      <FormField label="Título"><input v-model="form.titulo" class="form-control" /></FormField>
      <div class="row g-2 mb-3">
        <div class="col-6"><FormField label="Técnica" inline><input v-model="form.tecnica" class="form-control" /></FormField></div>
        <div class="col-6"><FormField label="Ano" inline><input v-model.number="form.ano_criacao" type="number" class="form-control" /></FormField></div>
      </div>
      <FormField label="Valor"><input v-model.number="form.valor_estimado" type="number" step="0.01" class="form-control" /></FormField>
      <FormField label="Categoria">
        <select v-model="form.categoria" class="form-select"><option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nome }}</option></select>
      </FormField>
    </FormModal>

    <FormModal v-model="showCert" :title="certificado ? 'Editar certificado' : 'Emitir certificado'" :saving="saving" @save="salvarCertificado">
      <FormField label="Código"><input v-model="certForm.codigo" class="form-control" /></FormField>
      <FormField label="Data emissão"><input v-model="certForm.data_emissao" type="date" class="form-control" /></FormField>
      <FormField label="Órgão"><input v-model="certForm.orgao_responsavel" class="form-control" /></FormField>
    </FormModal>

    <FormModal v-model="showArtista" title="Vincular artista" save-label="Vincular" :saving="saving" @save="vincularArtista">
      <FormField label="Artista">
        <select v-model="formularioVinculoArtista.artista" class="form-select">
          <option :value="null">Selecione</option>
          <option v-for="a in artistasLista" :key="a.id" :value="a.id">{{ a.first_name }} {{ a.last_name }}</option>
        </select>
      </FormField>
      <FormField label="Função"><input v-model="formularioVinculoArtista.funcao" class="form-control" /></FormField>
      <FormField label="Data"><input v-model="formularioVinculoArtista.data_participacao" type="date" class="form-control" /></FormField>
    </FormModal>

    <FormModal v-model="showRestauracao" title="Registrar restauração" save-label="Registrar" :saving="saving" @save="salvarRestauracao">
      <FormField label="Data início"><input v-model="formularioNovaRestauracao.data_inicio" type="date" class="form-control" /></FormField>
      <FormField label="Descrição"><textarea v-model="formularioNovaRestauracao.descricao" class="form-control" rows="3" /></FormField>
      <FormField label="Custo (R$)"><input v-model.number="formularioNovaRestauracao.custo" type="number" step="0.01" class="form-control" /></FormField>
    </FormModal>
  </AppSpinner>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { confirmDialog } from '@/composables/useToast'
import AppSpinner from '@/components/AppSpinner.vue'
import DetailBanner from '@/components/DetailBanner.vue'
import FormField from '@/components/FormField.vue'
import FormModal from '@/components/FormModal.vue'
import { formatDate, formatMoney } from '@/utils/format'
import {
  apiError,
  createArtistaObra,
  createCertificado,
  createRestauracao,
  deleteArtistaObra,
  deleteObra,
  fetchArtista,
  fetchArtistaObras,
  fetchArtistas,
  fetchCategorias,
  fetchCategoria,
  fetchCertificados,
  fetchObra,
  updateCertificado,
  updateObra,
} from '@/api/services'
import { useAuthStore } from '@/stores/auth'
import {
  criarFormularioVazioCertificado,
  criarFormularioVazioRestauracao,
  criarFormularioVazioVinculoArtistaObra,
} from '@/constants/obra'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToast()
const loading = ref(true)
const saving = ref(false)
const obra = ref(null)
const categoria = ref(null)
const categorias = ref([])
const certificado = ref(null)
const artistas = ref([])
const artistasLista = ref([])
const showEdit = ref(false)
const showCert = ref(false)
const showArtista = ref(false)
const showRestauracao = ref(false)
const form = ref({})
const certForm = ref(criarFormularioVazioCertificado())
const formularioVinculoArtista = ref(criarFormularioVazioVinculoArtistaObra())
const formularioNovaRestauracao = ref(criarFormularioVazioRestauracao())

const certificadoValido = computed(() => certificado.value?.codigo && certificado.value?.data_emissao)

watch(showEdit, (open) => {
  if (open && obra.value) {
    form.value = {
      ...obra.value,
      valor_estimado: Number(obra.value.valor_estimado),
    }
  }
})

async function loadArtistas() {
  const links = await fetchArtistaObras({ obra: obra.value.id })
  artistas.value = await Promise.all(
    links.map(async (l) => {
      const a = await fetchArtista(l.artista)
      return {
        ...l,
        artista_nome: `${a.first_name} ${a.last_name}`.trim() || a.username,
      }
    }),
  )
}

async function load() {
  try {
    obra.value = await fetchObra(route.params.id)
    categorias.value = await fetchCategorias()
    if (obra.value.categoria) {
      categoria.value = await fetchCategoria(obra.value.categoria)
    }
    const certs = await fetchCertificados(obra.value.id)
    certificado.value = certs[0] || null
    artistasLista.value = await fetchArtistas()
    await loadArtistas()
  } finally {
    loading.value = false
  }
}

async function salvarObra() {
  saving.value = true
  try {
    const payload = { ...form.value, valor_estimado: String(form.value.valor_estimado) }
    obra.value = await updateObra(obra.value.id, payload)
    if (obra.value.categoria) {
      categoria.value = await fetchCategoria(obra.value.categoria)
    }
    toast.success('Obra atualizada!')
    showEdit.value = false
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    saving.value = false
  }
}

async function confirmarExclusao() {
  try {
    await confirmDialog('Excluir esta obra permanentemente?', 'Confirmar exclusão')
    await deleteObra(obra.value.id)
    toast.success('Obra excluída.')
    router.push({ name: 'obras' })
  } catch (e) {
    if (e !== 'cancel') toast.error(apiError(e))
  }
}

function editarCertificado() {
  certForm.value = certificado.value ? { ...certificado.value } : criarFormularioVazioCertificado()
  showCert.value = true
}

async function salvarCertificado() {
  if (!certForm.value.codigo || !certForm.value.data_emissao || !certForm.value.orgao_responsavel) {
    toast.warning('Preencha todos os campos do certificado.')
    return
  }
  saving.value = true
  try {
    if (certificado.value) {
      certificado.value = await updateCertificado(certificado.value.id, certForm.value)
    } else {
      certificado.value = await createCertificado({ ...certForm.value, obra: obra.value.id })
    }
    toast.success('Certificado salvo!')
    showCert.value = false
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    saving.value = false
  }
}

async function vincularArtista() {
  if (!formularioVinculoArtista.value.artista || !formularioVinculoArtista.value.funcao || !formularioVinculoArtista.value.data_participacao) {
    toast.warning('Preencha artista, função e data.')
    return
  }
  saving.value = true
  try {
    await createArtistaObra({
      artista: formularioVinculoArtista.value.artista,
      obra: obra.value.id,
      funcao: formularioVinculoArtista.value.funcao,
      data_participacao: formularioVinculoArtista.value.data_participacao,
    })
    await loadArtistas()
    showArtista.value = false
    formularioVinculoArtista.value = criarFormularioVazioVinculoArtistaObra()
    toast.success('Artista vinculado!')
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    saving.value = false
  }
}

async function removerArtista(link) {
  try {
    await confirmDialog('Remover vínculo com este artista?', 'Confirmar')
    await deleteArtistaObra(link.id)
    await loadArtistas()
    toast.success('Vínculo removido.')
  } catch (e) {
    if (e !== 'cancel') toast.error(apiError(e))
  }
}

async function salvarRestauracao() {
  if (!formularioNovaRestauracao.value.data_inicio || !formularioNovaRestauracao.value.descricao) {
    toast.warning('Preencha data e descrição.')
    return
  }
  saving.value = true
  try {
    await createRestauracao({
      obra: obra.value.id,
      funcionario: auth.user.id,
      data_inicio: formularioNovaRestauracao.value.data_inicio,
      descricao: formularioNovaRestauracao.value.descricao,
      custo: String(formularioNovaRestauracao.value.custo),
    })
    toast.success('Restauração registrada!')
    showRestauracao.value = false
    formularioNovaRestauracao.value = criarFormularioVazioRestauracao()
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.obra-layout {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 1.25rem;
  align-items: start;
}

.price {
  font-size: 1.35rem;
  font-weight: 700;
  color: #d97706;
  margin-bottom: 1rem;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

.section-head .section-title {
  margin: 0;
}

.artist-chips {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.artist-chips li {
  padding: 0.65rem 0.85rem;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  font-size: 0.85rem;
}

.artist-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.artist-chips span {
  display: block;
  color: var(--text-muted);
  font-size: 0.78rem;
  margin-top: 0.15rem;
}

.side-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cert-panel,
.staff-panel {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: var(--radius);
  padding: 1.15rem;
}

.staff-panel {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.cert-empty {
  text-align: center;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.85rem;
}

.cert-panel h3,
.staff-panel h3 {
  font-size: 0.95rem;
}

.cert-panel p {
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.cert-panel span {
  display: block;
  font-size: 0.72rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.empty-hint {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

@media (max-width: 640px) {
  .obra-layout {
    grid-template-columns: 1fr;
  }
}
</style>
