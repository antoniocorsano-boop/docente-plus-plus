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
- **Dashboard Intuitiva**: Panoramica rapida di lezioni, studenti e attività con selezione classe attiva
- **Gestione Lezioni**: Crea, visualizza ed elimina lezioni programmate
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
- **Import/Export**: Backup e ripristino di profilo, classi e dati
- **Onboarding Guidato**: Configurazione iniziale del profilo docente al primo accesso
- **Gestione Classi**: Creazione, modifica, eliminazione classi
- **Gestione Studenti**: Organizzazione degli studenti
- **Gestione Lezioni**: Crea, visualizza ed elimina lezioni programmate
- **✅ Gestione Valutazioni Avanzata**: Sistema completo per criteri, griglie e valutazioni personalizzate con supporto IA
- **Gestione Materie**: Gestione discipline con autocomplete intelligente
- **Configurazione Anno Scolastico**: Date inizio/fine personalizzabili
- **Dashboard Intuitiva**: Panoramica di lezioni, studenti e attività
- **Configurazione Model ID OpenRouter**: Impostazione del modello IA utilizzato direttamente dalle impostazioni
- **Privacy e Sicurezza**: Dati e chiavi API solo locali, nessun server
- **Responsive & Accessibile**: Interfaccia moderna, fluida, personalizzabile, compatibile desktop/tablet/mobile
- **Documentazione API**: Esempi e guida API OpenRouter disponibili

### 🚀 Funzionalità da Implementare

Le seguenti funzionalità sono pianificate per le prossime versioni:

- **Notifiche e promemoria**: Sistema di notifiche per scadenze, attività e aggiornamenti
- **Esportazione dati in formati aggiuntivi**: Supporto a PDF/Excel per report e stampe
- **Gestione attività didattiche**: Modulo dedicato per esercizi, attività interattive, compiti e materiali associati alle lezioni
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
3. Inserisci voto (opzionale) e note dettagliate
4. Traccia la data della valutazione
5. Visualizza tutte le valutazioni assegnate

#### 📥 Esportazione Valutazioni
- Esporta tutte le valutazioni in formato JSON
- Include criteri, griglie e valutazioni con dati completi
- Ideale per reportistica e analisi

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
- **Export**: Scarica tutti i tuoi dati in formato JSON
- **Import**: Ripristina dati da un file precedentemente esportato

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
