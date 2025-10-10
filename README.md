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

## 🖼️ Screenshot

*Aggiungi qui degli screenshot rappresentativi dell'interfaccia e delle funzionalità principali.*

## ❓ FAQ

**Dove vengono salvati i miei dati?**  
Tutti i dati sono salvati localmente sul dispositivo, senza alcun server esterno.

**Posso usare l'app offline?**  
Sì, la web app è una PWA e funziona anche senza connessione.

**È obbligatorio configurare la API Key?**  
No, solo le funzionalità avanzate di IA richiedono una API Key.

*Per altre domande consulta la [guida utente](docs/user-guide.md).*

📖 **Per una guida completa**: vedi [Guida Rapida](docs/QUICK_START.md)

## 📊 Funzionalità Principali

- ✅ **Assistente IA OpenRouter** - Supporto intelligente per pianificazione didattica e creazione materiali
- ✅ **Gestione Completa** - Classi, studenti, lezioni, orario didattico e valutazioni
- ✅ **Attività Didattiche** - Pianificazione e monitoraggio con scadenze e notifiche automatiche
- ✅ **Import/Export Avanzato** - Backup e ripristino in formati multipli (JSON, PDF, Excel)
- ✅ **Importazione Documenti** - Sistema IA per importare documenti didattici e anagrafici (CSV, XLSX, PDF, TXT)
- ✅ **Registrazione Audio** - Registra e gestisci le lezioni con contesto automatico
- ✅ **News RSS/Atom** - Aggregazione news con analisi IA contestuale
- ✅ **Notifiche e Promemoria** - Sistema completo di notifiche automatiche personalizzabili
- ✅ **PWA** - Installabile come app su smartphone, tablet e desktop, funziona offline
- ✅ **Privacy** - Tutti i dati solo in locale, nessun server esterno
- ✅ **Toast Notifications** - Feedback visivo immediato per tutte le azioni
- ✅ **Guida Contestuale** - Aiuto "?" in ogni sezione principale
- ✅ **Validazione Real-time** - Controllo email e campi obbligatori in tempo reale
- ✅ **Tema Chiaro/Scuro** - Personalizzazione dell'interfaccia

## 📋 Cose da Fare (To Do)

Funzionalità pianificate per le prossime versioni:

- [ ] **Guida Primo Avvio Interattiva** - Tutorial step-by-step per utenti inesperti
- [ ] **Tooltip Contestuali** - Suggerimenti inline nei form
- [ ] **Scorciatoie da Tastiera** - Navigazione rapida da tastiera
- [ ] **Font Size Personalizzabile** - Dimensioni testo regolabili
- [ ] **Modalità Alta Leggibilità** - Contrasto elevato e spaziatura ottimizzata
- [ ] **Importazione Materiali Didattici** - Caricamento e classificazione automatica materiali didattici
- [ ] **Trascrizione Audio con IA** - Trascrizione automatica registrazioni audio lezioni
- [ ] **Analisi Predittiva** - Analisi progressi studenti e suggerimenti IA
- [ ] **Backup cloud opzionale** - Sincronizzazione e ripristino dati tramite Google Drive/Dropbox
- [ ] **Condivisione Programmazioni** - Esportazione e condivisione programmazioni didattiche
- [ ] **Integrazione Registro Elettronico** - Sincronizzazione con registri elettronici principali
- [ ] **Statistiche Avanzate** - Dashboard con grafici e analisi dettagliate

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
- **Material Design** - Sistema di design con Material Icons e font Roboto
- **LocalStorage API** - Persistenza dati lato client
- **OpenRouter API** - Intelligenza artificiale
- **PWA + Service Worker** - Installabile e funzionante offline

## 📱 Installazione PWA (Progressive Web App)

Docente++ può essere installato come app su smartphone, tablet e desktop!

### Come Installare

- **📱 Android**: Menu (⋮) → "Installa app"
- **🍎 iOS**: Condividi → "Aggiungi a Home"
- **💻 Desktop**: Icona "Installa" (⊕) nella barra degli indirizzi

L'app installata funziona anche offline! 

📖 **Guida completa**: [Installazione PWA](docs/PWA_INSTALLATION.md) | [Quick Start PWA](docs/PWA_QUICK_START.md)

## 🔐 Privacy e Sicurezza

- **Dati Locali** - Tutti i dati salvati solo nel browser
- **API Key Sicura** - Chiave API memorizzata localmente e mai condivisa
- **Nessun Server** - L'app funziona completamente lato client
- **HTTPS Consigliato** - Per chiamate API sicure a OpenRouter

## 🤝 Contribuire

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
