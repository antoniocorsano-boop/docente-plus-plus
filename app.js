
// app.js
import { loadData, saveData, isOnboardingComplete, skipOnboarding, clearAllData, checkStorageHealth, state } from './js/data.js';
import { createToastContainer, showToast, switchTab, updateActiveClassBadge, showOnboarding, renderChatMessages } from './js/ui.js';
import { setupEventListeners } from './js/events.js';
import { 
    showModal, hideModal, 
    createClass, editClass, deleteClass,
    createStudent, editStudent, deleteStudent,
    createLesson, editLesson, deleteLesson,
    createActivity, editActivity, deleteActivity,
    createEvaluation, editEvaluation, deleteEvaluation,
    exportStudentsCSV, importStudentsCSV
} from './js/crud.js';

class DocentePlusPlus {
    constructor() {
        this.subjectsPreset = [
            'Italiano', 'Storia', 'Geografia', 'Matematica', 'Scienze',
            'Inglese', 'Arte e Immagine', 'Musica', 'Educazione Fisica'
        ];
    }

    init() {
        try {
            const dataLoaded = loadData();
            if (!dataLoaded) {
                showToast('Dati corrotti rilevati. App ripristinata ai valori predefiniti.', 'warning', 5000);
            }
            
            if (!isOnboardingComplete()) {
                showOnboarding();
            } else {
                this.initializeAppUI();
            }
            setupEventListeners();
            createToastContainer();
            console.log("Docente++ v1.1.0 (Refactored) initialized.");
        } catch (error) {
            console.error("Error during init:", error);
            // Try to recover by showing a minimal UI
            createToastContainer();
            showToast('Errore durante l\'inizializzazione. Alcune funzionalità potrebbero non essere disponibili.', 'error', 5000);
            setupEventListeners();
        }
    }

    initializeAppUI() {
        document.querySelector('header')?.classList.add('minimal');
        this.renderAllTabs();
        updateActiveClassBadge();
        switchTab('home');
    }

    renderAllTabs() {
        this.renderHome();
        this.renderLessons();
        this.renderStudents();
        this.renderClasses();
        this.renderActivities();
        this.renderEvaluations();
        this.renderSchedule();
        this.renderAiAssistant();
        this.renderDocumentImport();
    }

    renderHome() {
        document.getElementById('home-lesson-count').textContent = state.lessons.length;
        document.getElementById('home-student-count').textContent = state.students.length;
        document.getElementById('home-activity-count').textContent = state.activities.length;
        document.getElementById('home-evaluation-count').textContent = state.evaluations.length;

        document.getElementById('today-schedule-enhanced').innerHTML = `<p class="home-placeholder">Nessuna lezione programmata per oggi.</p>`;

        const todoContainer = document.getElementById('things-todo-list');
        const upcomingActivities = state.activities.filter(a => new Date(a.date) >= new Date()).slice(0, 3);
        if (upcomingActivities.length > 0) {
            todoContainer.innerHTML = upcomingActivities.map(a => `<div class="todo-item">- Valutare <strong>${a.title}</strong></div>`).join('');
        } else {
            todoContainer.innerHTML = '<p class="home-placeholder">Nessuna attività imminente.</p>';
        }

        document.getElementById('ai-suggestions-content').innerHTML = `
            <div class="ai-suggestion-item">💡 Potresti creare un'attività di ripasso sulla "Rivoluzione Francese".</div>
            <div class="ai-suggestion-item">💡 Considera di pianificare una verifica per la classe 5B.</div>
        `;

        document.getElementById('home-ai-ready').textContent = "Pronta";
        document.getElementById('home-ai-ready').style.color = 'green';
    }

