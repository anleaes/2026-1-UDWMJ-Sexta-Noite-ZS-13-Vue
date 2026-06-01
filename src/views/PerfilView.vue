<template>
  <AppSpinner :show="loading">
    <div class="card mb-4 bg-primary text-white overflow-hidden">
      <div class="card-body d-flex align-items-center gap-3">
        <div class="avatar rounded-circle bg-warning text-white d-flex align-items-center justify-content-center fw-bold">
          {{ initials }}
        </div>
        <div>
          <h1 class="h4 mb-1">{{ auth.fullName || account?.username }}</h1>
          <span class="badge bg-light text-dark">{{ auth.roleLabel }}</span>
          <p class="small mb-0 mt-2 opacity-75">@{{ account?.username }} · {{ account?.email }}</p>
        </div>
      </div>
    </div>

    <div v-if="auth.isAdmin" class="mb-3">
      <router-link :to="{ name: 'admin' }" class="btn btn-outline-primary d-inline-flex align-items-center gap-1">
        <AppIcon name="Shield" :size="18" decorative /> Painel admin
      </router-link>
    </div>

    <div v-if="relatorio" class="card mb-3 bg-light">
      <div class="card-body">
        <h3 class="h6">Relatório operacional</h3>
        <p class="small mb-1">
          Galerias: {{ relatorio.acervo.galerias }} · Obras: {{ relatorio.acervo.obras }} · Exposições: {{ relatorio.acervo.exposicoes }}
        </p>
        <p class="small mb-0">
          Restaurações: {{ relatorio.restauracoes }} · Custo total: R$ {{ relatorio.custoRestauracoes }}
        </p>
      </div>
    </div>

    <ul class="nav nav-tabs mb-3" role="tablist" aria-label="Seções do perfil">
      <li v-for="aba in abasPerfil" :key="aba.id" class="nav-item" role="presentation">
        <button
          :id="`tab-${aba.id}`"
          type="button"
          role="tab"
          class="nav-link"
          :class="{ active: abaAtivaPerfil === aba.id }"
          :aria-selected="abaAtivaPerfil === aba.id ? 'true' : 'false'"
          :aria-controls="`panel-${aba.id}`"
          @click="abaAtivaPerfil = aba.id"
        >
          {{ aba.label }}
        </button>
      </li>
    </ul>

    <div
      v-show="abaAtivaPerfil === ID_ABA_DADOS"
      id="panel-dados"
      role="tabpanel"
      aria-labelledby="tab-dados"
      class="card card-body"
    >
      <div class="row g-2 mb-3">
        <div class="col-md-6"><label class="form-label">Nome</label><input v-model="form.first_name" class="form-control" /></div>
        <div class="col-md-6"><label class="form-label">Sobrenome</label><input v-model="form.last_name" class="form-control" /></div>
      </div>
      <div class="mb-3"><label class="form-label">E-mail</label><input v-model="form.email" class="form-control" /></div>
      <div class="mb-3"><label class="form-label">Telefone</label><input v-model="form.telefone" class="form-control" /></div>
      <div class="mb-3"><label class="form-label">Data nascimento</label><input v-model="form.data_nascimento" type="date" class="form-control" /></div>
      <template v-if="account?.role === 'artista'">
        <div class="mb-3"><label class="form-label">Nacionalidade</label><input v-model="form.nacionalidade" class="form-control" /></div>
        <div class="mb-3"><label class="form-label">Estilo</label><input v-model="form.estilo_artistico" class="form-control" /></div>
      </template>
      <table class="table table-sm mb-3">
        <tbody>
          <tr><th>CPF</th><td>{{ account?.cpf }}</td></tr>
          <tr v-if="account?.role === 'funcionario'"><th>Cargo</th><td>{{ account.cargo }}</td></tr>
          <tr v-if="account?.role === 'funcionario'"><th>Galeria</th><td>{{ account.galeria_nome || '—' }}</td></tr>
        </tbody>
      </table>
      <SubmitButton label="Salvar alterações" :loading="saving" @click="salvarDados" />
    </div>

    <div v-show="abaAtivaPerfil === ID_ABA_SENHA" id="panel-senha" role="tabpanel" aria-labelledby="tab-senha" class="card card-body" style="max-width: 400px">
      <div class="mb-3"><label class="form-label">Senha atual</label><input v-model="formularioAlteracaoSenha.senhaAtual" type="password" class="form-control" /></div>
      <div class="mb-3"><label class="form-label">Nova senha</label><input v-model="formularioAlteracaoSenha.novaSenha" type="password" class="form-control" /></div>
      <div class="mb-3"><label class="form-label">Confirmar</label><input v-model="formularioAlteracaoSenha.confirmacaoNovaSenha" type="password" class="form-control" /></div>
      <SubmitButton label="Alterar senha" :loading="savingPwd" @click="salvarSenha" />
    </div>

    <div v-show="abaAtivaPerfil === ID_ABA_ATIVIDADES" id="panel-atividades" role="tabpanel" aria-labelledby="tab-atividades">
      <template v-if="account?.role === 'artista'">
        <div class="d-flex gap-2 mb-3">
          <button type="button" class="btn btn-outline-primary btn-sm" @click="showPortfolio = true">Atualizar portfolio</button>
          <button type="button" class="btn btn-primary btn-sm" @click="abrirVincularObra">+ Vincular obra</button>
        </div>
        <div class="card mb-3">
          <div class="card-header">Minhas obras ({{ portfolio.length }})</div>
          <ul v-if="portfolio.length" class="list-group list-group-flush">
            <li v-for="p in portfolio" :key="p.id" class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <router-link :to="`/obras/${p.obra.id}`">{{ p.obra.titulo }}</router-link>
                <span class="small text-muted"> · {{ p.funcao }}</span>
              </div>
              <button type="button" class="btn btn-sm btn-outline-danger" @click="desvincularObra(p)">Desvincular</button>
            </li>
          </ul>
          <div v-else class="card-body text-muted small">Nenhuma obra vinculada</div>
        </div>
      </template>

      <template v-if="account?.role === 'visitante'">
        <div v-for="secao in secoesAtividadesVisitante" :key="secao.title">
          <SectionCard :title="`${secao.title} (${secao.items.length})`">
            <ul v-if="secao.items.length" class="list-group list-group-flush">
            <li v-for="item in secao.items" :key="item.id" class="list-group-item">
              <div class="d-flex justify-content-between align-items-start gap-2">
                <span class="small">{{ secao.format(item) }}</span>
                <div v-if="secao.actions" class="btn-group btn-group-sm flex-shrink-0">
                  <button
                    v-for="acao in secao.actions(item)"
                    :key="acao.label"
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="acao.handler(item)"
                  >
                    {{ acao.label }}
                  </button>
                </div>
              </div>
            </li>
            </ul>
            <div v-else class="card-body text-muted small">{{ secao.empty }}</div>
          </SectionCard>
        </div>
      </template>

      <template v-if="account?.role === 'funcionario' || account?.role === 'admin'">
        <div class="card mb-3">
          <div class="card-header">Restaurações ({{ restauracoes.length }})</div>
          <ul v-if="restauracoes.length" class="list-group list-group-flush">
            <li v-for="r in restauracoes" :key="r.id" class="list-group-item">
              <div class="d-flex justify-content-between align-items-start gap-2">
                <span class="small">
                  {{ mapaTitulosObra[r.obra] || `Obra #${r.obra}` }} · R$ {{ r.custo }} · {{ r.descricao }}
                  <span v-if="r.data_fim"> · Finalizada {{ formatDate(r.data_fim) }}</span>
                  <span v-else class="text-warning"> · Em andamento</span>
                </span>
                <div class="btn-group btn-group-sm flex-shrink-0">
                  <button type="button" class="btn btn-outline-secondary" @click="abrirEditRest(r)">Editar</button>
                  <button v-if="!r.data_fim" type="button" class="btn btn-outline-success" @click="finalizarRest(r)">Finalizar</button>
                  <button type="button" class="btn btn-outline-danger" @click="excluirRest(r)">Excluir</button>
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="card-body text-muted small">Nenhuma restauração</div>
        </div>
      </template>
    </div>

    <div v-show="abaAtivaPerfil === ID_ABA_EXCLUIR_CONTA" id="panel-excluir" role="tabpanel" aria-labelledby="tab-excluir" class="card card-body border-danger">
      <div class="alert alert-warning">Esta ação não pode ser desfeita.</div>
      <button type="button" class="btn btn-danger" @click="confirmarExclusao">Excluir minha conta</button>
    </div>

    <FormModal v-model="showPortfolio" title="Atualizar portfolio" :saving="actionLoading" @save="salvarPortfolio">
      <FormField label="Nacionalidade"><input v-model="portfolioForm.nacionalidade" class="form-control" /></FormField>
      <FormField label="Estilo artístico"><input v-model="portfolioForm.estilo_artistico" class="form-control" /></FormField>
    </FormModal>

    <FormModal v-model="showVincularObra" title="Vincular obra" save-label="Vincular" :saving="actionLoading" @save="vincularObra">
      <FormField label="Obra">
        <select v-model="formularioVinculoObraArtista.obra" class="form-select">
          <option v-for="o in todasObras" :key="o.id" :value="o.id">{{ o.titulo }}</option>
        </select>
      </FormField>
      <FormField label="Função"><input v-model="formularioVinculoObraArtista.funcao" class="form-control" placeholder="Autor, Co-autor..." /></FormField>
    </FormModal>

    <FormModal v-model="showEditAv" title="Editar avaliação" :saving="actionLoading" @save="salvarAvaliacao">
      <FormField label="Nota (1-5)"><input v-model.number="formularioAvaliacaoEdicao.nota" type="number" min="1" max="5" class="form-control" /></FormField>
      <FormField label="Comentário"><textarea v-model="formularioAvaliacaoEdicao.comentario" class="form-control" rows="2" /></FormField>
    </FormModal>

    <FormModal v-model="showEditRest" title="Editar restauração" :saving="actionLoading" @save="salvarRestauracao">
      <FormField label="Descrição"><input v-model="formularioRestauracaoEdicao.descricao" class="form-control" /></FormField>
      <FormField label="Custo"><input v-model="formularioRestauracaoEdicao.custo" type="number" step="0.01" class="form-control" /></FormField>
    </FormModal>
  </AppSpinner>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import AppSpinner from '@/components/AppSpinner.vue'
