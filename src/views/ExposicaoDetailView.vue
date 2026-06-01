<template>
  <AppSpinner :show="loading">
    <DetailBanner
      v-if="exposicao"
      variant="exposicao"
      :title="exposicao.titulo"
      :meta="`${formatDate(exposicao.data_inicio)} — ${formatDate(exposicao.data_fim)}`"
      :badge="exposicaoStatusLabel(exposicao.status)"
    >
      <template v-if="auth.canStaff" #actions>
        <select v-model="novoStatus" class="form-select form-select-sm d-inline-block w-auto me-2" @change="alterarStatus">
          <option value="planejada">Planejada</option>
          <option value="em_andamento">Em andamento</option>
          <option value="encerrada">Encerrada</option>
        </select>
        <button type="button" class="btn btn-light btn-sm" @click="showEdit = true">Editar</button>
        <button type="button" class="btn btn-outline-light btn-sm" @click="confirmarExclusao">Excluir</button>
      </template>
    </DetailBanner>

    <div v-if="exposicao" class="row g-4">
      <div class="col-lg-8">
        <div class="card card-body mb-3"><p class="text-muted mb-0">{{ exposicao.descricao }}</p></div>
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h3 class="h6 mb-0">Obras ({{ obrasExposicao.length }})</h3>
          <button v-if="auth.canStaff" type="button" class="btn btn-sm btn-primary" @click="showAddObra = true">+ Obra</button>
        </div>
        <div class="list-group">
          <div
            v-for="o in obrasExposicao"
            :key="o.link_id"
            class="list-group-item d-flex justify-content-between align-items-center gap-2"
          >
            <button type="button" class="btn btn-link text-start flex-grow-1 min-w-0 p-0 text-decoration-none" @click="goObra(o)">
              <strong class="text-body">{{ o.titulo }}</strong>
              <div class="small text-muted text-truncate">{{ o.tecnica }} · Sala {{ o.posicao_sala }} · {{ o.status_conservacao }}</div>
            </button>
            <button
              v-if="auth.canStaff"
              type="button"
              class="btn btn-sm btn-outline-danger flex-shrink-0"
              aria-label="Remover obra da exposição"
              @click="removerObra(o)"
            >
              Remover
            </button>
          </div>
        </div>
        <EmptyState v-if="!obrasExposicao.length" message="Nenhuma obra nesta exposição" icon="Image" />
      </div>

      <div class="col-lg-4">
        <div v-if="auth.isVisitante" class="card card-body">
          <h3 class="h6 d-flex align-items-center gap-1"><AppIcon name="Ticket" :size="18" decorative /> Visitante</h3>
          <button type="button" class="btn btn-primary w-100 mb-2" @click="showIngresso = true">Comprar ingressos</button>
          <button type="button" class="btn btn-outline-primary w-100 mb-3" :disabled="actionLoading" @click="showReserva = true">Reservar visita</button>
          <hr />
          <label class="form-label">Nota (1-5)</label>
          <input v-model.number="notaAvaliacao" type="range" min="1" max="5" class="form-range" />
          <label class="form-label">Comentário</label>
          <textarea v-model="comentarioAvaliacao" class="form-control mb-2" rows="2" />
          <button type="button" class="btn btn-success w-100" :disabled="actionLoading" @click="avaliar">Enviar avaliação</button>
        </div>
        <div v-else-if="auth.canStaff" class="card card-body bg-success bg-opacity-10">
          <h3 class="h6">Gestão</h3>
          <ul class="small text-muted mb-0">
            <li>Adicione obras com posição na sala</li>
            <li>Altere o status ao abrir/encerrar</li>
          </ul>
        </div>
      </div>
    </div>

    <FormModal v-model="showEdit" title="Editar exposição" size="lg" :saving="actionLoading" @save="salvarEdicao">
      <FormField label="Título"><input v-model="editForm.titulo" class="form-control" /></FormField>
      <FormField label="Galeria">
        <select v-model="editForm.galeria" class="form-select"><option v-for="g in galerias" :key="g.id" :value="g.id">{{ g.nome }}</option></select>
      </FormField>
      <div class="row g-2 mb-3">
        <div class="col-6"><FormField label="Início" inline><input v-model="editForm.data_inicio" type="date" class="form-control" /></FormField></div>
        <div class="col-6"><FormField label="Fim" inline><input v-model="editForm.data_fim" type="date" class="form-control" /></FormField></div>
      </div>
      <FormField label="Descrição"><textarea v-model="editForm.descricao" class="form-control" rows="3" /></FormField>
    </FormModal>

    <FormModal v-model="showAddObra" title="Adicionar obra" size="lg" save-label="Adicionar" :saving="actionLoading" @save="adicionarObra">
      <FormField label="Obra">
        <select v-model="formularioObraNaExposicao.obra" class="form-select"><option v-for="o in obrasDisponiveis" :key="o.id" :value="o.id">{{ o.titulo }}</option></select>
      </FormField>
      <FormField label="Data entrada"><input v-model="formularioObraNaExposicao.data_entrada" type="date" class="form-control" /></FormField>
      <FormField label="Posição sala"><input v-model="formularioObraNaExposicao.posicao_sala" class="form-control" /></FormField>
      <FormField label="Conservação"><input v-model="formularioObraNaExposicao.status_conservacao" class="form-control" /></FormField>
    </FormModal>

    <FormModal v-model="showIngresso" title="Comprar ingressos" save-label="Confirmar" :saving="actionLoading" @save="comprar">
      <FormField label="Quantidade"><input v-model.number="quantidadeIngressosCompra" type="number" :min="QUANTIDADE_MINIMA_INGRESSOS" :max="QUANTIDADE_MAXIMA_INGRESSOS" class="form-control" /></FormField>
      <FormField label="Tipo">
        <select v-model="tipoIngressoSelecionado" class="form-select">
          <option v-for="opcao in OPCOES_TIPO_INGRESSO_COM_PRECO" :key="opcao.valor" :value="opcao.valor">
            {{ opcao.rotulo }}
          </option>
        </select>
      </FormField>
      <p>Total: <strong>{{ formatMoney(quantidadeIngressosCompra * PRECOS_INGRESSO_POR_TIPO[tipoIngressoSelecionado]) }}</strong></p>
    </FormModal>

    <FormModal v-model="showReserva" title="Reservar visita" save-label="Confirmar" :saving="actionLoading" @save="reservar">
      <FormField label="Pessoas"><input v-model.number="quantidadePessoasReserva" type="number" min="1" class="form-control" /></FormField>
      <FormField label="Data"><input v-model="dataReservaSelecionada" type="date" class="form-control" /></FormField>
    </FormModal>
  </AppSpinner>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast, confirmDialog } from '@/composables/useToast'
