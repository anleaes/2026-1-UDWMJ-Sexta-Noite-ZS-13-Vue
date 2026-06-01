<template>
  <AppSpinner :show="loading">
    <PageHeader
      theme="home"
      :title="`Olá, ${auth.user?.first_name}!`"
      :subtitle="`Bem-vindo · ${auth.roleLabel}`"
    >
      <template #icon><AppIcon name="Hand" :size="28" decorative /></template>
    </PageHeader>

    <div class="row g-3 mb-4">
      <div v-for="(item, i) in cardsDashboard" :key="item.label" class="col-md-4">
        <MotionReveal :delay="60 + i * 70" :y="16">
          <router-link
            :to="item.route"
            class="card w-100 text-start border-0 h-100 stat-card text-decoration-none"
            :class="item.color"
          >
            <div class="card-body">
              <AppIcon :name="item.icon" :size="28" klass="mb-2" decorative />
              <div class="display-6 font-display mb-0 tabular-nums">{{ item.value }}</div>
              <div class="text-muted small">{{ item.label }}</div>
            </div>
          </router-link>
        </MotionReveal>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-lg-7">
        <div class="card h-100">
          <div class="card-header bg-transparent fw-semibold">
            {{ auth.canStaff ? 'Gestão do acervo' : 'Como usar' }}
          </div>
          <div class="card-body">
            <ol class="text-muted mb-0">
              <template v-if="auth.canStaff">
                <li>Cadastre <router-link :to="{ name: 'galerias' }">galerias</router-link> e exposições</li>
                <li>Registre obras e categorias</li>
                <li>Vincule obras às exposições</li>
              </template>
              <template v-else>
                <li>Explore galerias e obras</li>
                <li>Comprar ingressos como visitante</li>
                <li>Avalie exposições visitadas</li>
              </template>
            </ol>
          </div>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="card h-100">
          <div class="card-header bg-transparent fw-semibold">Atalhos</div>
          <div class="card-body d-flex flex-column gap-2">
            <router-link v-if="auth.isAdmin" :to="{ name: 'admin' }" class="btn btn-outline-primary d-inline-flex align-items-center gap-1">
              <AppIcon name="Shield" :size="18" decorative /> Painel admin
            </router-link>
            <router-link :to="{ name: 'perfil' }" class="btn btn-outline-secondary d-inline-flex align-items-center gap-1">
              <AppIcon name="User" :size="18" decorative /> Minha conta
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </AppSpinner>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import AppSpinner from '@/components/AppSpinner.vue'
import MotionReveal from '@/components/MotionReveal.vue'
import PageHeader from '@/components/PageHeader.vue'
import { fetchDashboard } from '@/api/services'
import { useAuthStore } from '@/stores/auth'
import { criarConfiguracaoCardsDashboard } from '@/constants/home'

const auth = useAuthStore()
const loading = ref(true)
/** Cards do dashboard — valores numéricos vêm da API em onMounted */
const cardsDashboard = ref(criarConfiguracaoCardsDashboard())

onMounted(async () => {
  try {
    const dadosDashboard = await fetchDashboard()
    cardsDashboard.value[0].value = dadosDashboard.galerias
    cardsDashboard.value[1].value = dadosDashboard.obras
    cardsDashboard.value[2].value = dadosDashboard.exposicoes
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.stat-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  color: inherit;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.stat-green { border-left: 4px solid #10b981 !important; }
.stat-amber { border-left: 4px solid #c9a227 !important; }
.stat-purple { border-left: 4px solid #a855f7 !important; }

@media (prefers-reduced-motion: reduce) {
  .stat-card { transition: none; }
  .stat-card:hover { transform: none; }
}
</style>
