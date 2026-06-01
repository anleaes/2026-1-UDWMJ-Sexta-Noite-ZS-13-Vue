/** Botões de filtro "Todas / Abertas / Fechadas" na listagem de galerias */
export const OPCOES_FILTRO_GALERIA_ABERTA = [
  { val: '', label: 'Todas' },
  { val: 'true', label: 'Abertas' },
  { val: 'false', label: 'Fechadas' },
]

/** Valores iniciais do modal "Nova galeria" */
export function criarFormularioVazioNovaGaleria() {
  return { nome: '', endereco: '', descricao: '', aberta: true }
}
