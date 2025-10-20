/* In-Class schedule UI skeleton
   - Renders the daily timeSlots table for the current day (from schedule_config)
   - Manual select of slot (no auto-select by default). Switch to enable auto-select is left to main settings.
   - 'Entra in classe' creates a lesson instance via InClasseDataManager and stores currentLessonInstanceId in localStorage
*/
(function(window){
  async function isoDate(d){ return d.toISOString().split('T')[0]; }

  function createEl(tag, attrs={}, children=[]){
    const el = document.createElement(tag);
    for (const k in attrs){ if (k==='class') el.className = attrs[k]; else if (k==='text') el.textContent = attrs[k]; else el.setAttribute(k, attrs[k]); }
    (Array.isArray(children)?children:[children]).forEach(c=>{ if (!c) return; if (typeof c === 'string') el.appendChild(document.createTextNode(c)); else el.appendChild(c); });
    return el;
  }

  async function renderDayGrid(containerId){
    const container = document.getElementById(containerId);
    if (!container) return;
    const dm = window.inClasseDataManager || (window.inClasseDataManager = new window.InClasseDataManager());
    await dm.init();
    const cfg = await dm.getScheduleConfig();
    const today = new Date();
    const dayName = cfg.days[(today.getDay()-1 + cfg.days.length)%cfg.days.length] || cfg.days[0];
    const timeSlots = cfg.timeSlots || [];

    // header
    container.innerHTML = '';
    const header = createEl('div', {class: 'inclasse-header'});
    header.appendChild(createEl('h2', {text: `In Classe — ${dayName} ${isoDate(today)}`}));
    const infoBar = createEl('div', {class: 'inclasse-infobar'});
    const clock = createEl('span', {id: 'device-time', text: 'Ora: --:--'});
    const autoLabel = createEl('label', {class: 'switch-label', text: 'Auto-select'});
    const autoCheckbox = createEl('input', {type: 'checkbox', id: 'auto-select'});
    autoCheckbox.checked = !!cfg.autoSelectDefault;
    autoCheckbox.addEventListener('change', (e)=>{
      // if enabled, perform auto-select
      if (e.target.checked){ dm.findCurrentSlot(new Date()).then(k=>{ if (k) selectSlot(k); }); }
    });
    infoBar.appendChild(clock); infoBar.appendChild(autoLabel); infoBar.appendChild(autoCheckbox);
    header.appendChild(infoBar);
    container.appendChild(header);

    // table
    const table = createEl('table', {class: 'inclasse-table'});
    const thead = createEl('thead');
    thead.appendChild(createEl('tr', {}, [createEl('th', {text: 'Ora'}), createEl('th', {text:'Classe'}), createEl('th', {text:'Materia'}), createEl('th',{text:'Tipo'}), createEl('th',{text:'Aula'}), createEl('th',{text:'Azioni'})]));
    table.appendChild(thead);
    const tbody = createEl('tbody');

    const entries = await dm.listScheduleEntries(dayName);
    // create a map by time
    const map = {};
    (entries||[]).forEach(e=>{ map[e.time] = map[e.time] || []; map[e.time].push(e); });

    for (const t of timeSlots){
      const row = createEl('tr');
      row.dataset.timeslot = t;
      const tdTime = createEl('td', {text: t});
      row.appendChild(tdTime);
      const cell = createEl('td');
      const subjectCell = createEl('td');
      const typeCell = createEl('td');
      const roomCell = createEl('td');
      const actionsCell = createEl('td');

      const slotEntries = map[t] || [];
      if (slotEntries.length === 0){
        cell.appendChild(createEl('div', {text: '— Vuoto —', class: 'empty-slot'}));
        subjectCell.appendChild(createEl('div', {text: ''}));
        typeCell.appendChild(createEl('div', {text: ''}));
        roomCell.appendChild(createEl('div', {text: ''}));
        const selectBtn = createEl('button', {class: 'btn', text: 'Seleziona'});
        selectBtn.addEventListener('click', ()=> selectSlot(null, t));
        actionsCell.appendChild(selectBtn);
      } else if (slotEntries.length === 1){
        const e = slotEntries[0];
        cell.appendChild(createEl('div', {text: e.classId || e.className}));
        subjectCell.appendChild(createEl('div', {text: e.subjectLabel || e.subjectCode || '—'}));
        typeCell.appendChild(createEl('div', {text: e.activityType || ''}));
        roomCell.appendChild(createEl('div', {text: e.room || ''}));
        const selectBtn = createEl('button', {class: 'btn', text: 'Seleziona'});
        selectBtn.addEventListener('click', ()=> selectSlot(e.lessonKey));
        const detailsBtn = createEl('button', {class: 'btn', text: 'Dettagli'});
        detailsBtn.addEventListener('click', ()=> openDetails(e));
        actionsCell.appendChild(selectBtn); actionsCell.appendChild(detailsBtn);
      } else {
        // multiple entries: show first summary and a small selector
        const list = createEl('div', {class:'multi-list'});
        slotEntries.forEach(it=>{
          const item = createEl('div', {class:'multi-item', text: `${it.classId || ''} — ${it.subjectLabel || it.subjectCode || ''}`});
          item.addEventListener('click', ()=> selectSlot(it.lessonKey));
          list.appendChild(item);
        });
        cell.appendChild(list);
        actionsCell.appendChild(createEl('button',{class:'btn', text:'Seleziona'}));
      }

      row.appendChild(cell);
      row.appendChild(subjectCell);
      row.appendChild(typeCell);
      row.appendChild(roomCell);
      row.appendChild(actionsCell);
      tbody.appendChild(row);
    }

    table.appendChild(tbody);
    container.appendChild(table);

    // global Entra button
    const footer = createEl('div', {class: 'inclasse-footer'});
    const enterBtn = createEl('button', {class:'btn btn-primary', text:'Entra in classe'});
    enterBtn.addEventListener('click', async ()=>{
      const selected = dm.getSelectedSlot();
      if (!selected){
        alert('Seleziona uno slot prima di entrare.');
        return;
      }
      const instance = await dm.createLessonInstanceFromSchedule(selected);
      // persist current lesson instance id for recorders
      try{ localStorage.setItem('currentLessonInstanceId', instance.id); }catch(e){}
      // change UI mode
      alert('Lezione avviata: ' + instance.id);
      // TODO: switch to lesson mode UI
    });
    footer.appendChild(enterBtn);
    container.appendChild(footer);

    // helper functions
    function selectSlot(lessonKey, time){
      // if lessonKey null -> ad-hoc selection for time
      if (!lessonKey && time){ lessonKey = `ADHOC-${dayName}-${time}`; }
      dm.setSelectedSlot(lessonKey);
      // visual highlight
      tbody.querySelectorAll('tr').forEach(r=> r.classList.remove('selected'));
      const row = tbody.querySelector(`tr[data-timeslot="${time}"]`) ;
      if (row) row.classList.add('selected');
    }

    function openDetails(entry){
      // simple modal using prompt for now
      const txt = `Classe: ${entry.classId}\nMateria: ${entry.subjectLabel || entry.subjectCode}\nTipo: ${entry.activityType}\nAula: ${entry.room || ''}`;
      if (confirm(txt + '\n\nVuoi entrare in questa lezione?')){
        dm.setSelectedSlot(entry.lessonKey);
      }
    }

    // start device clock
    function updateClock(){
      const d = new Date();
      const hh = String(d.getHours()).padStart(2,'0');
      const mm = String(d.getMinutes()).padStart(2,'0');
      clock.textContent = `Ora: ${hh}:${mm}`;
    }
    updateClock(); setInterval(updateClock, 30000);
  }

  // expose helper
  window.renderInClasseDayGrid = renderDayGrid;
})(window);