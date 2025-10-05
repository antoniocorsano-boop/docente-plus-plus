# 🎓 Docente++ 

**Web app per la gestione della didattica dell'insegnante potenziata da IA OpenRouter**

App per un insegnamento basato su IA, evoluzione del progetto docente-plus con interfaccia web completa.

## 📋 Caratteristiche

### Funzionalità Principali

- **Dashboard Intuitiva**: Panoramica rapida di lezioni, studenti e attività
- **Gestione Lezioni**: Crea, visualizza ed elimina lezioni programmate
- **Gestione Studenti**: Organizza e gestisci i tuoi studenti
- **Assistente IA OpenRouter**: Ottieni aiuto per pianificazione didattica, creazione materiali e idee innovative
- **Generazione Automatica**: Crea piani di lezione completi con l'IA
- **Persistenza Dati**: Tutti i dati salvati localmente nel browser
- **Import/Export**: Backup e ripristino dei dati

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

3. **Configura l'API Key e il Model ID**:
   - Vai nella sezione "Impostazioni"
   - Inserisci la tua OpenRouter API Key
   - (Opzionale) Inserisci il Model ID del modello OpenRouter che desideri utilizzare
   - Clicca "Verifica API Key" per testare la configurazione
   - Salva le impostazioni

4. **Inizia ad usare l'app**:
   - Aggiungi studenti e lezioni
   - Usa l'assistente IA per generare contenuti
   - Esporta i tuoi dati per backup

## 📖 Guida all'Uso

### Dashboard
Visualizza statistiche rapide su:
- Numero di lezioni programmate
- Totale studenti
- Valutazioni pendenti
- Stato connessione IA

### Gestione Lezioni
1. Clicca "Nuova Lezione" per creare manualmente
2. Oppure "Genera con IA" per una generazione assistita
3. Compila i campi richiesti
4. Salva e visualizza nella lista

### Gestione Studenti
1. Aggiungi studenti con nome, email e classe
2. Visualizza e gestisci l'elenco completo
3. Elimina studenti quando necessario

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