    renderLessons() {
        const list = document.getElementById('lessons-list');
        if (!list) return;
        if (state.lessons.length === 0) {
            list.innerHTML = '<p>Nessuna lezione pianificata. Clicca "Nuova Lezione" per iniziare.</p>';
            return;
        }
        
        // Sort lessons by date (newest first)
        const sortedLessons = [...state.lessons].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        list.innerHTML = sortedLessons.map(lesson => {
            const classObj = state.classes.find(c => c.id === lesson.classId);
            const className = classObj ? classObj.name : '';
            
            return `
                <div class="lesson-item card">
                    <h4>${lesson.title}</h4>
                    <p><strong>Materia:</strong> ${lesson.subject}</p>
                    <p><strong>Data:</strong> ${new Date(lesson.date).toLocaleDateString()} - ${lesson.time}</p>
                    ${className ? `<p><strong>Classe:</strong> ${className}</p>` : ''}
                    ${lesson.description ? `<p>${lesson.description}</p>` : ''}
                    <div class="item-actions">
                        <button class="btn btn-sm btn-secondary" onclick="window.app.editLesson('${lesson.id}')">✏️ Modifica</button>
                        <button class="btn btn-sm btn-danger" onclick="window.app.deleteLesson('${lesson.id}')">🗑️ Elimina</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderStudents() {
        const list = document.getElementById('students-list');
        if (!list) return;
        
        // Filter by active class if one is selected
        let studentsToShow = state.students;
        if (state.activeClass) {
            studentsToShow = state.students.filter(s => s.classId === state.activeClass);
        }
        
        if (studentsToShow.length === 0) {
            list.innerHTML = '<p>Nessuno studente trovato. Clicca "Nuovo Studente" per iniziare.</p>';
            return;
        }
        
        list.innerHTML = studentsToShow.map(student => {
            const classObj = state.classes.find(c => c.id === student.classId);
            const className = classObj ? classObj.name : 'Nessuna classe';
            
            return `
                <div class="student-item card">
                    <h4>${student.firstName} ${student.lastName}</h4>
                    <p><strong>Classe:</strong> ${className}</p>
                    ${student.email ? `<p><strong>Email:</strong> ${student.email}</p>` : ''}
                    ${student.birthDate ? `<p><strong>Data di nascita:</strong> ${new Date(student.birthDate).toLocaleDateString()}</p>` : ''}
                    ${student.notes ? `<p><strong>Note:</strong> ${student.notes}</p>` : ''}
                    <div class="item-actions">
                        <button class="btn btn-sm btn-secondary" onclick="window.app.editStudent('${student.id}')">✏️ Modifica</button>
                        <button class="btn btn-sm btn-danger" onclick="window.app.deleteStudent('${student.id}')">🗑️ Elimina</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    renderClasses() {
        const list = document.getElementById('classes-list');
        if (!list) return;
        
        if (state.classes.length === 0) {
            list.innerHTML = '<p>Nessuna classe creata. Clicca "Nuova Classe" per iniziare.</p>';
            return;
        }
        
        list.innerHTML = state.classes.map(classItem => {
            const studentCount = state.students.filter(s => s.classId === classItem.id).length;
            
            return `
                <div class="class-item card">
                    <h4>${classItem.name}</h4>
                    ${classItem.schoolYear ? `<p><strong>Anno Scolastico:</strong> ${classItem.schoolYear}</p>` : ''}
                    <p><strong>Studenti:</strong> ${studentCount}</p>
                    ${classItem.description ? `<p>${classItem.description}</p>` : ''}
                    <div class="item-actions">
                        <button class="btn btn-sm btn-secondary" onclick="window.app.editClass('${classItem.id}')">✏️ Modifica</button>
                        <button class="btn btn-sm btn-danger" onclick="window.app.deleteClass('${classItem.id}')">🗑️ Elimina</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    renderActivities() {
        const list = document.getElementById('activities-list');
        if (!list) return;
        if (state.activities.length === 0) {
            list.innerHTML = '<p>Nessuna attività creata. Clicca "Nuova Attività" per iniziare.</p>';
            return;
        }
        
        // Sort activities by date (newest first)
        const sortedActivities = [...state.activities].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        list.innerHTML = sortedActivities.map(act => {
            const classObj = state.classes.find(c => c.id === act.classId);
            const className = classObj ? classObj.name : '';
            
            // Status badge styling
            const statusColors = {
                'pianificata': '#2196f3',
                'in corso': '#ff9800',
                'completata': '#4caf50'
            };
            const statusColor = statusColors[act.status] || '#999';
            
            return `
                <div class="activity-item card">
                    <h4>${act.title}</h4>
                    <p><strong>Tipo:</strong> ${act.type} | <strong>Stato:</strong> <span style="color: ${statusColor}; font-weight: bold;">${act.status}</span></p>
                    <p><strong>Data:</strong> ${new Date(act.date).toLocaleDateString()}</p>
                    ${className ? `<p><strong>Classe:</strong> ${className}</p>` : ''}
                    ${act.description ? `<p>${act.description}</p>` : ''}
                    <div class="item-actions">
                        <button class="btn btn-sm btn-secondary" onclick="window.app.editActivity('${act.id}')">✏️ Modifica</button>
                        <button class="btn btn-sm btn-danger" onclick="window.app.deleteActivity('${act.id}')">🗑️ Elimina</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    renderEvaluations() {
        const list = document.getElementById('evaluations-list');
        if (!list) return;
        if (state.evaluations.length === 0) {
            list.innerHTML = '<p>Nessuna valutazione inserita. Clicca "Nuova Valutazione" per iniziare.</p>';
            return;
        }
        
        // Sort evaluations by date (newest first)
        const sortedEvals = [...state.evaluations].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        list.innerHTML = sortedEvals.map(evaluation => {
            const student = state.students.find(s => s.id === evaluation.studentId);
            const activity = state.activities.find(a => a.id === evaluation.activityId);
            
            const studentName = student ? `${student.firstName} ${student.lastName}` : 'Studente non trovato';
            const activityTitle = activity ? activity.title : 'Attività non trovata';
            
            return `
                <div class="evaluation-item card">
                    <h4>${studentName}</h4>
                    <p><strong>Attività:</strong> ${activityTitle}</p>
                    <p><strong>Voto:</strong> ${evaluation.grade || 'N/A'}</p>
                    <p><strong>Data:</strong> ${new Date(evaluation.date).toLocaleDateString()}</p>
                    ${evaluation.comment ? `<p><strong>Commento:</strong> ${evaluation.comment}</p>` : ''}
                    <div class="item-actions">
                        <button class="btn btn-sm btn-secondary" onclick="window.app.editEvaluation('${evaluation.id}')">✏️ Modifica</button>
                        <button class="btn btn-sm btn-danger" onclick="window.app.deleteEvaluation('${evaluation.id}')">🗑️ Elimina</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    renderSchedule() { /* ... */ }
    renderAiAssistant() { renderChatMessages(); }
    renderDocumentImport() { 
        // Document import functionality handled by file input
    }
    renderSettings() { 
        const nameElement = document.getElementById('settings-teacher-name');
        const yearElement = document.getElementById('settings-school-year');
        if (nameElement) {
            nameElement.textContent = state.settings.teacherName && state.settings.teacherLastName 
                ? `${state.settings.teacherName} ${state.settings.teacherLastName}`
                : state.settings.teacherName || 'Non configurato';
        }
        if (yearElement) {
            yearElement.textContent = state.settings.schoolYear || 'Non configurato';
        }
    }
    renderBackupRestore() { 
        // Backup/restore functionality
    }
    renderNotifications() { 
        // Notifications - future feature
    }
    renderInfoApp() { 
        // App info - future feature
    }
    renderHelp() { 
        // Help content already in HTML
    }
    
    // Expose CRUD functions to window scope
    showModal(modalId) { showModal(modalId); }
    hideModal(modalId) { hideModal(modalId); }
    
    // Classes CRUD
    newClass() {
        // Reset form for new entry
        document.getElementById('class-modal-form').reset();
        document.getElementById('class-modal-form').onsubmit = (e) => {
            e.preventDefault();
            createClass();
        };
        showModal('class-modal');
    }
    editClass(id) { editClass(id); }
    deleteClass(id) { deleteClass(id); }
    
    // Students CRUD
    newStudent() {
        document.getElementById('student-modal-form').reset();
        this.populateClassDropdowns();
        document.getElementById('student-modal-form').onsubmit = (e) => {
            e.preventDefault();
            createStudent();
        };
        showModal('student-modal');
    }
    editStudent(id) { editStudent(id); }
    deleteStudent(id) { deleteStudent(id); }
    exportStudentsCSV() { exportStudentsCSV(); }
    importStudentsCSV(file) { importStudentsCSV(file); }
    
    // Lessons CRUD
    newLesson() {
        document.getElementById('lesson-modal-form').reset();
        this.populateClassDropdowns();
        this.populateSubjectDropdown();
        // Set default date to today
        document.getElementById('lesson-modal-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('lesson-modal-form').onsubmit = (e) => {
            e.preventDefault();
            createLesson();
        };
        showModal('lesson-modal');
    }
    editLesson(id) { editLesson(id); }
    deleteLesson(id) { deleteLesson(id); }
    
    // Activities CRUD
    newActivity() {
        document.getElementById('activity-modal-form').reset();
        this.populateClassDropdowns();
        // Set default date to today
        document.getElementById('activity-modal-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('activity-modal-form').onsubmit = (e) => {
            e.preventDefault();
            createActivity();
        };
        showModal('activity-modal');
    }
    editActivity(id) { editActivity(id); }
    deleteActivity(id) { deleteActivity(id); }
    
    // Evaluations CRUD
    newEvaluation() {
        document.getElementById('evaluation-modal-form').reset();
        this.populateStudentDropdown();
        this.populateActivityDropdown();
        // Set default date to today
        document.getElementById('evaluation-modal-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('evaluation-modal-form').onsubmit = (e) => {
            e.preventDefault();
            createEvaluation();
        };
        showModal('evaluation-modal');
    }
    editEvaluation(id) { editEvaluation(id); }
    deleteEvaluation(id) { deleteEvaluation(id); }
    
    // Helper functions to populate dropdowns
    populateClassDropdowns() {
        const classSelects = [
            'student-modal-classId',
            'lesson-modal-classId',
            'activity-modal-classId'
        ];
        
        classSelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                // Keep the first option (None/empty)
                const firstOption = select.options[0];
                select.innerHTML = '';
                select.appendChild(firstOption);
                
                // Add all classes
                state.classes.forEach(cls => {
                    const option = document.createElement('option');
                    option.value = cls.id;
                    option.textContent = cls.name;
                    select.appendChild(option);
                });
            }
        });
    }
    
    populateSubjectDropdown() {
        const select = document.getElementById('lesson-modal-subject');
        if (select) {
            const firstOption = select.options[0];
            select.innerHTML = '';
            select.appendChild(firstOption);
            
            this.subjectsPreset.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                select.appendChild(option);
            });
        }
    }
    
    populateStudentDropdown() {
        const select = document.getElementById('evaluation-modal-studentId');
        if (select) {
            const firstOption = select.options[0];
            select.innerHTML = '';
            select.appendChild(firstOption);
            
            state.students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.id;
                option.textContent = `${student.firstName} ${student.lastName}`;
                select.appendChild(option);
            });
        }
    }
    
    populateActivityDropdown() {
        const select = document.getElementById('evaluation-modal-activityId');
        if (select) {
            const firstOption = select.options[0];
            select.innerHTML = '';
            select.appendChild(firstOption);
            
            state.activities.forEach(activity => {
                const option = document.createElement('option');
                option.value = activity.id;
                option.textContent = `${activity.title} (${activity.type})`;
                select.appendChild(option);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        window.app = new DocentePlusPlus();
        window.app.init();
    } catch (error) {
        console.error("Fatal error during app initialization:", error);
        document.body.innerHTML = '<div style="text-align:center;padding:20px;"><h1>Errore Critico</h1><p>L\'applicazione non è riuscita a caricarsi. Controlla la console per i dettagli.</p></div>';
    }
});
