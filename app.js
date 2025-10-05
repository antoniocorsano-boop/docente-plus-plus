// Docente++ - Main Application JavaScript
// Web app for teacher didactics management powered by OpenRouter AI

class DocentePlusPlus {
    constructor() {
        this.lessons = [];
        this.students = [];
        this.settings = {};
        this.chatMessages = [];
        this.activeClass = '';
        this.selectedFile = null;
        this.materials = []; // Store uploaded materials/files
        this.init();
    }

    init() {
        // Load data from localStorage
        this.loadData();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Render initial data
        this.renderDashboard();
        this.renderLessons();
        this.renderStudents();
        this.renderMaterials();
        this.loadSettings();
        this.loadActiveClass();
        
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

        // AI input
        const aiInput = document.getElementById('ai-input');
        if (aiInput) {
            aiInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    this.sendAIMessage();
                }
            });
        }
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

        // Refresh materials when switching to materials tab
        if (tabName === 'materials') {
            this.renderMaterials();
        }
    }

    // Dashboard methods
    renderDashboard() {
        document.getElementById('lesson-count').textContent = this.lessons.length;
        document.getElementById('student-count').textContent = this.students.length;
        document.getElementById('evaluation-count').textContent = '0';
        
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
            .map(lesson => {
                const linkedMaterials = lesson.materials ? 
                    this.materials.filter(m => lesson.materials.includes(m.id)) : [];
                
                return `
                    <div class="lesson-item">
                        <h4>${lesson.title}</h4>
                        <p><strong>Materia:</strong> ${lesson.subject}</p>
                        <p><strong>Data:</strong> ${new Date(lesson.date).toLocaleDateString('it-IT')}</p>
                        <p>${lesson.description || 'Nessuna descrizione'}</p>
                        ${linkedMaterials.length > 0 ? `
                            <div class="lesson-materials">
                                <strong>📎 Materiali allegati:</strong>
                                <ul class="materials-list-inline">
                                    ${linkedMaterials.map(m => `
                                        <li>
                                            <button class="material-link-btn" onclick="app.downloadMaterial(${m.id})" aria-label="Scarica ${m.name}">
                                                📄 ${m.name}
                                            </button>
                                            <button class="material-unlink-btn" onclick="app.unlinkMaterialFromLesson(${m.id}, ${lesson.id})" aria-label="Rimuovi ${m.name} dalla lezione" title="Rimuovi dalla lezione">✕</button>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        <div class="item-actions">
                            <button class="btn btn-danger" onclick="app.deleteLesson(${lesson.id})">Elimina</button>
                        </div>
                    </div>
                `;
            }).join('');
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

    // AI Assistant methods
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            // Validate file size (max 5MB for localStorage compatibility)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                alert('Il file è troppo grande. La dimensione massima è 5MB.');
                event.target.value = '';
                return;
            }

            // Validate file type
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'text/plain', 
                                  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.txt', '.doc', '.docx'];
            
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(fileExtension) && !allowedTypes.includes(file.type)) {
                alert('Tipo di file non supportato. Sono accettati solo: PDF, immagini (JPG, PNG), TXT, DOC, DOCX');
                event.target.value = '';
                return;
            }

            this.selectedFile = file;
            const displayElement = document.getElementById('selected-file-display');
            displayElement.innerHTML = `
                <div class="file-info">
                    <span class="file-name">📄 ${file.name} (${this.formatFileSize(file.size)})</span>
                    <button class="remove-file-btn" onclick="app.clearSelectedFile()" aria-label="Rimuovi file selezionato">Rimuovi</button>
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

        // Handle file upload first (before API key check)
        let savedFileId = null;
        if (this.selectedFile) {
            try {
                // Save file to materials
                savedFileId = await this.saveFileMaterial(this.selectedFile, message);
                const fileInfo = `📎 File salvato: ${this.selectedFile.name}`;
                this.addChatMessage('system', fileInfo);
                
                // Add note about AI model compatibility
                this.addChatMessage('system', 'Nota: Il file è stato salvato nei materiali. La maggior parte dei modelli OpenRouter non supporta l\'elaborazione diretta di file, ma il file è disponibile nella sezione materiali della lezione.');
                
                // Clear the selected file after saving
                this.clearSelectedFile();
            } catch (error) {
                console.error('Error saving file:', error);
                this.addChatMessage('system', `Errore nel salvataggio del file: ${error.message}`);
                this.clearSelectedFile();
            }
        }
        
        // If there's a message to send to AI, check for API key
        if (message) {
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
        }
        
        input.value = '';

        // Only call AI if there's a message and API key
        if (message && apiKey) {
            try {
                const userMessage = this.activeClass ? `[Classe: ${this.activeClass}] ${message}` : message;
                const response = await this.callOpenRouterAPI(userMessage, apiKey);
                
                if (response && response.content) {
                    this.addChatMessage('ai', response.content);
                }
            } catch (error) {
                console.error('Error calling AI:', error);
                this.addChatMessage('system', `Errore: ${error.message}`);
            }
        }
    }

    async saveFileMaterial(file, description = '') {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const material = {
                        id: Date.now(),
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        data: e.target.result, // Base64 encoded data
                        description: description,
                        uploadedAt: new Date().toISOString(),
                        linkedToClass: this.activeClass || null,
                        linkedToLessonId: null // Can be linked later
                    };
                    
                    this.materials.push(material);
                    this.saveData();
                    resolve(material.id);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Errore nella lettura del file'));
            };
            
            reader.readAsDataURL(file);
        });
    }

    deleteMaterial(materialId) {
        if (confirm('Sei sicuro di voler eliminare questo materiale?')) {
            this.materials = this.materials.filter(m => m.id !== materialId);
            
            // Remove references from lessons
            this.lessons.forEach(lesson => {
                if (lesson.materials && lesson.materials.includes(materialId)) {
                    lesson.materials = lesson.materials.filter(id => id !== materialId);
                }
            });
            
            this.saveData();
            this.renderMaterials();
        }
    }

    linkMaterialToLesson(materialId, lessonId) {
        const lesson = this.lessons.find(l => l.id === lessonId);
        if (lesson) {
            if (!lesson.materials) {
                lesson.materials = [];
            }
            if (!lesson.materials.includes(materialId)) {
                lesson.materials.push(materialId);
            }
            
            const material = this.materials.find(m => m.id === materialId);
            if (material) {
                material.linkedToLessonId = lessonId;
            }
            
            this.saveData();
            this.renderLessons();
            this.renderMaterials();
        }
    }

    unlinkMaterialFromLesson(materialId, lessonId) {
        const lesson = this.lessons.find(l => l.id === lessonId);
        if (lesson && lesson.materials) {
            lesson.materials = lesson.materials.filter(id => id !== materialId);
            
            const material = this.materials.find(m => m.id === materialId);
            if (material && material.linkedToLessonId === lessonId) {
                material.linkedToLessonId = null;
            }
            
            this.saveData();
            this.renderLessons();
            this.renderMaterials();
        }
    }

    downloadMaterial(materialId) {
        const material = this.materials.find(m => m.id === materialId);
        if (!material) return;

        const link = document.createElement('a');
        link.href = material.data;
        link.download = material.name;
        link.click();
    }

    renderMaterials() {
        const materialsList = document.getElementById('materials-list');
        if (!materialsList) return;

        if (this.materials.length === 0) {
            materialsList.innerHTML = `
                <div class="empty-state">
                    <h3>Nessun materiale caricato</h3>
                    <p>I file caricati tramite la chat IA appariranno qui</p>
                </div>
            `;
            return;
        }

        materialsList.innerHTML = this.materials
            .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
            .map(material => {
                const linkedLesson = material.linkedToLessonId ? 
                    this.lessons.find(l => l.id === material.linkedToLessonId) : null;
                
                return `
                    <div class="material-item">
                        <div class="material-header">
                            <h4>📎 ${material.name}</h4>
                            <span class="material-size">${this.formatFileSize(material.size)}</span>
                        </div>
                        ${material.description ? `<p class="material-description">${material.description}</p>` : ''}
                        <div class="material-meta">
                            <span>📅 ${new Date(material.uploadedAt).toLocaleDateString('it-IT')}</span>
                            ${material.linkedToClass ? `<span>🎯 Classe: ${material.linkedToClass}</span>` : ''}
                            ${linkedLesson ? `<span>📚 Lezione: ${linkedLesson.title}</span>` : ''}
                        </div>
                        <div class="material-actions">
                            <button class="btn btn-primary" onclick="app.downloadMaterial(${material.id})" aria-label="Scarica ${material.name}">📥 Scarica</button>
                            ${!material.linkedToLessonId ? `
                                <select onchange="if(this.value) app.linkMaterialToLesson(${material.id}, parseInt(this.value))" class="lesson-link-select" aria-label="Collega a lezione">
                                    <option value="">Collega a lezione...</option>
                                    ${this.lessons.map(l => `<option value="${l.id}">${l.title}</option>`).join('')}
                                </select>
                            ` : `
                                <button class="btn btn-secondary" onclick="app.unlinkMaterialFromLesson(${material.id}, ${material.linkedToLessonId})" aria-label="Scollega dalla lezione">🔗 Scollega</button>
                            `}
                            <button class="btn btn-danger" onclick="app.deleteMaterial(${material.id})" aria-label="Elimina ${material.name}">🗑️ Elimina</button>
                        </div>
                    </div>
                `;
            }).join('');
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
        const teacherName = document.getElementById('teacher-name').value;
        const schoolName = document.getElementById('school-name').value;
        const schoolYear = document.getElementById('school-year').value;

        if (apiKey) {
            localStorage.setItem('openrouter-api-key', apiKey);
        }
        if (modelId) {
            localStorage.setItem('openrouter-model-id', modelId);
        }
        if (teacherName) {
            localStorage.setItem('teacher-name', teacherName);
        }
        if (schoolName) {
            localStorage.setItem('school-name', schoolName);
        }
        if (schoolYear) {
            localStorage.setItem('school-year', schoolYear);
        }

        this.renderDashboard();
        alert('Impostazioni salvate con successo!');
    }

    loadSettings() {
        const apiKey = localStorage.getItem('openrouter-api-key');
        const modelId = localStorage.getItem('openrouter-model-id');
        const teacherName = localStorage.getItem('teacher-name');
        const schoolName = localStorage.getItem('school-name');
        const schoolYear = localStorage.getItem('school-year');

        if (apiKey) {
            document.getElementById('openrouter-api-key').value = apiKey;
        }
        if (modelId) {
            document.getElementById('openrouter-model-id').value = modelId;
        }
        if (teacherName) {
            document.getElementById('teacher-name').value = teacherName;
        }
        if (schoolName) {
            document.getElementById('school-name').value = schoolName;
        }
        if (schoolYear) {
            document.getElementById('school-year').value = schoolYear;
        }

        // Initialize API key status icon
        const statusIcon = document.getElementById('api-key-status');
        if (statusIcon) {
            statusIcon.textContent = '⚪';
            statusIcon.className = 'api-key-status unverified';
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
        localStorage.setItem('docente-plus-materials', JSON.stringify(this.materials));
        localStorage.setItem('docente-plus-chat-messages', JSON.stringify(this.chatMessages));
    }

    loadData() {
        const lessonsData = localStorage.getItem('docente-plus-lessons');
        const studentsData = localStorage.getItem('docente-plus-students');
        const materialsData = localStorage.getItem('docente-plus-materials');
        const chatMessagesData = localStorage.getItem('docente-plus-chat-messages');

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

        if (materialsData) {
            try {
                this.materials = JSON.parse(materialsData);
            } catch (e) {
                console.error('Error loading materials:', e);
                this.materials = [];
            }
        }

        if (chatMessagesData) {
            try {
                this.chatMessages = JSON.parse(chatMessagesData);
                // Restore chat messages to UI
                this.chatMessages.forEach(msg => {
                    const messagesContainer = document.getElementById('chat-messages');
                    if (messagesContainer) {
                        const messageDiv = document.createElement('div');
                        messageDiv.className = `message ${msg.type}`;
                        messageDiv.textContent = msg.content;
                        messagesContainer.appendChild(messageDiv);
                    }
                });
            } catch (e) {
                console.error('Error loading chat messages:', e);
                this.chatMessages = [];
            }
        }
    }

    exportData() {
        const data = {
            lessons: this.lessons,
            students: this.students,
            materials: this.materials,
            chatMessages: this.chatMessages,
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
                    if (data.materials) {
                        this.materials = data.materials;
                    }
                    if (data.chatMessages) {
                        this.chatMessages = data.chatMessages;
                    }
                    
                    this.saveData();
                    this.renderLessons();
                    this.renderStudents();
                    this.renderMaterials();
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
}

// Initialize the application
const app = new DocentePlusPlus();
