# 🎓 Docente++ 

**Progressive Web App per la gestione della didattica dell'insegnante potenziata da IA OpenRouter**

App installabile per un insegnamento basato su IA, evoluzione del progetto docente-plus con interfaccia web completa e supporto PWA.

> **Nota**: Questa è una web app standalone che non richiede installazione di dipendenze. Basta aprire `index.html` in un browser per iniziare!

## 🎨 Design

L'interfaccia utente di Docente++ segue le linee guida **Material Design** di Google:
- **Material Icons** - Icone vettoriali moderne e accessibili
- **Roboto Font** - Tipografia ottimizzata per leggibilità
- **Palette di colori Material** - Blu #1976d2 (primary), Verde #4caf50 (secondary), Grigio #f5f5f5 (background)
- **Elevazione e ombre** - Box-shadow coerenti per profondità visiva
- **Border-radius 4px/8px** - Angoli arrotondati secondo lo stile Material

## 📋 Caratteristiche

- **🎯 Onboarding Guidato** - Configurazione iniziale profilo docente
- **🏫 Gestione Classi** - Crea, modifica ed elimina classi
- **👥 Gestione Studenti** - Organizza studenti con import da CSV/Excel
- **📚 Gestione Lezioni** - Crea lezioni manualmente o genera con IA
- **📅 Orario Didattico** - Orario settimanale interattivo con vista giornaliera/settimanale
- **📋 Gestione Attività** - Pianifica esercitazioni, laboratori, progetti, compiti e verifiche
- **✅ Valutazioni** - Sistema completo per criteri, griglie e valutazioni con supporto IA
- **🔔 Notifiche** - Promemoria automatici per lezioni, scadenze e backup
- **📰 News RSS/Atom** - Aggregazione news con analisi IA contestuale
- **🤖 Assistente IA** - Supporto OpenRouter per pianificazione didattica
- **📂 Import Documenti** - Carica e importa documenti con riconoscimento IA
- **🎙️ Registrazione Audio** - Registra lezioni con contesto automatico
- **💾 Import/Export** - Backup completo in JSON, PDF o Excel
- **📱 PWA** - Installabile su tutti i dispositivi, funziona offline
- **🔐 Privacy** - Tutti i dati salvati solo localmente, nessun server

## 🚀 Avvio Rapido

1. **Clona il repository**:
   ```bash
   git clone https://github.com/antbrogame-a11y/docente-plus-plus.git
   cd docente-plus-plus
   ```

2. **Apri l'applicazione**:
   - Apri il file `index.html` nel tuo browser
   - Oppure usa un server locale:
     ```bash
     # Con Python 3
     python -m http.server 8000
     
     # Con Node.js (http-server)
     npx http-server
     ```
   - Poi naviga su `http://localhost:8000`

