# Changelog

Tutte le modifiche significative di Docente++ saranno documentate in questo file.

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