import FormField from '@/components/FormField.vue'
import FormModal from '@/components/FormModal.vue'
import SectionCard from '@/components/SectionCard.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import { formatDate } from '@/utils/format'
import {
  apiError,
  buildFuncionarioRelatorio,
  cancelarIngresso,
  cancelarReserva,
  changePassword,
  createArtistaObra,
  deleteArtistaObra,
  deleteAvaliacao,
  deleteRestauracao,
  fetchAccount,
  fetchArtistaObras,
  fetchAvaliacoes,
  fetchDashboardCounts,
  fetchExposicoes,
  fetchIngressos,
  fetchObra,
  fetchObras,
  fetchPagamentos,
  fetchReservas,
  fetchRestauracoesAll,
  fetchRestauracoesFuncionario,
  finalizarRestauracao,
  updateAvaliacao,
  updateRestauracao,
} from '@/api/services'
import { confirmDialog, useToast } from '@/composables/useToast'
import { useQuerySync } from '@/composables/useQuerySync'
import { useAuthStore } from '@/stores/auth'
import {
  ABAS_PERFIL_COMUNS,
  ABA_EXCLUIR_CONTA_VISITANTE,
  ID_ABA_ATIVIDADES,
  ID_ABA_DADOS,
  ID_ABA_EXCLUIR_CONTA,
  ID_ABA_SENHA,
} from '@/constants/perfil'
import { obterDataHojeFormatoISO } from '@/constants/datas'
import {
  FUNCAO_ARTISTA_NA_OBRA_PADRAO,
  NOTA_AVALIACAO_PADRAO,
  ROTULOS_STATUS_ATIVIDADE_VISITANTE,
} from '@/constants/visitante'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const toast = useToast()
const loading = ref(true)
const saving = ref(false)
const savingPwd = ref(false)
const actionLoading = ref(false)
/** Aba ativa — sincronizada com ?tab= na URL */
const abaAtivaPerfil = ref(ID_ABA_DADOS)

