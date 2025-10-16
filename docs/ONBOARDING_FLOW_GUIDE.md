# 📋 Guida al Flusso di Onboarding - Docente++

## Panoramica

A partire dalla versione 1.2.0, Docente++ implementa un flusso di onboarding obbligatorio per garantire che tutti gli utenti configurino correttamente il proprio profilo prima di accedere alle funzionalità principali dell'applicazione.

## Obiettivi del Nuovo Flusso

1. **Prevenire stati intermedi non chiari** - Gli utenti non possono più trovarsi in uno stato in cui l'app è parzialmente funzionante
2. **Garantire dati essenziali** - Assicura che ogni utente abbia almeno un nome configurato
3. **Esperienza utente migliore** - Guida chiara su cosa fare quando le funzionalità sono bloccate
4. **Gestione errori robusta** - Migliore gestione di localStorage corrotto o non disponibile

## Flusso Utente

### 1. Primo Avvio

Quando un utente apre Docente++ per la prima volta:

```
┌─────────────────────────────────────┐
│  Docente++ si carica                │
│  ↓                                   │
│  Controlla isOnboardingComplete()    │
│  ↓                                   │
│  FALSE: Mostra modal onboarding      │
│  ↓                                   │
│  Disabilita menu (tranne Home/Settings)│
│  ↓                                   │
│  Mostra banner "Configurazione incompleta"│
└─────────────────────────────────────┘
```

**Elemento visivo:** Modal di onboarding centrata con sfondo overlay

**Campi del form:**
- Nome * (obbligatorio)
- Cognome (opzionale)
- Anno Scolastico (opzionale, es. 2024/2025)

**Azioni disponibili:**
- ✅ "Inizia ad Usare Docente++" (submit)
- ℹ️ Messaggio informativo: "Il completamento del profilo è necessario per accedere all'applicazione"

**Nota:** Il pulsante "Salta per Ora" è stato rimosso nella v1.2.0

### 2. Completamento Onboarding

Quando l'utente compila e invia il form:

```
┌─────────────────────────────────────┐
│  Valida che "Nome" sia compilato    │
│  ↓                                   │
│  Salva dati in localStorage          │
│  ↓                                   │
│  Imposta onboardingComplete = true   │
│  ↓                                   │
│  Nascondi modal                      │
│  ↓                                   │
│  Nascondi banner                     │
│  ↓                                   │
│  Abilita tutte le voci di menu       │
│  ↓                                   │
│  Inizializza UI completa             │
│  ↓                                   │
│  Toast: "Profilo configurato!"       │
└─────────────────────────────────────┘
```

### 3. Avvii Successivi

Quando un utente ritorna all'app dopo aver completato l'onboarding:

```
┌─────────────────────────────────────┐
│  Docente++ si carica                │
│  ↓                                   │
│  Controlla isOnboardingComplete()    │
│  ↓                                   │
│  TRUE: Controlla isProfileComplete() │
│  ↓                                   │
│  TRUE: App completamente funzionante │
│  ↓                                   │
│  Abilita tutte le voci di menu       │
│  ↓                                   │
│  Nascondi banner                     │
└─────────────────────────────────────┘
```

### 4. Gestione Dati Corrotti

Se localStorage contiene dati corrotti o il profilo è incompleto:

```
┌─────────────────────────────────────┐
│  Docente++ si carica                │
│  ↓                                   │
│  onboardingComplete = TRUE           │
│  MA teacherName è vuoto/missing      │
│  ↓                                   │
│  Mostra banner "Configurazione incompleta"│
│  ↓                                   │
│  Disabilita menu (tranne Home/Settings)│
│  ↓                                   │
│  Inizializza UI limitata             │
│  ↓                                   │
│  Toast: "Profilo incompleto. Completa i dati..."│
└─────────────────────────────────────┘
```

**Come risolvere:**
1. Clicca sul banner "Completa Profilo"
2. Inserisci i dati mancanti
3. Salva
4. Menu si abilita automaticamente

## Componenti UI

### Banner "Configurazione Incompleta"

**Posizione:** Sticky top, subito sotto l'header principale

