import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createBootstrap } from 'bootstrap-vue-next'
import { MotionPlugin } from '@vueuse/motion'
import * as bootstrap from 'bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'lenis/dist/lenis.css'

import App from './App.vue'
import router from './router'
import './assets/main.css'

window.bootstrap = bootstrap

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(createBootstrap())
app.use(MotionPlugin)
app.mount('#app')
