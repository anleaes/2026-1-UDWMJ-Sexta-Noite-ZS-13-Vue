<template>
  <div class="d-flex flex-column min-vh-100">
    <a href="#main-content" class="skip-link">Pular para o conteúdo</a>

    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top shadow-sm" aria-label="Navegação principal">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center gap-2" :to="{ name: 'home' }">
          <span class="brand-icon rounded-3 d-flex align-items-center justify-content-center text-white bg-primary" aria-hidden="true">
            <AppIcon name="Image" :size="18" decorative />
          </span>
          <span translate="no">Museu & Galeria</span>
        </router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          :aria-expanded="menuMobileAberto"
          aria-label="Abrir menu de navegação"
          @click="menuMobileAberto = !menuMobileAberto"
        >
          <span class="navbar-toggler-icon" />
        </button>

        <div id="mainNav" class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-1">
            <li v-for="link in linksMenuPrincipal" :key="link.name" class="nav-item">
              <router-link
                :to="{ name: link.name }"
                class="nav-link rounded-pill px-3 d-inline-flex align-items-center gap-1"
                active-class="active fw-semibold bg-primary text-white"
              >
                <AppIcon :name="link.icon" :size="18" decorative />
                {{ link.label }}
              </router-link>
            </li>
          </ul>

          <div class="d-flex align-items-center gap-2">
            <span v-if="auth.canStaff" class="badge text-bg-warning">{{ auth.roleLabel }}</span>
            <span v-else class="badge text-bg-secondary">{{ auth.roleLabel }}</span>
            <span class="small text-muted d-none d-md-inline">{{ auth.user?.first_name }}</span>
            <button type="button" class="btn btn-outline-secondary btn-sm" aria-label="Sair da conta" @click="logout">
              <AppIcon name="LogOut" :size="18" decorative />
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main id="main-content" class="container py-4 flex-grow-1" tabindex="-1">
      <router-view v-slot="{ Component, route }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>

    <footer class="border-top bg-white py-3 text-center text-muted small">
      Sistema de Gerenciamento de Museus e Galerias — SDM 2026
    </footer>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import { useLenis } from '@/composables/useLenis'
import { useAuthStore } from '@/stores/auth'
import { obterLinksMenuPrincipal } from '@/constants/navegacao'

useLenis()

const router = useRouter()
const auth = useAuthStore()
const menuMobileAberto = ref(false)

/** Links do navbar — inclui Categorias só para funcionário/admin */
const linksMenuPrincipal = computed(() => obterLinksMenuPrincipal(auth.canStaff))

function logout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.brand-icon {
  width: 36px;
  height: 36px;
}

.nav-link.active {
  color: #fff !important;
}
</style>
