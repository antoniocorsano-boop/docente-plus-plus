# Changelog

Tutte le modifiche significative di Docente++ saranno documentate in questo file.

## [Non Rilasciato]

### Aggiunto - v1.2.2 (2024-10-16)
- **Menù Laterale Sempre Attivo**: Il menù laterale è ora sempre visibile e accessibile, indipendentemente dallo stato di onboarding
- **Onboarding Unificato nelle Impostazioni**: Il flusso di onboarding è stato integrato nella pagina Impostazioni, sempre accessibile dal menù
- **Sezione Profilo Docente Potenziata**: Aggiunta email opzionale al profilo utente
- **Selezione Anno Scolastico da Dropdown**: Menu a tendina per selezionare l'anno scolastico (2023/2024 - 2027/2028)
- **Gestione Classi Automatica**: 
  - Selezione sezioni (A-E) e livelli (1-5)
  - Generazione automatica delle classi (es. 1A, 2A, 3A, ecc.)
  - Possibilità di deselezionare classi non insegnate
- **Configurazione API Key IA Migliorata**:
  - Spiegazione privacy (salvataggio locale)
  - Pulsante mostra/nascondi per la chiave
  - Validazione formato chiave API con feedback visivo
- **Impostazioni Organizzate**: Tutte le impostazioni suddivise in sezioni chiare con icone

### Modificato
- **Menu Completamente Accessibile**: Rimossa definitivamente ogni logica di disabilitazione del menu. Tutte le voci sono sempre attive, cliccabili e accessibili, indipendentemente dallo stato del profilo o dell'onboarding. La funzione `disableMenuItems()` è ora una no-op mantenuta solo per retrocompatibilità.
- **Banner Onboarding Non Bloccante**: Il banner informativo per profilo incompleto non impedisce più la navigazione. L'utente può esplorare liberamente l'app mentre completa il profilo.
- **Workspace Button**: Rimosso temporaneamente il pulsante Workspace dall'AppBar (header) poiché la funzionalità non è attualmente utilizzata. Il codice è stato mantenuto e commentato per un facile ripristino futuro. Vedi `docs/WORKSPACE_RESTORATION.md` per istruzioni di ripristino.

### Rimosso
- **Controlli Menu Disabilitati**: Eliminate tutte le funzioni, condizioni e classi CSS che disabilitavano le voci del menu (`disabled`, `needs-profile`, `aria-disabled="true"`, tooltip bloccanti).
- **Logica di Blocco Navigazione**: Rimossa ogni verifica dello stato del profilo che impediva l'accesso alle voci del menu.
- **CSS Stati Disabilitati**: Svuotate le regole CSS per `.nav-item.disabled` e `.nav-item.needs-profile`.

## [1.1.0] - In Sviluppo

- Integrazione sezione FAQ e Screenshot nel README
- Bozza struttura documentazione avanzata in `docs/`
- Miglioramento linee guida contributori

## [1.0.0] - 2024-07-30

### Aggiunto

- **Onboarding Iniziale**: Procedura guidata per la prima configurazione dell'app (dati del docente, materie).
- **Gestione Classi**: CRUD completo per creare, modificare ed eliminare le classi.
- **Gestione Studenti**: CRUD completo per aggiungere, modificare ed eliminare studenti, con associazione a una classe specifica.
- **Gestione Lezioni**: CRUD completo per la pianificazione di lezioni dettagliate (argomento, obiettivi, data, ora).
- **Gestione Attività Didattiche**: CRUD completo per creare e assegnare attività (compiti, verifiche) alle classi.
- **Gestione Valutazioni**: Funzionalità per inserire voti e giudizi per ogni studente associandoli a un'attività specifica.
- **Orario Settimanale/Giornaliero**: Visualizzazione dinamica delle lezioni pianificate.
- **Dashboard Principale**: Widget con riepilogo delle prossime scadenze e delle ultime valutazioni.
- **Assistente IA (Simulato)**: Chat interattiva per ricevere suggerimenti, creare bozze di lezioni e rispondere a comandi in linguaggio naturale.
- **Importazione Documenti (Simulato)**: Funzione per caricare un file, analizzarne il contenuto e creare una bozza di lezione.
- **Persistenza Dati**: Tutte le informazioni vengono salvate e caricate automaticamente tramite il `localStorage` del browser.
- **UI Reattiva**: Interfaccia ottimizzata per desktop e dispositivi mobili.
- **Sistema di Notifiche Toast**: Feedback visivo per le azioni dell'utente.
