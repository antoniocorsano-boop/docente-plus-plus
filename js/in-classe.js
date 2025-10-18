/**
 * In Classe Page - Modular JavaScript
 * Mobile First, Vanilla JS, Ready for API Integration
 */

// Mock Data Management
class InClasseDataManager {
    constructor() {
        this.lessonKey = this.getLessonKeyFromURL();
        this.lessonData = this.loadLessonData();
        this.activities = this.loadActivities();
        this.homework = this.loadHomework();
        this.evaluations = this.loadEvaluations();
        this.recordings = this.loadRecordings();
        this.summary = this.loadSummary();
    }

    getLessonKeyFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('lesson') || null;
    }

    loadLessonData() {
        if (!this.lessonKey) {
            return null; // No lesson selected yet
        }

        // Try to load from localStorage schedule first
        const schedule = this.getScheduleFromStorage();
        if (schedule && schedule[this.lessonKey]) {
            const slot = schedule[this.lessonKey];
            const [day, time] = this.lessonKey.split('-');
            return {
                classId: slot.classId || '',
                className: slot.className || `Classe ${slot.classId}`,
                subject: slot.subject || '',
                day: day,
                time: time,
                activityType: slot.activityType || '',
                students: this.getStudentsForClass(slot.classId)
            };
        }

        // Fallback to mock data - in production, fetch from API
        const mockData = {
            'Lunedì-08:00': {
                classId: '3A',
                className: 'Classe 3A',
                subject: 'Matematica',
                day: 'Lunedì',
                time: '08:00 - 09:00',
                activityType: 'Teoria',
                students: [
                    { id: '1', firstName: 'Mario', lastName: 'Rossi', avatar: 'MR' },
                    { id: '2', firstName: 'Laura', lastName: 'Bianchi', avatar: 'LB' },
                    { id: '3', firstName: 'Giuseppe', lastName: 'Verdi', avatar: 'GV' },
                    { id: '4', firstName: 'Anna', lastName: 'Neri', avatar: 'AN' }
                ]
            }
        };
        
        return mockData[this.lessonKey] || null;
    }

    getScheduleFromStorage() {
        try {
            const scheduleStr = localStorage.getItem('schedule');
            return scheduleStr ? JSON.parse(scheduleStr) : {};
        } catch (e) {
            console.error('Error loading schedule:', e);
            return {};
        }
    }

    getStudentsForClass(classId) {
        if (!classId) return [];
        try {
            const studentsStr = localStorage.getItem('students');
            const students = studentsStr ? JSON.parse(studentsStr) : [];
            return students.filter(s => s.classId === classId).map(s => ({
                id: s.id,
                firstName: s.firstName,
                lastName: s.lastName,
                avatar: `${s.firstName?.charAt(0) || ''}${s.lastName?.charAt(0) || ''}`
            }));
        } catch (e) {
            console.error('Error loading students:', e);
            return [];
        }
    }

    loadActivities() {
        const key = `inClasse_activities_${this.lessonKey}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    }

    saveActivities() {
        const key = `inClasse_activities_${this.lessonKey}`;
        localStorage.setItem(key, JSON.stringify(this.activities));
    }

    addActivity(activity) {
        activity.id = Date.now().toString();
        activity.timestamp = new Date().toISOString();
        this.activities.push(activity);
        this.saveActivities();
        return activity;
    }

    removeActivity(id) {
        this.activities = this.activities.filter(a => a.id !== id);
        this.saveActivities();
    }

    loadHomework() {
        const key = `inClasse_homework_${this.lessonKey}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    }

    saveHomework() {
        const key = `inClasse_homework_${this.lessonKey}`;
        localStorage.setItem(key, JSON.stringify(this.homework));
    }

    addHomework(homework) {
        homework.id = Date.now().toString();
        homework.timestamp = new Date().toISOString();
        homework.completed = false;
        this.homework.push(homework);
        this.saveHomework();
        return homework;
    }

    removeHomework(id) {
        this.homework = this.homework.filter(h => h.id !== id);
        this.saveHomework();
    }

    toggleHomeworkComplete(id) {
        const hw = this.homework.find(h => h.id === id);
        if (hw) {
            hw.completed = !hw.completed;
            this.saveHomework();
        }
    }

    loadEvaluations() {
        const key = `inClasse_evaluations_${this.lessonKey}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : {};
    }

    saveEvaluations() {
        const key = `inClasse_evaluations_${this.lessonKey}`;
        localStorage.setItem(key, JSON.stringify(this.evaluations));
    }

    addEvaluation(studentId, evaluation) {
        if (!this.evaluations[studentId]) {
            this.evaluations[studentId] = [];
        }
        evaluation.timestamp = new Date().toISOString();
        this.evaluations[studentId].push(evaluation);
        this.saveEvaluations();
    }

    getStudentLastGrade(studentId) {
        const evals = this.evaluations[studentId];
        if (!evals || evals.length === 0) return null;
        return evals[evals.length - 1].grade;
    }

    loadRecordings() {
        const key = `inClasse_recordings_${this.lessonKey}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    }

    saveRecordings() {
        const key = `inClasse_recordings_${this.lessonKey}`;
        localStorage.setItem(key, JSON.stringify(this.recordings));
    }

    addRecording(recording) {
        recording.id = Date.now().toString();
        recording.timestamp = new Date().toISOString();
        this.recordings.push(recording);
        this.saveRecordings();
        return recording;
    }

    loadSummary() {
        const key = `inClasse_summary_${this.lessonKey}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : { text: '', nextSteps: [] };
    }

    saveSummary() {
        const key = `inClasse_summary_${this.lessonKey}`;
        localStorage.setItem(key, JSON.stringify(this.summary));
    }
}

// Audio Recording Manager
class AudioRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.stream = null;
        this.startTime = null;
        this.timerInterval = null;
    }

    async start() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(this.stream);
            this.audioChunks = [];

            this.mediaRecorder.addEventListener('dataavailable', event => {
                this.audioChunks.push(event.data);
            });

            this.mediaRecorder.start();
            this.startTime = Date.now();
            return true;
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Impossibile accedere al microfono. Verifica le permessi del browser.');
            return false;
        }
    }

    stop() {
        return new Promise((resolve) => {
            this.mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const duration = Math.floor((Date.now() - this.startTime) / 1000);
                
                // Stop all tracks
                if (this.stream) {
                    this.stream.getTracks().forEach(track => track.stop());
                }
                
                resolve({ blob: audioBlob, url: audioUrl, duration });
            });

            this.mediaRecorder.stop();
        });
    }

    isRecording() {
        return this.mediaRecorder && this.mediaRecorder.state === 'recording';
    }
}

// Analytics Manager (Demo/Mock)
class AnalyticsManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
    }

    generateMockData() {
        const students = this.dataManager.lessonData.students;
        const present = Math.floor(students.length * 0.8); // 80% present
        const absent = students.length - present;

        const grades = students.map(() => Math.floor(Math.random() * 5) + 6); // Grades 6-10
        const average = (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1);

        return {
            attendance: { present, absent },
            performance: { grades, average },
            trend: this.generateTrendData()
        };
    }

    generateTrendData() {
        const weeks = ['Sett. 1', 'Sett. 2', 'Sett. 3', 'Sett. 4'];
        const values = weeks.map(() => Math.floor(Math.random() * 3) + 7);
        return { weeks, values };
    }

    renderCharts() {
        const data = this.generateMockData();

        // Update attendance summary
        document.getElementById('present-count').textContent = data.attendance.present;
        document.getElementById('absent-count').textContent = data.attendance.absent;
        document.getElementById('class-average').textContent = data.performance.average;

        // For demo purposes, we'll create simple text-based charts
        // In production, use Chart.js or similar library
        this.renderTextChart('attendance-chart', data.attendance);
        this.renderTextChart('performance-chart', data.performance);
        this.renderTextChart('trend-chart', data.trend);
    }

    renderTextChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = 200;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#666';
        ctx.font = '14px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('Demo Chart - Integra Chart.js per grafici reali', width / 2, height / 2);
    }
}

// UI Controller
class InClasseUI {
    constructor(dataManager, audioRecorder, analytics) {
        this.dataManager = dataManager;
        this.audioRecorder = audioRecorder;
        this.analytics = analytics;
        this.currentRecording = null;
    }

    init() {
        this.renderHeader();
        this.renderActivities();
        this.renderHomework();
        this.renderEvaluations();
        this.setupVoiceRecorder();
        this.renderSummary();
        this.setupCollapsibleSections();
        this.setupEventListeners();
    }

    renderHeader() {
        // Check if activeSessionClass exists in localStorage
        let activeSession = null;
        try {
            const activeSessionStr = localStorage.getItem('activeSessionClass');
            if (activeSessionStr) {
                activeSession = JSON.parse(activeSessionStr);
            }
        } catch (e) {
            console.debug('in-classe: failed to load activeSessionClass', e);
        }

        // Use activeSessionClass if available, otherwise show generic header
        if (activeSession) {
            document.getElementById('lesson-title').textContent = `In Classe: ${activeSession.className || activeSession.classId}`;
            document.getElementById('lesson-class').textContent = activeSession.className || activeSession.classId;
            document.getElementById('lesson-subject').textContent = activeSession.subject || '';
            document.getElementById('lesson-datetime').textContent = `${activeSession.day || ''}, ${activeSession.time || ''}`;
            document.getElementById('lesson-type').textContent = activeSession.activityType || '';
            // Show the lesson meta section
            const lessonMeta = document.getElementById('lesson-meta');
            if (lessonMeta) {
                lessonMeta.style.display = 'flex';
            }
        } else {
            // Show generic header without class details
            document.getElementById('lesson-title').textContent = 'In Classe';
            // Hide the lesson meta section
            const lessonMeta = document.getElementById('lesson-meta');
            if (lessonMeta) {
                lessonMeta.style.display = 'none';
            }
        }
    }

    renderActivities() {
        const container = document.getElementById('activities-list');
        const activities = this.dataManager.activities;

        document.getElementById('activities-count').textContent = activities.length;

        if (activities.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-symbols-outlined">assignment</span>
                    <p>Nessuna attività registrata per questa lezione</p>
                </div>
            `;
            return;
        }

        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-info">
                    <h4>${activity.title}</h4>
                    <p>${activity.description || ''}</p>
                    <span class="activity-type-badge">${activity.type}</span>
                </div>
                <div class="activity-actions">
                    <button class="icon-btn" onclick="inClasseApp.removeActivity('${activity.id}')" title="Elimina">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderHomework() {
        const container = document.getElementById('homework-list');
        const homework = this.dataManager.homework;

        document.getElementById('homework-count').textContent = homework.length;

        if (homework.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-symbols-outlined">book</span>
                    <p>Nessun compito assegnato per questa lezione</p>
                </div>
            `;
            return;
        }

        container.innerHTML = homework.map(hw => {
            const dueDate = new Date(hw.dueDate);
            const isOverdue = dueDate < new Date();
            return `
                <div class="homework-item ${hw.completed ? 'completed' : ''}">
                    <input type="checkbox" class="homework-checkbox" 
                           ${hw.completed ? 'checked' : ''} 
                           onchange="inClasseApp.toggleHomework('${hw.id}')">
                    <div class="homework-info">
                        <h4>${hw.title}</h4>
                        <p>${hw.description || ''}</p>
                        <div class="homework-due ${isOverdue && !hw.completed ? 'overdue' : ''}">
                            <span class="material-symbols-outlined">event</span>
                            <span>Scadenza: ${dueDate.toLocaleDateString('it-IT')}</span>
                        </div>
                    </div>
                    <div class="activity-actions">
                        <button class="icon-btn" onclick="inClasseApp.removeHomework('${hw.id}')" title="Elimina">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderEvaluations() {
        const container = document.getElementById('students-evaluation-grid');
        const students = this.dataManager.lessonData.students;

        document.getElementById('evaluations-count').textContent = students.length;

        container.innerHTML = students.map(student => {
            const lastGrade = this.dataManager.getStudentLastGrade(student.id);
            return `
                <div class="student-eval-card">
                    <div class="student-avatar">${student.avatar}</div>
                    <div class="student-eval-info">
                        <h4>${student.firstName} ${student.lastName}</h4>
                        <div class="last-grade">
                            ${lastGrade ? `Ultimo voto: ${lastGrade}` : 'Nessuna valutazione'}
                        </div>
                    </div>
                    <div class="student-eval-actions">
                        <button class="btn btn-sm btn-primary" onclick="inClasseApp.openEvaluation('${student.id}', '${student.firstName} ${student.lastName}')">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    setupVoiceRecorder() {
        const recordBtn = document.getElementById('record-button');
        const stopBtn = document.getElementById('stop-button');
        const recordingTime = document.getElementById('recording-time');
        const recordingIndicator = document.querySelector('.recording-indicator');

        recordBtn.addEventListener('click', async () => {
            const started = await this.audioRecorder.start();
            if (started) {
                recordBtn.style.display = 'none';
                stopBtn.style.display = 'inline-flex';
                recordingIndicator.style.display = 'flex';

                // Start timer
                this.audioRecorder.timerInterval = setInterval(() => {
                    const elapsed = Math.floor((Date.now() - this.audioRecorder.startTime) / 1000);
                    const minutes = Math.floor(elapsed / 60);
                    const seconds = elapsed % 60;
                    recordingTime.textContent = 
                        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }, 1000);
            }
        });

        stopBtn.addEventListener('click', async () => {
            const result = await this.audioRecorder.stop();
            
            recordBtn.style.display = 'inline-flex';
            stopBtn.style.display = 'none';
            recordingIndicator.style.display = 'none';
            
            clearInterval(this.audioRecorder.timerInterval);

            // Show audio player
            const audioPlayback = document.getElementById('audio-playback');
            const audioPlayer = document.getElementById('audio-player');
            audioPlayer.src = result.url;
            audioPlayback.style.display = 'block';

            // Mock AI transcription (demo)
            this.showMockTranscription();

            // Save recording
            this.currentRecording = result;
        });
    }

    showMockTranscription() {
        const transcriptionArea = document.getElementById('transcription-area');
        const transcriptionText = document.getElementById('transcription-text');
        
        // Simulate AI processing delay
        transcriptionText.textContent = 'Elaborazione in corso...';
        transcriptionArea.style.display = 'block';

        setTimeout(() => {
            transcriptionText.textContent = `Questa è una trascrizione demo. In produzione, qui apparirà la trascrizione automatica dell'audio registrato tramite integrazione con servizi di AI come OpenAI Whisper o Google Speech-to-Text.

Esempio di trascrizione:
"Oggi abbiamo affrontato il teorema di Pitagora e le sue applicazioni pratiche. Gli studenti hanno mostrato particolare interesse nella risoluzione dei problemi geometrici. Per la prossima lezione, prepareranno degli esercizi sulle figure piane."`;
        }, 2000);
    }

    renderSummary() {
        document.getElementById('lesson-summary').value = this.dataManager.summary.text || '';
        this.renderNextSteps();
    }

    renderNextSteps() {
        const container = document.getElementById('next-steps-list');
        const steps = this.dataManager.summary.nextSteps || [];

        if (steps.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="padding: var(--spacing-md);">
                    <p>Nessun passo successivo definito</p>
                </div>
            `;
            return;
        }

        container.innerHTML = steps.map((step, index) => `
            <div class="next-step-item ${step.completed ? 'completed' : ''}">
                <input type="checkbox" ${step.completed ? 'checked' : ''} 
                       onchange="inClasseApp.toggleNextStep(${index})">
                <span class="next-step-text">${step.text}</span>
                <button class="icon-btn" onclick="inClasseApp.removeNextStep(${index})">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
        `).join('');
    }

    setupCollapsibleSections() {
        document.querySelectorAll('.section-header').forEach(header => {
            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                const content = header.nextElementSibling;

                header.setAttribute('aria-expanded', !isExpanded);
                content.style.display = isExpanded ? 'none' : 'block';
            });

            // Keyboard support
            header.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    header.click();
                }
            });
        });
    }

    setupEventListeners() {
        // Back/Exit buttons
        document.getElementById('back-button').addEventListener('click', () => this.exit());
        document.getElementById('exit-button').addEventListener('click', () => this.exit());

        // Activity modal
        document.getElementById('add-activity-btn').addEventListener('click', () => this.openModal('activity-modal'));
        document.getElementById('activity-form').addEventListener('submit', (e) => this.handleActivitySubmit(e));

        // Homework modal
        document.getElementById('add-homework-btn').addEventListener('click', () => this.openModal('homework-modal'));
        document.getElementById('homework-form').addEventListener('submit', (e) => this.handleHomeworkSubmit(e));

        // Summary
        document.getElementById('save-summary-btn').addEventListener('click', () => this.saveSummary());
        document.getElementById('add-next-step-btn').addEventListener('click', () => this.addNextStep());
        document.getElementById('export-summary-btn').addEventListener('click', () => this.exportSummary());

        // Transcription
        document.getElementById('save-transcription-btn').addEventListener('click', () => this.saveTranscription());

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });

        // Load analytics when section is expanded
        const analyticsHeader = document.querySelector('[data-section="analytics"] .section-header');
        let analyticsLoaded = false;
        analyticsHeader.addEventListener('click', () => {
            if (!analyticsLoaded) {
                setTimeout(() => this.analytics.renderCharts(), 100);
                analyticsLoaded = true;
            }
        });
    }

    openModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    handleActivitySubmit(e) {
        e.preventDefault();
        const form = e.target;
        const activity = {
            title: form.querySelector('#activity-title').value,
            description: form.querySelector('#activity-description').value,
            type: form.querySelector('#activity-type').value
        };

        this.dataManager.addActivity(activity);
        this.renderActivities();
        this.closeAllModals();
        form.reset();
        this.showToast('Attività aggiunta con successo');
    }

    handleHomeworkSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const homework = {
            title: form.querySelector('#homework-title').value,
            description: form.querySelector('#homework-description').value,
            dueDate: form.querySelector('#homework-due-date').value
        };

        this.dataManager.addHomework(homework);
        this.renderHomework();
        this.closeAllModals();
        form.reset();
        this.showToast('Compito assegnato con successo');
    }

    openEvaluation(studentId, studentName) {
        document.getElementById('student-id').value = studentId;
        document.getElementById('student-name').value = studentName;
        this.openModal('evaluation-modal');

        document.getElementById('evaluation-form').onsubmit = (e) => {
            e.preventDefault();
            const evaluation = {
                grade: document.getElementById('evaluation-grade').value,
                notes: document.getElementById('evaluation-notes').value
            };

            this.dataManager.addEvaluation(studentId, evaluation);
            this.renderEvaluations();
            this.closeAllModals();
            e.target.reset();
            this.showToast(`Valutazione salvata per ${studentName}`);
        };
    }

    saveSummary() {
        this.dataManager.summary.text = document.getElementById('lesson-summary').value;
        this.dataManager.saveSummary();
        this.showToast('Sintesi salvata con successo');
    }

    addNextStep() {
        const text = prompt('Inserisci il prossimo passo:');
        if (text) {
            if (!this.dataManager.summary.nextSteps) {
                this.dataManager.summary.nextSteps = [];
            }
            this.dataManager.summary.nextSteps.push({ text, completed: false });
            this.dataManager.saveSummary();
            this.renderNextSteps();
        }
    }

    toggleNextStep(index) {
        this.dataManager.summary.nextSteps[index].completed = 
            !this.dataManager.summary.nextSteps[index].completed;
        this.dataManager.saveSummary();
        this.renderNextSteps();
    }

    removeNextStep(index) {
        if (confirm('Rimuovere questo passo?')) {
            this.dataManager.summary.nextSteps.splice(index, 1);
            this.dataManager.saveSummary();
            this.renderNextSteps();
        }
    }

    saveTranscription() {
        const text = document.getElementById('transcription-text').textContent;
        if (this.currentRecording) {
            const recording = {
                transcription: text,
                duration: this.currentRecording.duration
            };
            this.dataManager.addRecording(recording);
            this.showToast('Trascrizione salvata con successo');
        }
    }

    exportSummary() {
        // Demo: In production, generate PDF using jsPDF
        const summary = this.dataManager.summary.text;
        const data = this.dataManager.lessonData;
        
        const content = `
SINTESI LEZIONE
================

Classe: ${data.className}
Materia: ${data.subject}
Data: ${data.day}, ${data.time}
Tipo: ${data.activityType}

${summary}

Prossimi Passi:
${this.dataManager.summary.nextSteps.map((s, i) => `${i + 1}. ${s.text}`).join('\n')}
        `;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sintesi-${data.classId}-${data.day}.txt`;
        a.click();
        
        this.showToast('Sintesi esportata');
    }

    removeActivity(id) {
        if (confirm('Rimuovere questa attività?')) {
            this.dataManager.removeActivity(id);
            this.renderActivities();
            this.showToast('Attività rimossa');
        }
    }

    removeHomework(id) {
        if (confirm('Rimuovere questo compito?')) {
            this.dataManager.removeHomework(id);
            this.renderHomework();
            this.showToast('Compito rimosso');
        }
    }

    toggleHomework(id) {
        this.dataManager.toggleHomeworkComplete(id);
        this.renderHomework();
    }

    showToast(message) {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--md-primary);
            color: var(--md-on-primary);
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: var(--md-elevation-3);
            z-index: 10000;
            animation: slideUp 0.3s ease;
        `;

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    exit() {
        // Clear activeSessionClass when exiting
        try {
            localStorage.removeItem('activeSessionClass');
        } catch (e) {
            console.debug('in-classe: failed to clear activeSessionClass', e);
        }
        
        // Navigate back to schedule or main app
        if (window.opener) {
            window.close();
        } else {
            window.location.href = 'index.html#schedule';
        }
    }
}

