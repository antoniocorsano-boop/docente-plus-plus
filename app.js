// Docente++ - Main Application JavaScript
// Web app for teacher didactics management powered by OpenRouter AI

class DocentePlusPlus {
    constructor() {
        this.lessons = [];
        this.students = [];
        this.classes = [];
        this.subjects = [];
        this.settings = {};
        this.chatMessages = [];
        this.activeClass = '';
        this.selectedFile = null;
        this.evaluationCriteria = [];
        this.evaluationGrids = [];
        this.evaluations = [];
        this.notifications = [];
        this.reminders = [];
        this.notificationSettings = {
            browserNotifications: true,
            emailNotifications: false,
            lessonReminders: true,
            remindersBefore24h: true,
            remindersBefore1h: true,
            quietHoursEnabled: false,
            quietHoursStart: '22:00',
            quietHoursEnd: '07:00'
        };
        this.notificationCheckInterval = null;
        this.init();
    }

    init() {
        // Load data from localStorage
        this.loadData();
        
        // Check if onboarding is needed
        if (!this.isOnboardingComplete()) {
            this.showOnboarding();
        }
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Render initial data
        this.renderDashboard();
        this.renderLessons();
        this.renderStudents();
        this.renderClasses();
        this.renderEvaluations();
        this.loadSettings();
        this.loadActiveClass();
        this.updateClassSelectors();
        
        // Initialize notification system
        this.requestNotificationPermission();
        this.startNotificationChecks();
        
        console.log('Docente++ initialized successfully');
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
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

        // Class form
        const classForm = document.getElementById('class-form');
        if (classForm) {
            classForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveClass();
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
    }

    // Onboarding methods
    isOnboardingComplete() {
        return localStorage.getItem('onboarding-complete') === 'true';
    }

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
        this.renderDashboard();

        // Show welcome message
        alert(`Benvenuto/a ${firstName}! Il tuo profilo è stato configurato con successo.`);
    }

    // Subject management methods
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

    addSubject(subject) {
        const normalizedSubject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
        if (!this.subjects.includes(normalizedSubject)) {
            this.subjects.push(normalizedSubject);
        }
    }

    removeSubject(subject) {
        this.subjects = this.subjects.filter(s => s !== subject);
    }

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

    renderAllSubjects() {
        const displayOnboarding = document.getElementById('selected-subjects-display');
        const displaySettings = document.getElementById('selected-subjects-display-settings');
        this.renderSubjects(displayOnboarding);
        this.renderSubjects(displaySettings);
    }

    switchTab(tabName) {
        // Update active button
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        // Refresh notifications when switching to notifications tab
        if (tabName === 'notifications') {
            this.renderNotifications();
        }
    }

    // Dashboard methods
    renderDashboard() {
        document.getElementById('lesson-count').textContent = this.lessons.length;
        document.getElementById('student-count').textContent = this.students.length;
        
        // Count pending evaluations (those without a score or from the last 7 days)
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const pendingEvaluations = this.evaluations.filter(e => {
            if (!e.score) return true;
            const evalDate = new Date(e.date);
            return evalDate >= sevenDaysAgo;
        });
        document.getElementById('evaluation-count').textContent = pendingEvaluations.length;
        
        const apiKey = localStorage.getItem('openrouter-api-key');
        document.getElementById('ai-status').textContent = apiKey ? '✓' : '✗';
        
        // Update active class display
        this.updateClassDisplay();
    }

    // Class Management methods
    setActiveClass(className) {
        this.activeClass = className;
        localStorage.setItem('active-class', className);
        this.updateClassDisplay();
    }

    loadActiveClass() {
        const savedClass = localStorage.getItem('active-class');
        if (savedClass) {
            this.activeClass = savedClass;
            const selector = document.getElementById('active-class-selector');
            if (selector) {
                selector.value = savedClass;
            }
            this.updateClassDisplay();
        }
    }

    updateClassDisplay() {
        const displayElement = document.getElementById('current-class-display');
        if (displayElement) {
            if (this.activeClass) {
                displayElement.textContent = `Classe: ${this.activeClass}`;
                displayElement.style.display = 'inline-block';
            } else {
                displayElement.textContent = 'Nessuna classe selezionata';
                displayElement.style.display = 'inline-block';
            }
        }
    }

    // Lesson management methods
    showAddLessonForm() {
        document.getElementById('add-lesson-form').style.display = 'block';
    }

    hideAddLessonForm() {
        document.getElementById('add-lesson-form').style.display = 'none';
        document.getElementById('lesson-form').reset();
    }

    addLesson() {
        const lesson = {
            id: Date.now(),
            title: document.getElementById('lesson-title').value,
            subject: document.getElementById('lesson-subject').value,
            date: document.getElementById('lesson-date').value,
            time: document.getElementById('lesson-time').value || '09:00',
            description: document.getElementById('lesson-description').value,
            createdAt: new Date().toISOString()
        };

        this.lessons.push(lesson);
        this.saveData();
        this.renderLessons();
        this.renderDashboard();
        this.hideAddLessonForm();
    }

    deleteLesson(id) {
        if (confirm('Sei sicuro di voler eliminare questa lezione?')) {
            this.lessons = this.lessons.filter(lesson => lesson.id !== id);
            this.saveData();
            this.renderLessons();
            this.renderDashboard();
        }
    }

    renderLessons() {
        const lessonsList = document.getElementById('lessons-list');
        
        if (this.lessons.length === 0) {
            lessonsList.innerHTML = `
                <div class="empty-state">
                    <h3>Nessuna lezione programmata</h3>
                    <p>Inizia aggiungendo una nuova lezione o generandola con l'IA</p>
                </div>
            `;
            return;
        }

        lessonsList.innerHTML = this.lessons
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(lesson => `
                <div class="lesson-item">
                    <h4>${lesson.title}</h4>
                    <p><strong>Materia:</strong> ${lesson.subject}</p>
                    <p><strong>Data:</strong> ${new Date(lesson.date).toLocaleDateString('it-IT')} ${lesson.time ? 'alle ' + lesson.time : ''}</p>
                    <p>${lesson.description || 'Nessuna descrizione'}</p>
                    <div class="item-actions">
                        <button class="btn btn-danger" onclick="app.deleteLesson(${lesson.id})">Elimina</button>
                    </div>
                </div>
            `).join('');
    }

