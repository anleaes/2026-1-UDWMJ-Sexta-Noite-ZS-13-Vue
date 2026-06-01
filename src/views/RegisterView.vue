<template>
  <div class="py-4">
    <AuthCard title="Criar conta" subtitle="Cadastro público para visitantes">
      <form novalidate @submit.prevent="handleRegister">
        <div class="row g-2">
          <div class="col-md-6">
            <FormInput v-model="form.first_name" label="Nome" name="first_name" autocomplete="given-name" required :error="errors.first_name" inline />
          </div>
          <div class="col-md-6">
            <FormInput v-model="form.last_name" label="Sobrenome" name="last_name" autocomplete="family-name" required :error="errors.last_name" inline />
          </div>
        </div>
        <FormInput v-model="form.username" label="Usuário" name="username" autocomplete="username" :spellcheck="false" required :error="errors.username" />
        <FormInput v-model="form.email" label="E-mail" name="email" type="email" autocomplete="email" inputmode="email" required :error="errors.email" />
        <FormInput v-model="form.cpf" label="CPF" name="cpf" autocomplete="off" inputmode="numeric" :spellcheck="false" maxlength="14" required :error="errors.cpf" />
        <FormInput v-model="form.telefone" label="Telefone" name="telefone" type="tel" autocomplete="tel" inputmode="tel" />
        <div class="row g-2 mb-3">
          <div class="col-md-6">
            <FormInput v-model="form.password" label="Senha" name="password" type="password" autocomplete="new-password" required :error="errors.password" inline />
          </div>
          <div class="col-md-6">
            <FormInput v-model="form.password_confirm" label="Confirmar senha" name="password_confirm" type="password" autocomplete="new-password" required :error="errors.password_confirm" inline />
          </div>
        </div>
        <SubmitButton label="Cadastrar" loading-label="Cadastrando…" :loading="loading" block type="submit" />
      </form>
      <template #footer>
        Já tem conta? <router-link :to="{ name: 'login' }">Entrar</router-link>
      </template>
    </AuthCard>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthCard from '@/components/AuthCard.vue'
import FormInput from '@/components/FormInput.vue'
import SubmitButton from '@/components/SubmitButton.vue'
import { apiError } from '@/api/services'
import { useFieldErrors } from '@/composables/useFieldErrors'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const toast = useToast()
const { errors, clear, set, focusFirstError } = useFieldErrors()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  password_confirm: '',
  email: '',
  first_name: '',
  last_name: '',
  cpf: '',
  telefone: '',
  data_nascimento: null,
})

async function handleRegister() {
  clear()
  if (!form.first_name.trim()) set('first_name', 'Informe o nome.')
  if (!form.last_name.trim()) set('last_name', 'Informe o sobrenome.')
  if (!form.username.trim()) set('username', 'Informe o usuário.')
  if (!form.email.trim()) set('email', 'Informe o e-mail.')
  if (!form.cpf.trim()) set('cpf', 'Informe o CPF.')
  if (!form.password) set('password', 'Informe a senha.')
  if (form.password !== form.password_confirm) set('password_confirm', 'As senhas não coincidem.')
  if (Object.keys(errors).length) {
    focusFirstError()
    return
  }
  loading.value = true
  try {
    const payload = { ...form }
    if (!payload.data_nascimento) delete payload.data_nascimento
    await auth.register(payload)
    toast.success('Conta criada!')
    router.push({ name: 'home' })
  } catch (e) {
    toast.error(apiError(e))
  } finally {
    loading.value = false
  }
}
</script>
