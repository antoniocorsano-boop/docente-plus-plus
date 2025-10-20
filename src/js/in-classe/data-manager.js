/* DataManager stub for In Classe schedule integration
   - IndexedDB stores: config, schedule, instances, recordings, memos
   - Public API (promises) as specified in IN_CLASSE_SPEC.md
*/
(function(window){
  const DB_NAME = 'docente_plus_db';
  const DB_VERSION = 1;
  const STORES = {
    CONFIG: 'config',
    SCHEDULE: 'schedule',
    INSTANCES: 'instances',
    RECORDINGS: 'recordings',
    MEMOS: 'memos'
  };

  function openDb(){
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORES.CONFIG)) db.createObjectStore(STORES.CONFIG, { keyPath: 'key' });
        if (!db.objectStoreNames.contains(STORES.SCHEDULE)) db.createObjectStore(STORES.SCHEDULE, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(STORES.INSTANCES)) db.createObjectStore(STORES.INSTANCES, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(STORES.RECORDINGS)) db.createObjectStore(STORES.RECORDINGS, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(STORES.MEMOS)) db.createObjectStore(STORES.MEMOS, { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function promisifyRequest(req){
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function getStore(mode, storeName){
    const db = await openDb();
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    return { db, tx, store };
  }

  const InClasseDataManager = function(){
    this.selectedSlot = null; // lessonKey
  };

  InClasseDataManager.prototype.init = async function(){
    // ensure DB exists
    await openDb();
    // load default config if missing
    const cfg = await this.getScheduleConfig();
    if (!cfg){
      const defaultCfg = {
        key: 'schedule_config',
        days: ['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì'],
        startTime: '08:00',
        slotDurationMinutes: 60,
        hoursPerDay: 6,
        timeSlots: ['08:00','09:00','10:00','11:00','12:00','13:00'],
        autoSelectDefault: false
      };
      await this.saveScheduleConfig(defaultCfg);
    }
  };

  // Config
  InClasseDataManager.prototype.getScheduleConfig = async function(){
    const { store } = await getStore('readonly', STORES.CONFIG);
    const req = store.get('schedule_config');
    return promisifyRequest(req);
  };

  InClasseDataManager.prototype.saveScheduleConfig = async function(cfg){
    const { store } = await getStore('readwrite', STORES.CONFIG);
    const payload = Object.assign({}, cfg, { key: 'schedule_config' });
    const req = store.put(payload);
    return promisifyRequest(req);
  };

  // Schedule entries
  InClasseDataManager.prototype.listScheduleEntries = async function(day){
    const { store } = await getStore('readonly', STORES.SCHEDULE);
    if (day){
      // simple filter by day
      const allReq = store.getAll();
      const all = await promisifyRequest(allReq);
      return all.filter(e => e.day === day);
    }
    const req = store.getAll();
    return promisifyRequest(req);
  };

  InClasseDataManager.prototype.getScheduleEntry = async function(lessonKey){
    const { store } = await getStore('readonly', STORES.SCHEDULE);
    const allReq = store.getAll();
    const all = await promisifyRequest(allReq);
    return all.find(e => e.lessonKey === lessonKey) || null;
  };

  InClasseDataManager.prototype.saveScheduleEntry = async function(entry){
    const { store } = await getStore('readwrite', STORES.SCHEDULE);
    // ensure id
    if (!entry.id) entry.id = 'sch_' + Date.now();
    const req = store.put(entry);
    return promisifyRequest(req);
  };

  // Selected slot
  InClasseDataManager.prototype.setSelectedSlot = function(lessonKey){
    this.selectedSlot = lessonKey;
    // persist lightweight selection in localStorage for UI restore
    try{ localStorage.setItem('selectedSlot', lessonKey); }catch(e){}
  };
  InClasseDataManager.prototype.getSelectedSlot = function(){
    if (this.selectedSlot) return this.selectedSlot;
    try{ return localStorage.getItem('selectedSlot'); }catch(e){ return null; }
  };

  // findCurrentSlot (optional; used only if autoSelect enabled)
  InClasseDataManager.prototype.findCurrentSlot = async function(now){
    const cfg = await this.getScheduleConfig();
    const date = now || new Date();
    const dayName = cfg.days[date.getDay()-1] || cfg.days[0];
    const start = cfg.startTime.split(':').map(Number);
    const slots = cfg.timeSlots || [];
    const hh = date.getHours();
    const mm = date.getMinutes();
    const timeStr = String(hh).padStart(2,'0') + ':' + String(mm).padStart(2,'0');
    // simple nearest: find slot where time >= slot && time < slot+duration
    for (const s of slots){
      const [sh, sm] = s.split(':').map(Number);
      const slotStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), sh, sm);
      const slotEnd = new Date(slotStart.getTime() + (cfg.slotDurationMinutes||60)*60000);
      if (date >= slotStart && date < slotEnd){
        return `${dayName}-${s}`;
      }
    }
    return null;
  };

  // Lesson instances
  InClasseDataManager.prototype.createLessonInstanceFromSchedule = async function(lessonKey){
    const entry = await this.getScheduleEntry(lessonKey);
    const id = 'li_' + Date.now();
    const snapshot = entry ? Object.assign({}, entry) : {};
    const instance = {
      id,
      lessonKey: lessonKey || null,
      snapshot: snapshot,
      startTime: (new Date()).toISOString(),
      endTime: null,
      status: 'in_corso',
      activities: [],
      homeworks_assigned: [],
      evaluations: [],
      recordings: [],
      summary: '',
      nextSteps: [],
      createdAt: (new Date()).toISOString(),
      updatedAt: (new Date()).toISOString()
    };
    const { store } = await getStore('readwrite', STORES.INSTANCES);
    const req = store.put(instance);
    await promisifyRequest(req);
    return instance;
  };

  InClasseDataManager.prototype.createLessonInstanceAdHoc = async function(payload){
    const id = 'li_' + Date.now();
    const instance = Object.assign({
      id,
      lessonKey: null,
      snapshot: payload.snapshot || {},
      startTime: (new Date()).toISOString(),
      endTime: null,
      status: 'in_corso',
      activities: [],
      homeworks_assigned: [],
      evaluations: [],
      recordings: [],
      summary: '',
      nextSteps: [],
      createdAt: (new Date()).toISOString(),
      updatedAt: (new Date()).toISOString()
    }, payload);
    const { store } = await getStore('readwrite', STORES.INSTANCES);
    const req = store.put(instance);
    await promisifyRequest(req);
    return instance;
  };

  InClasseDataManager.prototype.getLessonInstance = async function(id){
    const { store } = await getStore('readonly', STORES.INSTANCES);
    const req = store.get(id);
    return promisifyRequest(req);
  };

  InClasseDataManager.prototype.updateLessonInstance = async function(id, patch){
    const inst = await this.getLessonInstance(id);
    if (!inst) throw new Error('instance not found');
    Object.assign(inst, patch, { updatedAt: (new Date()).toISOString() });
    const { store } = await getStore('readwrite', STORES.INSTANCES);
    const req = store.put(inst);
    return promisifyRequest(req);
  };

  InClasseDataManager.prototype.closeLessonInstance = async function(id){
    const inst = await this.getLessonInstance(id);
    if (!inst) throw new Error('instance not found');
    inst.endTime = (new Date()).toISOString();
    inst.status = 'chiusa';
    inst.updatedAt = (new Date()).toISOString();
    const { store } = await getStore('readwrite', STORES.INSTANCES);
    const req = store.put(inst);
    return promisifyRequest(req);
  };

  InClasseDataManager.prototype.listLessonInstances = async function(filter){
    const { store } = await getStore('readonly', STORES.INSTANCES);
    const req = store.getAll();
    const all = await promisifyRequest(req);
    if (!filter) return all.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
    // simple filter support
    return all.filter(i => {
      if (filter.classId && i.snapshot && i.snapshot.classId !== filter.classId) return false;
      if (filter.from && new Date(i.createdAt) < new Date(filter.from)) return false;
      if (filter.to && new Date(i.createdAt) > new Date(filter.to)) return false;
      return true;
    }).sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
  };

  InClasseDataManager.prototype.addActivityToInstance = async function(lessonInstanceId, activity){
    const inst = await this.getLessonInstance(lessonInstanceId);
    if (!inst) throw new Error('instance not found');
    activity.id = 'act_' + Date.now();
    activity.timestamp = (new Date()).toISOString();
    inst.activities.push(activity);
    inst.updatedAt = (new Date()).toISOString();
    const { store } = await getStore('readwrite', STORES.INSTANCES);
    const req = store.put(inst);
    return promisifyRequest(req);
  };

  InClasseDataManager.prototype.addRecordingToInstance = async function(lessonInstanceId, recordingMeta){
    // recordingMeta: { id, duration, url, blob? }
    const inst = await this.getLessonInstance(lessonInstanceId);
    if (!inst) throw new Error('instance not found');
    inst.recordings.push(Object.assign({}, recordingMeta));
    inst.updatedAt = (new Date()).toISOString();
    const { store } = await getStore('readwrite', STORES.INSTANCES);
    const req = store.put(inst);
    await promisifyRequest(req);
    // optionally persist blob in RECORDINGS store
    if (recordingMeta.blob){
      const rec = Object.assign({ id: recordingMeta.id || ('rec_' + Date.now()), timestamp: (new Date()).toISOString() }, recordingMeta);
      const { store: rstore } = await getStore('readwrite', STORES.RECORDINGS);
      const rreq = rstore.put(rec);
      await promisifyRequest(rreq);
    }
    return inst;
  };

  // Export
  window.InClasseDataManager = InClasseDataManager;
})(window);