useQuerySync(route, router, [{ ref: abaAtivaPerfil, key: 'tab' }])
const account = ref(null)
const relatorio = ref(null)
/** Mapa exposicaoId → título (para listas do visitante) */
const mapaTitulosExposicao = ref({})
/** Mapa obraId → título (para restaurações) */
const mapaTitulosObra = ref({})

const showPortfolio = ref(false)
const showVincularObra = ref(false)
const showEditAv = ref(false)
const showEditRest = ref(false)
const editingAv = ref(null)
const editingRest = ref(null)

const portfolioForm = reactive({ nacionalidade: '', estilo_artistico: '' })
const formularioVinculoObraArtista = reactive({ obra: null, funcao: FUNCAO_ARTISTA_NA_OBRA_PADRAO })
const formularioAvaliacaoEdicao = reactive({ nota: NOTA_AVALIACAO_PADRAO, comentario: '' })
const formularioRestauracaoEdicao = reactive({ descricao: '', custo: '' })

/** Abas visíveis conforme o papel do usuário */
const abasPerfil = computed(() => {
  const abas = [...ABAS_PERFIL_COMUNS]
  if (account.value?.role === 'visitante') abas.push(ABA_EXCLUIR_CONTA_VISITANTE)
  return abas
})

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  telefone: '',
  data_nascimento: null,
  nacionalidade: '',
  estilo_artistico: '',
})

