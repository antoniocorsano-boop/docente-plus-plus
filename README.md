# 🎓 Docente++ 

**Web app per la gestione della didattica dell'insegnante potenziata da IA OpenRouter**

App per un insegnamento basato su IA, evoluzione del progetto docente-plus con interfaccia web completa.

## 📋 Caratteristiche

### Funzionalità Principali

- **🎯 Onboarding Guidato**: Configurazione iniziale del profilo docente al primo accesso
- **👤 Profilo Docente**: Nome, cognome, email e informazioni scolastiche complete
- **🏫 Gestione Classi**: Crea, modifica ed elimina le tue classi con dettagli completi
- **📚 Discipline**: Gestione materie insegnate con autocomplete intelligente
- **📅 Anno Scolastico**: Configurazione anno scolastico con date inizio/fine personalizzabili
- **📅 Orario Didattico**: Gestione dell'orario settimanale con vista giornaliera e settimanale (lun-ven, 8-14)
- **Dashboard Intuitiva**: Panoramica rapida di lezioni, studenti e attività con selezione classe attiva
- **Gestione Lezioni**: Crea, visualizza ed elimina lezioni programmate
- **📋 Gestione Attività**: Sistema completo per pianificare e monitorare attività didattiche (esercitazioni, laboratori, progetti, compiti)
- **Gestione Studenti**: Organizza e gestisci i tuoi studenti
- **✅ Gestione Valutazioni**: Sistema completo per criteri, griglie e valutazioni personalizzate
- **Assistente IA OpenRouter**: Ottieni aiuto per pianificazione didattica, creazione materiali e idee innovative
- **Generazione Automatica**: Crea piani di lezione completi con l'IA
- **Persistenza Dati**: Tutti i dati salvati localmente nel browser
- **Import/Export**: Backup e ripristino completo di profilo, classi e dati

### Funzionalità IA

L'assistente IA OpenRouter può aiutarti con:
- 📐 Generazione piani di lezione strutturati
- ✍️ Creazione di esercizi e attività didattiche
- 🎯 Suggerimenti per attività interattive
- 📊 Criteri e griglie di valutazione
- 💡 Idee innovative per l'insegnamento
- 🔍 Consigli personalizzati per la didattica

## 🚀 Installazione e Utilizzo

### Requisiti

