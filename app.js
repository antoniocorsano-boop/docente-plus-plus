// Docente++ - Main Application JavaScript
// Web app for teacher didactics management powered by OpenRouter AI

/**
 * @class DocentePlusPlus
 * @classdesc Main application class for Docente++. Handles all logic,
 * data management, and UI interaction for the teacher didactics management tool.
 */
class DocentePlusPlus {
    /**
     * Initializes the application, setting up state variables and loading initial data.
     */
    constructor() {
        /** @property {Array<Object>} lessons - Array of lesson objects. */
        this.lessons = [];
        /** @property {Array<Object>} students - Array of student objects. */
        this.students = [];
        /** @property {Array<Object>} classes - Array of class objects. */
        this.classes = [];
        /** @property {Array<string>} subjects - Array of subjects taught by the teacher. */
        this.subjects = [];
        /** @property {Object} settings - General application settings. */
        this.settings = {};
        /** @property {Array<Object>} chatMessages - Array of AI chat messages. */
        this.chatMessages = [];
        /** @property {string} activeClass - The name of the currently active class. */
        this.activeClass = '';
        /** @property {File|null} selectedFile - The file selected for AI assistant upload. */
        this.selectedFile = null;
        /** @property {Array<Object>} evaluationCriteria - Array of evaluation criteria. */
        this.evaluationCriteria = [];
        /** @property {Array<Object>} evaluationGrids - Array of evaluation grids (rubrics). */
        this.evaluationGrids = [];
        /** @property {Array<Object>} evaluations - Array of assigned evaluations. */
        this.evaluations = [];
        /** @property {Array<Object>} notifications - Array of notification objects. */
        this.notifications = [];
        /** @property {Array<Object>} reminders - Array of custom reminder objects. */
        this.reminders = [];
        /** @property {Array<Object>} activities - Array of didactic activity objects. */
        this.activities = [];
        /** @property {Object} schedule - The teacher's weekly schedule. */
        this.schedule = {}; // { 'YYYY-MM-DD-HH': { classId: null, activityType: null } }
        /** @property {Object} notificationSettings - Settings for notifications. */
        this.notificationSettings = {
            browserNotifications: true,
            emailNotifications: false,
            lessonReminders: true,
            remindersBefore24h: true,
            remindersBefore1h: true,
            backupReminders: true,
            backupReminderInterval: 7, // days
            lastBackupDate: null,
            quietHoursEnabled: false,
            quietHoursStart: '22:00',
            quietHoursEnd: '07:00'
        };
        /** @property {string} notificationFilter - The current filter for the notifications view. */
        this.notificationFilter = 'all'; // all, lesson-reminder, activity-reminder, custom-reminder, backup, system
        /** @property {number|null} notificationCheckInterval - Interval ID for notification checks. */
        this.notificationCheckInterval = null;
        /** @property {string} scheduleView - The current view mode for the schedule ('weekly' or 'daily'). */
        this.scheduleView = 'weekly'; // weekly or daily
        /** @property {string|null} currentScheduleDate - The date being viewed in the schedule. */
        this.currentScheduleDate = null; // Will be set to current/next weekday
        
        // Document Import Module
        /** @property {Array<Object>} importedDocuments - History of imported documents. */
        this.importedDocuments = [];
        /** @property {Object|null} currentImportData - Data for the document currently being imported. */
        this.currentImportData = null;
        /** @property {Object|null} documentClassification - AI classification result for a document. */
        this.documentClassification = null;
        
        // Audio Recording Module
        /** @property {Array<Object>} audioRecordings - Array of audio recording objects. */
        this.audioRecordings = [];
        /** @property {MediaRecorder|null} mediaRecorder - The MediaRecorder instance for audio recording. */
        this.mediaRecorder = null;
        /** @property {Array<Blob>} recordingChunks - Chunks of the current audio recording. */
        this.recordingChunks = [];
        /** @property {number|null} recordingStartTime - Timestamp when the recording started. */
        this.recordingStartTime = null;
        /** @property {number|null} recordingTimer - Interval ID for the recording timer. */
        this.recordingTimer = null;
        
        // News and RSS Feeds Module
        this.rssFeeds = [];
        this.newsItems = [];
        this.newsFilter = { source: '', category: '' };
        
        // Smart Daily Schedule Module
        this.lessonSessions = []; // Active lesson sessions with student evaluations
        this.currentLessonSession = null; // Currently active lesson session
        
        // Backup & Restore Module
        this.backups = []; // Stored backups metadata
        this.backupSettings = {
            frequency: 'weekly', // never, daily, weekly, monthly
            lastBackupDate: null,
            nextBackupDate: null
        };
        this.backupTimer = null;
        this.MAX_BACKUPS = 10; // Maximum number of backups to keep
        this.BACKUP_CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds
        
        this.init();
    }