**Aspetto:**
- Sfondo: Gradiente arancione (#ff9800 → #f57c00)
- Icona: Material Symbol "info"
- Testo: 
  - Titolo: "Configurazione incompleta" (bold)
  - Sottotitolo: "Completa il tuo profilo per accedere a tutte le funzionalità"
- Pulsante: "Completa Profilo" (bianco su arancione)

**Comportamento:**
- Appare solo se il profilo non è completo
- Scompare automaticamente quando il profilo viene completato
- È sempre visibile durante lo scroll
- Animazione di entrata: slide down con fade in

### Voci di Menu Disabilitate

**Aspetto visivo:**
- Opacità: 40%
- Cursore: not-allowed
- Icona lucchetto: 🔒 aggiunta dopo il testo
- Non clickabile (pointer-events: none)

**Voci abilitate sempre:**
- 🏠 Home
- ⚙️ Impostazioni

**Voci disabilitate prima del completamento:**
- 📚 Lezioni
- 👥 Studenti
- 🎓 Classi
- 📝 Attività
- 📊 Valutazioni
- 📅 Orario
- 📆 Agenda
- 🤖 Assistente IA
- 📄 Importa Documenti

**Feedback al click:**
- Toast: "Completa il profilo per accedere a questa funzionalità"

## Validazione e Controlli

### Funzioni di Controllo

```javascript
// Controlla se l'onboarding è stato completato
isOnboardingComplete()
// Returns: boolean
// Controlla: localStorage.getItem('onboardingComplete') === 'true'

// Controlla se il profilo è completo e valido
isProfileComplete()
// Returns: boolean
// Controlla: 
//   - isOnboardingComplete() === true
//   - state.settings.teacherName esiste
//   - state.settings.teacherName.trim() !== ''
```

### Validazione Form Onboarding

**Campo Nome:**
- Required: true
- Validazione: Non può essere vuoto o solo spazi
- Errore: "Inserisci almeno il tuo nome."

**Campo Cognome:**
- Required: false
- Nessuna validazione particolare

**Campo Anno Scolastico:**
- Required: false
- Placeholder: "2024/2025"
- Nessuna validazione particolare

## Gestione Errori

### localStorage Non Disponibile

**Scenari:**
- Browser troppo vecchio
- localStorage disabilitato
- Modalità privata con restrizioni
- Quota storage esaurita

**Comportamento:**
```javascript
if (!checkStorageHealth()) {
    showToast('Errore: localStorage non disponibile. Verifica le impostazioni del browser.', 'error', 10000);
    return false;
}
```

**Azione utente:** 
- Messaggio di errore persistente (10 secondi)
- Guida l'utente a verificare le impostazioni del browser

### Dati Corrotti in localStorage

**Rilevamento:**
- Parsing JSON fallisce
- Tipi di dati non corrispondono
- Valori null/undefined inaspettati

**Comportamento:**
```javascript
try {
    const parsed = JSON.parse(value);
    // Validate data type
} catch (error) {
    console.warn('Failed to parse localStorage item:', error);
    return fallback; // Usa valore di default
}
```

**Azione automatica:**
- Reset ai valori di default
- Toast: "Dati corrotti rilevati. App ripristinata ai valori predefiniti."
- L'app continua a funzionare con dati puliti

### Profilo Incompleto dopo Onboarding

**Scenari:**
- Dati del profilo cancellati manualmente
- localStorage parzialmente corrotto
- Bug durante il salvataggio

**Comportamento:**
- Banner "Configurazione incompleta" visibile
- Menu disabilitato (tranne Home/Settings)
- Toast: "Profilo incompleto. Completa i dati mancanti..."

**Recupero:**
1. Utente clicca su "Completa Profilo" nel banner
2. Modal onboarding si apre con dati esistenti pre-compilati
3. Utente completa i campi mancanti
4. Salvataggio e ripristino funzionalità

## Best Practices per Sviluppatori

### 1. Non Permettere Mai Stati Intermedi

❌ **Sbagliato:**
```javascript
// Permettere skip senza dati minimi
function skipOnboarding() {
    localStorage.setItem('onboardingComplete', 'true');
    // Nessun dato salvato!
}
```

✅ **Corretto:**
```javascript
// Skip non permesso, deve completare
function skipOnboarding() {
    console.warn('Skipping onboarding is not allowed.');
    return false;
}
```

### 2. Validare Sempre il Profilo

❌ **Sbagliato:**
```javascript
if (isOnboardingComplete()) {
    enableAllFeatures();
}
```

✅ **Corretto:**
```javascript
if (isOnboardingComplete() && isProfileComplete()) {
    enableAllFeatures();
} else {
    showBanner();
    disableMenu();
}
```

### 3. Fornire Feedback Chiaro

❌ **Sbagliato:**
```javascript
// Disabilita senza spiegazioni
button.disabled = true;
```

✅ **Corretto:**
```javascript
button.classList.add('disabled');
button.setAttribute('title', 'Completa il profilo per accedere');
button.addEventListener('click', () => {
    showToast('Completa il profilo per accedere a questa funzionalità');
});
```

### 4. Gestire Errori Gracefully

❌ **Sbagliato:**
```javascript
const data = JSON.parse(localStorage.getItem('data'));
// Può lanciare errore e bloccare l'app
```

✅ **Corretto:**
```javascript
const data = safeJSONParse(localStorage.getItem('data'), defaultValue);
// Ritorna sempre un valore valido
```

## Testing

### Test Manuali Essenziali

1. **Primo avvio pulito**
   ```
   1. Cancella localStorage
   2. Ricarica app
   3. Verifica: Modal onboarding appare
   4. Verifica: Menu disabilitato
   5. Verifica: Banner visibile
   ```

2. **Completamento onboarding**
   ```
   1. Compila solo campo Nome
   2. Submit form
   3. Verifica: Modal si chiude
   4. Verifica: Banner scompare
   5. Verifica: Menu tutto abilitato
   6. Verifica: Toast successo appare
   ```

3. **Validazione campo obbligatorio**
   ```
   1. Lascia campo Nome vuoto
   2. Prova submit
   3. Verifica: Form non si invia
   4. Verifica: Toast warning appare
   ```

4. **Dati corrotti**
   ```
   1. Imposta manualmente: localStorage.setItem('onboardingComplete', 'true')
   2. NON impostare teacherName
   3. Ricarica app
   4. Verifica: Banner appare
   5. Verifica: Menu disabilitato
   6. Verifica: Toast warning appare
   ```

5. **Recupero da profilo incompleto**
   ```
   1. Scenario dati corrotti attivo
   2. Clicca "Completa Profilo" nel banner
   3. Inserisci nome
   4. Salva
   5. Verifica: Menu si abilita
   6. Verifica: Banner scompare
   ```

6. **Click su voci disabilitate**
   ```
   1. Con profilo incompleto
   2. Clicca su voce disabilitata (es. Lezioni)
   3. Verifica: Nessun cambio tab
   4. Verifica: Toast warning appare
   ```

7. **localStorage non disponibile**
   ```
   1. Disabilita localStorage nel browser
   2. Ricarica app
   3. Verifica: Toast errore appare
   4. Verifica: App non si blocca
   ```

## Metriche e Monitoraggio

### Eventi da Tracciare

- `onboarding_started` - Modal aperta
- `onboarding_completed` - Form inviato con successo
- `onboarding_validation_error` - Errore validazione form
- `profile_incomplete_detected` - Dati corrotti rilevati
- `banner_shown` - Banner "Configurazione incompleta" mostrato
- `banner_button_clicked` - Click su "Completa Profilo"
- `menu_item_disabled_clicked` - Click su voce disabilitata
- `localStorage_error` - Errore accesso localStorage

### KPI

- **Tasso completamento onboarding** - % utenti che completano vs abbandonano
- **Tempo medio completamento** - Secondi dall'apertura modal al submit
- **Tasso errori validazione** - % submit falliti per validazione
- **Tasso recupero da errori** - % utenti che risolvono profilo incompleto

## Changelog

### v1.2.0 (2025-10-16)
- ✅ Implementato flusso onboarding obbligatorio
- ✅ Rimosso pulsante "Salta per Ora"
- ✅ Aggiunto banner persistente per configurazione incompleta
- ✅ Disabilitazione selettiva voci di menu
- ✅ Migliorata gestione errori localStorage
- ✅ Aggiunta validazione `isProfileComplete()`
- ✅ Feedback visivo per voci disabilitate
- ✅ Toast informativi per guidare l'utente
- ✅ Documentazione completa del flusso

### v1.1.0 (Precedente)
- Onboarding opzionale con skip
- Nessuna validazione profilo
- Menu sempre abilitato

---

**Versione documento:** 1.0  
**Autore:** Sistema Copilot  
**Ultimo aggiornamento:** 2025-10-16  
**Compatibile con:** Docente++ v1.2.0+