- Browser web moderno (Chrome, Firefox, Safari, Edge)
- Chiave API OpenRouter (ottenibile su [https://openrouter.ai](https://openrouter.ai))

### Avvio Rapido

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

3. **Primo accesso - Onboarding**:
   - Al primo avvio, compila il form di benvenuto con:
     - Nome, cognome ed email
     - Ordine di scuola (Infanzia, Primaria, Secondaria I/II grado)
     - Discipline insegnate (con autocomplete)
     - Anno scolastico con date personalizzabili (default: 09/09/2025 - 30/06/2026)
   - Clicca "Inizia ad Usare Docente++"

4. **Configura le tue classi**:
   - Vai nella sezione "Classi"
   - Aggiungi le tue classi con nome, anno, sezione e numero studenti
   - Modifica o elimina classi quando necessario

5. **Configura l'API Key** (opzionale, per usare l'IA):
   - Vai nella sezione "Impostazioni"
   - Inserisci la tua OpenRouter API Key
   - (Opzionale) Inserisci il Model ID del modello OpenRouter
   - Clicca "Verifica API Key" per testare la configurazione
   - Salva le impostazioni

6. **Inizia ad usare l'app**:
   - Seleziona la classe attiva dalla Dashboard
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
- **Onboarding Guidato**: Configurazione iniziale del profilo docente al primo accesso
- **Gestione Classi**: Creazione, modifica, eliminazione classi
- **Gestione Studenti**: Organizzazione degli studenti
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

- **Backup cloud opzionale**: Sincronizzazione e ripristino dati tramite provider esterni (es. Google Drive, Dropbox)
- **Accessibilità estesa**: Miglioramento funzioni per utenti con disabilità (es. navigazione da tastiera, testo alternativo, modalità contrasto elevato)

> **Nota**: Per richiedere una nuova funzionalità o discutere le priorità, apri una [nuova issue](https://github.com/antbrogame-a11y/docente-plus-plus/issues) su GitHub.

## 📖 Guida all'Uso

### 🎓 Onboarding Iniziale
Al primo accesso, l'app ti guiderà attraverso la configurazione del profilo:
1. **Dati Personali**: Nome, cognome ed email
2. **Informazioni Scolastiche**: Ordine di scuola e nome istituto
3. **Discipline**: Seleziona o inserisci le materie che insegni
4. **Anno Scolastico**: Scegli l'anno e personalizza le date di inizio/fine

Tutti i dati vengono salvati automaticamente in localStorage.

### 🏫 Gestione Classi
1. Clicca "Nuova Classe" nella sezione Classi
2. Inserisci nome classe (es. 3A, 5B)
3. (Opzionale) Specifica anno di corso, sezione e numero studenti
4. Le classi create saranno disponibili nel selettore della Dashboard
5. Modifica o elimina classi in qualsiasi momento

### 📊 Dashboard
Visualizza statistiche rapide su:
- Numero di lezioni programmate
- Totale studenti
- Valutazioni pendenti
- Stato connessione IA
- **Classe Attiva**: Seleziona la classe corrente per contestualizzare l'assistente IA

### 📚 Gestione Lezioni
1. Clicca "Nuova Lezione" per creare manualmente
2. Oppure "Genera con IA" per una generazione assistita
3. Compila i campi richiesti
4. Salva e visualizza nella lista

### 📅 Gestione Orario Didattico

La sezione "Orario" ti permette di gestire il tuo orario settimanale in modo interattivo:

#### Funzionalità Principali
1. **Vista Settimanale**: Visualizza l'intera settimana dal lunedì al venerdì in una griglia
2. **Vista Giornaliera**: Visualizza in dettaglio l'orario di un singolo giorno
3. **Slot Orari**: Configura gli slot dalle 8:00 alle 14:00 (6 ore al giorno)
4. **Esclusione Weekend**: Sabato e domenica sono automaticamente esclusi

#### Configurazione Orario
1. **Clicca su una cella** per modificare lo slot orario
2. **Seleziona la classe** dal menu a tendina
3. **Scegli il tipo di attività**:
   - **T** (Teoria) - Badge blu
   - **D** (Disegno) - Badge arancione
   - **L** (Laboratorio) - Badge verde
4. Salva o elimina lo slot

#### Avvio Attività
1. Clicca il pulsante **"Avvia"** su uno slot configurato
2. Viene mostrata una finestra con le attività disponibili per la classe:
   - Attività in corso
   - Attività pianificate
   - Attività completate di recente
3. Seleziona un'attività per gestirla

#### Navigazione
- **Settimana Precedente/Successiva**: Naviga tra le settimane
- **Giorno Precedente/Successivo**: Naviga tra i giorni (solo giorni lavorativi)
- **Toggle Vista**: Passa da vista settimanale a giornaliera e viceversa

> **Nota**: L'orario viene salvato automaticamente e incluso nei backup JSON, PDF ed Excel.

### Gestione Studenti
1. Aggiungi studenti con nome, email e classe
2. Visualizza e gestisci l'elenco completo
3. Elimina studenti quando necessario

### ✅ Gestione Valutazioni

La nuova sezione "Valutazioni" offre un sistema completo per gestire la valutazione degli studenti:

#### 📋 Criteri di Valutazione
1. Crea criteri personalizzati (es. "Comprensione del testo narrativo")
2. Specifica tipo: Conoscenza, Competenza, Abilità o Atteggiamento
3. Associa una disciplina al criterio
4. Usa l'IA per generare criteri automaticamente

#### 📊 Griglie di Valutazione (Rubriche)
1. Crea griglie con livelli di performance predefiniti:
   - **Eccellente**: 10/10
   - **Buono**: 8/10
   - **Sufficiente**: 6/10
   - **Insufficiente**: 4/10
2. Personalizza per disciplina e argomento
3. Usa le griglie per valutazioni standardizzate

#### ✅ Assegnazione Valutazioni
1. Assegna valutazioni a singoli studenti o classi intere
2. Scegli un criterio o una griglia di riferimento
3. Seleziona la disciplina di riferimento
4. Inserisci voto (opzionale) e note dettagliate
5. Traccia la data della valutazione
6. Visualizza tutte le valutazioni assegnate

#### 📈 Risultati e Statistiche
1. **Visualizzazione per Studente**: Vedi tutte le valutazioni di ogni studente con media calcolata automaticamente
2. **Visualizzazione Aggregata per Classe**: Analizza i risultati a livello di classe con:
   - Media generale della classe
   - Numero totale di valutazioni
   - Medie per disciplina con dettaglio del numero di valutazioni
3. **Filtri Avanzati**: Filtra i risultati per classe, disciplina o studente specifico
4. **Cambio Visualizzazione**: Passa facilmente tra vista studente e vista classe

#### 📥 Esportazione Valutazioni
- **Formati multipli disponibili**: JSON, PDF e Excel (XLSX)
- **JSON**: Formato dati strutturato, ideale per backup e importazione
- **PDF**: Documento formattato pronto per la stampa e condivisione professionale
- **Excel**: Foglio di calcolo per analisi avanzate e manipolazione dati
- Include criteri, griglie e valutazioni con dati completi
- **Statistiche avanzate**: L'export include automaticamente:
  - Numero totale di valutazioni, studenti e classi
  - Media generale di tutte le valutazioni
  - Statistiche per disciplina (conteggio e media)
  - Statistiche per classe (conteggio e media)
- **Privacy e Sicurezza**: Footer con nota di riservatezza nei documenti PDF
- Ideale per reportistica, condivisione con colleghi e analisi dettagliate

### 🔔 Notifiche e Promemoria

Il sistema di notifiche ti aiuta a rimanere organizzato e non perdere scadenze importanti con notifiche automatiche, promemoria personalizzati e un sistema di gestione completo.

#### Tipi di Notifiche

Il sistema supporta diverse categorie di notifiche:
- **📚 Lezioni**: Promemoria automatici per lezioni programmate
- **⏰ Promemoria**: Promemoria personalizzati creati manualmente
- **💾 Backup**: Avvisi per ricordarti di eseguire backup periodici dei dati
- **⚙️ Sistema**: Notifiche di sistema (import/export completati, aggiornamenti, ecc.)

#### Notifiche Automatiche per Lezioni
1. **Promemoria 24 ore prima**: Ricevi un avviso il giorno prima della lezione
2. **Promemoria 1 ora prima**: Avviso finale un'ora prima dell'inizio
3. Le notifiche vengono inviate automaticamente per tutte le lezioni programmate
4. Puoi configurare quali promemoria ricevere nelle impostazioni

#### Promemoria Backup Automatici
1. **Backup Periodici**: Il sistema ti ricorda di eseguire backup regolari dei tuoi dati
2. **Intervallo Configurabile**: Imposta ogni quanti giorni ricevere il promemoria (default: 7 giorni)
3. **Tracciamento Automatico**: L'ultimo backup viene tracciato automaticamente
4. **Notifiche Completamento**: Ricevi conferma quando esporti o importi i dati

#### Promemoria Personalizzati
1. Vai alla sezione "Notifiche"
2. Clicca "Nuovo Promemoria"
3. Inserisci titolo, messaggio, data e ora
4. Il promemoria apparirà nella lista e ti notificherà al momento opportuno
5. Puoi archiviare o eliminare promemoria completati

#### Gestione e Filtri Notifiche
- **Filtri per Categoria**: Visualizza solo le notifiche di una specifica categoria (Tutte, Lezioni, Promemoria, Backup, Sistema)
- **Contatori in Tempo Reale**: Ogni filtro mostra il numero di notifiche per categoria
- **Indicatori Visivi**: Ogni tipo di notifica ha un colore distintivo per facile identificazione
- **Badge Non Lette**: Visualizza il numero di notifiche non ancora lette

#### Storico Notifiche
- Visualizza tutte le notifiche ricevute (limite 50 più recenti)
- Distingui tra notifiche lette e non lette con indicatori visivi
- Segna notifiche come lette individualmente o tutte insieme
- Elimina singole notifiche o pulisci tutto lo storico
- Filtra per tipo per trovare rapidamente ciò che cerchi

#### Impostazioni Notifiche
- **Notifiche Browser**: Abilita/disabilita notifiche popup del browser
- **Promemoria Lezioni**: Attiva/disattiva i promemoria automatici per le lezioni
- **Promemoria Backup**: Attiva/disattiva i promemoria periodici per i backup
- **Intervallo Backup**: Configura ogni quanti giorni ricevere il promemoria (1-365 giorni)
- **Orari di Silenzio**: Configura orari in cui non ricevere notifiche (es. 22:00-07:00)
- Personalizza quando ricevere i promemoria (24h, 1h prima)

**Nota**: Per ricevere notifiche browser, devi autorizzare il sito quando richiesto dal browser.

### Assistente IA
1. Scrivi la tua richiesta nella chat
2. Usa i suggerimenti rapidi per iniziare
3. L'IA risponderà con consigli professionali
4. Usa Ctrl+Enter per inviare rapidamente

### Configurazione Modello IA
L'applicazione permette di configurare il modello OpenRouter da utilizzare:
- **Model ID predefinito**: `alibaba/tongyi-deepresearch-30b-a3b` (gratuito)
- **Modelli personalizzati**: Puoi specificare qualsiasi modello disponibile su OpenRouter
- **Esempi di modelli**:
  - `openai/gpt-3.5-turbo` - Modello OpenAI veloce ed economico
  - `anthropic/claude-2` - Modello Anthropic Claude
  - `google/palm-2-chat-bison` - Modello Google PaLM
  - Per la lista completa, visita [OpenRouter Models](https://openrouter.ai/models)

**Nota**: Alcuni modelli potrebbero richiedere crediti sul tuo account OpenRouter.

### Import/Export Dati

#### 📥 Esportazione Dati
L'applicazione supporta l'esportazione completa dei dati in **tre formati**:

1. **JSON** - Formato dati strutturato
   - Ideale per backup completi e importazione
   - Include tutti i dati: lezioni, studenti, classi, valutazioni, notifiche, ecc.
   - Perfetto per portabilità e ripristino completo

2. **PDF** - Documento formattato
   - Report professionale pronto per la stampa
   - Include riepilogo con statistiche principali
   - Tabelle formattate con classi, studenti e valutazioni
   - Footer con nota di riservatezza e numerazione pagine
   - Ideale per condivisione formale e archivio cartaceo

3. **Excel (XLSX)** - Foglio di calcolo
   - Fogli separati per ogni tipo di dati (Profilo, Classi, Studenti, Lezioni, Valutazioni, Discipline)
   - Perfetto per analisi avanzate con Excel, Google Sheets, LibreOffice
   - Facile manipolazione e filtri personalizzati
   - Compatibile con tutti i software di foglio di calcolo

**Come esportare**:
- Vai nella sezione "Impostazioni"
- Clicca su "📥 Esporta Dati"
- Scegli il formato desiderato (JSON, PDF o Excel)
- Il file verrà scaricato automaticamente

#### 📤 Importazione Dati
- **Import**: Ripristina dati da un file JSON precedentemente esportato
- Tutti i dati vengono ripristinati: lezioni, studenti, classi, valutazioni, notifiche, ecc.

## 🏗️ Struttura del Progetto

```
docente-plus-plus/
├── index.html      # Interfaccia principale dell'app
├── styles.css      # Stili e design dell'applicazione
├── app.js          # Logica applicativa e integrazione IA
└── README.md       # Questa documentazione
```

## 🔧 Tecnologie Utilizzate

- **HTML5**: Struttura semantica moderna
- **CSS3**: Design responsive con variabili CSS e animazioni
- **JavaScript (ES6+)**: Logica applicativa orientata agli oggetti
- **LocalStorage API**: Persistenza dati lato client
- **OpenRouter API**: Intelligenza artificiale per assistenza didattica
- **Fetch API**: Comunicazione con servizi esterni

## 🎨 Caratteristiche del Design

- **Responsive**: Funziona su desktop, tablet e mobile
- **Accessibile**: Interfaccia chiara e intuitiva
- **Moderna**: Design pulito con animazioni fluide
- **Tema Personalizzabile**: Variabili CSS per facile personalizzazione

## 🔐 Privacy e Sicurezza

- **Dati Locali**: Tutti i dati sono salvati solo nel tuo browser
- **API Key Sicura**: La chiave API è memorizzata localmente e mai condivisa
- **Nessun Server**: L'app funziona completamente lato client
- **HTTPS Consigliato**: Per chiamate API sicure a OpenRouter

## 📝 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file LICENSE per i dettagli.

## 🤝 Contributi

I contributi sono benvenuti! Per contribuire:

1. Fai fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 🐛 Segnalazione Bug

Per segnalare bug o richiedere nuove funzionalità, apri una [Issue](https://github.com/antbrogame-a11y/docente-plus-plus/issues) su GitHub.

## 👨‍💻 Autore

Progetto sviluppato per migliorare la gestione didattica degli insegnanti attraverso l'intelligenza artificiale.

## 📚 Risorse Utili

- [Documentazione OpenRouter API](https://openrouter.ai/docs)
- [Guida HTML5](https://developer.mozilla.org/it/docs/Web/HTML)
- [Guida CSS3](https://developer.mozilla.org/it/docs/Web/CSS)
- [Guida JavaScript](https://developer.mozilla.org/it/docs/Web/JavaScript)

## 🔄 Changelog

### Versione 1.0.0 (2025)
- Implementazione iniziale dell'applicazione web
- Integrazione con OpenRouter AI
- Gestione lezioni e studenti
- Dashboard interattiva
- Sistema di import/export dati
- Design responsive completo

---

**Nota**: Questa è una web app standalone che non richiede installazione di dipendenze. Basta aprire `index.html` in un browser per iniziare!