const formularioAlteracaoSenha = reactive({
  senhaAtual: '',
  novaSenha: '',
  confirmacaoNovaSenha: '',
})
const ingressos = ref([])
const reservas = ref([])
const avaliacoes = ref([])
const pagamentos = ref([])
const restauracoes = ref([])
const portfolio = ref([])
const todasObras = ref([])

const initials = computed(() => {
  const f = account.value?.first_name?.[0] || ''
  const l = account.value?.last_name?.[0] || ''
  return (f + l).toUpperCase() || '?'
})

const secoesAtividadesVisitante = computed(() => [
  {
    title: 'Ingressos',
    items: ingressos.value,
    empty: 'Nenhum ingresso',
    format: (ingresso) =>
      `${mapaTitulosExposicao.value[ingresso.exposicao] || `#${ingresso.exposicao}`} · ${ingresso.tipo} · R$ ${ingresso.valor} · ${ROTULOS_STATUS_ATIVIDADE_VISITANTE[ingresso.status] || ingresso.status}`,
    actions: (ingresso) => (ingresso.status === 'ativo' ? [{ label: 'Cancelar', handler: handleCancelarIngresso }] : []),
  },
  {
    title: 'Reservas',
    items: reservas.value,
    empty: 'Nenhuma reserva',
    format: (reserva) =>
      `${mapaTitulosExposicao.value[reserva.exposicao] || `#${reserva.exposicao}`} · ${formatDate(reserva.data_reserva)} · ${reserva.quantidade_pessoas} pessoas · ${ROTULOS_STATUS_ATIVIDADE_VISITANTE[reserva.status] || reserva.status}`,
    actions: (reserva) => (reserva.status !== 'cancelada' ? [{ label: 'Cancelar', handler: handleCancelarReserva }] : []),
  },
  {
    title: 'Avaliações',
    items: avaliacoes.value,
    empty: 'Nenhuma avaliação',
    format: (avaliacao) =>
      `${mapaTitulosExposicao.value[avaliacao.exposicao] || `#${avaliacao.exposicao}`} · ${'★'.repeat(avaliacao.nota)} · ${avaliacao.comentario}`,
    actions: () => [
      { label: 'Editar', handler: abrirEditAv },
      { label: 'Excluir', handler: excluirAv },
    ],
  },
  {
    title: 'Pagamentos',
    items: pagamentos.value,
    empty: 'Nenhum pagamento',
    format: (pagamento) => `R$ ${pagamento.valor} · ${pagamento.metodo} · ${pagamento.status || '—'}`,
    actions: () => [],
  },
])

function fillForm(data) {
  form.first_name = data.first_name || ''
  form.last_name = data.last_name || ''
  form.email = data.email || ''
  form.telefone = data.telefone || ''
  form.data_nascimento = data.data_nascimento || null
  form.nacionalidade = data.nacionalidade || ''
  form.estilo_artistico = data.estilo_artistico || ''
}

