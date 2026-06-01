/** Identificadores das abas da tela de perfil (sincronizados com ?tab= na URL) */
export const ID_ABA_DADOS = 'dados'
export const ID_ABA_SENHA = 'senha'
export const ID_ABA_ATIVIDADES = 'atividades'
export const ID_ABA_EXCLUIR_CONTA = 'excluir'

/** Abas comuns a todos os papéis */
export const ABAS_PERFIL_COMUNS = [
  { id: ID_ABA_DADOS, label: 'Dados' },
  { id: ID_ABA_SENHA, label: 'Senha' },
  { id: ID_ABA_ATIVIDADES, label: 'Atividades' },
]

/** Aba extra só para visitante (LGPD — excluir conta) */
export const ABA_EXCLUIR_CONTA_VISITANTE = { id: ID_ABA_EXCLUIR_CONTA, label: 'Excluir conta' }
