import api, { unwrap } from './client'
import {
  PRECOS_INGRESSO_POR_TIPO,
  QUANTIDADE_MAXIMA_INGRESSOS,
  QUANTIDADE_MINIMA_INGRESSOS,
  TIPO_INGRESSO_PADRAO,
} from '@/constants/ingresso'

export function apiError(e) {
  const data = e.response?.data
  if (!data) return e.message || 'Erro desconhecido'
  if (typeof data.detail === 'string') return data.detail
  if (typeof data === 'object') {
    return Object.entries(data)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
      .join(' · ')
  }
  return 'Erro na requisicao'
}

// —— Auth / Account (Usuario: cadastrar, atualizar, excluir) ——
export async function loginUser(username, password) {
  const { data } = await api.post('/auth/login/', { username, password })
  return data
}

export const registerUser = (payload) =>
  api.post('/auth/register/', payload).then((r) => r.data)

export const fetchAccount = (id) =>
  api.get(`/auth/account/${id}/`).then((r) => r.data)

export const updateAccount = (id, payload) =>
  api.patch(`/auth/account/${id}/`, payload).then((r) => r.data)

export const changePassword = (id, payload) =>
  api.post(`/auth/account/${id}/change-password/`, payload).then((r) => r.data)

export const deleteAccount = (id) => api.delete(`/auth/account/${id}/`)

// —— Dashboard ——
export const fetchDashboard = async () => {
  const [galerias, obras, exposicoes] = await Promise.all([
    api.get('/galerias/'),
    api.get('/obras/'),
    api.get('/exposicoes/'),
  ])
  return {
    galerias: galerias.data.count,
    obras: obras.data.count,
    exposicoes: exposicoes.data.count,
  }
}

export const fetchDashboardCounts = fetchDashboard

// —— Galeria ——
export const fetchGalerias = (params) =>
  api.get('/galerias/', { params }).then((r) => unwrap(r.data))
export const fetchGaleria = (id) => api.get(`/galerias/${id}/`).then((r) => r.data)
export const createGaleria = (payload) =>
  api.post('/galerias/', payload).then((r) => r.data)
export const updateGaleria = (id, payload) =>
  api.patch(`/galerias/${id}/`, payload).then((r) => r.data)
export const deleteGaleria = (id) => api.delete(`/galerias/${id}/`)

// —— CategoriaObra ——
export const fetchCategorias = (params) =>
  api.get('/categorias-obra/', { params }).then((r) => unwrap(r.data))
export const fetchCategoria = (id) =>
  api.get(`/categorias-obra/${id}/`).then((r) => r.data)
export const createCategoria = (payload) =>
  api.post('/categorias-obra/', payload).then((r) => r.data)
export const updateCategoria = (id, payload) =>
  api.patch(`/categorias-obra/${id}/`, payload).then((r) => r.data)
export const deleteCategoria = (id) => api.delete(`/categorias-obra/${id}/`)

// —— ObraArte ——
export const fetchObras = (params) =>
  api.get('/obras/', { params }).then((r) => unwrap(r.data))
export const fetchObra = (id) => api.get(`/obras/${id}/`).then((r) => r.data)
export const createObra = (payload) => api.post('/obras/', payload).then((r) => r.data)
export const updateObra = (id, payload) =>
  api.patch(`/obras/${id}/`, payload).then((r) => r.data)
export const deleteObra = (id) => api.delete(`/obras/${id}/`)

// —— CertificadoAutenticidade ——
export const fetchCertificados = (obraId) =>
  api.get('/certificados/', { params: { obra: obraId } }).then((r) => unwrap(r.data))
export const createCertificado = (payload) =>
  api.post('/certificados/', payload).then((r) => r.data)
export const updateCertificado = (id, payload) =>
  api.patch(`/certificados/${id}/`, payload).then((r) => r.data)
export const deleteCertificado = (id) => api.delete(`/certificados/${id}/`)

// —— Artista ——
export const fetchArtistas = (params) =>
  api.get('/artistas/', { params }).then((r) => unwrap(r.data))

// —— ArtistaObra (N:N Artista–Obra) ——
export const fetchArtistaObras = (params) =>
  api.get('/artista-obras/', { params }).then((r) => unwrap(r.data))
export const fetchArtista = (id) => api.get(`/artistas/${id}/`).then((r) => r.data)
export const createArtistaObra = (payload) =>
  api.post('/artista-obras/', payload).then((r) => r.data)
export const deleteArtistaObra = (id) => api.delete(`/artista-obras/${id}/`)

// —— Exposicao ——
export const fetchExposicoes = (params) =>
  api.get('/exposicoes/', { params }).then((r) => unwrap(r.data))
export const fetchExposicao = (id) => api.get(`/exposicoes/${id}/`).then((r) => r.data)
export const createExposicao = (payload) =>
  api.post('/exposicoes/', payload).then((r) => r.data)
export const updateExposicao = (id, payload) =>
  api.patch(`/exposicoes/${id}/`, payload).then((r) => r.data)
export const deleteExposicao = (id) => api.delete(`/exposicoes/${id}/`)

// —— ExposicaoObra (associativa) ——
export const fetchExposicaoObras = (exposicaoId) =>
  api.get('/exposicao-obras/', { params: { exposicao: exposicaoId } }).then((r) => unwrap(r.data))
export const createExposicaoObra = (payload) =>
  api.post('/exposicao-obras/', payload).then((r) => r.data)
export const deleteExposicaoObra = (id) => api.delete(`/exposicao-obras/${id}/`)

// —— Visitante: Ingresso, Reserva, Avaliacao ——
export const fetchIngressos = (visitanteId) =>
  api.get('/ingressos/', { params: { visitante: visitanteId } }).then((r) => unwrap(r.data))
