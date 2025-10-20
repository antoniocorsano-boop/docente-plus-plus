(function(window){
  // Lesson Mode UI: listens for lessonInstanceStarted and renders a lesson dashboard
  async function formatTimeAgo(startIso){
    const start = new Date(startIso);
    const now = new Date();
    const diff = Math.floor((now - start) / 1000);
    const mm = String(Math.floor(diff / 60) % 60).padStart(2,'0');
    const hh = String(Math.floor(diff / 3600)).padStart(2,'0');
    return `${hh}:${mm}`;
  }

  function createEl(tag, attrs={}, children=[]){
    const el = document.createElement(tag);
    for (const k in attrs){ if (k==='class') el.className = attrs[k]; else if (k==='text') el.textContent = attrs[k]; else el.setAttribute(k, attrs[k]); }
    (Array.isArray(children)?children:[children]).forEach(c=>{ if (!c) return; if (typeof c === 'string') el.appendChild(document.createTextNode(c)); else el.appendChild(c); });
    return el;
  }

  async function renderLessonMode(instance, opts={containerId:'lesson-mode-container'}){
    const containerId = opts.containerId;
    let container = document.getElementById(containerId);
    if (!container){
      container = createEl('div', {id: containerId, class: 'lesson-mode-root'});
      document.body.appendChild(container);
    }

    const dm = window.inClasseDataManager || (window.inClasseDataManager = new window.InClasseDataManager());
    await dm.init();

    // refresh instance details from store
    if (instance && instance.id){
      instance = await dm.getLessonInstance(instance.id) || instance;
    }

    container.innerHTML = '';
    container.setAttribute('aria-live','polite');

    const header = createEl('div', {class: 'lesson-header'});
    header.appendChild(createEl('h2', {text: `Lezione: ${instance.snapshot.className || instance.snapshot.classId || ''} — ${instance.snapshot.subjectLabel || ''}`}));
    const meta = createEl('div', {class: 'lesson-meta'});
    const timer = createEl('div', {class: 'lesson-timer', id: 'lesson-timer', text: '00:00'});
    meta.appendChild(timer);
    const endBtn = createEl('button', {class: 'btn btn-danger', text: 'Termina lezione'});
    endBtn.addEventListener('click', async ()=>{
      if (!confirm('Sei sicuro di voler terminare la lezione?')) return;
      await dm.closeLessonInstance(instance.id);
      try{ localStorage.removeItem('currentLessonInstanceId'); }catch(e){}
      document.dispatchEvent(new CustomEvent('lessonInstanceEnded', { detail: { id: instance.id } }));
      // hide lesson mode
      container.innerHTML = '';
      alert('Lezione terminata');
    });
    meta.appendChild(endBtn);
    header.appendChild(meta);
    container.appendChild(header);

    // panels: activities, recordings
    const panels = createEl('div', {class:'lesson-panels'});
    // Activities panel
    const activitiesPanel = createEl('section', {class:'panel activities-panel'});
    activitiesPanel.appendChild(createEl('h3', {text:'Attività'}));
    const actList = createEl('ul', {class:'activities-list'});
    (instance.activities||[]).forEach(a=>{
      const li = createEl('li', {text: `${a.timestamp || ''} — ${a.description || a.title || ''}`});
      actList.appendChild(li);
    });
    activitiesPanel.appendChild(actList);
    const actForm = createEl('form', {class:'activity-form'});
    const actInp = createEl('input', {type:'text', placeholder:'Descrizione attività', name:'actdesc'});
    const actAdd = createEl('button', {type:'button', class:'btn btn-primary', text:'Aggiungi attività'});
    actAdd.addEventListener('click', async ()=>{
      const desc = actInp.value && actInp.value.trim();
      if (!desc) return alert('Inserisci la descrizione');
      const activity = { description: desc, type: 'general' };
      await dm.addActivityToInstance(instance.id, activity);
      actInp.value = '';
      // refresh list
      const updated = await dm.getLessonInstance(instance.id);
      renderActivitiesList(updated.activities || []);
    });
    actForm.appendChild(actInp); actForm.appendChild(actAdd);
    activitiesPanel.appendChild(actForm);

    function renderActivitiesList(list){
      actList.innerHTML = '';
      (list||[]).forEach(a=>{ const li = createEl('li', {text: `${a.timestamp || ''} — ${a.description || a.title || ''}`}); actList.appendChild(li); });
    }

    // Recordings panel
    const recPanel = createEl('section', {class:'panel recordings-panel'});
    recPanel.appendChild(createEl('h3', {text:'Registrazioni'}));
    const recList = createEl('ul', {class:'recordings-list'});
    (instance.recordings||[]).forEach(r=>{
      const li = createEl('li');
      const a = createEl('a', {href: r.url || '#', text: r.filename || r.id || 'Registrazione', target: '_blank'});
      li.appendChild(a);
      recList.appendChild(li);
    });
    recPanel.appendChild(recList);
    const recRefresh = createEl('button', {class:'btn', text:'Aggiorna registrazioni'});
    recRefresh.addEventListener('click', async ()=>{
      const updated = await dm.getLessonInstance(instance.id);
      renderRecordingsList(updated.recordings || []);
    });
    recPanel.appendChild(recRefresh);

    function renderRecordingsList(list){
      recList.innerHTML = '';
      (list||[]).forEach(r=>{ const li = createEl('li'); const a = createEl('a', {href: r.url || '#', text: r.filename || r.id || 'Registrazione', target: '_blank'}); li.appendChild(a); recList.appendChild(li); });
    }

    panels.appendChild(activitiesPanel);
    panels.appendChild(recPanel);
    container.appendChild(panels);

    // live timer update
    let timerInterval = null;
    function startTimer(){
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(async ()=>{
        const inst = await dm.getLessonInstance(instance.id);
        if (!inst) return;
        timer.textContent = await formatTimeAgo(inst.startTime);
      }, 1000);
    }
    startTimer();

    // expose refresh hook
    container._refresh = async function(){
      const updated = await dm.getLessonInstance(instance.id);
      renderActivitiesList(updated.activities || []);
      renderRecordingsList(updated.recordings || []);
    };

    // attach some global hooks to allow external recorders to refresh the UI
    document.addEventListener('recordingSaved', async (e)=>{
      // recordingSaved should contain { meta }
      try{ await container._refresh(); }catch(e){}
    });

    return container;
  }

  // Listen to events
  document.addEventListener('lessonInstanceStarted', (e)=>{
    const inst = e.detail;
    renderLessonMode(inst);
  });

  // If there's an active currentLessonInstanceId on load, render it
  window.addEventListener('load', async ()=>{
    try{
      const dm = window.inClasseDataManager || (window.inClasseDataManager = new window.InClasseDataManager());
      await dm.init();
      const id = localStorage.getItem('currentLessonInstanceId');
      if (id){
        const inst = await dm.getLessonInstance(id);
        if (inst) renderLessonMode(inst);
      }
    }catch(e){ /* ignore */ }
  });

  window.renderLessonMode = renderLessonMode;
})(window);
