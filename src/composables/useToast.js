/** Toast Bootstrap — aria-live para leitores de tela (Web Interface Guidelines) */

/** Tempo em ms até o toast sumir automaticamente */
const DURACAO_EXIBICAO_TOAST_MS = 3500

/** ID do container fixo no canto superior direito */
const ID_CONTAINER_TOAST = 'toast-container'

/** ID do modal reutilizado para confirmações */
const ID_MODAL_CONFIRMACAO = 'confirm-modal'

export function useToast() {
  function show(message, variant = 'primary', live = 'polite') {
    const container = document.getElementById(ID_CONTAINER_TOAST) || createContainer()
    const id = `toast-${Date.now()}`
    const html = `
      <div id="${id}" class="toast align-items-center text-bg-${variant} border-0" role="${variant === 'danger' ? 'alert' : 'status'}" aria-live="${live}" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">${escapeHtml(message)}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar notificação"></button>
        </div>
      </div>`
    container.insertAdjacentHTML('beforeend', html)
    const el = document.getElementById(id)
    const toast = window.bootstrap.Toast.getOrCreateInstance(el, { delay: DURACAO_EXIBICAO_TOAST_MS })
    toast.show()
    el.addEventListener('hidden.bs.toast', () => el.remove())
  }

  return {
    success: (msg) => show(msg, 'success', 'polite'),
    error: (msg) => show(msg, 'danger', 'assertive'),
    warning: (msg) => show(msg, 'warning', 'polite'),
    info: (msg) => show(msg, 'info', 'polite'),
  }
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function createContainer() {
  const div = document.createElement('div')
  div.id = ID_CONTAINER_TOAST
  div.className = 'toast-container position-fixed top-0 end-0 p-3'
  div.setAttribute('aria-label', 'Notificações')
  document.body.appendChild(div)
  return div
}

/** Confirmação acessível — Bootstrap Modal com foco preso e Escape */
export function confirmDialog(message, title = 'Confirmar') {
  return new Promise((resolve, reject) => {
    const id = ID_MODAL_CONFIRMACAO
    let modalEl = document.getElementById(id)
    if (!modalEl) {
      document.body.insertAdjacentHTML(
        'beforeend',
        `<div class="modal fade" id="${id}" tabindex="-1" aria-labelledby="${id}-title" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header"><h5 class="modal-title" id="${id}-title"></h5></div>
              <div class="modal-body" id="${id}-body"></div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-action="cancel">Cancelar</button>
                <button type="button" class="btn btn-danger" data-action="ok">Confirmar</button>
              </div>
            </div>
          </div>
        </div>`,
      )
      modalEl = document.getElementById(id)
    }
    modalEl.querySelector('.modal-title').textContent = title
    modalEl.querySelector('.modal-body').textContent = message
    const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl)

    const onOk = () => { cleanup(); resolve(true) }
    const onCancel = () => { cleanup(); reject('cancel') }
    const onHidden = () => cleanup()

    function cleanup() {
      modalEl.querySelector('[data-action="ok"]').removeEventListener('click', onOk)
      modalEl.querySelector('[data-action="cancel"]').removeEventListener('click', onCancel)
      modalEl.removeEventListener('hidden.bs.modal', onHidden)
    }

    modalEl.querySelector('[data-action="ok"]').addEventListener('click', onOk)
    modalEl.querySelector('[data-action="cancel"]').addEventListener('click', onCancel)
    modalEl.addEventListener('hidden.bs.modal', onHidden, { once: true })
    modal.show()
  })
}
