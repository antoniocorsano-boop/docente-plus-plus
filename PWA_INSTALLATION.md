# 📱 Docente++ - Guida Installazione PWA

## 🎯 Cos'è una Progressive Web App (PWA)?

Docente++ è ora una **Progressive Web App (PWA)**, il che significa che può essere installata sul tuo smartphone, tablet o computer come un'app nativa, pur rimanendo una web app. Una PWA offre:

- ✅ **Installazione facile** - Aggiungi l'app alla schermata home
- 📴 **Funzionamento offline** - Accedi ai tuoi dati anche senza connessione
- ⚡ **Velocità** - Caricamento istantaneo grazie alla cache
- 📱 **Esperienza nativa** - Si comporta come un'app installata
- 🔄 **Aggiornamenti automatici** - Sempre la versione più recente

---

## 🚀 Installazione

### 📱 Su Smartphone/Tablet Android

#### **Metodo 1: Chrome/Edge**

1. **Apri il browser** Chrome o Microsoft Edge
2. **Visita il sito** dell'app Docente++
3. **Cerca il prompt di installazione**:
   - Apparirà un banner in basso con "Installa Docente++"
   - Oppure tocca l'icona del menu (⋮) in alto a destra
4. **Seleziona "Installa app"** o "Aggiungi a schermata Home"
5. **Conferma l'installazione** - L'app verrà aggiunta alla schermata home
6. **Apri l'app** dalla schermata home come qualsiasi altra app

#### **Metodo 2: Firefox Android**

1. Apri **Firefox** sul tuo dispositivo Android
2. Visita il sito di Docente++
3. Tocca il menu (⋮) in alto a destra
4. Seleziona **"Installa"** o **"Aggiungi a schermata Home"**
5. Conferma e l'app sarà disponibile nella schermata home

---

### 🍎 Su iPhone/iPad (iOS)

#### **Safari (consigliato)**

1. **Apri Safari** sul tuo iPhone o iPad
2. **Visita il sito** di Docente++
3. **Tocca il pulsante Condividi** (quadrato con freccia in su) nella barra inferiore
4. **Scorri in basso** e tocca **"Aggiungi a Home"**
5. **Modifica il nome** se desideri (opzionale)
6. **Tocca "Aggiungi"** in alto a destra
7. **L'icona dell'app** apparirà sulla schermata home

> **Nota iOS**: Safari è il browser consigliato per iOS in quanto supporta pienamente le PWA.

---

### 💻 Su Desktop (Windows/Mac/Linux)

#### **Chrome**

1. Apri **Google Chrome**
2. Visita il sito di Docente++
3. Vedrai un'icona **"Installa"** (⊕) nella barra degli indirizzi a destra
4. **Clicca sull'icona** o vai al menu (⋮) → "Installa Docente++"
5. Conferma l'installazione
6. L'app si aprirà in una finestra dedicata e sarà aggiunta al menu Start/Applicazioni

#### **Edge**

1. Apri **Microsoft Edge**
2. Visita il sito di Docente++
3. Clicca sul menu (⋯) in alto a destra
4. Seleziona **"App" → "Installa questo sito come app"**
5. Conferma e l'app sarà disponibile nel menu Start

#### **Firefox/Safari Desktop**

Firefox e Safari desktop hanno un supporto limitato per le PWA, ma puoi comunque:
- Creare un segnalibro sulla barra dei segnalibri
- Usare la modalità schermo intero (F11)
- L'app funzionerà normalmente nel browser

---

## 🧪 Come Testare l'Installazione PWA

### ✅ Checklist di Verifica

Prima di installare, verifica che l'app sia una PWA valida:

#### **1. Apri DevTools (per sviluppatori)**

