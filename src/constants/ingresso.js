/** Preço em reais de cada tipo de ingresso (visitante compra na exposição) */
export const PRECOS_INGRESSO_POR_TIPO = {
  inteira: 60,
  meia: 30,
  cortesia: 0,
}

/** Limite de ingressos por compra (regra de negócio da API) */
export const QUANTIDADE_MINIMA_INGRESSOS = 1
export const QUANTIDADE_MAXIMA_INGRESSOS = 20

/** Tipo padrão selecionado no modal de compra */
export const TIPO_INGRESSO_PADRAO = 'inteira'

/** Opções exibidas no select "Tipo de ingresso" (detalhe da exposição) */
export const OPCOES_TIPO_INGRESSO_COM_PRECO = [
  { valor: 'inteira', rotulo: 'Inteira — R$ 60' },
  { valor: 'meia', rotulo: 'Meia — R$ 30' },
  { valor: 'cortesia', rotulo: 'Cortesia — R$ 0' },
]

/** Compatibilidade com imports antigos */
export const INGRESSO_PRECOS = PRECOS_INGRESSO_POR_TIPO
