# Museu Galeria — Frontend Vue.js

Frontend web em **Vue 3 + Vite** conectado à API Django.

## Bibliotecas

| Lib | Uso |
|-----|-----|
| **Vue 3** | Framework |
| **Vite** | Build e dev server |
| **Vue Router** | Navegação + transições entre páginas |
| **Pinia** | Estado (login/sessão) |
| **Axios** | Chamadas HTTP à API |
| **Element Plus** | UI (tabelas, forms, cards, tags) |
| **@vueuse/motion** | Animações de entrada (fade + slide) |
| **@vueuse/core** | `prefers-reduced-motion` (acessibilidade) |
| **Lenis** | Scroll suave no layout autenticado |
| **lucide-vue-next** | Ícones SVG leves (nav, headers, listas) |

## Animações

- **Transição de rota** — fade + slide ao trocar de página (`AppLayout`)
- **MotionReveal** — componente reutilizável com stagger nas listas
- **Lenis** — scroll fluido (desativado se o usuário preferir menos movimento)
- **Login** — blobs animados no fundo + cards com entrada suave
- **Tipografia** — DM Sans + Instrument Serif (Google Fonts)

## Telas

- Login (visitante / funcionário / artista)
- Início (dashboard)
- Galerias + detalhe
- Obras + detalhe + certificado
- Exposições + detalhe (comprar ingresso, reservar, avaliar)
- Perfil

## Como rodar

### 1. Backend (raiz do projeto)

```bash
source .venv/bin/activate
python manage.py runserver 0.0.0.0:8001
```

### 2. Frontend Vue

```bash
cd frontend-vue
npm install
npm run dev
```

Abra: **http://localhost:5173**

> O Vite faz **proxy** de `/api` → `http://127.0.0.1:8001` (sem problema de CORS no dev).

## Usuários demo

| Login | Senha | Perfil |
|-------|-------|--------|
| `nathan.visitante` | `demo123` | Visitante |
| `nathan.funcionario` | `demo123` | Funcionário |
| `nathan.artista` | `demo123` | Artista |

Rode `python manage.py seed_demo` se os usuários não existirem.

## Estrutura

```
frontend-vue/
├── src/
│   ├── api/              # Axios + serviços
│   ├── composables/      # useLenis (scroll suave)
│   ├── components/       # PageHeader, MotionReveal, DetailBanner
│   ├── stores/           # Pinia (auth)
│   ├── router/           # Rotas
│   ├── layouts/          # Layout com menu animado
│   └── views/            # Telas
├── vite.config.js        # Proxy para Django
└── package.json
```