**Chrome/Edge:**
1. Apri il sito di Docente++
2. Premi `F12` o `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
3. Vai alla tab **"Application"** o **"Applicazione"**
4. Verifica le seguenti sezioni:

**Manifest:**
- ✅ Il file `manifest.json` è caricato correttamente
- ✅ Nome app: "Docente++ - Gestione Didattica con IA"
- ✅ Nome breve: "Docente++"
- ✅ Icone: 192x192 e 512x512 presenti
- ✅ Display mode: "standalone"
- ✅ Theme color: #4a90e2

**Service Workers:**
- ✅ Service Worker registrato e attivo
- ✅ Stato: "activated and running"
- ✅ Scope: /

**Storage:**
- ✅ Cache Storage presente con file cached
- ✅ LocalStorage con dati dell'app (se già utilizzata)

#### **2. Lighthouse Audit (Analisi PWA)**

1. Apri DevTools (`F12`)
2. Vai alla tab **"Lighthouse"**
3. Seleziona solo **"Progressive Web App"**
4. Clicca su **"Generate report"**
5. Verifica che il punteggio sia **≥ 90%**

**Criteri verificati da Lighthouse:**
- ✅ Manifest valido con nome e icone
- ✅ Service Worker registrato
- ✅ HTTPS (in produzione)
- ✅ Risponde con 200 quando offline
- ✅ Metadata per installazione
- ✅ Icone Apple Touch Icon
- ✅ Theme color configurato

#### **3. Test Funzionamento Offline**

1. **Installa l'app** sul dispositivo
2. **Apri l'app** e usa normalmente
3. **Attiva la modalità aereo** o disconnetti WiFi/dati
4. **Chiudi e riapri l'app**
5. **Verifica**:
   - ✅ L'app si apre correttamente
   - ✅ I dati salvati sono accessibili
   - ✅ L'interfaccia è completamente funzionante
   - ⚠️ Le funzioni che richiedono internet (AI) mostreranno un errore appropriato

#### **4. Test Cache e Performance**

1. **Prima visita**: Apri l'app per la prima volta
   - Il Service Worker viene registrato
   - I file statici vengono cached
2. **Chiudi e riapri**: L'app dovrebbe caricarsi istantaneamente
3. **Verifica Cache**:
   - Apri DevTools → Application → Cache Storage
   - Dovresti vedere 2 cache:
     - `docente-static-v1`: File statici (HTML, CSS, JS, icone)
     - `docente-dynamic-v1`: Risorse caricate dinamicamente

---

## 📊 Test di Accettazione

### Test Scenario 1: Installazione su Android

1. ✅ Apri Chrome su Android
2. ✅ Visita l'app
3. ✅ Appare il banner "Installa Docente++"
4. ✅ Tocca "Installa"
5. ✅ L'icona appare sulla home screen
6. ✅ Tocca l'icona - l'app si apre in modalità standalone
7. ✅ Nessuna barra URL visibile
8. ✅ Tema colore blu applicato alla status bar

### Test Scenario 2: Installazione su iOS

1. ✅ Apri Safari su iPhone/iPad
2. ✅ Visita l'app
3. ✅ Tocca il pulsante Condividi
4. ✅ Seleziona "Aggiungi a Home"
5. ✅ L'icona appare sulla home screen con il logo corretto
6. ✅ Tocca l'icona - l'app si apre senza barra Safari
7. ✅ Funziona come app nativa

### Test Scenario 3: Funzionamento Offline

1. ✅ Apri l'app e naviga tra le sezioni
2. ✅ Aggiungi studenti, lezioni, attività
3. ✅ Disconnetti internet
4. ✅ Chiudi e riapri l'app
5. ✅ Tutti i dati sono ancora accessibili
6. ✅ Puoi continuare a lavorare offline
7. ✅ Le modifiche vengono salvate in LocalStorage
8. ✅ Quando riconnetti, l'app funziona normalmente

### Test Scenario 4: Aggiornamenti

1. ✅ Modifica il Service Worker (cambia versione)
2. ✅ Ricarica l'app
3. ✅ Appare notifica "È disponibile un aggiornamento"
4. ✅ Conferma l'aggiornamento
5. ✅ L'app si ricarica con la nuova versione
6. ✅ I dati utente sono preservati

---

## 🔧 Risoluzione Problemi

### ❓ Il prompt di installazione non appare

**Possibili cause:**
- L'app non è servita su HTTPS (richiesto in produzione)
- Il Service Worker non è registrato correttamente
- Il manifest.json non è valido
- L'app è già installata

**Soluzioni:**
1. Verifica che il sito usi HTTPS in produzione
2. Controlla la console per errori del Service Worker
3. Valida il manifest.json in DevTools
4. Se già installata, disinstalla e reinstalla

### ❓ L'app non funziona offline

**Soluzioni:**
1. Verifica che il Service Worker sia attivo (DevTools → Application → Service Workers)
2. Controlla la Cache Storage - deve contenere i file necessari
3. Cancella cache e ricarica:
   ```
   DevTools → Application → Clear storage → Clear site data
   ```
4. Ricarica la pagina e riprova

### ❓ Le icone non appaiono correttamente

**Soluzioni:**
1. Verifica che i file icon-192x192.png e icon-512x512.png esistano in `/icons/`
2. Controlla il manifest.json - i percorsi devono essere corretti
3. Svuota cache del browser
4. Disinstalla e reinstalla l'app

### ❓ Service Worker non si aggiorna

**Soluzioni:**
1. Chiudi tutte le tab/finestre dell'app
2. Apri DevTools → Application → Service Workers
3. Clicca "Unregister" sul vecchio Service Worker
4. Ricarica la pagina
5. Il nuovo Service Worker verrà registrato

---

## 📝 Checklist Pre-Deploy

Prima di pubblicare la PWA in produzione:

- [ ] **HTTPS abilitato** - Obbligatorio per Service Workers
- [ ] **manifest.json** presente e valido
- [ ] **Service Worker** (sw.js) registrato correttamente
- [ ] **Icone PWA** (192x192 e 512x512) presenti
- [ ] **Meta tags** per iOS configurati
- [ ] **Theme color** definito
- [ ] **Test Lighthouse** con punteggio ≥ 90
- [ ] **Test offline** superato
- [ ] **Test su Android** superato
- [ ] **Test su iOS** superato
- [ ] **Test su Desktop** superato

---

## 🎓 Risorse Utili

### Documentazione PWA

- [Google PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [PWA Builder](https://www.pwabuilder.com/) - Tool per testare e migliorare PWA

### Tool di Test

- **Chrome DevTools** - Application tab
- **Lighthouse** - Audit PWA integrato in Chrome
- **PWA Builder** - Test e validazione online
- **Webhint** - Analisi e best practices

### Community e Supporto

- [PWA su Stack Overflow](https://stackoverflow.com/questions/tagged/progressive-web-apps)
- [Web.dev Community](https://web.dev/community/)

---

## 📞 Supporto

Per problemi di installazione o domande:

1. Verifica questa guida
2. Controlla la sezione "Risoluzione Problemi"
3. Apri un issue su GitHub con:
   - Dispositivo e browser utilizzato
   - Screenshot del problema
   - Log della console (se disponibili)

---

**Versione Guida**: 1.0.0  
**Ultima modifica**: 2025  
**Autore**: Docente++ Team

---

🎉 **Buon uso di Docente++ come PWA!**