async function loadActivities(id, role) {
  const exposicoes = await fetchExposicoes()
  mapaTitulosExposicao.value = Object.fromEntries(exposicoes.map((e) => [e.id, e.titulo]))

  if (role === 'visitante') {
    ;[ingressos.value, reservas.value, avaliacoes.value] = await Promise.all([
      fetchIngressos(id), fetchReservas(id), fetchAvaliacoes(id),
    ])
    const allPag = await fetchPagamentos()
    const ingIds = new Set(ingressos.value.map((i) => i.id))
    const resIds = new Set(reservas.value.map((r) => r.id))
    pagamentos.value = allPag.filter((p) => (p.ingresso && ingIds.has(p.ingresso)) || (p.reserva && resIds.has(p.reserva)))
  }

  if (role === 'funcionario') {
    restauracoes.value = await fetchRestauracoesFuncionario(id)
    const counts = await fetchDashboardCounts()
    relatorio.value = await buildFuncionarioRelatorio(account.value, counts, restauracoes.value)
    const obraIds = [...new Set(restauracoes.value.map((r) => r.obra))]
    const obras = await Promise.all(obraIds.map((oid) => fetchObra(oid)))
    mapaTitulosObra.value = Object.fromEntries(obras.map((o) => [o.id, o.titulo]))
  }

  if (role === 'admin') {
    restauracoes.value = await fetchRestauracoesAll()
    const obraIds = [...new Set(restauracoes.value.map((r) => r.obra))]
    const obras = await Promise.all(obraIds.map((oid) => fetchObra(oid)))
    mapaTitulosObra.value = Object.fromEntries(obras.map((o) => [o.id, o.titulo]))
  }

  if (role === 'artista') {
    portfolioForm.nacionalidade = account.value.nacionalidade || ''
    portfolioForm.estilo_artistico = account.value.estilo_artistico || ''
    todasObras.value = await fetchObras()
    const links = await fetchArtistaObras({ artista: id })
    portfolio.value = await Promise.all(links.map(async (link) => ({ ...link, obra: await fetchObra(link.obra) })))
  }
}

onMounted(async () => {
  const id = auth.user?.id
  if (!id) return
  try {
    account.value = await fetchAccount(id)
    fillForm(account.value)
    await loadActivities(id, account.value.role)
  } finally {
    loading.value = false
  }
})

async function reloadActivities() {
  const id = auth.user?.id
  if (!id || !account.value) return
  await loadActivities(id, account.value.role)
}

async function salvarDados() {
  saving.value = true
  try {
    const payload = { first_name: form.first_name, last_name: form.last_name, email: form.email, telefone: form.telefone, data_nascimento: form.data_nascimento }
    if (account.value?.role === 'artista') {
      payload.nacionalidade = form.nacionalidade
      payload.estilo_artistico = form.estilo_artistico
    }
    account.value = await auth.saveAccount(payload)
    toast.success('Dados atualizados!')
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    saving.value = false
  }
}

async function salvarSenha() {
  savingPwd.value = true
  try {
    await changePassword(auth.user.id, {
      current_password: formularioAlteracaoSenha.senhaAtual,
      new_password: formularioAlteracaoSenha.novaSenha,
      new_password_confirm: formularioAlteracaoSenha.confirmacaoNovaSenha,
    })
    toast.success('Senha alterada!')
    Object.assign(formularioAlteracaoSenha, { senhaAtual: '', novaSenha: '', confirmacaoNovaSenha: '' })
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    savingPwd.value = false
  }
}

async function confirmarExclusao() {
  try {
    await confirmDialog('Deseja excluir sua conta de visitante?', 'Confirmar')
    await auth.removeAccount()
    toast.success('Conta excluída.')
    router.push({ name: 'login' })
  } catch (e) {
    if (e !== 'cancel') toast.error(apiError(e))
  }
}

async function handleCancelarIngresso(item) {
  try {
    await confirmDialog('Cancelar este ingresso?', 'Confirmar')
    await cancelarIngresso(item.id)
    toast.success('Ingresso cancelado.')
    await reloadActivities()
  } catch (e) {
    if (e !== 'cancel') toast.error(apiError(e))
  }
}