    async generateLessonWithAI() {
        const apiKey = localStorage.getItem('openrouter-api-key');
        
        if (!apiKey) {
            alert('Configura la tua API key di OpenRouter nelle impostazioni prima di usare l\'IA');
            this.switchTab('settings');
            return;
        }

        const subject = prompt('Per quale materia vuoi generare una lezione?');
        if (!subject) return;

        const topic = prompt('Quale argomento?');
        if (!topic) return;

        this.addChatMessage('system', 'Generazione lezione in corso...');

        try {
            const response = await this.callOpenRouterAPI(
                `Genera un piano di lezione dettagliato per ${subject} sull'argomento "${topic}". 
                Includi: obiettivi di apprendimento, durata stimata, materiali necessari, 
                attività didattiche e metodi di valutazione. Rispondi in formato JSON con i campi: 
                title, subject, duration, objectives, materials, activities, evaluation.`,
                apiKey
            );

            if (response && response.content) {
                try {
                    // Try to parse JSON from the response
                    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        const lessonData = JSON.parse(jsonMatch[0]);
                        
                        const lesson = {
                            id: Date.now(),
                            title: lessonData.title || `Lezione: ${topic}`,
                            subject: lessonData.subject || subject,
                            date: new Date().toISOString().split('T')[0],
                            description: `
Durata: ${lessonData.duration || 'N/D'}

Obiettivi:
${lessonData.objectives || 'N/D'}

Materiali:
${lessonData.materials || 'N/D'}

Attività:
${lessonData.activities || 'N/D'}

Valutazione:
${lessonData.evaluation || 'N/D'}
                            `.trim(),
                            createdAt: new Date().toISOString(),
                            generatedByAI: true
                        };

                        this.lessons.push(lesson);
                        this.saveData();
                        this.renderLessons();
                        this.renderDashboard();
                        this.switchTab('lessons');
                        
                        this.addChatMessage('system', 'Lezione generata con successo!');
                    } else {
                        throw new Error('Invalid JSON response');
                    }
                } catch (parseError) {
                    // If JSON parsing fails, create a simple lesson with the text response
                    const lesson = {
                        id: Date.now(),
                        title: `${subject}: ${topic}`,
                        subject: subject,
                        date: new Date().toISOString().split('T')[0],
                        description: response.content,
                        createdAt: new Date().toISOString(),
                        generatedByAI: true
                    };

                    this.lessons.push(lesson);
                    this.saveData();
                    this.renderLessons();
                    this.renderDashboard();
                    this.switchTab('lessons');
                    
                    this.addChatMessage('system', 'Lezione generata con successo!');
                }
            }
        } catch (error) {
            console.error('Error generating lesson:', error);
            this.addChatMessage('system', `Errore nella generazione: ${error.message}`);
            alert('Errore nella generazione della lezione. Verifica la tua API key.');
        }
    }

    // Student management methods
    showAddStudentForm() {
        document.getElementById('add-student-form').style.display = 'block';
    }

    hideAddStudentForm() {
        document.getElementById('add-student-form').style.display = 'none';
        document.getElementById('student-form').reset();
    }

    addStudent() {
        const student = {
            id: Date.now(),
            name: document.getElementById('student-name').value,
            email: document.getElementById('student-email').value,
            class: document.getElementById('student-class').value,
            createdAt: new Date().toISOString()
        };

        this.students.push(student);
        this.saveData();
        this.renderStudents();
        this.renderDashboard();
        this.hideAddStudentForm();
    }

    deleteStudent(id) {
        if (confirm('Sei sicuro di voler eliminare questo studente?')) {
            this.students = this.students.filter(student => student.id !== id);
            this.saveData();
            this.renderStudents();
            this.renderDashboard();
        }
    }

    renderStudents() {
        const studentsList = document.getElementById('students-list');
        
        if (this.students.length === 0) {
            studentsList.innerHTML = `
                <div class="empty-state">
                    <h3>Nessuno studente registrato</h3>
                    <p>Inizia aggiungendo un nuovo studente</p>
                </div>
            `;
            return;
        }

        studentsList.innerHTML = this.students.map(student => `
            <div class="student-item">
                <h4>${student.name}</h4>
                <p><strong>Email:</strong> ${student.email || 'N/D'}</p>
                <p><strong>Classe:</strong> ${student.class || 'N/D'}</p>
                <div class="item-actions">
                    <button class="btn btn-danger" onclick="app.deleteStudent(${student.id})">Elimina</button>
                </div>
            </div>
        `).join('');
    }

    // Class Management methods
    showAddClassForm() {
        document.getElementById('add-class-form').style.display = 'block';
        document.getElementById('class-form-title').textContent = 'Nuova Classe';
        document.getElementById('class-edit-id').value = '';
    }

    hideAddClassForm() {
        document.getElementById('add-class-form').style.display = 'none';
        document.getElementById('class-form').reset();
        document.getElementById('class-edit-id').value = '';
    }

    saveClass() {
        const editId = document.getElementById('class-edit-id').value;
        const className = document.getElementById('class-name').value.trim();
        const year = document.getElementById('class-year').value;
        const section = document.getElementById('class-section').value.trim();
        const studentsCount = document.getElementById('class-students-count').value;

        if (!className) {
            alert('Il nome della classe è obbligatorio');
            return;
        }

        if (editId) {
            // Edit existing class
            const classIndex = this.classes.findIndex(c => c.id === parseInt(editId));
            if (classIndex !== -1) {
                this.classes[classIndex] = {
                    ...this.classes[classIndex],
                    name: className,
                    year: year,
                    section: section,
                    studentsCount: studentsCount ? parseInt(studentsCount) : 0,
                    updatedAt: new Date().toISOString()
                };
            }
        } else {
            // Add new class
            const newClass = {
                id: Date.now(),
                name: className,
                year: year,
                section: section,
                studentsCount: studentsCount ? parseInt(studentsCount) : 0,
                createdAt: new Date().toISOString()
            };
            this.classes.push(newClass);
        }

        this.saveData();
        this.renderClasses();
        this.updateClassSelectors();
        this.hideAddClassForm();
    }

    editClass(id) {
        const classToEdit = this.classes.find(c => c.id === id);
        if (!classToEdit) return;

        document.getElementById('add-class-form').style.display = 'block';
        document.getElementById('class-form-title').textContent = 'Modifica Classe';
        document.getElementById('class-edit-id').value = classToEdit.id;
        document.getElementById('class-name').value = classToEdit.name;
        document.getElementById('class-year').value = classToEdit.year || '';
        document.getElementById('class-section').value = classToEdit.section || '';
        document.getElementById('class-students-count').value = classToEdit.studentsCount || '';

        // Scroll to form
        document.getElementById('add-class-form').scrollIntoView({ behavior: 'smooth' });
    }

    deleteClass(id) {
        const classToDelete = this.classes.find(c => c.id === id);
        if (!classToDelete) return;

        if (confirm(`Sei sicuro di voler eliminare la classe ${classToDelete.name}?`)) {
            this.classes = this.classes.filter(c => c.id !== id);
            
            // If this was the active class, clear it
            if (this.activeClass === classToDelete.name) {
                this.activeClass = '';
                localStorage.removeItem('active-class');
            }

            this.saveData();
            this.renderClasses();
            this.updateClassSelectors();
            this.renderDashboard();
        }
    }

    renderClasses() {
        const classesList = document.getElementById('classes-list');
        
        if (!classesList) return;

        if (this.classes.length === 0) {
            classesList.innerHTML = `
                <div class="empty-state">
                    <h3>Nessuna classe configurata</h3>
                    <p>Inizia aggiungendo le tue classi per organizzare al meglio la didattica</p>
                </div>
            `;
            return;
        }

        classesList.innerHTML = this.classes
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(cls => `
                <div class="class-item">
                    <h4>${cls.name}</h4>
                    ${cls.year ? `<p><strong>Anno:</strong> ${cls.year}°</p>` : ''}
                    ${cls.section ? `<p><strong>Sezione:</strong> ${cls.section}</p>` : ''}
                    <p><strong>Studenti:</strong> ${cls.studentsCount || 0}</p>
                    <div class="item-actions">
                        <button class="btn btn-secondary" onclick="app.editClass(${cls.id})">Modifica</button>
                        <button class="btn btn-danger" onclick="app.deleteClass(${cls.id})">Elimina</button>
                    </div>
                </div>
            `).join('');
    }

    updateClassSelectors() {
        const selector = document.getElementById('active-class-selector');
        if (!selector) return;

        const currentValue = selector.value;
        
        // Clear and rebuild options
        selector.innerHTML = '<option value="">Seleziona una classe</option>';
        
        this.classes
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(cls => {
                const option = document.createElement('option');
                option.value = cls.name;
                option.textContent = cls.name;
                selector.appendChild(option);
            });

        // Restore selection if it still exists
        if (currentValue && this.classes.some(c => c.name === currentValue)) {
            selector.value = currentValue;
        } else if (this.activeClass && this.classes.some(c => c.name === this.activeClass)) {
            selector.value = this.activeClass;
        }
    }

    // Evaluation Management methods
    showAddCriterionForm() {
        document.getElementById('add-criterion-form').style.display = 'block';
    }

    hideAddCriterionForm() {
        document.getElementById('add-criterion-form').style.display = 'none';
        document.getElementById('criterion-form').reset();
    }

    addCriterion() {
        const name = document.getElementById('criterion-name').value;
        const description = document.getElementById('criterion-description').value;
        const subject = document.getElementById('criterion-subject').value;
        const type = document.getElementById('criterion-type').value;

        if (!name) {
            alert('Inserisci un nome per il criterio');
            return;
        }

        const criterion = {
            id: Date.now(),
            name,
            description,
            subject,
            type,
            createdAt: new Date().toISOString()
        };

        this.evaluationCriteria.push(criterion);
        this.saveData();
        this.renderEvaluations();
        this.hideAddCriterionForm();
    }

    deleteCriterion(id) {
        if (confirm('Sei sicuro di voler eliminare questo criterio?')) {
            this.evaluationCriteria = this.evaluationCriteria.filter(c => c.id !== id);
            this.saveData();
            this.renderEvaluations();
        }
    }

    showAddGridForm() {
        document.getElementById('add-grid-form').style.display = 'block';
    }

    hideAddGridForm() {
        document.getElementById('add-grid-form').style.display = 'none';
        document.getElementById('grid-form').reset();
    }

    addGrid() {
        const name = document.getElementById('grid-name').value;
        const description = document.getElementById('grid-description').value;
        const subject = document.getElementById('grid-subject').value;

        if (!name) {
            alert('Inserisci un nome per la griglia');
            return;
        }

        const grid = {
            id: Date.now(),
            name,
            description,
            subject,
            levels: [
                { name: 'Eccellente', score: 10, description: 'Prestazione eccellente' },
                { name: 'Buono', score: 8, description: 'Prestazione buona' },
                { name: 'Sufficiente', score: 6, description: 'Prestazione sufficiente' },
                { name: 'Insufficiente', score: 4, description: 'Prestazione insufficiente' }
            ],
            createdAt: new Date().toISOString()
        };

        this.evaluationGrids.push(grid);
        this.saveData();
        this.renderEvaluations();
        this.hideAddGridForm();
    }

    deleteGrid(id) {
        if (confirm('Sei sicuro di voler eliminare questa griglia?')) {
            this.evaluationGrids = this.evaluationGrids.filter(g => g.id !== id);
            this.saveData();
            this.renderEvaluations();
        }
    }

    showAddEvaluationForm() {
        document.getElementById('add-evaluation-form').style.display = 'block';
        this.updateEvaluationFormSelectors();
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('evaluation-date').value = today;
    }

    hideAddEvaluationForm() {
        document.getElementById('add-evaluation-form').style.display = 'none';
        document.getElementById('evaluation-form').reset();
    }

    updateEvaluationFormSelectors() {
        // Update student selector
        const studentSelect = document.getElementById('evaluation-student');
        if (studentSelect) {
            studentSelect.innerHTML = '<option value="">Seleziona studente</option>';
            this.students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.id;
                option.textContent = student.name;
                studentSelect.appendChild(option);
            });
        }

        // Update class selector
        const classSelect = document.getElementById('evaluation-class');
        if (classSelect) {
            classSelect.innerHTML = '<option value="">Seleziona classe</option>';
            this.classes.forEach(cls => {
                const option = document.createElement('option');
                option.value = cls.id;
                option.textContent = cls.name;
                classSelect.appendChild(option);
            });
        }

        // Update criterion selector
        const criterionSelect = document.getElementById('evaluation-criterion');
        if (criterionSelect) {
            criterionSelect.innerHTML = '<option value="">Seleziona criterio</option>';
            this.evaluationCriteria.forEach(criterion => {
                const option = document.createElement('option');
                option.value = criterion.id;
                option.textContent = criterion.name;
                criterionSelect.appendChild(option);
            });
        }

        // Update grid selector
        const gridSelect = document.getElementById('evaluation-grid');
        if (gridSelect) {
            gridSelect.innerHTML = '<option value="">Seleziona griglia</option>';
            this.evaluationGrids.forEach(grid => {
                const option = document.createElement('option');
                option.value = grid.id;
                option.textContent = grid.name;
                gridSelect.appendChild(option);
            });
        }

        // Update subject selector
        const subjectSelect = document.getElementById('evaluation-subject');
        if (subjectSelect) {
            subjectSelect.innerHTML = '<option value="">Seleziona disciplina</option>';
            this.subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                subjectSelect.appendChild(option);
            });
        }
    }

    addEvaluation() {
        const studentId = document.getElementById('evaluation-student').value;
        const classId = document.getElementById('evaluation-class').value;
        const criterionId = document.getElementById('evaluation-criterion').value;
        const gridId = document.getElementById('evaluation-grid').value;
        const subjectId = document.getElementById('evaluation-subject').value;
        const score = document.getElementById('evaluation-score').value;
        const notes = document.getElementById('evaluation-notes').value;
        const date = document.getElementById('evaluation-date').value;

        if (!studentId && !classId) {
            alert('Seleziona uno studente o una classe');
            return;
        }

        if (!criterionId && !gridId) {
            alert('Seleziona un criterio o una griglia di valutazione');
            return;
        }

        const evaluation = {
            id: Date.now(),
            studentId: studentId || null,
            classId: classId || null,
            criterionId: criterionId || null,
            gridId: gridId || null,
            subjectId: subjectId || null,
            score: score || null,
            notes,
            date: date || new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        };

        this.evaluations.push(evaluation);
        this.saveData();
        this.renderEvaluations();
        this.renderDashboard();
        this.hideAddEvaluationForm();
    }

    deleteEvaluation(id) {
        if (confirm('Sei sicuro di voler eliminare questa valutazione?')) {
            this.evaluations = this.evaluations.filter(e => e.id !== id);
            this.saveData();
            this.renderEvaluations();
            this.renderDashboard();
        }
    }

    renderEvaluations() {
        // Render criteria list
        const criteriaList = document.getElementById('criteria-list');
        if (criteriaList) {
            if (this.evaluationCriteria.length === 0) {
                criteriaList.innerHTML = '<p class="empty-state">Nessun criterio di valutazione. Creane uno!</p>';
            } else {
                criteriaList.innerHTML = this.evaluationCriteria.map(criterion => `
                    <div class="card evaluation-item">
                        <h4>${criterion.name}</h4>
                        <p><strong>Tipo:</strong> ${criterion.type || 'Non specificato'}</p>
                        <p><strong>Disciplina:</strong> ${criterion.subject || 'Non specificata'}</p>
                        <p>${criterion.description || ''}</p>
                        <div class="evaluation-actions">
                            <button class="btn btn-danger" onclick="app.deleteCriterion(${criterion.id})">Elimina</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Render grids list
        const gridsList = document.getElementById('grids-list');
        if (gridsList) {
            if (this.evaluationGrids.length === 0) {
                gridsList.innerHTML = '<p class="empty-state">Nessuna griglia di valutazione. Creane una!</p>';
            } else {
                gridsList.innerHTML = this.evaluationGrids.map(grid => `
                    <div class="card evaluation-item">
                        <h4>${grid.name}</h4>
                        <p><strong>Disciplina:</strong> ${grid.subject || 'Non specificata'}</p>
                        <p>${grid.description || ''}</p>
                        <div class="grid-levels">
                            <strong>Livelli:</strong>
                            ${grid.levels.map(level => `
                                <div class="level-item">
                                    <span class="level-name">${level.name}</span>
                                    <span class="level-score">${level.score}/10</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="evaluation-actions">
                            <button class="btn btn-danger" onclick="app.deleteGrid(${grid.id})">Elimina</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Render evaluations list
        const evaluationsList = document.getElementById('evaluations-list');
        if (evaluationsList) {
            if (this.evaluations.length === 0) {
                evaluationsList.innerHTML = '<p class="empty-state">Nessuna valutazione registrata.</p>';
            } else {
                evaluationsList.innerHTML = this.evaluations.map(evaluation => {
                    const student = this.students.find(s => s.id == evaluation.studentId);
                    const cls = this.classes.find(c => c.id == evaluation.classId);
                    const criterion = this.evaluationCriteria.find(c => c.id == evaluation.criterionId);
                    const grid = this.evaluationGrids.find(g => g.id == evaluation.gridId);

                    return `
                        <div class="card evaluation-item">
                            <div class="evaluation-header">
                                <h4>${student ? student.name : (cls ? 'Classe: ' + cls.name : 'N/D')}</h4>
                                <span class="evaluation-date">${evaluation.date}</span>
                            </div>
                            <p><strong>Criterio/Griglia:</strong> ${criterion ? criterion.name : (grid ? grid.name : 'N/D')}</p>
                            ${evaluation.subjectId ? `<p><strong>Disciplina:</strong> ${evaluation.subjectId}</p>` : ''}
                            ${evaluation.score ? `<p><strong>Voto:</strong> ${evaluation.score}/10</p>` : ''}
                            ${evaluation.notes ? `<p><strong>Note:</strong> ${evaluation.notes}</p>` : ''}
                            <div class="evaluation-actions">
                                <button class="btn btn-danger" onclick="app.deleteEvaluation(${evaluation.id})">Elimina</button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        // Initialize results filters
        this.initializeResultsFilters();
        // Render results view
        this.renderResults();
    }

    exportEvaluations() {
        // Calculate statistics for export
        const stats = {
            totalEvaluations: this.evaluations.length,
            totalStudents: new Set(this.evaluations.map(e => e.studentId).filter(id => id)).size,
            totalClasses: new Set(this.evaluations.map(e => e.classId).filter(id => id)).size,
            averageScore: this.calculateAverageScore(this.evaluations),
            evaluationsBySubject: {},
            evaluationsByClass: {}
        };

        // Calculate by subject
        this.subjects.forEach(subject => {
            const subjectEvals = this.evaluations.filter(e => e.subjectId === subject);
            if (subjectEvals.length > 0) {
                stats.evaluationsBySubject[subject] = {
                    count: subjectEvals.length,
                    averageScore: this.calculateAverageScore(subjectEvals)
                };
            }
        });

        // Calculate by class
        this.classes.forEach(cls => {
            const classEvals = this.evaluations.filter(e => e.classId == cls.id);
            if (classEvals.length > 0) {
                stats.evaluationsByClass[cls.name] = {
                    count: classEvals.length,
                    averageScore: this.calculateAverageScore(classEvals)
                };
            }
        });

        const data = {
            evaluationCriteria: this.evaluationCriteria,
            evaluationGrids: this.evaluationGrids,
            evaluations: this.evaluations.map(evaluation => {
                const student = this.students.find(s => s.id == evaluation.studentId);
                const cls = this.classes.find(c => c.id == evaluation.classId);
                const criterion = this.evaluationCriteria.find(c => c.id == evaluation.criterionId);
                const grid = this.evaluationGrids.find(g => g.id == evaluation.gridId);

                return {
                    ...evaluation,
                    studentName: student ? student.name : null,
                    className: cls ? cls.name : null,
                    criterionName: criterion ? criterion.name : null,
                    gridName: grid ? grid.name : null,
                    subjectName: evaluation.subjectId || null
                };
            }),
            statistics: stats,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `valutazioni-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        alert('Valutazioni esportate con successo con statistiche!');
    }

    initializeResultsFilters() {
        // Populate filter selectors
        const filterClass = document.getElementById('filter-class');
        if (filterClass) {
            filterClass.innerHTML = '<option value="">Tutte le classi</option>';
            this.classes.forEach(cls => {
                const option = document.createElement('option');
                option.value = cls.id;
                option.textContent = cls.name;
                filterClass.appendChild(option);
            });
        }

        const filterSubject = document.getElementById('filter-subject');
        if (filterSubject) {
            filterSubject.innerHTML = '<option value="">Tutte le discipline</option>';
            this.subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                filterSubject.appendChild(option);
            });
        }

        const filterStudent = document.getElementById('filter-student');
        if (filterStudent) {
            filterStudent.innerHTML = '<option value="">Tutti gli studenti</option>';
            this.students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.id;
                option.textContent = student.name;
                filterStudent.appendChild(option);
            });
        }
    }

    filterResults() {
        this.renderResults();
    }

    toggleResultsView() {
        const viewMode = localStorage.getItem('results-view-mode') || 'by-student';
        const newMode = viewMode === 'by-student' ? 'by-class' : 'by-student';
        localStorage.setItem('results-view-mode', newMode);
        this.renderResults();
    }

    renderResults() {
        const resultsDisplay = document.getElementById('results-display');
        if (!resultsDisplay) return;

        const filterClassId = document.getElementById('filter-class')?.value || '';
        const filterSubject = document.getElementById('filter-subject')?.value || '';
        const filterStudentId = document.getElementById('filter-student')?.value || '';

        // Filter evaluations
        let filteredEvaluations = this.evaluations.filter(evaluation => {
            if (filterClassId && evaluation.classId != filterClassId && evaluation.studentId) {
                const student = this.students.find(s => s.id == evaluation.studentId);
                if (!student || student.classId != filterClassId) return false;
            }
            if (filterSubject && evaluation.subjectId != filterSubject) return false;
            if (filterStudentId && evaluation.studentId != filterStudentId) return false;
            return true;
        });

        const viewMode = localStorage.getItem('results-view-mode') || 'by-student';

        if (filteredEvaluations.length === 0) {
            resultsDisplay.innerHTML = '<p class="empty-state">Nessuna valutazione corrisponde ai filtri selezionati.</p>';
            return;
        }

        if (viewMode === 'by-student') {
            this.renderResultsByStudent(resultsDisplay, filteredEvaluations);
        } else {
            this.renderResultsByClass(resultsDisplay, filteredEvaluations);
        }
    }

    renderResultsByStudent(container, evaluations) {
        const studentGroups = {};
        
        evaluations.forEach(evaluation => {
            if (evaluation.studentId) {
                if (!studentGroups[evaluation.studentId]) {
                    studentGroups[evaluation.studentId] = [];
                }
                studentGroups[evaluation.studentId].push(evaluation);
            }
        });

        let html = '<h4>📊 Risultati per Studente</h4>';
        
        Object.keys(studentGroups).forEach(studentId => {
            const student = this.students.find(s => s.id == studentId);
            const studentEvaluations = studentGroups[studentId];
            const avgScore = this.calculateAverageScore(studentEvaluations);
            
            html += `
                <div class="card student-results">
                    <div class="student-results-header">
                        <h5>${student ? student.name : 'Studente sconosciuto'}</h5>
                        ${avgScore !== null ? `<span class="avg-score">Media: ${avgScore.toFixed(2)}/10</span>` : ''}
                    </div>
                    <div class="student-evaluations">
                        ${studentEvaluations.map(evaluation => {
                            const criterion = this.evaluationCriteria.find(c => c.id == evaluation.criterionId);
                            const grid = this.evaluationGrids.find(g => g.id == evaluation.gridId);
                            return `
                                <div class="evaluation-row">
                                    <span class="eval-date">${evaluation.date}</span>
                                    <span class="eval-criterion">${criterion ? criterion.name : (grid ? grid.name : 'N/D')}</span>
                                    ${evaluation.subjectId ? `<span class="eval-subject">${evaluation.subjectId}</span>` : ''}
                                    ${evaluation.score ? `<span class="eval-score">${evaluation.score}/10</span>` : '<span class="eval-score">-</span>'}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    renderResultsByClass(container, evaluations) {
        const classGroups = {};
        
        evaluations.forEach(evaluation => {
            let classId = evaluation.classId;
            if (!classId && evaluation.studentId) {
                const student = this.students.find(s => s.id == evaluation.studentId);
                if (student) classId = student.classId;
            }
            
            if (classId) {
                if (!classGroups[classId]) {
                    classGroups[classId] = [];
                }
                classGroups[classId].push(evaluation);
            }
        });

        let html = '<h4>📊 Risultati Aggregati per Classe</h4>';
        
        Object.keys(classGroups).forEach(classId => {
            const cls = this.classes.find(c => c.id == classId);
            const classEvaluations = classGroups[classId];
            const avgScore = this.calculateAverageScore(classEvaluations);
            const subjectStats = this.calculateSubjectStats(classEvaluations);
            
            html += `
                <div class="card class-results">
                    <div class="class-results-header">
                        <h5>${cls ? cls.name : 'Classe sconosciuta'}</h5>
                        ${avgScore !== null ? `<span class="avg-score">Media Generale: ${avgScore.toFixed(2)}/10</span>` : ''}
                    </div>
                    <div class="class-stats">
                        <p><strong>Totale Valutazioni:</strong> ${classEvaluations.length}</p>
                        ${subjectStats ? `
                            <div class="subject-stats">
                                <strong>Medie per Disciplina:</strong>
                                ${Object.keys(subjectStats).map(subject => `
                                    <div class="subject-stat-row">
                                        <span>${subject}</span>
                                        <span>${subjectStats[subject].avg.toFixed(2)}/10 (${subjectStats[subject].count} valutazioni)</span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    calculateAverageScore(evaluations) {
        const scored = evaluations.filter(e => e.score !== null && e.score !== '');
        if (scored.length === 0) return null;
        const sum = scored.reduce((acc, e) => acc + parseFloat(e.score), 0);
        return sum / scored.length;
    }

    calculateSubjectStats(evaluations) {
        const stats = {};
        
        evaluations.forEach(evaluation => {
            if (evaluation.subjectId && evaluation.score) {
                if (!stats[evaluation.subjectId]) {
                    stats[evaluation.subjectId] = { sum: 0, count: 0 };
                }
                stats[evaluation.subjectId].sum += parseFloat(evaluation.score);
                stats[evaluation.subjectId].count++;
            }
        });

        Object.keys(stats).forEach(subject => {
            stats[subject].avg = stats[subject].sum / stats[subject].count;
        });

        return Object.keys(stats).length > 0 ? stats : null;
    }

    async generateCriteriaWithAI() {
        const subject = prompt('Per quale disciplina vuoi generare i criteri di valutazione?');
        if (!subject) return;

        const topic = prompt('Quale argomento o competenza vuoi valutare?');
        if (!topic) return;

        const apiKey = localStorage.getItem('openrouter-api-key');
        if (!apiKey) {
            alert('Configura la tua API Key di OpenRouter nelle impostazioni prima di usare questa funzione');
            return;
        }

        const loadingMsg = document.getElementById('chat-messages');
        if (loadingMsg) {
            const tempDiv = document.createElement('div');
            tempDiv.className = 'message assistant-message';
            tempDiv.textContent = '🤖 Generazione criteri di valutazione in corso...';
            loadingMsg.appendChild(tempDiv);
            loadingMsg.scrollTop = loadingMsg.scrollHeight;
        }

        try {
            const modelId = localStorage.getItem('openrouter-model-id') || 'alibaba/tongyi-deepresearch-30b-a3b';
            const response = await this.callOpenRouterAPI(
                `Genera 4-6 criteri di valutazione dettagliati per la disciplina "${subject}" sull'argomento "${topic}". 
                Per ogni criterio fornisci:
                - Nome del criterio
                - Descrizione dettagliata
                - Tipo (es. conoscenza, competenza, abilità)
                
                Rispondi in formato JSON array con questa struttura:
                [{"name": "...", "description": "...", "type": "..."}]`,
                apiKey,
                modelId
            );

            if (response && response.content) {
                try {
                    const jsonMatch = response.content.match(/\[[\s\S]*\]/);
                    if (jsonMatch) {
                        const criteria = JSON.parse(jsonMatch[0]);
                        
                        criteria.forEach(c => {
                            this.evaluationCriteria.push({
                                id: Date.now() + Math.random(),
                                name: c.name,
                                description: c.description,
                                subject: subject,
                                type: c.type,
                                createdAt: new Date().toISOString()
                            });
                        });

                        this.saveData();
                        this.renderEvaluations();
                        alert(`${criteria.length} criteri di valutazione generati con successo!`);
                    }
                } catch (e) {
                    console.error('Error parsing AI response:', e);
                    alert('Errore nella generazione dei criteri. Riprova.');
                }
            }
        } catch (error) {
            console.error('Error generating criteria:', error);
            alert('Errore nella generazione dei criteri');
        }
    }

    // AI Assistant methods
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            const displayElement = document.getElementById('selected-file-display');
            displayElement.innerHTML = `
                <div class="file-info">
                    <span class="file-name">📄 ${file.name} (${this.formatFileSize(file.size)})</span>
                    <button class="remove-file-btn" onclick="app.clearSelectedFile()">Rimuovi</button>
                </div>
            `;
            displayElement.classList.add('active');
        }
    }

    clearSelectedFile() {
        this.selectedFile = null;
        const fileInput = document.getElementById('ai-file-input');
        if (fileInput) {
            fileInput.value = '';
        }
        const displayElement = document.getElementById('selected-file-display');
        if (displayElement) {
            displayElement.innerHTML = '';
            displayElement.classList.remove('active');
        }
    }

    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    async sendAIMessage() {
        const input = document.getElementById('ai-input');
        const message = input.value.trim();
        
        if (!message && !this.selectedFile) return;

        const apiKey = localStorage.getItem('openrouter-api-key');
        
        if (!apiKey) {
            alert('Configura la tua API key di OpenRouter nelle impostazioni prima di usare l\'IA');
            this.switchTab('settings');
            return;
        }

        // Build user message with context
        let userMessage = message;
        if (this.activeClass) {
            userMessage = `[Classe: ${this.activeClass}] ${message}`;
        }

        this.addChatMessage('user', message);
        
        // Handle file upload
        if (this.selectedFile) {
            const fileInfo = `📎 File allegato: ${this.selectedFile.name}`;
            this.addChatMessage('system', fileInfo);
            
            // Check if file is supported (basic check - most models don't support file uploads via this API)
            this.addChatMessage('system', 'Nota: Il file è stato selezionato, ma la maggior parte dei modelli OpenRouter non supporta l\'upload diretto di file. Il file verrà ignorato in questa richiesta.');
            
            // Clear the selected file after attempting to send
            this.clearSelectedFile();
        }
        
        input.value = '';

        try {
            const response = await this.callOpenRouterAPI(userMessage, apiKey);
            
            if (response && response.content) {
                this.addChatMessage('ai', response.content);
            }
        } catch (error) {
            console.error('Error calling AI:', error);
            this.addChatMessage('system', `Errore: ${error.message}`);
        }
    }

    quickAIPrompt(prompt) {
        document.getElementById('ai-input').value = prompt;
        this.switchTab('ai-assistant');
    }

    addChatMessage(type, content) {
        const messagesContainer = document.getElementById('chat-messages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = content;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        this.chatMessages.push({ type, content, timestamp: new Date().toISOString() });
    }

    async callOpenRouterAPI(prompt, apiKey) {
        const modelId = localStorage.getItem('openrouter-model-id') || 'alibaba/tongyi-deepresearch-30b-a3b';
        
        // Build system message with context
        let systemMessage = 'Sei un assistente IA specializzato nell\'aiutare gli insegnanti con la pianificazione didattica, la creazione di materiali educativi e la gestione della classe. Rispondi sempre in italiano in modo chiaro e professionale.';
        
        if (this.activeClass) {
            systemMessage += ` L'insegnante sta lavorando con la classe ${this.activeClass}.`;
        }
        
        const schoolYear = localStorage.getItem('school-year');
        if (schoolYear) {
            systemMessage += ` Anno scolastico: ${schoolYear}.`;
        }
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: modelId,
                messages: [
                    {
                        role: 'system',
                        content: systemMessage
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
            return {
                content: data.choices[0].message.content
            };
        }

        throw new Error('No response from AI');
    }

    // Settings methods
    saveSettings() {
        const apiKey = document.getElementById('openrouter-api-key').value;
        const modelId = document.getElementById('openrouter-model-id').value;
        const firstName = document.getElementById('teacher-first-name').value;
        const lastName = document.getElementById('teacher-last-name').value;
        const email = document.getElementById('teacher-email').value;
        const schoolLevel = document.getElementById('school-level').value;
        const schoolName = document.getElementById('school-name').value;
        const schoolYear = document.getElementById('school-year').value;
        const yearStart = document.getElementById('school-year-start').value;
        const yearEnd = document.getElementById('school-year-end').value;

        if (apiKey) {
            localStorage.setItem('openrouter-api-key', apiKey);
        }
        if (modelId) {
            localStorage.setItem('openrouter-model-id', modelId);
        }
        if (firstName) {
            localStorage.setItem('teacher-first-name', firstName);
        }
        if (lastName) {
            localStorage.setItem('teacher-last-name', lastName);
        }
        if (email) {
            localStorage.setItem('teacher-email', email);
        }
        if (schoolLevel) {
            localStorage.setItem('school-level', schoolLevel);
        }
        if (schoolName) {
            localStorage.setItem('school-name', schoolName);
        }
        if (schoolYear) {
            localStorage.setItem('school-year', schoolYear);
        }
        if (yearStart) {
            localStorage.setItem('school-year-start', yearStart);
        }
        if (yearEnd) {
            localStorage.setItem('school-year-end', yearEnd);
        }

        // Save subjects
        localStorage.setItem('teacher-subjects', JSON.stringify(this.subjects));

        this.renderDashboard();
        alert('Impostazioni salvate con successo!');
    }

    loadSettings() {
        const apiKey = localStorage.getItem('openrouter-api-key');
        const modelId = localStorage.getItem('openrouter-model-id');
        const firstName = localStorage.getItem('teacher-first-name');
        const lastName = localStorage.getItem('teacher-last-name');
        const email = localStorage.getItem('teacher-email');
        const schoolLevel = localStorage.getItem('school-level');
        const schoolName = localStorage.getItem('school-name');
        const schoolYear = localStorage.getItem('school-year');
        const yearStart = localStorage.getItem('school-year-start');
        const yearEnd = localStorage.getItem('school-year-end');
        const subjectsData = localStorage.getItem('teacher-subjects');

        if (apiKey) {
            document.getElementById('openrouter-api-key').value = apiKey;
        }
        if (modelId) {
            document.getElementById('openrouter-model-id').value = modelId;
        }
        if (firstName) {
            const firstNameInput = document.getElementById('teacher-first-name');
            if (firstNameInput) firstNameInput.value = firstName;
        }
        if (lastName) {
            const lastNameInput = document.getElementById('teacher-last-name');
            if (lastNameInput) lastNameInput.value = lastName;
        }
        if (email) {
            const emailInput = document.getElementById('teacher-email');
            if (emailInput) emailInput.value = email;
        }
        if (schoolLevel) {
            const schoolLevelInput = document.getElementById('school-level');
            if (schoolLevelInput) schoolLevelInput.value = schoolLevel;
        }
        if (schoolName) {
            document.getElementById('school-name').value = schoolName;
        }
        if (schoolYear) {
            document.getElementById('school-year').value = schoolYear;
        }
        if (yearStart) {
            const yearStartInput = document.getElementById('school-year-start');
            if (yearStartInput) yearStartInput.value = yearStart;
        }
        if (yearEnd) {
            const yearEndInput = document.getElementById('school-year-end');
            if (yearEndInput) yearEndInput.value = yearEnd;
        }

        // Load subjects
        if (subjectsData) {
            try {
                this.subjects = JSON.parse(subjectsData);
                this.renderAllSubjects();
            } catch (e) {
                console.error('Error loading subjects:', e);
                this.subjects = [];
            }
        }

        // Initialize API key status icon
        const statusIcon = document.getElementById('api-key-status');
        if (statusIcon) {
            statusIcon.textContent = '⚪';
            statusIcon.className = 'api-key-status';
            statusIcon.title = 'Non verificata';
        }
    }

    async verifyAPIKey() {
        const apiKeyInput = document.getElementById('openrouter-api-key');
        const statusIcon = document.getElementById('api-key-status');
        const apiKey = apiKeyInput.value.trim();

        if (!apiKey) {
            alert('Inserisci una API key prima di verificarla');
            return;
        }

        const modelId = document.getElementById('openrouter-model-id').value.trim() || 'alibaba/tongyi-deepresearch-30b-a3b';

        // Update status to show verification in progress
        statusIcon.textContent = '⏳';
        statusIcon.className = 'api-key-status';
        statusIcon.title = 'Verifica in corso...';

        try {
            // Make a minimal test call to OpenRouter API
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: modelId,
                    messages: [
                        {
                            role: 'user',
                            content: 'test'
                        }
                    ],
                    max_tokens: 5
                })
            });

            if (response.ok) {
                // API key is valid
                statusIcon.textContent = '✅';
                statusIcon.className = 'api-key-status verified';
                statusIcon.title = 'API Key valida';
                alert(`✅ API Key verificata con successo!\n\nLa chiave API è valida e funzionante.\nModello verificato: ${modelId}`);
            } else {
                // API key is invalid
                const errorData = await response.json().catch(() => ({}));
                statusIcon.textContent = '❌';
                statusIcon.className = 'api-key-status invalid';
                statusIcon.title = 'API Key non valida';
                alert(`❌ Verifica fallita!\n\nLa chiave API non è valida.\nErrore: ${response.status} ${response.statusText}\n\n${errorData.error?.message || 'Verifica che la chiave sia corretta.'}`);
            }
        } catch (error) {
            // Network or other error
            statusIcon.textContent = '❌';
            statusIcon.className = 'api-key-status invalid';
            statusIcon.title = 'Errore di verifica';
            alert(`❌ Errore durante la verifica!\n\n${error.message}\n\nVerifica la tua connessione internet e riprova.`);
        }
    }

    // Data persistence methods
    saveData() {
        localStorage.setItem('docente-plus-lessons', JSON.stringify(this.lessons));
        localStorage.setItem('docente-plus-students', JSON.stringify(this.students));
        localStorage.setItem('docente-plus-classes', JSON.stringify(this.classes));
        localStorage.setItem('docente-plus-evaluation-criteria', JSON.stringify(this.evaluationCriteria));
        localStorage.setItem('docente-plus-evaluation-grids', JSON.stringify(this.evaluationGrids));
        localStorage.setItem('docente-plus-evaluations', JSON.stringify(this.evaluations));
        localStorage.setItem('docente-plus-notifications', JSON.stringify(this.notifications));
        localStorage.setItem('docente-plus-reminders', JSON.stringify(this.reminders));
        localStorage.setItem('docente-plus-notification-settings', JSON.stringify(this.notificationSettings));
    }

    loadData() {
        const lessonsData = localStorage.getItem('docente-plus-lessons');
        const studentsData = localStorage.getItem('docente-plus-students');
        const classesData = localStorage.getItem('docente-plus-classes');
        const evaluationCriteriaData = localStorage.getItem('docente-plus-evaluation-criteria');
        const evaluationGridsData = localStorage.getItem('docente-plus-evaluation-grids');
        const evaluationsData = localStorage.getItem('docente-plus-evaluations');

        if (lessonsData) {
            try {
                this.lessons = JSON.parse(lessonsData);
            } catch (e) {
                console.error('Error loading lessons:', e);
                this.lessons = [];
            }
        }

        if (studentsData) {
            try {
                this.students = JSON.parse(studentsData);
            } catch (e) {
                console.error('Error loading students:', e);
                this.students = [];
            }
        }

        if (classesData) {
            try {
                this.classes = JSON.parse(classesData);
            } catch (e) {
                console.error('Error loading classes:', e);
                this.classes = [];
            }
        }

        if (evaluationCriteriaData) {
            try {
                this.evaluationCriteria = JSON.parse(evaluationCriteriaData);
            } catch (e) {
                console.error('Error loading evaluation criteria:', e);
                this.evaluationCriteria = [];
            }
        }

        if (evaluationGridsData) {
            try {
                this.evaluationGrids = JSON.parse(evaluationGridsData);
            } catch (e) {
                console.error('Error loading evaluation grids:', e);
                this.evaluationGrids = [];
            }
        }

        if (evaluationsData) {
            try {
                this.evaluations = JSON.parse(evaluationsData);
            } catch (e) {
                console.error('Error loading evaluations:', e);
                this.evaluations = [];
            }
        }

        // Load notifications
        const notificationsData = localStorage.getItem('docente-plus-notifications');
        if (notificationsData) {
            try {
                this.notifications = JSON.parse(notificationsData);
            } catch (e) {
                console.error('Error loading notifications:', e);
                this.notifications = [];
            }
        }

        // Load reminders
        const remindersData = localStorage.getItem('docente-plus-reminders');
        if (remindersData) {
            try {
                this.reminders = JSON.parse(remindersData);
            } catch (e) {
                console.error('Error loading reminders:', e);
                this.reminders = [];
            }
        }

        // Load notification settings
        const notificationSettingsData = localStorage.getItem('docente-plus-notification-settings');
        if (notificationSettingsData) {
            try {
                this.notificationSettings = JSON.parse(notificationSettingsData);
            } catch (e) {
                console.error('Error loading notification settings:', e);
            }
        }
    }

    exportData() {
        const data = {
            lessons: this.lessons,
            students: this.students,
            classes: this.classes,
            subjects: this.subjects,
            evaluationCriteria: this.evaluationCriteria,
            evaluationGrids: this.evaluationGrids,
            evaluations: this.evaluations,
            notifications: this.notifications,
            reminders: this.reminders,
            notificationSettings: this.notificationSettings,
            teacherProfile: {
                firstName: localStorage.getItem('teacher-first-name'),
                lastName: localStorage.getItem('teacher-last-name'),
                email: localStorage.getItem('teacher-email'),
                schoolLevel: localStorage.getItem('school-level'),
                schoolName: localStorage.getItem('school-name'),
                schoolYear: localStorage.getItem('school-year'),
                schoolYearStart: localStorage.getItem('school-year-start'),
                schoolYearEnd: localStorage.getItem('school-year-end')
            },
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `docente-plus-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    if (data.lessons) {
                        this.lessons = data.lessons;
                    }
                    if (data.students) {
                        this.students = data.students;
                    }
                    if (data.classes) {
                        this.classes = data.classes;
                    }
                    if (data.subjects) {
                        this.subjects = data.subjects;
                        localStorage.setItem('teacher-subjects', JSON.stringify(this.subjects));
                    }
                    if (data.evaluationCriteria) {
                        this.evaluationCriteria = data.evaluationCriteria;
                    }
                    if (data.evaluationGrids) {
                        this.evaluationGrids = data.evaluationGrids;
                    }
                    if (data.evaluations) {
                        this.evaluations = data.evaluations;
                    }
                    if (data.notifications) {
                        this.notifications = data.notifications;
                    }
                    if (data.reminders) {
                        this.reminders = data.reminders;
                    }
                    if (data.notificationSettings) {
                        this.notificationSettings = data.notificationSettings;
                    }
                    if (data.teacherProfile) {
                        const profile = data.teacherProfile;
                        if (profile.firstName) localStorage.setItem('teacher-first-name', profile.firstName);
                        if (profile.lastName) localStorage.setItem('teacher-last-name', profile.lastName);
                        if (profile.email) localStorage.setItem('teacher-email', profile.email);
                        if (profile.schoolLevel) localStorage.setItem('school-level', profile.schoolLevel);
                        if (profile.schoolName) localStorage.setItem('school-name', profile.schoolName);
                        if (profile.schoolYear) localStorage.setItem('school-year', profile.schoolYear);
                        if (profile.schoolYearStart) localStorage.setItem('school-year-start', profile.schoolYearStart);
                        if (profile.schoolYearEnd) localStorage.setItem('school-year-end', profile.schoolYearEnd);
                    }
                    
                    this.saveData();
                    this.renderLessons();
                    this.renderStudents();
                    this.renderClasses();
                    this.renderEvaluations();
                    this.renderNotifications();
                    this.updateClassSelectors();
                    this.loadSettings();
                    this.renderDashboard();
                    
                    alert('Dati importati con successo!');
                } catch (error) {
                    console.error('Error importing data:', error);
                    alert('Errore durante l\'importazione dei dati');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    // Notification Management Methods
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted');
                } else {
                    console.log('Notification permission denied');
                }
            });
        }
    }

    startNotificationChecks() {
        // Check for notifications every 5 minutes
        this.notificationCheckInterval = setInterval(() => {
            this.checkAndSendNotifications();
        }, 5 * 60 * 1000); // 5 minutes

        // Also check immediately
        this.checkAndSendNotifications();
    }

    checkAndSendNotifications() {
        const now = new Date();

        // Check if we're in quiet hours
        if (this.isQuietHours(now)) {
            return;
        }

        // Check lesson reminders
        if (this.notificationSettings.lessonReminders) {
            this.checkLessonReminders(now);
        }

        // Check custom reminders
        this.checkCustomReminders(now);
    }

    isQuietHours(date) {
        if (!this.notificationSettings.quietHoursEnabled) {
            return false;
        }

        const currentTime = date.getHours() * 60 + date.getMinutes();
        const [startHour, startMin] = this.notificationSettings.quietHoursStart.split(':').map(Number);
        const [endHour, endMin] = this.notificationSettings.quietHoursEnd.split(':').map(Number);
        const startTime = startHour * 60 + startMin;
        const endTime = endHour * 60 + endMin;

        if (startTime < endTime) {
            return currentTime >= startTime && currentTime <= endTime;
        } else {
            // Quiet hours span midnight
            return currentTime >= startTime || currentTime <= endTime;
        }
    }

    checkLessonReminders(now) {
        this.lessons.forEach(lesson => {
            const lessonDate = new Date(lesson.date + 'T' + lesson.time);
            const timeDiff = lessonDate - now;
            const hoursDiff = timeDiff / (1000 * 60 * 60);

            // Check for 24-hour reminder
            if (this.notificationSettings.remindersBefore24h && 
                hoursDiff > 23.5 && hoursDiff <= 24.5) {
                const notificationId = `lesson-24h-${lesson.id}`;
                if (!this.hasNotificationBeenSent(notificationId)) {
                    this.createNotification({
                        title: '📚 Promemoria Lezione (24 ore)',
                        message: `Domani alle ${lesson.time}: ${lesson.title}`,
                        type: 'lesson-reminder',
                        relatedId: lesson.id,
                        notificationId: notificationId
                    });
                }
            }

            // Check for 1-hour reminder
            if (this.notificationSettings.remindersBefore1h && 
                hoursDiff > 0.5 && hoursDiff <= 1.5) {
                const notificationId = `lesson-1h-${lesson.id}`;
                if (!this.hasNotificationBeenSent(notificationId)) {
                    this.createNotification({
                        title: '📚 Promemoria Lezione (1 ora)',
                        message: `Tra un\'ora: ${lesson.title}`,
                        type: 'lesson-reminder',
                        relatedId: lesson.id,
                        notificationId: notificationId
                    });
                }
            }
        });
    }

    checkCustomReminders(now) {
        this.reminders.forEach(reminder => {
            if (reminder.dismissed || reminder.notified) {
                return;
            }

            const reminderDate = new Date(reminder.dateTime);
            const timeDiff = reminderDate - now;

            if (timeDiff <= 0 && timeDiff > -5 * 60 * 1000) { // Within 5 minutes of reminder time
                this.createNotification({
                    title: `🔔 ${reminder.title}`,
                    message: reminder.message,
                    type: 'custom-reminder',
                    relatedId: reminder.id,
                    notificationId: `reminder-${reminder.id}`
                });
                reminder.notified = true;
                this.saveData();
            }
        });
    }

    hasNotificationBeenSent(notificationId) {
        return this.notifications.some(n => n.notificationId === notificationId);
    }

    createNotification(data) {
        const notification = {
            id: Date.now(),
            ...data,
            createdAt: new Date().toISOString(),
            read: false
        };

        this.notifications.unshift(notification);
        this.saveData();

        // Send browser notification
        if (this.notificationSettings.browserNotifications && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: '🎓',
                tag: notification.notificationId
            });
        }

        // Update UI if on notifications tab
        this.renderNotifications();
    }

    addReminder() {
        const title = document.getElementById('reminder-title').value;
        const message = document.getElementById('reminder-message').value;
        const date = document.getElementById('reminder-date').value;
        const time = document.getElementById('reminder-time').value;

        if (!title || !date || !time) {
            alert('Inserisci titolo, data e ora per il promemoria');
            return;
        }

        const reminder = {
            id: Date.now(),
            title,
            message,
            dateTime: `${date}T${time}`,
            createdAt: new Date().toISOString(),
            notified: false,
            dismissed: false
        };

        this.reminders.push(reminder);
        this.saveData();
        this.renderNotifications();
        this.hideAddReminderForm();

        // Clear form
        document.getElementById('reminder-title').value = '';
        document.getElementById('reminder-message').value = '';
        document.getElementById('reminder-date').value = '';
        document.getElementById('reminder-time').value = '';
    }

    deleteReminder(id) {
        if (confirm('Sei sicuro di voler eliminare questo promemoria?')) {
            this.reminders = this.reminders.filter(r => r.id !== id);
            this.saveData();
            this.renderNotifications();
        }
    }

    dismissReminder(id) {
        const reminder = this.reminders.find(r => r.id === id);
        if (reminder) {
            reminder.dismissed = true;
            this.saveData();
            this.renderNotifications();
        }
    }

    markNotificationRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.saveData();
            this.renderNotifications();
        }
    }

    markAllNotificationsRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveData();
        this.renderNotifications();
    }

    deleteNotification(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.saveData();
        this.renderNotifications();
    }

    clearAllNotifications() {
        if (confirm('Sei sicuro di voler eliminare tutte le notifiche?')) {
            this.notifications = [];
            this.saveData();
            this.renderNotifications();
        }
    }

    saveNotificationSettings() {
        this.notificationSettings.browserNotifications = document.getElementById('notification-browser').checked;
        this.notificationSettings.emailNotifications = document.getElementById('notification-email').checked;
        this.notificationSettings.lessonReminders = document.getElementById('notification-lesson-reminders').checked;
        this.notificationSettings.remindersBefore24h = document.getElementById('notification-24h').checked;
        this.notificationSettings.remindersBefore1h = document.getElementById('notification-1h').checked;
        this.notificationSettings.quietHoursEnabled = document.getElementById('notification-quiet-hours').checked;
        this.notificationSettings.quietHoursStart = document.getElementById('notification-quiet-start').value;
        this.notificationSettings.quietHoursEnd = document.getElementById('notification-quiet-end').value;

        this.saveData();
        alert('Impostazioni notifiche salvate!');
    }

    showAddReminderForm() {
        document.getElementById('add-reminder-form').style.display = 'block';
    }

    hideAddReminderForm() {
        document.getElementById('add-reminder-form').style.display = 'none';
    }

    renderNotifications() {
        // Render notifications list
        const notificationsList = document.getElementById('notifications-list');
        if (notificationsList) {
            const unreadCount = this.notifications.filter(n => !n.read).length;
            const notificationsHeader = document.getElementById('notifications-header');
            if (notificationsHeader) {
                notificationsHeader.innerHTML = `
                    <h3>🔔 Notifiche Recenti</h3>
                    ${unreadCount > 0 ? `<span class="badge">${unreadCount} non lette</span>` : ''}
                `;
            }

            if (this.notifications.length === 0) {
                notificationsList.innerHTML = '<p class="empty-state">Nessuna notifica</p>';
            } else {
                notificationsList.innerHTML = this.notifications.slice(0, 50).map(notification => `
                    <div class="notification-item ${notification.read ? 'read' : 'unread'}">
                        <div class="notification-header">
                            <h4>${notification.title}</h4>
                            <span class="notification-time">${new Date(notification.createdAt).toLocaleString('it-IT')}</span>
                        </div>
                        <p>${notification.message}</p>
                        <div class="notification-actions">
                            ${!notification.read ? `<button class="btn btn-sm" onclick="app.markNotificationRead(${notification.id})">Segna come letta</button>` : ''}
                            <button class="btn btn-sm btn-danger" onclick="app.deleteNotification(${notification.id})">Elimina</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Render reminders list
        const remindersList = document.getElementById('reminders-list');
        if (remindersList) {
            const activeReminders = this.reminders.filter(r => !r.dismissed);
            
            if (activeReminders.length === 0) {
                remindersList.innerHTML = '<p class="empty-state">Nessun promemoria attivo</p>';
            } else {
                remindersList.innerHTML = activeReminders.map(reminder => {
                    const reminderDate = new Date(reminder.dateTime);
                    const isPast = reminderDate < new Date();
                    
                    return `
                        <div class="reminder-item ${isPast ? 'past' : 'upcoming'}">
                            <div class="reminder-header">
                                <h4>${reminder.title}</h4>
                                <span class="reminder-time">${reminderDate.toLocaleString('it-IT')}</span>
                            </div>
                            ${reminder.message ? `<p>${reminder.message}</p>` : ''}
                            <div class="reminder-actions">
                                <button class="btn btn-sm" onclick="app.dismissReminder(${reminder.id})">Archivia</button>
                                <button class="btn btn-sm btn-danger" onclick="app.deleteReminder(${reminder.id})">Elimina</button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        // Load notification settings into form
        const browserCheckbox = document.getElementById('notification-browser');
        if (browserCheckbox) {
            browserCheckbox.checked = this.notificationSettings.browserNotifications;
            document.getElementById('notification-email').checked = this.notificationSettings.emailNotifications;
            document.getElementById('notification-lesson-reminders').checked = this.notificationSettings.lessonReminders;
            document.getElementById('notification-24h').checked = this.notificationSettings.remindersBefore24h;
            document.getElementById('notification-1h').checked = this.notificationSettings.remindersBefore1h;
            document.getElementById('notification-quiet-hours').checked = this.notificationSettings.quietHoursEnabled;
            document.getElementById('notification-quiet-start').value = this.notificationSettings.quietHoursStart;
            document.getElementById('notification-quiet-end').value = this.notificationSettings.quietHoursEnd;
        }
    }
}

// Initialize the application
const app = new DocentePlusPlus();
