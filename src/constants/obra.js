/** Valores iniciais do modal "Nova obra" */
export function criarFormularioVazioNovaObra() {
  return {
    titulo: '',
    tecnica: '',
    ano_criacao: new Date().getFullYear(),
    valor_estimado: 0,
    categoria: null,
  }
}

/** Valores iniciais do modal rápido "Nova categoria" (dentro de Obras) */
export function criarFormularioVazioNovaCategoria() {
  return { nome: '', descricao: '' }
}

/** Valores iniciais do certificado de autenticidade */
export function criarFormularioVazioCertificado() {
  return { codigo: '', data_emissao: '', orgao_responsavel: '' }
}

/** Valores iniciais ao vincular artista à obra */
export function criarFormularioVazioVinculoArtistaObra() {
  return { artista: null, funcao: 'Autor', data_participacao: '' }
}

/** Valores iniciais do registro de restauração */
export function criarFormularioVazioRestauracao() {
  return { data_inicio: '', descricao: '', custo: 0 }
}