import AppIcon from '@/components/AppIcon.vue'
import AppSpinner from '@/components/AppSpinner.vue'
import DetailBanner from '@/components/DetailBanner.vue'
import EmptyState from '@/components/EmptyState.vue'
import FormField from '@/components/FormField.vue'
import FormModal from '@/components/FormModal.vue'
import { exposicaoStatusLabel, formatDate, formatMoney } from '@/utils/format'
import {
  apiError,
  comprarIngressos,
  criarAvaliacao,
  criarReserva,
  deleteExposicao,
  deleteExposicaoObra,
  fetchExposicao,
  fetchExposicaoObras,
  fetchGalerias,
  fetchObra,
  fetchObras,
  updateExposicao,
  createExposicaoObra,
} from '@/api/services'
import { useAuthStore } from '@/stores/auth'
import { criarFormularioVazioObraNaExposicao } from '@/constants/exposicao'
import {
  COMENTARIO_AVALIACAO_PADRAO,
  DATA_RESERVA_PADRAO,
  NOTA_AVALIACAO_PADRAO,
  QUANTIDADE_INGRESSOS_PADRAO,
  QUANTIDADE_PESSOAS_RESERVA_PADRAO,
} from '@/constants/visitante'
import {
  OPCOES_TIPO_INGRESSO_COM_PRECO,
  PRECOS_INGRESSO_POR_TIPO,
  QUANTIDADE_MAXIMA_INGRESSOS,
  QUANTIDADE_MINIMA_INGRESSOS,
  TIPO_INGRESSO_PADRAO,
} from '@/constants/ingresso'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToast()
const loading = ref(true)
const actionLoading = ref(false)
const exposicao = ref(null)
const obrasExposicao = ref([])
const galerias = ref([])
const todasObras = ref([])
const novoStatus = ref('')
const notaAvaliacao = ref(NOTA_AVALIACAO_PADRAO)
const comentarioAvaliacao = ref(COMENTARIO_AVALIACAO_PADRAO)
const showReserva = ref(false)
const showIngresso = ref(false)
const showEdit = ref(false)
const showAddObra = ref(false)
const quantidadePessoasReserva = ref(QUANTIDADE_PESSOAS_RESERVA_PADRAO)
const quantidadeIngressosCompra = ref(QUANTIDADE_INGRESSOS_PADRAO)
const tipoIngressoSelecionado = ref(TIPO_INGRESSO_PADRAO)
const dataReservaSelecionada = ref(DATA_RESERVA_PADRAO)
const editForm = ref({})
const formularioObraNaExposicao = ref(criarFormularioVazioObraNaExposicao())

