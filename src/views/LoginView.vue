<template>
  <div class="login-page min-vh-100 d-flex align-items-center py-4">
    <div class="container">
      <div class="row align-items-center g-4">
        <div class="col-lg-6">
          <MotionReveal :y="20">
            <span class="badge text-bg-primary mb-3">Projeto SDM · A3</span>
            <h1 class="display-5 font-display mb-3">Museu & Galeria</h1>
            <p class="text-muted lead mb-4">Sistema completo para museus e galerias — mesmo fluxo do app mobile.</p>
            <ul class="list-unstyled d-flex flex-column gap-2">
              <li v-for="destaque in LISTA_DESTAQUES_TELA_LOGIN" :key="destaque" class="d-flex align-items-center gap-2 text-muted">
                <AppIcon name="CircleCheck" klass="text-primary flex-shrink-0" decorative /> {{ destaque }}
              </li>
            </ul>
          </MotionReveal>
        </div>
        <div class="col-lg-5 ms-lg-auto">
          <AuthCard title="Entrar" subtitle="Use seu usuário e senha" large-padding :delay="80">
            <form novalidate @submit.prevent="handleLogin">
              <FormInput
                v-model="username"
                label="Usuário"
                name="username"
                autocomplete="username"
                :spellcheck="false"
                required
                size="lg"
                :error="errors.username"
              />
              <FormInput
                v-model="password"
                label="Senha"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                size="lg"
                :error="errors.password"
              />
              <SubmitButton label="Entrar" loading-label="Entrando…" :loading="loading" block size="lg" type="submit" />
            </form>
            <template #footer>
              Não tem conta?
              <router-link :to="{ name: 'register' }">Cadastre-se</router-link>
            </template>
          </AuthCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import AuthCard from '@/components/AuthCard.vue'
import FormInput from '@/components/FormInput.vue'
import MotionReveal from '@/components/MotionReveal.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import { useFieldErrors } from '@/composables/useFieldErrors'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'
import { LISTA_DESTAQUES_TELA_LOGIN } from '@/constants/login'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const toast = useToast()
const { errors, clear, set, focusFirstError } = useFieldErrors()
const username = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
  clear()
  if (!username.value.trim()) set('username', 'Informe o usuário.')
  if (!password.value) set('password', 'Informe a senha.')
  if (Object.keys(errors).length) {
    focusFirstError()
    return
  }
  loading.value = true
  try {
    await auth.login(username.value.trim(), password.value)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    router.push(redirect)
  } catch (e) {
    const status = e.response?.status
    let msg = e.response?.data?.detail || e.message || 'Erro ao entrar. Verifique usuário e senha.'
    if (status === 403) msg = 'Acesso negado. Confira suas permissões.'
    else if (!e.response) msg = 'Backend inacessível. Rode: python manage.py runserver 0.0.0.0:8001'
    set('password', msg)
    focusFirstError()
    toast.error(msg)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.font-display {
  font-family: var(--font-display);
  font-weight: 400;
  text-wrap: balance;
}

.login-page {
  background: linear-gradient(135deg, var(--mg-bg) 0%, #eef2f6 100%);
}

@media (prefers-color-scheme: dark) {
  .login-page {
    background: linear-gradient(135deg, var(--mg-bg) 0%, #0f1419 100%);
  }
}
</style>