// Lesson Picker Modal Manager
class LessonPickerModal {
    constructor() {
        this.modal = document.getElementById('lesson-picker-modal');
        this.form = document.getElementById('lesson-picker-form');
        this.select = document.getElementById('lesson-picker-select');
        this.cancelBtn = document.getElementById('lesson-picker-cancel');
    }

    init() {
        if (!this.modal || !this.form || !this.select) {
            console.error('Lesson picker modal elements not found');
            return;
        }

        // Load available lessons from schedule
        this.loadAvailableLessons();

        // Setup event listeners
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLessonSelection();
        });

        this.cancelBtn.addEventListener('click', () => {
            this.close();
            // Redirect to home if user cancels
            window.location.href = 'index.html#home';
        });
    }

    loadAvailableLessons() {
        try {
            const scheduleStr = localStorage.getItem('schedule');
            const schedule = scheduleStr ? JSON.parse(scheduleStr) : {};
            
            // Clear existing options except the first one
            this.select.innerHTML = '<option value="">-- Seleziona una lezione --</option>';

            // Add lessons from schedule
            const lessons = Object.entries(schedule);
            if (lessons.length === 0) {
                this.select.innerHTML += '<option value="" disabled>Nessuna lezione disponibile nell\'orario</option>';
                return;
            }

            // Sort lessons by day and time
            const dayOrder = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
            lessons.sort(([keyA], [keyB]) => {
                const [dayA, timeA] = keyA.split('-');
                const [dayB, timeB] = keyB.split('-');
                const dayDiff = dayOrder.indexOf(dayA) - dayOrder.indexOf(dayB);
                return dayDiff !== 0 ? dayDiff : timeA.localeCompare(timeB);
            });

            lessons.forEach(([key, slot]) => {
                if (slot.classId && slot.subject) {
                    const [day, time] = key.split('-');
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = `${day} ${time} - ${slot.className || slot.classId} - ${slot.subject}${slot.activityType ? ' (' + slot.activityType + ')' : ''}`;
                    this.select.appendChild(option);
                }
            });
        } catch (e) {
            console.error('Error loading available lessons:', e);
        }
    }

    handleLessonSelection() {
        const selectedLesson = this.select.value;
        if (!selectedLesson) {
            return;
        }

        // Reload page with selected lesson as URL parameter
        window.location.href = `in-classe.html?lesson=${encodeURIComponent(selectedLesson)}`;
    }

    show() {
        if (this.modal) {
            this.modal.style.display = 'flex';
        }
    }

    close() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    }
}