export const fetchReservas = (visitanteId) =>
  api.get('/reservas/', { params: { visitante: visitanteId } }).then((r) => unwrap(r.data))
export const fetchAvaliacoes = (visitanteId) =>
  api.get('/avaliacoes/', { params: { visitante: visitanteId } }).then((r) => unwrap(r.data))

export const comprarIngresso = (visitanteId, exposicaoId, tipo = TIPO_INGRESSO_PADRAO) =>
  api.post('/ingressos/', {
    visitante: visitanteId,
    exposicao: exposicaoId,
    tipo,
    valor: PRECOS_INGRESSO_POR_TIPO[tipo].toFixed(2),
    status: 'ativo',
  })

/** Backend: 1 registro Ingresso = 1 bilhete (sem campo quantidade). Compra N ingressos = N POSTs. */
export async function comprarIngressos(visitanteId, exposicaoId, quantidade, tipo = TIPO_INGRESSO_PADRAO) {
  const quantidadeNormalizada = Math.max(
    QUANTIDADE_MINIMA_INGRESSOS,
    Math.min(QUANTIDADE_MAXIMA_INGRESSOS, Number(quantidade) || QUANTIDADE_MINIMA_INGRESSOS),
  )
  const ingressosCriados = []
  for (let indice = 0; indice < quantidadeNormalizada; indice += 1) {
    const { data } = await comprarIngresso(visitanteId, exposicaoId, tipo)
    ingressosCriados.push(data)
  }
  return ingressosCriados
}

/** Alias legível — preferir import de @/constants/ingresso */
export { PRECOS_INGRESSO_POR_TIPO as INGRESSO_PRECOS }

export const criarReserva = (visitanteId, exposicaoId, quantidade, dataReserva) =>
  api.post('/reservas/', {
    visitante: visitanteId,
    exposicao: exposicaoId,
    quantidade_pessoas: quantidade,
    data_reserva: dataReserva,
    status: 'confirmada',
  })

export const criarAvaliacao = (visitanteId, exposicaoId, nota, comentario) =>
  api.post('/avaliacoes/', {
    visitante: visitanteId,
    exposicao: exposicaoId,
    nota,
    comentario,
  })

// —— Pagamento ——
export const fetchPagamentos = (params) =>
  api.get('/pagamentos/', { params }).then((r) => unwrap(r.data))

// —— Funcionario: Restauracao ——
export const fetchRestauracoes = (params) =>
  api.get('/restauracoes/', { params }).then((r) => unwrap(r.data))

export const fetchRestauracoesFuncionario = (funcionarioId) =>
  fetchRestauracoes({ funcionario: funcionarioId })

export const fetchRestauracoesAll = () => fetchRestauracoes()

export const createRestauracao = (payload) =>
  api.post('/restauracoes/', payload).then((r) => r.data)

export const deleteRestauracao = (id) => api.delete(`/restauracoes/${id}/`)

export const updateRestauracao = (id, payload) =>
  api.patch(`/restauracoes/${id}/`, payload).then((r) => r.data)

export const finalizarRestauracao = (id, dataFim) =>
  updateRestauracao(id, { data_fim: dataFim || new Date().toISOString().slice(0, 10) })

// —— Pagamento (paridade RN) ——
export const createPagamento = (payload) =>
  api.post('/pagamentos/', payload).then((r) => r.data)

export const updatePagamento = (id, payload) =>
  api.patch(`/pagamentos/${id}/`, payload).then((r) => r.data)

export const estornarPagamento = (id) => updatePagamento(id, { status: 'estornado' })

export const updateIngresso = (id, payload) =>
  api.patch(`/ingressos/${id}/`, payload).then((r) => r.data)

export const cancelarIngresso = (id) => updateIngresso(id, { status: 'cancelado' })

export const updateReserva = (id, payload) =>
  api.patch(`/reservas/${id}/`, payload).then((r) => r.data)

export const cancelarReserva = (id) => updateReserva(id, { status: 'cancelada' })

export const updateAvaliacao = (id, payload) =>
  api.patch(`/avaliacoes/${id}/`, payload).then((r) => r.data)

export const deleteAvaliacao = (id) => api.delete(`/avaliacoes/${id}/`)

// —— Funcionários / Artistas (admin — paridade RN) ——
export const fetchFuncionarios = () =>
  api.get('/funcionarios/').then((r) => unwrap(r.data))

export const createFuncionario = (payload) =>
  api.post('/funcionarios/', payload).then((r) => r.data)

export const updateFuncionario = (id, payload) =>
  api.patch(`/funcionarios/${id}/`, payload).then((r) => r.data)

export const deleteFuncionario = (id) => api.delete(`/funcionarios/${id}/`)

export const fetchArtistasAdmin = () =>
  api.get('/artistas/').then((r) => unwrap(r.data))

export const createArtistaAdmin = (payload) =>
  api.post('/artistas/', payload).then((r) => r.data)

export const updateArtistaAdmin = (id, payload) =>
  api.patch(`/artistas/${id}/`, payload).then((r) => r.data)

export const deleteArtistaAdmin = (id) => api.delete(`/artistas/${id}/`)

export async function buildFuncionarioRelatorio(user, counts, restauracoes) {
  const custoTotal = restauracoes.reduce((sum, r) => sum + Number(r.custo || 0), 0)
  return {
    funcionario: `${user.first_name} ${user.last_name}`.trim() || user.username,
    cargo: user.cargo ?? '—',
    galeria: user.galeria_nome ?? '—',
    acervo: counts,
    restauracoes: restauracoes.length,
    custoRestauracoes: custoTotal.toFixed(2),
    geradoEm: new Date().toLocaleString('pt-BR'),
  }
}
