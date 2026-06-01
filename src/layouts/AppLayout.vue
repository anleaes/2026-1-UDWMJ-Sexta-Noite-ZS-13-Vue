<template>
  <el-container class="layout">
    <el-header height="auto" class="header">
      <MotionReveal :y="12" :duration="400" class="header-motion">
        <div class="header-inner">
          <div class="brand" @click="$router.push({ name: 'home' })">
            <span class="brand-icon"><ImageIcon :size="26" stroke-width="1.75" /></span>
            <div>
              <span class="brand-name">Museu & Galeria</span>
              <span class="brand-sub">SDM · Projeto A3</span>
            </div>
          </div>

          <nav class="nav">
            <router-link
              v-for="(link, i) in links"
              :key="link.to.name"
              :to="link.to"
              class="nav-link"
              :style="{ '--nav-delay': `${i * 40}ms` }"
            >
              <component :is="link.icon" :size="16" stroke-width="2" class="nav-icon" />
              {{ link.label }}
            </router-link>
          </nav>

          <div class="header-user">
            <el-tag v-if="auth.canManage" size="small" type="warning" effect="plain">{{ auth.roleLabel }}</el-tag>
            <span class="user-name">{{ auth.user?.first_name }}</span>
            <el-button size="small" @click="logout">
              <LogOut :size="14" stroke-width="2" style="margin-right: 4px" />
              Sair
            </el-button>
          </div>
        </div>
      </MotionReveal>
    </el-header>

    <el-main class="layout-main">
      <div class="page">
        <router-view v-slot="{ Component, route }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </div>
    </el-main>

    <footer class="footer">
      Sistema de Gerenciamento de Museus e Galerias — trabalho acadêmico SDM 2026
    </footer>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  Home,
  Building2,
  Palette,
  Calendar,
  User,
  LogOut,
  Image as ImageIcon,
} from 'lucide-vue-next'
import MotionReveal from '@/components/MotionReveal.vue'
import { useLenis } from '@/composables/useLenis'
import { useAuthStore } from '@/stores/auth'

useLenis()

const router = useRouter()
const auth = useAuthStore()

const links = [
  { to: { name: 'home' }, label: 'Início', icon: Home },
  { to: { name: 'galerias' }, label: 'Galerias', icon: Building2 },
  { to: { name: 'obras' }, label: 'Obras', icon: Palette },
  { to: { name: 'exposicoes' }, label: 'Exposições', icon: Calendar },
  { to: { name: 'perfil' }, label: 'Perfil', icon: User },
]

function logout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background: var(--bg);
  flex-direction: column;
}

.header-motion {
  width: 100%;
}

.header {
  background: #fff;
  border-bottom: 1px solid var(--border);
  padding: 0;
  height: auto !important;
}

.header-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 0.85rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  user-select: none;
  transition: opacity 0.2s;
}

.brand:hover {
  opacity: 0.85;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--primary-light);
  color: var(--primary);
}

.brand-name {
  display: block;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.15rem;
  color: var(--text);
  line-height: 1.2;
}

.brand-sub {
  display: block;
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 400;
}

.nav {
  display: flex;
  gap: 0.25rem;
  flex: 1;
  flex-wrap: wrap;
}

.nav-link {
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: background 0.2s var(--ease-out), color 0.2s var(--ease-out), transform 0.2s var(--ease-out);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  animation: nav-in 0.45s var(--ease-out) both;
  animation-delay: var(--nav-delay, 0ms);
}

@keyframes nav-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
}

.nav-icon {
  flex-shrink: 0;
}

.nav-link:hover {
  background: #f3f4f6;
  color: var(--text);
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 600;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-name {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.footer {
  text-align: center;
  padding: 1rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  border-top: 1px solid var(--border);
  background: #fff;
}

@media (max-width: 640px) {
  .header-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .nav {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-link {
    animation: none;
  }
}
</style>
