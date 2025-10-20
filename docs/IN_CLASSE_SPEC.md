# Specifica funzionale: Pagina "In Classe" — Orario Giornaliero (svincolato dall'orologio di sistema)

Versione: 2025-10-20  
Autore: Copilot / antoniocorsano-boop

Sommario
- Obiettivo
- Principi di progetto
- Comportamento principale (svincolato)
- Modello dati e schemi JSON
- DataManager: API e store IndexedDB
- UI: griglia giornaliera, interazioni e accessibility
- Flusso "Entra in classe" / lessonInstance
- Validazioni, edge cases e impostazioni
- Acceptance criteria e test cases
- Deliverable e next steps operativi

---

## 1. Obiettivo
La pagina "In Classe" mostra la griglia dell'orario del giorno (come definita nella pagina "Orario") in forma tabellare, riconoscibile e compatta. L'orario NON viene selezionato automaticamente in base all'orologio del dispositivo: la scelta dello slot è sempre manuale a meno che l'insegnante non abiliti esplicitamente l'opzione "Auto‑select". Quando l'insegnante preme "Entra in classe" sullo slot selezionato si crea un'istanza immutabile della lezione (lessonInstance) — questa istanza rappresenta la voce del registro annuale e raccoglie tutte le attività svolte in quella lezione.

---

## 2. Principi di progetto
- Single source of truth: lo Schedule (Orario settimanale) è la fonte unica per la pianificazione.
- Snapshot immutabile: lessonInstance è un'istantanea immutabile dello schedule al momento dell'avvio.
- Manual-first: selezione manuale dello slot è il comportamento di default.
- Configurabilità: le impostazioni di orario (giorni, ora inizio, ore giornaliere, durata slot) sono configurabili dall'utente.
- Offline-first: persistente in IndexedDB; sincronizzazione server opzionale in fase successiva.
- Mobile-first e accessibile (ARIA / keyboard).

---

## 3. Comportamento principale (svincolato dall'orologio)
- All'apertura di "In Classe":
  - Mostrare la griglia del giorno corrente (derivata da schedule_config).
  - Nessuno slot è pre-selezionato automaticamente.
  - Visualizzare, in header, l'ora del dispositivo come informazione passive: "Ora: HH:MM".
  - Visualizzare uno switch (visivo) per l'opzione "Auto‑select slot corrente" (default: OFF).
- Se lo switch è OFF (default):
  - Nessun effetto automatico sull'interfaccia: l'insegnante seleziona manualmente la riga.
  - Il pulsante "Entra" è abilitato solo se esiste uno slot selezionato (altrimenti apre picker/ad-hoc).
- Se lo switch è ON:
  - All'apertura la UI esegue findCurrentSlot(now) e imposta selectedSlot automaticamente (comportamento legacy).
- StartTime della lessonInstance è comunque il timestamp di sistema al momento del click "Entra".

---

## 4. Modello dati (JSON)

### schedule_config (configurazione orario)
```json
{
  "days": ["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì"],
  "startTime": "08:00",
  "slotDurationMinutes": 60,
  "hoursPerDay": 6,
  "timeSlots": ["08:00","09:00","10:00","11:00","12:00","13:00"],
  "autoSelectDefault": false
}
```

### schedule_entry (una voce di orario)
```json
{
  "id": "sch_2025-10-20_Lun_0800_3C",
  "lessonKey": "Lunedì-08:00",
  "day": "Lunedì",
  "time": "08:00",
  "classId": "class_3C",
  "subjectCode": "MAT",
  "activityType": "T",
  "room": "Aula 12",
  "teacherId": "t_antonio",
  "notes": ""
}
```

### lesson_instance (istanza di lezione creata alla pressione di "Entra")
```json
{
  "id": "li_2025-10-20T08:03:22Z_3C",
  "lessonKey": "Lunedì-08:00",
  "snapshot": {
    "classId": "class_3C",
    "className": "3C",
    "subjectCode": "MAT",
    "subjectLabel": "Matematica",
    "activityType": "T",
    "room": "Aula 12",
    "teacherId": "t_antonio"
  },
  "startTime": "2025-10-20T08:03:22.123Z",
  "endTime": null,
  "status": "in_corso",
  "activities": [],
  "homeworks_assigned": [],
  "evaluations": [],
  "recordings": [],
  "summary": "",
  "nextSteps": [],
  "createdAt": "2025-10-20T08:03:22.123Z",
  "updatedAt": "2025-10-20T08:03:22.123Z"
}
```

---

## 5. DataManager & IndexedDB (store proposti)
IndexedDB stores:
- schedule_config (store: config)
- schedule_entries (store: schedule)
- lesson_instances (store: instances)
- recordings (store: recordings) — blob supportato
- memos (store: memos) — se separato

Interfaccia pubblica (API) del DataManager (client-side)
- init(): Promise<void>
- getScheduleConfig(): Promise<ScheduleConfig>
- saveScheduleConfig(config): Promise<void>
- listScheduleEntries(day?): Promise<schedule_entry[]>
- getScheduleEntry(lessonKey): Promise<schedule_entry | null>
- setSelectedSlot(lessonKey): void
- getSelectedSlot(): string | null
- findCurrentSlot(now: Date): Promise<string | null>
- createLessonInstanceFromSchedule(lessonKey): Promise<lesson_instance>
- createLessonInstanceAdHoc(payload): Promise<lesson_instance>
- getLessonInstance(id): Promise<lesson_instance | null>
- updateLessonInstance(id, patch): Promise<void>
- closeLessonInstance(id): Promise<void>
- listLessonInstances(filter?): Promise<lesson_instance[]>
- addActivityToInstance(lessonInstanceId, activity): Promise<void>
- addRecordingToInstance(lessonInstanceId, recordingMeta): Promise<void>
- migrateScheduleEntries(oldFormat): Promise<void>

Nota: findCurrentSlot esiste ma è chiamato solo se autoSelect configurato.

---

## 6. UI: griglia giornaliera "In Classe"

Layout proposto (mobile-first)
- Header
  - Titolo: "In Classe — [Data]"
  - Info device time: "Ora: HH:MM" (passivo)
  - Switch: "Auto‑select slot corrente" (OFF per default)
- Table (lista righe)
  - Colonne: Ora | Classe | Materia | Tipo (T/P) | Aula | Azioni
  - Righe: una riga per timeSlot del giorno (mostra entry schedule o "Vuoto")
  - Azioni per riga:
    - "Seleziona" (click su riga può funzionare come select)
    - "Dettagli" (apre modal con info schedule)
    - "Entra" (se selezionata; oppure il pulsante globale "Entra" in header lavora sul selectedSlot)
- Modal dettagli slot
  - Visualizza: className, subjectLabel, activityType (T/P), room, note, elenco studenti (se disponibile)
  - Azioni: Entra in classe, Apri Orario (link), Crea ad‑hoc
- Stato visivo:
  - selectedSlot: bordo/color highlighting
  - in_corso: badge rosso/verde "In corso"
  - svolta: icona check

Accessibility
- Righe navigabili con tastiera (arrow keys), Enter apre modal, Space seleziona.
- Modal con focus trap e aria-labelledby.
- Colori rispettano contrast ratios.

---

## 7. Flusso "Entra in classe" (dettagli)
... (spec completata nel documento in repo)