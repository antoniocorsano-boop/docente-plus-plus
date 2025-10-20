# Docente++ - Developer Working Guidelines (single-user first)

Scopo
- Questo documento definisce le regole operative condivise per lo sviluppo dell'app "docente-plus-plus".
- È il riferimento da leggere PRIMA di iniziare qualsiasi modifica nel repository.

Principi generali
- Modello "single-user first": dati locali (IndexedDB) sono la fonte primaria; sync remoto è opzionale e disabilitato di default.
- Tutti i moduli interagiscono con un unico DataManager (esposto come `window.DataManager` o `src/js/data-manager.js`).
- Le modifiche allo schedule possono essere fatte da "Orario" e anche da "In Classe". Quando modificate da In Classe salvate direttamente nello Schedule locale.

Branching & PR
- Regola operativa: una (1) PR attiva per area/epic. Evitiamo PR concorrenti sulla stessa area.  
- Nomi branch: feat/<area>-short (es. feat/in-classe-refactor), fix/<issue>-short, chore/<task>-short.
- PR piccole: preferibilmente ≤ 500 LOC; ogni PR deve avere checklist e steps di test manuale.
- PR in draft: usate per lavoro in corso, ma non aprite Draft PR multipli per la stessa area.
- Merge: only after review + CI checks (se presenti).

Issue tracking & sviluppo
- Ogni task minimo ha un Issue. Le PR devono referenziare l’Issue corrispondente.
- Priorità: Core (schedule, in-classe functionality, data manager) → UX (modal, mobile) → Extras (analytics, AI integration).
- Evitare di sviluppare funzionalità complesse in un’unica PR: dividere in steps testabili.

Single‑user specifics
- Storage: IndexedDB per entità principali: schedule_entries, lesson_instances, recordings, memos, config.
- Undo: breve undo UI (toast con “Annulla” 6–8s) per revert immediato senza audit persistente.
- Registrazioni e trascrizioni: non inviare nulla a server/IA senza consenso esplicito; salva blob localmente per default.

Integrazione UI / Tema
- Usare i token MD3 e gli stili esistenti (src/styles / css/*).  
- I nuovi componenti devono rispettare le variabili di tema e i componenti globali (ThemeProvider).

Work session policy (come lavoro io)
- Prima di aprire modifiche: leggere DEVELOPER_GUIDELINES.md e il .dev-session.json se presente.  
- Creo/uso una branch nominata coerente. Non apro più PR nella stessa area finché la PR precedente non è mergeata o chiusa.  
- Documenterò ogni sessione in una breve nota (session snapshot) nel corpo della PR: cosa ho fatto, cosa manca, come testare.

Sync e futuro
- Preparare code paths per adattare un eventuale ServerAdapter (pattern adapter) senza riscrivere DataManager.
- Non implementare versioning/audit completo a meno che non sia necessario.

Note finali
- Questo file è il punto di partenza; possiamo modificare le regole se preferisci altri vincoli. Se mi dai l'ok, lo aggiungo al repo in una branch di lavoro e poi apro la PR iniziale (solo dopo tuo via libera).