// Initialize app
let inClasseApp;

document.addEventListener('DOMContentLoaded', () => {
    const dataManager = new InClasseDataManager();
    
    // Auto-open lesson picker is now disabled (suppressed by schedule-enhance.js)
    // Users must select lessons through the static schedule grid on this page
    
    // Check if lesson is selected
    if (!dataManager.lessonKey) {
        // Don't auto-open picker modal - rely on schedule-enhance.js suppression
        // User will use the static schedule grid to select a lesson
        console.debug('in-classe: No lesson selected. Use the schedule grid to select a lesson.');
        
        // Update header to show generic "In Classe" without class details
        updateHeaderForNoSession();
        
        // Initialize breadcrumb navigation even without a lesson
        initBreadcrumbNavigation();
        
        // Initialize floating AI assistant if available
        if (typeof initFloatingAssistant === 'function') {
            initFloatingAssistant();
        }
        return; // Don't initialize the full lesson UI yet
    }

    // Check if lesson data is available
    if (!dataManager.lessonData) {
        alert('Lezione non trovata. Verrai reindirizzato alla home.');
        window.location.href = 'index.html#home';
        return;
    }

    const audioRecorder = new AudioRecorder();
    const analytics = new AnalyticsManager(dataManager);
    
    inClasseApp = new InClasseUI(dataManager, audioRecorder, analytics);
    inClasseApp.init();
    
    // Initialize breadcrumb navigation
    initBreadcrumbNavigation();
    
    // Initialize floating AI assistant if available
    if (typeof initFloatingAssistant === 'function') {
        initFloatingAssistant();
    }
});

