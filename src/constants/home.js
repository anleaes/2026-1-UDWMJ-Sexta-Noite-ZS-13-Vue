/** Cards de contagem na tela inicial (valores numéricos são preenchidos pela API) */
export function criarConfiguracaoCardsDashboard() {
  return [
    { label: 'Galerias', value: 0, route: { name: 'galerias' }, icon: 'Building2', color: 'stat-green' },
    { label: 'Obras', value: 0, route: { name: 'obras' }, icon: 'Palette', color: 'stat-amber' },
    { label: 'Exposições', value: 0, route: { name: 'exposicoes' }, icon: 'Calendar', color: 'stat-purple' },
  ]
}