    /**
     * Initializes the application by loading data, checking for onboarding,
     * setting up event listeners, and rendering the initial UI state.
     */
    init() {
        // Load data from localStorage
        this.loadData();
        
        // Check if onboarding is needed
        if (!this.isOnboardingComplete()) {
            this.showOnboarding();
        }
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Set initial header style (minimal for dashboard)
        const header = document.querySelector('header');
        if (header) {
            header.classList.add('minimal');
        }
        
        // Create toast container
        this.createToastContainer();
        
        // Render initial data
        this.renderHome();
        this.renderLessons();
        this.renderStudents();
        this.renderClasses();
        this.renderEvaluations();
        this.renderActivities();
        this.renderSchedule();
        this.renderImportedDocuments();
        this.renderRecordings();
        this.renderFeeds();
        this.renderNews();
        this.loadSettings();
        this.loadActiveClass();
        this.updateClassSelectors();
        
        // Initialize workspace and active class badge
        this.initializeWorkspace();
        
        // Initialize AI FAB
        this.initializeAIFAB();
        
        // Initialize notification system
        this.requestNotificationPermission();
        this.startNotificationChecks();
        
        // Initialize backup system
        this.initBackupSystem();
        
        // Initialize usability features
        this.initBackToTop();
        this.initCollapsibleSections();
        
        console.log('Docente++ initialized successfully');
    }

