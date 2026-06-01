/** Tipos de cadastro no painel admin (define campos do modal) */
export const TIPO_CADASTRO_FUNCIONARIO = 'funcionario'
export const TIPO_CADASTRO_ARTISTA = 'artista'

/** Valores iniciais do formulário de funcionário ou artista */
export function criarFormularioVazioCadastroAdmin() {
  return {
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    cpf: '',
    cargo: 'Curador',
    salario: '5000.00',
    galeria: null,
    nacionalidade: 'Brasileira',
    estilo_artistico: 'Contemporâneo',
  }
}