async function handleCancelarReserva(item) {
  try {
    await confirmDialog('Cancelar esta reserva?', 'Confirmar')
    await cancelarReserva(item.id)
    toast.success('Reserva cancelada.')
    await reloadActivities()
  } catch (e) {
    if (e !== 'cancel') toast.error(apiError(e))
  }
}

function abrirEditAv(item) {
  editingAv.value = item
  formularioAvaliacaoEdicao.nota = item.nota
  formularioAvaliacaoEdicao.comentario = item.comentario
  showEditAv.value = true
}

async function salvarAvaliacao() {
  if (!editingAv.value) return
  actionLoading.value = true
  try {
    await updateAvaliacao(editingAv.value.id, {
      nota: formularioAvaliacaoEdicao.nota,
      comentario: formularioAvaliacaoEdicao.comentario,
    })
    toast.success('Avaliação atualizada!')
    showEditAv.value = false
    await reloadActivities()
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    actionLoading.value = false
  }
}

async function excluirAv(item) {
  try {
    await confirmDialog('Excluir esta avaliação?', 'Confirmar')
    await deleteAvaliacao(item.id)
    toast.success('Avaliação excluída.')
    await reloadActivities()
  } catch (e) {
    if (e !== 'cancel') toast.error(apiError(e))
  }
}

function abrirEditRest(item) {
  editingRest.value = item
  formularioRestauracaoEdicao.descricao = item.descricao
  formularioRestauracaoEdicao.custo = item.custo
  showEditRest.value = true
}

async function salvarRestauracao() {
  if (!editingRest.value) return
  actionLoading.value = true
  try {
    await updateRestauracao(editingRest.value.id, {
      descricao: formularioRestauracaoEdicao.descricao,
      custo: formularioRestauracaoEdicao.custo,
    })
    toast.success('Restauração atualizada!')
    showEditRest.value = false
    await reloadActivities()
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    actionLoading.value = false
  }
}

async function finalizarRest(item) {
  try {
    await finalizarRestauracao(item.id)
    toast.success('Restauração finalizada!')
    await reloadActivities()
  } catch (e) {
    toast.error(apiError(e))
  }
}

async function excluirRest(item) {
  try {
    await confirmDialog('Excluir esta restauração?', 'Confirmar')
    await deleteRestauracao(item.id)
    toast.success('Restauração excluída.')
    await reloadActivities()
  } catch (e) {
    if (e !== 'cancel') toast.error(apiError(e))
  }
}

async function salvarPortfolio() {
  actionLoading.value = true
  try {
    account.value = await auth.saveAccount({
      nacionalidade: portfolioForm.nacionalidade.trim(),
      estilo_artistico: portfolioForm.estilo_artistico.trim(),
    })
    fillForm(account.value)
    toast.success('Portfolio atualizado!')
    showPortfolio.value = false
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    actionLoading.value = false
  }
}

function abrirVincularObra() {
  if (!formularioVinculoObraArtista.obra && todasObras.value[0]) {
    formularioVinculoObraArtista.obra = todasObras.value[0].id
  }
  showVincularObra.value = true
}

async function vincularObra() {
  if (!formularioVinculoObraArtista.obra) return
  actionLoading.value = true
  try {
    await createArtistaObra({
      artista: auth.user.id,
      obra: formularioVinculoObraArtista.obra,
      funcao: formularioVinculoObraArtista.funcao.trim() || FUNCAO_ARTISTA_NA_OBRA_PADRAO,
      data_participacao: obterDataHojeFormatoISO(),
    })
    toast.success('Obra vinculada!')
    showVincularObra.value = false
    await reloadActivities()
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    actionLoading.value = false
  }
}

async function desvincularObra(link) {
  try {
    await confirmDialog(`Desvincular "${link.obra.titulo}"?`, 'Confirmar')
    await deleteArtistaObra(link.id)
    toast.success('Obra desvinculada.')
    await reloadActivities()
  } catch (e) {
    if (e !== 'cancel') toast.error(apiError(e))
  }
}
</script>

<style scoped>
.avatar {
  width: 64px;
  height: 64px;
  font-size: 1.25rem;
}
</style>
