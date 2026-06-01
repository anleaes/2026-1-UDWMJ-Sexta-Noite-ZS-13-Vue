import { defineStore } from 'pinia'
import {
  deleteAccount as apiDeleteAccount,
  fetchAccount,
  loginUser,
  registerUser,
  updateAccount,
} from '@/api/services'
import { CHAVE_LOCAL_STORAGE_USUARIO, ROTULOS_PAPEL_USUARIO } from '@/constants/papeis'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem(CHAVE_LOCAL_STORAGE_USUARIO) || 'null'),
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    fullName: (state) =>
      state.user ? `${state.user.first_name} ${state.user.last_name}`.trim() : '',
    roleLabel: (state) =>
      state.user ? ROTULOS_PAPEL_USUARIO[state.user.role] || state.user.role : '',
    isVisitante: (state) => state.user?.role === 'visitante',
    isFuncionario: (state) => state.user?.role === 'funcionario',
    isArtista: (state) => state.user?.role === 'artista',
    isAdmin: (state) => state.user?.role === 'admin',
    /** Funcionário ou admin — alinhado ao RN canStaff */
    canStaff: (state) =>
      state.user?.role === 'funcionario' || state.user?.role === 'admin',
    canManage: (state) =>
      state.user?.role === 'funcionario' || state.user?.role === 'admin',
    canRestauracao: (state) =>
      state.user?.role === 'funcionario' || state.user?.role === 'admin',
  },
  actions: {
    _persist(user) {
      this.user = user
      localStorage.setItem(CHAVE_LOCAL_STORAGE_USUARIO, JSON.stringify(user))
    },
    async login(username, password) {
      const user = await loginUser(username, password)
      this._persist(user)
    },
    async register(payload) {
      const user = await registerUser(payload)
      this._persist(user)
    },
    async refreshAccount() {
      if (!this.user?.id) return
      const user = await fetchAccount(this.user.id)
      this._persist(user)
    },
    async saveAccount(payload) {
      const user = await updateAccount(this.user.id, payload)
      this._persist(user)
      return user
    },
    async removeAccount() {
      await apiDeleteAccount(this.user.id)
      this.logout()
    },
    logout() {
      this.user = null
      localStorage.removeItem(CHAVE_LOCAL_STORAGE_USUARIO)
    },
  },
})
