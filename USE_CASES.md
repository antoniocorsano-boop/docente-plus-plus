# Analisi del Progetto e Casi d'Uso per Docente++

## 1. Analisi del Progetto

### Scopo
**Docente++** è un'applicazione web completa progettata per assistere gli insegnanti nella gestione delle loro attività didattiche quotidiane. L'obiettivo è di semplificare le attività amministrative, la pianificazione delle lezioni e la valutazione degli studenti attraverso un'unica interfaccia intuitiva, potenziata da un assistente basato su intelligenza artificiale.

### Funzionalità Chiave
L'applicazione include moduli per la gestione di:
- **Classi e Studenti**: Anagrafica completa.
- **Lezioni e Attività Didattiche**: Pianificazione e monitoraggio.
- **Valutazioni**: Criteri, griglie e registrazione dei voti.
- **Orario**: Organizzazione della settimana didattica.
- **Assistente IA**: Supporto per la generazione di contenuti didattici (via OpenRouter).
- **Dati**: Persistenza locale tramite `localStorage` e funzionalità avanzate di import/export (JSON, PDF, Excel).
- **Utility**: Notifiche, promemoria e registrazione audio.

### Attori
L'unico attore del sistema è l'**Insegnante** (Docente), che esegue tutte le operazioni disponibili nell'applicazione.

---

## 2. Casi d'Uso (Use Cases)

Di seguito sono elencati i casi d'uso che descrivono le interazioni tra l'attore (Insegnante) e il sistema (Docente++).

### Categoria: Configurazione e Gestione del Sistema
| ID      | Nome del Caso d'Uso         | Descrizione                                                                                                                              |
|---------|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| **UC-01** | Completare l'Onboarding       | Un nuovo insegnante inserisce le proprie informazioni personali, scolastiche e di materia per configurare il profilo al primo utilizzo.      |
| **UC-02** | Configurare le Impostazioni   | L'insegnante aggiorna il proprio profilo, i dettagli della scuola, le materie insegnate o la chiave API per l'assistente IA.             |
| **UC-03** | Gestire le Discipline         | L'insegnante aggiunge nuove discipline al proprio profilo o rimuove quelle esistenti.                                                    |

### Categoria: Gestione Didattica Principale
| ID      | Nome del Caso d'Uso         | Descrizione                                                                                                                              |
|---------|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| **UC-04** | Gestire le Classi           | L'insegnante crea, modifica o elimina le voci relative alle classi (es. "3A", "2B").                                                     |
| **UC-05** | Gestire gli Studenti        | L'insegnante aggiunge, modifica o elimina i profili degli studenti all'interno delle proprie classi.                                     |
| **UC-06** | Gestire le Lezioni          | L'insegnante crea, visualizza o elimina manualmente i piani delle lezioni.                                                               |
| **UC-07** | Gestire le Attività Didattiche| L'insegnante crea, monitora lo stato (pianificata, in corso, completata) ed elimina attività come compiti, progetti o laboratori.        |
| **UC-08** | Gestire l'Orario            | L'insegnante organizza il proprio orario didattico settimanale o giornaliero assegnando classi e tipi di attività a specifici slot orari. |

### Categoria: Gestione delle Valutazioni
| ID      | Nome del Caso d'Uso         | Descrizione                                                                                                                              |
|---------|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| **UC-09** | Gestire i Criteri di Valutazione | L'insegnante definisce, visualizza o elimina criteri personalizzati per le valutazioni.                                                  |
| **UC-10** | Gestire le Griglie di Valutazione| L'insegnante crea, visualizza o elimina rubriche di valutazione con livelli di performance predefiniti.                               |
| **UC-11** | Registrare le Valutazioni   | L'insegnante assegna valutazioni a studenti o classi utilizzando i criteri e le griglie stabiliti.                                       |
| **UC-12** | Analizzare i Risultati      | L'insegnante visualizza dati aggregati sulle valutazioni, filtrando per classe, studente o materia per analizzare le performance.        |

### Categoria: Interazione con l'Assistente IA
| ID      | Nome del Caso d'Uso         | Descrizione                                                                                                                              |
|---------|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| **UC-13** | Generare Lezione con IA     | L'insegnante richiede all'assistente IA di creare automaticamente un piano di lezione dettagliato per una materia e un argomento specifici.|
| **UC-14** | Generare Criteri con IA     | L'insegnante utilizza l'IA per generare criteri di valutazione pertinenti per una materia.                                                |
| **UC-15** | Usare l'Assistente IA Generico| L'insegnante interagisce con l'IA per ottenere aiuto didattico generale, come idee per attività o chiarimenti su concetti.                |

### Categoria: Gestione Dati e Utility
| ID      | Nome del Caso d'Uso         | Descrizione                                                                                                                              |
|---------|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| **UC-16** | Importare Studenti da File  | L'insegnante carica un file (es. CSV, XLSX) per importare in massa i dati degli studenti nell'applicazione.                              |
| **UC-17** | Importare Attività da File  | L'insegnante carica un documento (es. PDF) contenente un piano didattico per importare più attività contemporaneamente.                  |
| **UC-18** | Esportare i Dati            | L'insegnante esporta tutti i dati dell'applicazione (profilo, classi, studenti, ecc.) in un unico file (JSON, PDF o Excel) per backup.   |
| **UC-19** | Esportare le Valutazioni    | L'insegnante esporta un report dettagliato dei dati e delle statistiche di valutazione.                                                  |
| **UC-20** | Gestire le Notifiche        | L'insegnante visualizza le notifiche di sistema e crea o gestisce promemoria personali.                                                  |
| **UC-21** | Registrare Lezione Audio    | L'insegnante registra una lezione audio, che viene salvata all'interno dell'applicazione per la riproduzione o il download.             |