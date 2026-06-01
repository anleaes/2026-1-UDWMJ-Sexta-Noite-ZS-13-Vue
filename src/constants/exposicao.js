/** Texto amigável para cada status de exposição (lista e detalhe) */
export const ROTULOS_STATUS_EXPOSICAO = {
  planejada: 'Planejada',
  em_andamento: 'Em andamento',
  encerrada: 'Encerrada',
}

/** Botões de filtro na tela de listagem de exposições */
export const OPCOES_FILTRO_STATUS_EXPOSICAO = [
  { val: '', label: 'Todas' },
  { val: 'planejada', label: 'Planejada' },
  { val: 'em_andamento', label: 'Em andamento' },
  { val: 'encerrada', label: 'Encerrada' },
]

/** Valores iniciais ao abrir o modal "Nova exposição" */
export function criarFormularioVazioNovaExposicao() {
  return {
    titulo: '',
    descricao: '',
    data_inicio: '',
    data_fim: '',
    status: 'planejada',
    galeria: null,
  }
}

/** Valores iniciais ao vincular uma obra à exposição */
export function criarFormularioVazioObraNaExposicao() {
  return {
    obra: null,
    data_entrada: '',
    posicao_sala: '',
    status_conservacao: 'Ótimo',
    iluminacao_especial: '',
    estilo_obra: '',
  }
}

export function obterRotuloStatusExposicao(status) {
  return ROTULOS_STATUS_EXPOSICAO[status] || status
}

export function obterClasseBadgeStatusExposicao(status) {
  if (status === 'em_andamento') return 'text-bg-success'
  if (status === 'encerrada') return 'text-bg-secondary'
  return 'text-bg-warning'
}