    /**
     * Sets up all the initial event listeners for the application UI.
     */
    setupEventListeners() {
        // Hamburger menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const mainNav = document.getElementById('main-nav');
        const menuBackdrop = document.getElementById('menu-backdrop');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                mainNav.classList.toggle('mobile-open');
                menuBackdrop.classList.toggle('active');
            });
        }
        
        if (menuBackdrop) {
            menuBackdrop.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('mobile-open');
                menuBackdrop.classList.remove('active');
            });
        }
        
        // Tab switching - updated to handle submenu items
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                // Skip if this is a menu-with-submenu button (it just shows dropdown)
                if (button.classList.contains('menu-with-submenu')) {
                    e.stopPropagation();
                    return;
                }
                
                // Close mobile menu when tab is selected
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                    mainNav.classList.remove('mobile-open');
                    menuBackdrop.classList.remove('active');
                }
                
                const tabName = button.dataset.tab;
                if (tabName && tabName !== 'class-selector' && tabName !== 'info-app' && tabName !== 'help') {
                    this.switchTab(tabName);
                }
            });
        });

        // Menu group toggle (for mobile collapsible menu)
        document.querySelectorAll('.menu-group-title').forEach(title => {
            title.addEventListener('click', (e) => {
                const menuGroup = title.closest('.menu-group');
                if (window.innerWidth <= 768) {
                    menuGroup.classList.toggle('collapsed');
                }
            });
        });
        
        // Close modals on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Lesson form
        const lessonForm = document.getElementById('lesson-form');
        if (lessonForm) {
            lessonForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addLesson();
            });
        }

        // Student form
        const studentForm = document.getElementById('student-form');
        if (studentForm) {
            studentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addStudent();
            });
        }

        // Email validation for student form
        const studentEmailInput = document.getElementById('student-email');
        if (studentEmailInput) {
            studentEmailInput.addEventListener('input', (e) => {
                this.validateEmail(e.target.value, 'student-email-validation');
            });
        }

        // Class form
        const classForm = document.getElementById('class-form');
        if (classForm) {
            classForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveClass();
            });
        }

        // Activity form
        const activityForm = document.getElementById('activity-form');
        if (activityForm) {
            activityForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addActivity();
            });
        }

        // Onboarding form
        const onboardingForm = document.getElementById('onboarding-form');
        if (onboardingForm) {
            onboardingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.completeOnboarding();
            });
        }

        // AI input
        const aiInput = document.getElementById('ai-input');
        if (aiInput) {
            aiInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    this.sendAIMessage();
                }
            });
        }

        // Subject inputs
        this.setupSubjectInput('onboarding-subjects', 'subjects-suggestions', 'selected-subjects-display');
        this.setupSubjectInput('teacher-subjects-settings', 'subjects-suggestions-settings', 'selected-subjects-display-settings');
        
        // Drag and drop for document upload
        const uploadArea = document.getElementById('document-upload-area');
        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--primary-color)';
                uploadArea.style.background = '#f0f7ff';
            });
            
            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '';
                uploadArea.style.background = '';
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '';
                uploadArea.style.background = '';
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    const fileInput = document.getElementById('document-file-input');
                    fileInput.files = files;
                    this.handleDocumentUpload({ target: { files: files } });
                }
            });
        }
    }

    // Onboarding methods
    /**
     * Checks if the onboarding process has been completed.
     * @returns {boolean} True if onboarding is complete, false otherwise.
     */
    isOnboardingComplete() {
        return localStorage.getItem('onboarding-complete') === 'true';
    }

    /**
     * Displays the onboarding modal to the user.
     */
    showOnboarding() {
        const modal = document.getElementById('onboarding-modal');
        if (modal) {
            modal.style.display = 'flex';
            
            // Prefill email if available
            const email = localStorage.getItem('teacher-email');
            if (email) {
                document.getElementById('onboarding-email').value = email;
            }
        }
    }

    /**
     * Completes the onboarding process by saving the user's initial data.
     */
    completeOnboarding() {
        // Get all form values
        const firstName = document.getElementById('onboarding-first-name').value;
        const lastName = document.getElementById('onboarding-last-name').value;
        const email = document.getElementById('onboarding-email').value;
        const schoolLevel = document.getElementById('onboarding-school-level').value;
        const schoolName = document.getElementById('onboarding-school-name').value;
        const schoolYear = document.getElementById('onboarding-school-year').value;
        const yearStart = document.getElementById('onboarding-year-start').value;
        const yearEnd = document.getElementById('onboarding-year-end').value;

        // Save to localStorage
        localStorage.setItem('teacher-first-name', firstName);
        localStorage.setItem('teacher-last-name', lastName);
        localStorage.setItem('teacher-email', email);
        localStorage.setItem('school-level', schoolLevel);
        localStorage.setItem('school-name', schoolName);
        localStorage.setItem('school-year', schoolYear);
        localStorage.setItem('school-year-start', yearStart);
        localStorage.setItem('school-year-end', yearEnd);
        localStorage.setItem('teacher-subjects', JSON.stringify(this.subjects));
        localStorage.setItem('onboarding-complete', 'true');

        // Hide onboarding modal
        document.getElementById('onboarding-modal').style.display = 'none';

        // Load settings to reflect changes
        this.loadSettings();
        this.renderHome();

        // Show welcome message
        this.showToast(`Benvenuto/a ${firstName}! Il tuo profilo è stato configurato con successo.`, 'success');
    }

    // Toast notification system
    createToastContainer() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    }

    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = {
            'success': '✓',
            'error': '✗',
            'warning': '⚠',
            'info': 'ℹ'
        }[type] || 'ℹ';
        
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;
        
        container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove toast after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // Email validation
    validateEmail(email, validationElementId) {
        const validationElement = document.getElementById(validationElementId);
        if (!validationElement) return true;

        if (!email || email.trim() === '') {
            validationElement.textContent = '';
            validationElement.className = 'validation-message';
            return true;
        }

        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        const isValid = emailRegex.test(email);

        if (isValid) {
            validationElement.textContent = '✓ Email valida';
            validationElement.className = 'validation-message validation-success';
        } else {
            validationElement.textContent = '✗ Email non valida';
            validationElement.className = 'validation-message validation-error';
        }

        return isValid;
    }

    // Contextual help system
    showContextualHelp(section) {
        const helpContent = {
            'home': {
                title: '🏠 Home',
                content: `
                    <h3>Benvenuto nella Home!</h3>
                    <p>Questa è la tua panoramica generale dell'app. Qui trovi:</p>
                    <ul>
                        <li><strong>Orario del giorno:</strong> le lezioni programmate per oggi</li>
                        <li><strong>Accesso rapido:</strong> pulsanti per le azioni più comuni</li>
                        <li><strong>Classe attiva:</strong> seleziona la classe su cui stai lavorando</li>
                    </ul>
                    <p><strong>💡 Suggerimento:</strong> Seleziona una classe attiva per filtrare i dati visualizzati.</p>
                `
            },
            'dashboard': {
                title: '📊 Dashboard',
                content: `
                    <h3>Benvenuto nella Dashboard!</h3>
                    <p>Questa è la tua panoramica generale dell'app. Qui trovi:</p>
                    <ul>
                        <li><strong>Statistiche rapide:</strong> numero di lezioni, studenti, attività e classi</li>
                        <li><strong>Orario del giorno:</strong> le lezioni programmate per oggi</li>
                        <li><strong>Cose da fare:</strong> attività in scadenza e da completare</li>
                        <li><strong>Suggerimenti IA:</strong> consigli personalizzati (se hai configurato l'API key)</li>
                    </ul>
                    <p><strong>💡 Suggerimento:</strong> Seleziona una classe attiva per filtrare i dati visualizzati.</p>
                `
            },
            'lessons': {
                title: '📚 Gestione Lezioni',
                content: `
                    <h3>Come gestire le tue lezioni</h3>
                    <p>In questa sezione puoi:</p>
                    <ul>
                        <li><strong>Aggiungere lezioni:</strong> clicca "➕ Nuova Lezione" e compila il form</li>
                        <li><strong>Generare con IA:</strong> usa l'assistente per creare piani didattici</li>
                        <li><strong>Modificare/Eliminare:</strong> usa i pulsanti nelle card delle lezioni</li>
                    </ul>
                    <p><strong>💡 Suggerimento:</strong> Le lezioni generate con IA includono obiettivi, materiali e metodi di valutazione.</p>
                `
            },
            'students': {
                title: '👥 Gestione Studenti',
                content: `
                    <h3>Come gestire gli studenti</h3>
                    <p>In questa sezione puoi:</p>
                    <ul>
                        <li><strong>Aggiungere studenti:</strong> uno alla volta o importando da CSV/Excel</li>
                        <li><strong>Email:</strong> inserisci email valide per comunicazioni (validazione in tempo reale)</li>
                        <li><strong>Note personalizzate:</strong> aggiungi informazioni su onomastico, compleanno, ecc.</li>
                        <li><strong>Associare a classi:</strong> assegna ogni studente alla sua classe</li>
                    </ul>
                    <p><strong>💡 Suggerimento:</strong> Usa il pulsante "📥 Importa da File" per caricare molti studenti insieme.</p>
                `
            },
            'classes': {
                title: '🏫 Gestione Classi',
                content: `
                    <h3>Come gestire le classi</h3>
                    <p>In questa sezione puoi:</p>
                    <ul>
                        <li><strong>Creare classi:</strong> inserisci nome, anno, sezione</li>
                        <li><strong>Numero studenti:</strong> tieni traccia degli iscritti</li>
                        <li><strong>Classe attiva:</strong> seleziona la classe su cui stai lavorando</li>
                        <li><strong>Modifica/Elimina:</strong> gestisci le classi esistenti</li>
                    </ul>
                    <p><strong>💡 Suggerimento:</strong> La classe attiva influenza l'orario, le attività e i suggerimenti IA.</p>
                `
            }
        };

        const help = helpContent[section] || {
            title: 'Aiuto',
            content: '<p>Informazioni non disponibili per questa sezione.</p>'
        };

        // Show help modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>${help.title}</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    ${help.content}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="this.closest('.modal').remove()">Ho capito</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Subject management methods
    /**
     * Returns a list of common school subjects.
     * @returns {Array<string>} A list of common subjects.
     */
    getCommonSubjects() {
        return [
            'Italiano',
            'Matematica',
            'Scienze',
            'Storia',
            'Geografia',
            'Inglese',
            'Francese',
            'Spagnolo',
            'Tedesco',
            'Arte e Immagine',
            'Musica',
            'Educazione Fisica',
            'Tecnologia',
            'Religione',
            'Educazione Civica',
            'Fisica',
            'Chimica',
            'Biologia',
            'Filosofia',
            'Latino',
            'Greco',
            'Informatica',
            'Diritto ed Economia'
        ];
    }

    /**
     * Sets up the event listeners and behavior for a subject input field,
     * including autocomplete suggestions.
     * @param {string} inputId - The ID of the subject input element.
     * @param {string} suggestionsId - The ID of the container for suggestions.
     * @param {string} displayId - The ID of the container to display selected subjects.
     */
    setupSubjectInput(inputId, suggestionsId, displayId) {
        const input = document.getElementById(inputId);
        const suggestionsDiv = document.getElementById(suggestionsId);
        const displayDiv = document.getElementById(displayId);

        if (!input || !suggestionsDiv || !displayDiv) return;

        // Render existing subjects
        this.renderSubjects(displayDiv);

        // Handle input
        input.addEventListener('input', (e) => {
            const value = e.target.value.trim().toLowerCase();
            if (value.length > 0) {
                const commonSubjects = this.getCommonSubjects();
                const filtered = commonSubjects.filter(s => 
                    s.toLowerCase().includes(value) && 
                    !this.subjects.includes(s)
                );

                if (filtered.length > 0) {
                    suggestionsDiv.innerHTML = filtered.map(subject => 
                        `<div class="subject-suggestion-item" data-subject="${subject}">${subject}</div>`
                    ).join('');
                    suggestionsDiv.classList.add('active');

                    // Add click handlers to suggestions
                    suggestionsDiv.querySelectorAll('.subject-suggestion-item').forEach(item => {
                        item.addEventListener('click', () => {
                            this.addSubject(item.dataset.subject);
                            this.renderSubjects(displayDiv);
                            input.value = '';
                            suggestionsDiv.classList.remove('active');
                        });
                    });
                } else {
                    suggestionsDiv.classList.remove('active');
                }
            } else {
                suggestionsDiv.classList.remove('active');
            }
        });

        // Handle Enter key
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = input.value.trim();
                if (value) {
                    this.addSubject(value);
                    this.renderSubjects(displayDiv);
                    input.value = '';
                    suggestionsDiv.classList.remove('active');
                }
            }
        });

        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !suggestionsDiv.contains(e.target)) {
                suggestionsDiv.classList.remove('active');
            }
        });
    }

    /**
     * Adds a subject to the teacher's list of subjects.
     * @param {string} subject - The subject to add.
     */
    addSubject(subject) {
        const normalizedSubject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
        if (!this.subjects.includes(normalizedSubject)) {
            this.subjects.push(normalizedSubject);
        }
    }

    /**
     * Removes a subject from the teacher's list.
     * @param {string} subject - The subject to remove.
     */
    removeSubject(subject) {
        this.subjects = this.subjects.filter(s => s !== subject);
    }

    /**
     * Renders the list of selected subjects into a specified container.
     * @param {HTMLElement} displayDiv - The HTML element to render the subjects into.
     */
    renderSubjects(displayDiv) {
        if (!displayDiv) return;

        if (this.subjects.length === 0) {
            displayDiv.innerHTML = '<span style="color: var(--text-secondary); padding: 10px;">Nessuna disciplina aggiunta</span>';
        } else {
            displayDiv.innerHTML = this.subjects.map(subject => `
                <span class="subject-tag">
                    ${subject}
                    <span class="remove-subject" onclick="app.removeSubject('${subject}'); app.renderAllSubjects();">×</span>
                </span>
            `).join('');
        }
    }

    /**
     * Renders the subjects list in all relevant UI locations.
     */
    renderAllSubjects() {
        const displayOnboarding = document.getElementById('selected-subjects-display');
        const displaySettings = document.getElementById('selected-subjects-display-settings');
        this.renderSubjects(displayOnboarding);
        this.renderSubjects(displaySettings);
    }

    /**
     * Switches the active tab in the main UI.
     * @param {string} tabName - The name of the tab to switch to.
     */
    switchTab(tabName) {
        // Update current active tab for AI context
        this.currentActiveTab = tabName;
        
        // Update active button
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        const tabButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (tabButton) {
            tabButton.classList.add('active');
        }

        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const tabContent = document.getElementById(tabName);
        if (tabContent) {
            tabContent.classList.add('active');
        }

        // Update header style based on active tab
        const header = document.querySelector('header');
        if (header) {
            if (tabName === 'settings') {
                header.classList.remove('minimal');
            } else {
                header.classList.add('minimal');
            }
        }

        // Refresh notifications when switching to notifications tab
        if (tabName === 'notifications') {
            this.renderNotifications();
        }
        
        // Initialize backup list when switching to backup-restore tab
        if (tabName === 'backup-restore') {
            this.renderBackupList();
            this.updateBackupScheduleInfo();
        }
    }

    // Dashboard methods
    /**
     * Renders the main dashboard with key statistics.
     */
    renderDashboard() {
        document.getElementById('lesson-count').textContent = this.lessons.length;
        document.getElementById('student-count').textContent = this.students.length;
        
        // Count in-progress activities
        const inProgressActivities = this.activities.filter(a => a.status === 'in-progress' || a.status === 'planned');
        const activityCount = document.getElementById('home-activity-count');
        if (activityCount) activityCount.textContent = inProgressActivities.length;
        
        // Count pending evaluations (those without a score or from the last 7 days)
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const pendingEvaluations = this.evaluations.filter(e => {
            if (!e.score) return true;
            const evalDate = new Date(e.date);
            return eval
        const app = new DocentePlusPlus();