const obrasDisponiveis = computed(() => {
  const ids = new Set(obrasExposicao.value.map((o) => o.obra_id))
  return todasObras.value.filter((o) => !ids.has(o.id))
})

function goObra(row) { if (row.obra_id) router.push(`/obras/${row.obra_id}`) }

watch(showEdit, (open) => { if (open && exposicao.value) editForm.value = { ...exposicao.value } })

async function loadObrasExposicao() {
  const links = await fetchExposicaoObras(exposicao.value.id)
  obrasExposicao.value = await Promise.all(
    links.map(async (link) => {
      const obra = await fetchObra(link.obra)
      return { link_id: link.id, obra_id: link.obra, titulo: obra.titulo, tecnica: obra.tecnica, posicao_sala: link.posicao_sala, status_conservacao: link.status_conservacao }
    }),
  )
}

onMounted(async () => {
  try {
    galerias.value = await fetchGalerias()
    todasObras.value = await fetchObras()
    exposicao.value = await fetchExposicao(route.params.id)
    novoStatus.value = exposicao.value.status
    await loadObrasExposicao()
  } finally {
    loading.value = false
  }
})

async function alterarStatus() {
  try {
    exposicao.value = await updateExposicao(exposicao.value.id, { status: novoStatus.value })
    toast.success('Status atualizado!')
  } catch (e) {
    toast.error(apiError(e))
    novoStatus.value = exposicao.value.status
  }
}

async function salvarEdicao() {
  actionLoading.value = true
  try {
    exposicao.value = await updateExposicao(exposicao.value.id, editForm.value)
    toast.success('Exposição atualizada!')
    showEdit.value = false
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    actionLoading.value = false
  }
}

async function confirmarExclusao() {
  try {
    await confirmDialog('Excluir esta exposição?', 'Confirmar')
    await deleteExposicao(exposicao.value.id)
    toast.success('Exposição excluída.')
    router.push({ name: 'exposicoes' })
  } catch (e) {
    if (e !== 'cancel') toast.error(apiError(e))
  }
}

async function adicionarObra() {
  if (!formularioObraNaExposicao.value.obra || !formularioObraNaExposicao.value.data_entrada || !formularioObraNaExposicao.value.posicao_sala) {
    toast.warning('Preencha obra, data e posição.')
    return
  }
  actionLoading.value = true
  try {
    await createExposicaoObra({ exposicao: exposicao.value.id, ...formularioObraNaExposicao.value })
    await loadObrasExposicao()
    showAddObra.value = false
    formularioObraNaExposicao.value = criarFormularioVazioObraNaExposicao()
    toast.success('Obra adicionada!')
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    actionLoading.value = false
  }
}

async function removerObra(row) {
  try {
    await confirmDialog(`Remover "${row.titulo}"?`, 'Confirmar')
    await deleteExposicaoObra(row.link_id)
    await loadObrasExposicao()
    toast.success('Obra removida.')
  } catch (e) {
    if (e !== 'cancel') toast.error(apiError(e))
  }
}

async function comprar() {
  actionLoading.value = true
  try {
    const ingressosCriados = await comprarIngressos(
      auth.user.id,
      exposicao.value.id,
      quantidadeIngressosCompra.value,
      tipoIngressoSelecionado.value,
    )
    toast.success(`${ingressosCriados.length} ingresso(s) comprado(s)!`)
    showIngresso.value = false
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    actionLoading.value = false
  }
}

async function reservar() {
  actionLoading.value = true
  try {
    await criarReserva(auth.user.id, exposicao.value.id, quantidadePessoasReserva.value, dataReservaSelecionada.value)
    toast.success('Reserva confirmada!')
    showReserva.value = false
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    actionLoading.value = false
  }
}

async function avaliar() {
  actionLoading.value = true
  try {
    await criarAvaliacao(auth.user.id, exposicao.value.id, notaAvaliacao.value, comentarioAvaliacao.value)
    toast.success('Avaliação enviada!')
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    actionLoading.value = false
  }
}
</script>
