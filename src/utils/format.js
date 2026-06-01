/** Formata valor numérico como moeda brasileira (R$) */
export function formatMoney(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/** Converte data ISO (YYYY-MM-DD) para exibição DD/MM/YYYY */
export function formatDate(data) {
  if (!data) return '—'
  const [ano, mes, dia] = String(data).split('-')
  return dia ? `${dia}/${mes}/${ano}` : data
}

/** Reexporta rótulos e helpers de status de exposição (legado + constants/) */
export {
  ROTULOS_STATUS_EXPOSICAO as EXPOSICAO_STATUS,
  obterRotuloStatusExposicao as exposicaoStatusLabel,
  obterClasseBadgeStatusExposicao as exposicaoBadgeClass,
} from '@/constants/exposicao'
