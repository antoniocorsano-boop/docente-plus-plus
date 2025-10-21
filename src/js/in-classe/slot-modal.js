(function(window){
  // Fullscreen accessible modal for slot details / Entra in classe
  // Usage: SlotModal.open({entry, onConfirm: (overrides)=>{ ... }})
  const KEY_ESCAPE = 27;
  const focusableSelector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]';

  function createModalDOM(){
    const wrapper = document.createElement('div');
    wrapper.className = 'slot-modal-overlay';
    wrapper.setAttribute('role','dialog');
    wrapper.setAttribute('aria-modal','true');
    wrapper.setAttribute('aria-hidden','true');
    wrapper.innerHTML = `
      <div class="slot-modal" role="document" aria-labelledby="slot-modal-title">
        <header class="slot-modal-header">
          <h2 id="slot-modal-title">Dettagli lezione</h2>
          <button class="slot-modal-close" aria-label="Chiudi">&times;</button>
        </header>
        <section class="slot-modal-body">
          <div class="slot-info">
            <div><strong>Classe:</strong> <span data-field="classId"></span></div>
            <div><strong>Materia:</strong> <span data-field="subjectLabel"></span></div>
            <div><strong>Aula:</strong> <span data-field="room"></span></div>
            <div><strong>Tipo pianificato:</strong> <span data-field="activityType"></span></div>
          </div>
          <form class="slot-modal-form" novalidate>
            <label for="override-activityType">Tipo attività (modifica per questa istanza)</label>
            <select id="override-activityType" name="activityType">
              <option value="">(mantieni)</option>
              <option value="T">T - Teoria</option>
              <option value="P">P - Pratica</option>
            </select>
            <label for="override-note">Note (solo istanza)</label>
            <textarea id="override-note" name="note" rows="3" placeholder="Note per questa lezione..."></textarea>
          </form>
        </section>
        <footer class="slot-modal-footer">
          <button class="btn btn-secondary slot-cancel">Annulla</button>
          <button class="btn btn-primary slot-confirm">Entra in classe</button>
        </footer>
      </div>
    `;
    document.body.appendChild(wrapper);
    return wrapper;
  }

  function trapFocus(modalEl){
    const focusable = Array.from(modalEl.querySelectorAll(focusableSelector));
    if (!focusable.length) return () => {};
    const first = focusable[0];
    const last = focusable[focusable.length -1];
    function onKey(e){
      if (e.keyCode === 9){ // Tab
        if (e.shiftKey && document.activeElement === first){
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last){
          e.preventDefault();
          first.focus();
        }
      }
    }
    modalEl.addEventListener('keydown', onKey);
    return () => modalEl.removeEventListener('keydown', onKey);
  }

  const SlotModal = {
    _el: null,
    _onClose: null,
    open(opts = {}){
      if (!this._el) this._el = createModalDOM();
      const overlay = this._el;
      overlay.setAttribute('aria-hidden','false');
      const modal = overlay.querySelector('.slot-modal');
      // populate fields
      const entry = opts.entry || {};
      overlay.querySelector('[data-field="classId"]').textContent = entry.classId || entry.className || '—';
      overlay.querySelector('[data-field="subjectLabel"]').textContent = entry.subjectLabel || entry.subjectCode || '—';
      overlay.querySelector('[data-field="room"]').textContent = entry.room || '—';
      overlay.querySelector('[data-field="activityType"]').textContent = entry.activityType || '—';
      // reset form
      overlay.querySelector('#override-activityType').value = '';
      overlay.querySelector('#override-note').value = '';

      // show overlay
      overlay.classList.add('open');
      // focus management
      const previouslyFocused = document.activeElement;
      const confirmBtn = overlay.querySelector('.slot-confirm');
      confirmBtn.focus();
      const removeTrap = trapFocus(modal);

      function close(returned){
        removeTrap();
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden','true');
        if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
        if (SlotModal._onClose) SlotModal._onClose(returned);
      }

      // handlers
      const closeBtn = overlay.querySelector('.slot-modal-close');
      const cancelBtn = overlay.querySelector('.slot-cancel');
      const confirm = overlay.querySelector('.slot-confirm');

      const onEscape = (e) => { if (e.keyCode === KEY_ESCAPE) close({ canceled: true }); };

      closeBtn.onclick = () => close({ canceled: true });
      cancelBtn.onclick = () => close({ canceled: true });
      confirm.onclick = async () => {
        // gather overrides
        const act = overlay.querySelector('#override-activityType').value || null;
        const note = overlay.querySelector('#override-note').value || '';
        const overrides = {};
        if (act) overrides.activityType = act;
        if (note) overrides.note = note;
        close({ canceled: false, overrides });
      };

      document.addEventListener('keydown', onEscape);
      this._onClose = (ret) => {
        document.removeEventListener('keydown', onEscape);
        closeBtn.onclick = cancelBtn.onclick = confirm.onclick = null;
        if (opts.onClose) opts.onClose(ret);
      };
    }
  };

  window.SlotModal = SlotModal;
})(window);