3. **Configura l'API Key** (opzionale, per usare l'IA):
   - Vai nella sezione "Impostazioni"
   - Inserisci la tua OpenRouter API Key (ottenibile su [openrouter.ai](https://openrouter.ai))
   - Salva le impostazioni

4. **Inizia ad usare l'app**:
   - Completa l'onboarding iniziale con i tuoi dati
   - Crea le tue classi
   - Aggiungi studenti e lezioni
   - Usa l'assistente IA per generare contenuti
   - Esporta i tuoi dati per backup

## 📊 Riepilogo Funzionalità

### ✅ Funzionalità Implementate

- **Assistente IA OpenRouter**: Supporto per la pianificazione didattica, la creazione di materiali e idee innovative
- **Generazione Automatica**: Piani di lezione creati con l'IA
- **Persistenza Dati**: Salvataggio locale dei dati nel browser
- **Import/Export Avanzato**: Backup e ripristino in **formati multipli (JSON, PDF, Excel)**
- **Esportazione PDF e Excel**: Report professionali stampabili e fogli di calcolo per analisi avanzate
- **📂 Modulo Importazione Documenti con IA**: Sistema avanzato per importare e gestire documenti didattici e anagrafici
  - Caricamento file multipli formati (CSV, XLSX, PDF, TXT, JSON)
  - **📋 Importazione Intelligente Attività**: Estrazione automatica di attività didattiche da file PDF, CSV o Excel. Il sistema associa intelligentemente le attività alle classi corrette in base all'anno di corso (es. "Prima Media" viene mappato su tutte le tue classi del 1° anno come 1A, 1B, ecc.).
  - Riconoscimento automatico tipo documento tramite IA
  - Importazione intelligente anagrafica studenti con campi estesi (data nascita, onomastico, note)
  - Gestione duplicati con merge automatico
  - Anteprima dati prima dell'importazione
  - Storico documenti importati
- **🎙️ Registrazione Audio Lezioni**: Registra e gestisci audio delle lezioni
  - Registrazione con timer in tempo reale
  - Associazione automatica contesto (classe, lezione, data)
  - Riproduzione e download registrazioni
  - Gestione archivio registrazioni
- **Onboarding Guidato**: Configurazione iniziale del profilo docente al primo accesso
- **Gestione Classi**: Creazione, modifica, eliminazione classi
- **Gestione Studenti Avanzata**: Organizzazione studenti con campi estesi
  - Dati anagrafici completi (nome, email, classe)
  - Data di nascita per calcolo età e compleanni
  - Onomastico/Santo per notifiche personalizzate
  - Note aggiuntive personalizzabili
  - Importazione massiva da file CSV/Excel
- **Gestione Lezioni**: Crea, visualizza ed elimina lezioni programmate
- **📅 Gestione Orario Didattico**: Orario settimanale interattivo con vista giornaliera/settimanale, assegnazione classi e tipi di attività (teoria, disegno, laboratorio), esclusione automatica weekend, integrazione con attività
- **📋 Gestione Attività Didattiche**: Sistema completo per pianificare, monitorare e gestire attività (lezioni, esercitazioni, laboratori, progetti, compiti, verifiche) con:
  - Creazione e modifica attività con priorità (bassa, media, alta)
  - Monitoraggio avanzamento con percentuale di completamento
  - Gestione scadenze con notifiche automatiche (3 giorni, 24 ore, scadute)
  - Note e feedback per ogni attività
  - Dashboard riepilogativo con statistiche in tempo reale
  - Assegnazione a classi e studenti
  - Tracciamento stato (pianificata, in corso, completata)
  - Export in PDF, Excel e JSON
- **✅ Gestione Valutazioni Avanzata**: Sistema completo per criteri, griglie e valutazioni personalizzate con supporto IA
- **🔔 Notifiche e Promemoria**: Sistema completo di notifiche automatiche e promemoria personalizzabili
- **Gestione Materie**: Gestione discipline con autocomplete intelligente
- **Configurazione Anno Scolastico**: Date inizio/fine personalizzabili
- **Dashboard Intuitiva**: Panoramica di lezioni, studenti e attività
- **Configurazione Model ID OpenRouter**: Impostazione del modello IA utilizzato direttamente dalle impostazioni
- **Privacy e Sicurezza**: Dati e chiavi API solo locali, nessun server, note di riservatezza nei documenti esportati
- **Responsive & Accessibile**: Interfaccia moderna, fluida, personalizzabile, compatibile desktop/tablet/mobile
- **Documentazione API**: Esempi e guida API OpenRouter disponibili

### 🚀 Funzionalità da Implementare

Le seguenti funzionalità sono pianificate per le prossime versioni:

- **Importazione Materiali Didattici**: Caricamento e classificazione automatica materiali didattici
- **Importazione Attività**: Import massivo di attività e programmi didattici
- **Trascrizione Audio con IA**: Trascrizione automatica registrazioni audio lezioni
- **Analisi Predittiva**: Analisi progressi studenti e suggerimenti IA
- **Backup cloud opzionale**: Sincronizzazione e ripristino dati tramite provider esterni (es. Google Drive, Dropbox)
- **Accessibilità estesa**: Miglioramento funzioni per utenti con disabilità (es. navigazione da tastiera, testo alternativo, modalità contrasto elevato)

> **Nota**: Per richiedere una nuova funzionalità o discutere le priorità, apri una [nuova issue](https://github.com/antbrogame-a11y/docente-plus-plus/issues) su GitHub.

## 📖 Guida all'Uso

### Primo Accesso
Al primo avvio, l'app ti guiderà attraverso l'onboarding con configurazione di profilo, classi, discipline e anno scolastico.

### Funzionalità Principali

- **Dashboard** - Panoramica rapida con statistiche di lezioni, studenti e attività
- **Classi e Studenti** - Gestisci classi e anagrafica studenti, importa da CSV/Excel
- **Lezioni** - Crea lezioni manualmente o genera con l'IA
- **Orario Didattico** - Gestisci l'orario settimanale con vista giornaliera e settimanale
- **Attività** - Pianifica e monitora esercitazioni, laboratori, progetti, compiti e verifiche
- **Valutazioni** - Sistema completo per criteri, griglie e valutazioni personalizzate
- **Notifiche** - Promemoria automatici per lezioni, scadenze e backup
- **News RSS** - Aggrega news da fonti esterne con analisi IA contestuale
- **Assistente IA** - Chat intelligente per supporto didattico
- **Import/Export** - Backup completo in JSON, PDF o Excel

Per istruzioni dettagliate su ogni funzionalità, consulta la [📚 Documentazione Aggiuntiva](#-documentazione-aggiuntiva) qui sotto.

## 🏗️ Struttura del Progetto

```
docente-plus-plus/
├── index.html          # Interfaccia principale dell'app
├── styles.css          # Stili e design dell'applicazione
├── app.js              # Logica applicativa e integrazione IA
├── manifest.json       # Configurazione PWA
├── sw.js               # Service Worker per funzionamento offline
├── icons/              # Icone per PWA
├── docs/               # Documentazione dettagliata
└── README.md           # Questa documentazione
```

## 🔧 Tecnologie Utilizzate

- **HTML5, CSS3, JavaScript (ES6+)** - Frontend moderno e responsive
- **Material Design** - Sistema di design Google con Material Icons, tipografia Roboto, elevazione con ombre, e palette colori Material
- **LocalStorage API** - Persistenza dati lato client
- **OpenRouter API** - Intelligenza artificiale
- **PWA + Service Worker** - Installabile e funzionante offline

## 📱 Installazione PWA (Progressive Web App)

Docente++ può essere installato come app su smartphone, tablet e desktop!

### Come Installare

- **📱 Android**: Menu (⋮) → "Installa app"
- **🍎 iOS**: Condividi → "Aggiungi a Home"
- **💻 Desktop**: Icona "Installa" (⊕) nella barra degli indirizzi

## 👨‍💻 Sviluppo e Documentazione

Il codice sorgente è documentato utilizzando lo standard [JSDoc](https://jsdoc.app/). Questo facilita la comprensione del codice e permette la generazione automatica di una documentazione HTML completa per gli sviluppatori.

### Generare la Documentazione
Per generare la documentazione del codice:
1. Assicurati di avere Node.js installato.
2. Installa JSDoc:
   ```bash
   npm install -g jsdoc
   ```
3. Esegui JSDoc dalla root del progetto:
   ```bash
   jsdoc app.js -d docs/
   ```
4. Apri `docs/index.html` nel browser per visualizzare la documentazione completa del codice.

## 📝 Licenza

📖 **Guida completa**: [Installazione PWA](docs/PWA_INSTALLATION.md) | [Quick Start PWA](docs/PWA_QUICK_START.md)

## 🔐 Privacy e Sicurezza

I contributi sono i benvenuti! Se desideri contribuire al progetto, segui questi passaggi:

1. **Fai un Fork** del repository.
2. **Crea un Branch** per la tua modifica (`git checkout -b feature/NomeFunzionalita`).
3. **Sviluppa la tua feature**. Cerca di seguire lo stile di codifica esistente e documenta le nuove funzioni con commenti JSDoc.
4. **Fai Commit** delle tue modifiche (`git commit -m 'Aggiunta nuova funzionalità X'`).
5. **Fai Push** al tuo branch (`git push origin feature/NomeFunzionalita`).
6. **Apri una Pull Request** descrivendo le modifiche apportate.

Vuoi contribuire? Consulta [CONTRIBUTING.md](CONTRIBUTING.md) per le linee guida e come proporre richieste di modifica o segnalare bug.

## 🐛 Segnalazione Bug e Feedback

Vogliamo rendere Docente++ sempre migliore! Il tuo feedback è prezioso:

- **🐛 Segnala un Bug:** [Apri Bug Report](https://github.com/antbrogame-a11y/docente-plus-plus/issues/new?template=bug_report.md)
- **💡 Condividi Feedback:** [Invia Suggerimenti](https://github.com/antbrogame-a11y/docente-plus-plus/issues/new?template=feedback.md)
- **📋 Vedi Feedback Raccolti:** [Documento Feedback Utente](docs/FEEDBACK_UTENTE.md)
- **🧪 Piano Test Beta:** [Piano Test Completo](docs/BETA_TEST_PLAN.md)

## 👨‍💻 Autore

Progetto sviluppato per migliorare la gestione didattica degli insegnanti attraverso l'intelligenza artificiale.

## 📚 Documentazione avanzata

- [Guida Utente](docs/user-guide.md)
- [Guida Sviluppatori](docs/dev-guide.md)
- [Architettura e API](docs/architecture.md)
- [Changelog](CHANGELOG.md)

## 📄 Licenza

Questo progetto è distribuito sotto licenza MIT. Vedi [LICENSE](LICENSE).
