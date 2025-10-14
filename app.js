// Docente++ - Main Application JavaScript
// Versione 1.0.1 - Corretta per allineamento con index.html

class DocentePlusPlus {
    constructor() {
        // State properties
        this.settings = {};
        this.classes = [];
        this.students = [];
        this.lessons = [];
        this.activities = [];
        this.evaluations = [];
        this.chatMessages = [];
        
        // UI State
        this.activeClass = \'\';
        this.selectedFile = null;
        this.currentImportData = null;

        console.log(\'Constructor finished. Initializing...\');
    }

    init() {
        console.log(\'App initialization started...\');
        this.loadData();
        
        // Onboarding check
        if (!this.isOnboardingComplete()) {
            this.showOnboarding();
        } else {
            this.initializeAppUI();
        }
        
        this.setupEventListeners();
        this.createToastContainer();
        console.log(\'Docente++ init process completed.\');
    }
    
    initializeAppUI() {
        document.querySelector(\'header\')?.classList.add(\'minimal\');
        this.renderAllTabs();
        this.switchTab(\'home\'); // Corrected from \'dashboard\' to \'home\'
    }

    renderAllTabs() {
        // Call all render functions to populate the UI on load
        this.renderHome(); // Replaces renderDashboard
        this.renderLessons();
        this.renderStudents();
        this.renderClasses();
        this.renderActivities();
        this.renderEvaluations();
        this.renderSchedule();
        this.renderChatMessages();
    }

    setupEventListeners() {
        console.log(\'Setting up ALL event listeners...\');
        // --- Main Navigation & Modals ---
        document.getElementById(\'menu-toggle\')?.addEventListener(\'click\', () => {
            document.getElementById(\'main-nav\').classList.toggle(\'mobile-open\');
            document.getElementById(\'menu-backdrop\').classList.toggle(\'active\');
        });
        document.getElementById(\'menu-backdrop\')?.addEventListener(\'click\', () => document.getElementById(\'menu-toggle\').click());
        document.querySelectorAll(\'.tab-button[data-tab]\').forEach(button => {
            if (!button.classList.contains(\'menu-with-submenu\')) {
                button.addEventListener(\'click\', () => this.switchTab(button.dataset.tab));
            }
        });
        document.querySelectorAll(\'.modal-close, .modal-cancel\').forEach(b => b.addEventListener(\'click\', e => e.target.closest(\'.modal\').style.display = \'none\'));

        // --- Forms ---
        document.getElementById(\'onboarding-form\')?.addEventListener(\'submit\', e => { e.preventDefault(); this.completeOnboarding(); });
        document.getElementById(\'class-form\')?.addEventListener(\'submit\', e => { e.preventDefault(); this.saveClass(); });
        document.getElementById(\'student-form\')?.addEventListener(\'submit\', e => { e.preventDefault(); this.saveStudent(); });
        document.getElementById(\'lesson-form\')?.addEventListener(\'submit\', e => { e.preventDefault(); this.saveLesson(); });
        document.getElementById(\'activity-form\')?.addEventListener(\'submit\', e => { e.preventDefault(); this.saveActivity(); });
        document.getElementById(\'evaluation-form\')?.addEventListener(\'submit\', e => { e.preventDefault(); this.saveEvaluation(); });

        // --- AI & Advanced Features ---
        // Corrected event listeners to match the new HTML structure
        document.getElementById(\'ai-chat-send\')?.addEventListener(\'click\', () => this.sendMessageToAI());
        document.getElementById(\'ai-chat-input\')?.addEventListener(\'keydown\', e => {
            if (e.key === \'Enter\' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessageToAI();
            }
        });
        document.getElementById(\'pdf-upload\')?.addEventListener(\'change\', e => this.handleFileUpload(e));
        
        // Add event listeners for buttons that now exist in the corrected HTML
        const importOptions = document.getElementById(\'pdf-import-options\');
        if (importOptions) {
            importOptions.querySelector(\'button[onclick*=\"processPdfForLessons\"]\').addEventListener(\'click\', () => this.createLessonFromImport());
        }
    }
    
    // --- ONBOARDING ---
    isOnboardingComplete() {
        return localStorage.getItem(\'onboardingComplete\') === \'true\';
    }

    showOnboarding() {
        document.getElementById(\'onboarding-modal\').style.display = \'flex\';
    }

    completeOnboarding() {
        // Logic to save onboarding data
        this.settings.teacherName = document.getElementById(\'onboarding-first-name\').value;
        // ... (save other settings)
        localStorage.setItem(\'onboardingComplete\', \'true\');
        this.saveData();
        document.getElementById(\'onboarding-modal\').style.display = \'none\';
        this.initializeAppUI();
    }
    
    // --- DATA MANAGEMENT ---
    loadData() {
        this.settings = JSON.parse(localStorage.getItem(\'settings\') || \'{}\');
        this.classes = JSON.parse(localStorage.getItem(\'classes\') || \'[]\');
        this.students = JSON.parse(localStorage.getItem(\'students\') || \'[]\');
        this.lessons = JSON.parse(localStorage.getItem(\'lessons\') || \'[]\');
        this.activities = JSON.parse(localStorage.getItem(\'activities\') || \'[]\');
        this.evaluations = JSON.parse(localStorage.getItem(\'evaluations\') || \'[]\');
        this.chatMessages = JSON.parse(localStorage.getItem(\'chatMessages\') || \'[]\');
    }

    saveData() {
        localStorage.setItem(\'settings\', JSON.stringify(this.settings));
        localStorage.setItem(\'classes\', JSON.stringify(this.classes));
        localStorage.setItem(\'students\', JSON.stringify(this.students));
        localStorage.setItem(\'lessons\', JSON.stringify(this.lessons));
        localStorage.setItem(\'activities\', JSON.stringify(this.activities));
        localStorage.setItem(\'evaluations\', JSON.stringify(this.evaluations));
        localStorage.setItem(\'chatMessages\', JSON.stringify(this.chatMessages));
    }
    
    // --- UI & NAVIGATION ---
    switchTab(tabName) {
        if (!tabName) return;
        document.querySelectorAll(\'.tab-content\').forEach(c => c.classList.remove(\'active\'));
        document.querySelectorAll(\'.tab-button[data-tab]\').forEach(b => b.classList.remove(\'active\'));
        
        const content = document.getElementById(tabName);
        const button = document.querySelector(`.tab-button[data-tab=\"${tabName}\"]`);
        
        if (content) content.classList.add(\'active\');
        if (button) {
            button.classList.add(\'active\');
            const parentMenu = button.closest(\'.menu-group\');
            if (parentMenu) {
                parentMenu.querySelector(\'.menu-with-submenu\').classList.add(\'active\');
            }
        }
        
        if (document.body.clientWidth < 768) {
            document.getElementById(\'menu-toggle\')?.click();
        }
    }
    
    createToastContainer() { if (!document.getElementById(\'toast-container\')) { const c = document.createElement(\'div\'); c.id = \'toast-container\'; document.body.appendChild(c); } }
    showToast(message, type = \'info\', d = 3000) { const c = document.getElementById(\'toast-container\'); if (!c) return; const t = document.createElement(\'div\'); t.className = `toast toast-${type} show`; t.textContent = message; c.appendChild(t); setTimeout(() => { t.classList.remove(\'show\'); setTimeout(() => t.remove(), 500); }, d); }

    // --- HOME TAB (SALA PROF) ---
    renderHome() {
        console.log(\'IMPLEMENTED: renderHome\');
        
        // Quick Access Counts
        document.getElementById(\'home-lesson-count\').textContent = this.lessons.length;
        document.getElementById(\'home-student-count\').textContent = this.students.length;
        document.getElementById(\'home-activity-count\').textContent = this.activities.length;
        document.getElementById(\'home-evaluation-count\').textContent = this.evaluations.length;

        // Things To Do (mock data for now)
        const todoContainer = document.getElementById(\'things-todo-list\');
        const upcomingActivities = this.activities.filter(a => new Date(a.date) >= new Date()).slice(0, 3);
        if (upcomingActivities.length > 0) {
            todoContainer.innerHTML = upcomingActivities.map(a => `<div class=\"todo-item\">- Valutare <strong>${a.title}</strong> per la classe X</div>`).join(\'\');
        } else {
            todoContainer.innerHTML = \'<p class=\"home-placeholder\">Nessuna attività imminente da completare.</p>\';
        }

        // AI Suggestions (mock data)
        document.getElementById(\'ai-suggestions-content\').innerHTML = \`
            <div class=\"ai-suggestion-item\">💡 Potresti creare un\'attività di ripasso sulla \"Rivoluzione Francese\".</div>
            <div class=\"ai-suggestion-item\">💡 Considera di pianificare una verifica per la classe 5B.</div>
        \`;
    }

    // --- CRUD Sections (condensed for brevity) ---
    renderClasses() { /* ... placeholder ... */ }
    saveClass() { /* ... placeholder ... */ }
    renderStudents() { /* ... placeholder ... */ }
    saveStudent() { /* ... placeholder ... */ }
    renderLessons() { /* ... placeholder ... */ }
    saveLesson() { /* ... placeholder ... */ }
    renderActivities() { /* ... placeholder ... */ }
    saveActivity() { /* ... placeholder ... */ }
    renderEvaluations() { /* ... placeholder ... */ }
    saveEvaluation() { /* ... placeholder ... */ }
    renderSchedule() { /* ... placeholder ... */ }

    // --- AI & ADVANCED FEATURES (Corrected) ---

    renderChatMessages() {
        const container = document.getElementById(\'ai-chat-messages\');
        if (!container) return;
        container.innerHTML = this.chatMessages.map(msg => 
            `<div class=\"chat-message ${msg.sender}\">${msg.text}</div>`
        ).join(\'\');
        container.scrollTop = container.scrollHeight;
    }

    sendMessageToAI() {
        const input = document.getElementById(\'ai-chat-input\');
        if (!input) return;
        const messageText = input.value.trim();
        if (!messageText) return;

        this.chatMessages.push({ sender: \'user\', text: messageText });
        this.renderChatMessages();
        input.value = \'\';

        setTimeout(() => this.getAIResponse(messageText), 800);
    }

    getAIResponse(message) {
        let responseText = "Non ho capito. Prova a chiedere: \\\"suggerisci un\'attività\\\" o \\\"crea una lezione sulla fotosintesi\\\".";
        message = message.toLowerCase();

        if (message.includes(\'suggerisci\') || message.includes(\'idea\')) {
            responseText = \'Certo! Che ne dici di un dibattito in classe sull\\\'impatto dei social media? Oppure una verifica sulla Seconda Guerra Mondiale.\';
        } else if (message.includes(\'crea\') && message.includes(\'lezione\')) {
            responseText = \'Ok, ho creato una bozza di lezione su \\\"Il Ciclo dell\\\'Acqua\\\". La trovi nella sezione Lezioni.\';
            this.lessons.push({ id: `les_${Date.now()}`, title: \'Bozza AI: Il Ciclo dell\\\'Acqua\', date: new Date().toISOString().split(\'T\')[0], time: \'10:00\', subject: \'Scienze\', description: \'Lezione generata da IA.\' });
            this.renderLessons();
        }

        this.chatMessages.push({ sender: \'ai\', text: responseText });
        this.saveData();
        this.renderChatMessages();
    }
    
    // Corrected to match HTML IDs like \'pdf-upload\' and \'pdf-upload-feedback\'
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        this.selectedFile = file;
        
        const feedbackEl = document.getElementById(\'pdf-upload-feedback\');
        const optionsEl = document.getElementById(\'pdf-import-options\');

        if(feedbackEl) feedbackEl.innerHTML = `<p>File selezionato: <strong>${file.name}</strong></p>`;
        if(optionsEl) optionsEl.style.display = \'block\';
        
        this.showToast(\'File pronto per l\\\'elaborazione.\', \'info\');
        
        // Simulate text extraction
        this.currentImportData = {
            summary: `Il documento "${file.name}" sembra trattare argomenti complessi. I punti chiave includono A, B e C.`,
            keywords: [\'argomento1\', \'argomento2\', \'argomento3\']
        };
        const outputEl = document.getElementById(\'pdf-processing-output\');
        if(outputEl) outputEl.innerHTML = `
            <h4>Analisi Preliminare Completata</h4>
            <p><strong>Riepilogo:</strong> ${this.currentImportData.summary}</p>
        `;
    }
    
    // Corrected to be triggered by the new button
    createLessonFromImport() {
        if(!this.currentImportData || !this.selectedFile) {
            this.showToast(\'Nessun dato da importare. Carica un file prima.\', \'error\');
            return;
        }
        
        const newLesson = {
            id: `les_${Date.now()}`,
            title: `Lezione da file: ${this.selectedFile.name}`,
            subject: \'Da Documento\',
            description: this.currentImportData.summary,
            date: new Date().toISOString().split(\'T\')[0],
            time: \'09:00\'
        };
        this.lessons.push(newLesson);
        this.saveData();
        this.renderLessons();
        this.switchTab(\'lessons\');
        this.showToast(\'Bozza di lezione creata dal documento!\', \'success\');
    }
}

// --- App Initialization ---
document.addEventListener(\'DOMContentLoaded\', () => {
    try {
        window.app = new DocentePlusPlus();
        window.app.init();
    } catch (error) {
        console.error("Errore fatale durante l\'inizializzazione dell\'app:", error);
        document.body.innerHTML = \'<div style="text-align:center;padding:20px;"><h1>Errore Critico</h1><p>L\\\'applicazione non è riuscita a caricarsi. Controlla la console per i dettagli.</p></div>\';
    }
});
