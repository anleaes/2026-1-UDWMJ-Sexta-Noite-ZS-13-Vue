/** Itens do menu principal — função recebe se o usuário é staff (funcionário/admin) */
export function obterLinksMenuPrincipal(usuarioPodeAcessarStaff) {
  const links = [
    { name: 'home', label: 'Início', icon: 'Home' },
    { name: 'galerias', label: 'Galerias', icon: 'Building2' },
    { name: 'obras', label: 'Obras', icon: 'Palette' },
    { name: 'exposicoes', label: 'Exposições', icon: 'Calendar' },
  ]
  if (usuarioPodeAcessarStaff) {
    links.push({ name: 'categorias', label: 'Categorias', icon: 'Folder' })
  }
  links.push({ name: 'perfil', label: 'Perfil', icon: 'User' })
  return links
}