// Update header when no session is active
function updateHeaderForNoSession() {
    try {
        // Check if activeSessionClass exists in localStorage
        let activeSession = null;
        try {
            const activeSessionStr = localStorage.getItem('activeSessionClass');
            if (activeSessionStr) {
                activeSession = JSON.parse(activeSessionStr);
            }
        } catch (e) {
            console.debug('in-classe: failed to load activeSessionClass in updateHeaderForNoSession', e);
        }

        if (activeSession) {
            // Show header with activeSessionClass details
            const titleEl = document.getElementById('lesson-title');
            if (titleEl) {
                titleEl.textContent = `In Classe: ${activeSession.className || activeSession.classId}`;
            }
            
            const lessonClass = document.getElementById('lesson-class');
            if (lessonClass) {
                lessonClass.textContent = activeSession.className || activeSession.classId;
            }
            
            const lessonSubject = document.getElementById('lesson-subject');
            if (lessonSubject) {
                lessonSubject.textContent = activeSession.subject || '';
            }
            
            const lessonDatetime = document.getElementById('lesson-datetime');
            if (lessonDatetime) {
                lessonDatetime.textContent = `${activeSession.day || ''}, ${activeSession.time || ''}`;
            }
            
            const lessonType = document.getElementById('lesson-type');
            if (lessonType) {
                lessonType.textContent = activeSession.activityType || '';
            }
            
            // Show the lesson meta section
            const lessonMeta = document.getElementById('lesson-meta');
            if (lessonMeta) {
                lessonMeta.style.display = 'flex';
            }
        } else {
            // Show generic header without class details
            const titleEl = document.getElementById('lesson-title');
            if (titleEl) {
                titleEl.textContent = 'In Classe';
            }
            
            // Hide the lesson meta section
            const lessonMeta = document.getElementById('lesson-meta');
            if (lessonMeta) {
                lessonMeta.style.display = 'none';
            }
        }
    } catch (e) {
        console.debug('in-classe: failed to update header for no session', e);
    }
}

// Initialize breadcrumb navigation
function initBreadcrumbNavigation() {
    const backButton = document.getElementById('breadcrumb-back-button');
    const homeButton = document.getElementById('breadcrumb-home-button');
    const headerBackButton = document.getElementById('back-button');
    
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'index.html#schedule';
        });
    }
    
    if (homeButton) {
        homeButton.addEventListener('click', () => {
            window.location.href = 'index.html#home';
        });
    }
    
    if (headerBackButton) {
        headerBackButton.addEventListener('click', () => {
            window.location.href = 'index.html#schedule';
        });
    }
    
    // Setup AI FAB button
    const aiFab = document.getElementById('ai-fab');
    if (aiFab) {
        aiFab.addEventListener('click', () => {
            if (window.floatingAssistant) {
                window.floatingAssistant.open();
            }
        });
    }
}

// Export for global access
window.inClasseApp = inClasseApp;
