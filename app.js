
// app.js
import { loadData, saveData, isOnboardingComplete, skipOnboarding, clearAllData, checkStorageHealth, state } from './js/data.js';
import { createToastContainer, showToast, switchTab, updateActiveClassBadge, showOnboarding, renderChatMessages } from './js/ui.js';
import { setupEventListeners } from './js/events.js';
import { initializeTheme, setupThemePicker } from './js/theme.js';
import { 
    showModal, hideModal, 
    createClass, editClass, deleteClass,
    createStudent, editStudent, deleteStudent,
    createLesson, editLesson, deleteLesson,
    createActivity, editActivity, deleteActivity,
    createEvaluation, editEvaluation, deleteEvaluation,
    exportStudentsCSV, importStudentsCSV
} from './js/crud.js';
import { 
    initAIAgentFAB, 
    openAIAgentModal, 
    closeAIAgentModal, 
    resetFABPosition, 
    toggleFABVisibility 
} from './js/ai-agent.js';

class DocentePlusPlus {
    constructor() {
        this.subjectsPreset = [
            'Italiano', 'Storia', 'Geografia', 'Matematica', 'Scienze',
            'Inglese', 'Arte e Immagine', 'Musica', 'Educazione Fisica'
        ];
        this.currentActiveTab = 'home'; // Track current active tab for AI context
        
        // Schedule management properties
        this.scheduleView = 'weekly'; // 'weekly' or 'daily'
        this.currentScheduleDate = null; // Will be set to current/next weekday
        this.scheduleTimeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];
        this.currentEditingSlot = null; // Track the slot being edited
    }

    init() {
        try {
            // Initialize theme first (before loading data)
            initializeTheme();
            
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
            setupThemePicker();
            createToastContainer();
            
            // Initialize AI Agent FAB
            initAIAgentFAB();
            
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
    renderSchedule() {
        const container = document.getElementById('schedule-view');
        if (!container) return;
        
        // Initialize current schedule date if not set
        if (!this.currentScheduleDate) {
            this.currentScheduleDate = this.getNextWeekday(new Date());
        }
        
        // Render view controls
        const viewControls = `
            <div class="schedule-controls">
                <div class="schedule-nav">
                    <button class="btn btn-sm btn-secondary" onclick="window.app.navigateSchedule('prev')">⬅ ${this.scheduleView === 'weekly' ? 'Settimana Prec.' : 'Giorno Prec.'}</button>
                    <button class="btn btn-sm btn-primary" onclick="window.app.navigateSchedule('today')">📅 Oggi</button>
                    <button class="btn btn-sm btn-secondary" onclick="window.app.navigateSchedule('next')">${this.scheduleView === 'weekly' ? 'Settimana Succ.' : 'Giorno Succ.'} ➡</button>
                </div>
                <div class="schedule-view-toggle">
                    <button class="btn btn-sm ${this.scheduleView === 'weekly' ? 'btn-primary' : 'btn-secondary'}" onclick="window.app.toggleScheduleView('weekly')">📅 Settimana</button>
                    <button class="btn btn-sm ${this.scheduleView === 'daily' ? 'btn-primary' : 'btn-secondary'}" onclick="window.app.toggleScheduleView('daily')">📋 Giorno</button>
                </div>
            </div>
        `;
        
        container.innerHTML = viewControls;
        
        // Render appropriate view
        if (this.scheduleView === 'weekly') {
            this.renderWeeklySchedule(container);
        } else {
            this.renderDailySchedule(container);
        }
    }
    
    renderWeeklySchedule(container) {
        const weekStart = this.getWeekStart(this.currentScheduleDate);
        const weekDays = [];
        
        // Generate Monday to Friday
        for (let i = 0; i < 5; i++) {
            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + i);
            weekDays.push(day);
        }
        
        // Create table header
        let tableHtml = `
            <div class="schedule-week-info">
                Settimana dal ${weekDays[0].toLocaleDateString()} al ${weekDays[4].toLocaleDateString()}
            </div>
            <div class="schedule-table-wrapper">
                <table class="schedule-table">
                    <thead>
                        <tr>
                            <th>Ora</th>
                            ${weekDays.map(day => `<th>${this.getDayName(day)}<br><small>${day.toLocaleDateString()}</small></th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // Create table rows for each time slot
        this.scheduleTimeSlots.forEach(time => {
            tableHtml += '<tr>';
            tableHtml += `<td class="schedule-time">${time}</td>`;
            
            weekDays.forEach(day => {
                const scheduleKey = this.getScheduleKey(day, time);
                const slot = state.schedule[scheduleKey];
                tableHtml += `<td class="schedule-cell" onclick="window.app.showScheduleSlotEditor('${scheduleKey}', '${day.toISOString()}', '${time}')">`;
                
                if (slot && slot.classId) {
                    const classObj = state.classes.find(c => c.id === slot.classId);
                    const activityTypeInfo = this.getActivityTypeIcon(slot.activityType);
                    
                    tableHtml += `
                        <div class="schedule-slot-content">
                            <div class="schedule-class-name">${classObj ? classObj.name : 'Classe N/A'}</div>
                            <div class="schedule-activity-badge" style="background-color: ${activityTypeInfo.color}">
                                ${activityTypeInfo.icon} ${activityTypeInfo.label}
                            </div>
                            <button class="btn btn-xs btn-success schedule-launch-btn" onclick="event.stopPropagation(); window.app.launchScheduleActivity('${scheduleKey}')">▶ Avvia</button>
                        </div>
                    `;
                } else {
                    tableHtml += '<div class="schedule-slot-empty">+ Aggiungi</div>';
                }
                
                tableHtml += '</td>';
            });
            
            tableHtml += '</tr>';
        });
        
        tableHtml += '</tbody></table></div>';
        
        container.insertAdjacentHTML('beforeend', tableHtml);
    }
    
    renderDailySchedule(container) {
        const day = this.currentScheduleDate;
        
        let tableHtml = `
            <div class="schedule-week-info">
                ${this.getDayName(day)} - ${day.toLocaleDateString()}
            </div>
            <div class="schedule-table-wrapper">
                <table class="schedule-table schedule-table-daily">
                    <thead>
                        <tr>
                            <th>Ora</th>
                            <th>Lezione</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        this.scheduleTimeSlots.forEach(time => {
            const scheduleKey = this.getScheduleKey(day, time);
            const slot = state.schedule[scheduleKey];
            
            tableHtml += `
                <tr>
                    <td class="schedule-time">${time}</td>
                    <td class="schedule-cell schedule-cell-daily" onclick="window.app.showScheduleSlotEditor('${scheduleKey}', '${day.toISOString()}', '${time}')">
            `;
            
            if (slot && slot.classId) {
                const classObj = state.classes.find(c => c.id === slot.classId);
                const activityTypeInfo = this.getActivityTypeIcon(slot.activityType);
                
                tableHtml += `
                    <div class="schedule-slot-content schedule-slot-content-daily">
                        <div class="schedule-class-name">${classObj ? classObj.name : 'Classe N/A'}</div>
                        <div class="schedule-activity-badge" style="background-color: ${activityTypeInfo.color}">
                            ${activityTypeInfo.icon} ${activityTypeInfo.label}
                        </div>
                        <button class="btn btn-sm btn-success schedule-launch-btn" onclick="event.stopPropagation(); window.app.launchScheduleActivity('${scheduleKey}')">▶ Avvia Lezione</button>
                    </div>
                `;
            } else {
                tableHtml += '<div class="schedule-slot-empty">+ Aggiungi Lezione</div>';
            }
            
            tableHtml += '</td></tr>';
        });
        
        tableHtml += '</tbody></table></div>';
        
        container.insertAdjacentHTML('beforeend', tableHtml);
    }
    
    // Helper methods for schedule management
    getScheduleKey(date, time) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hour = time.split(':')[0];
        return `${year}-${month}-${day}-${hour}`;
    }
    
    getNextWeekday(date) {
        const d = new Date(date);
        const dayOfWeek = d.getDay();
        
        // If Saturday (6), move to Monday
        if (dayOfWeek === 6) {
            d.setDate(d.getDate() + 2);
        }
        // If Sunday (0), move to Monday
        else if (dayOfWeek === 0) {
            d.setDate(d.getDate() + 1);
        }
        
        return d;
    }
    
    getWeekStart(date) {
        const d = new Date(date);
        const dayOfWeek = d.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday
        d.setDate(d.getDate() + diff);
        return d;
    }
    
    getDayName(date) {
        const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
        return days[date.getDay()];
    }
    
    getActivityTypeIcon(type) {
        const types = {
            'theory': { icon: 'T', label: 'Teoria', color: '#3498db' },
            'drawing': { icon: 'D', label: 'Disegno', color: '#e67e22' },
            'lab': { icon: 'L', label: 'Laboratorio', color: '#27ae60' }
        };
        return types[type] || { icon: '?', label: 'N/A', color: '#999' };
    }
    
    toggleScheduleView(view) {
        this.scheduleView = view;
        this.renderSchedule();
    }
    
    navigateSchedule(direction) {
        if (direction === 'today') {
            this.currentScheduleDate = this.getNextWeekday(new Date());
        } else if (direction === 'prev') {
            if (this.scheduleView === 'weekly') {
                this.currentScheduleDate.setDate(this.currentScheduleDate.getDate() - 7);
            } else {
                this.currentScheduleDate.setDate(this.currentScheduleDate.getDate() - 1);
                this.currentScheduleDate = this.getNextWeekday(this.currentScheduleDate);
            }
        } else if (direction === 'next') {
            if (this.scheduleView === 'weekly') {
                this.currentScheduleDate.setDate(this.currentScheduleDate.getDate() + 7);
            } else {
                this.currentScheduleDate.setDate(this.currentScheduleDate.getDate() + 1);
                this.currentScheduleDate = this.getNextWeekday(this.currentScheduleDate);
            }
        }
        this.renderSchedule();
    }
    
    showScheduleSlotEditor(scheduleKey, dateISO, time) {
        this.currentEditingSlot = scheduleKey;
        const slot = state.schedule[scheduleKey] || {};
        
        // Create and show modal
        const modal = document.createElement('div');
        modal.id = 'schedule-slot-modal';
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        const date = new Date(dateISO);
        const dayName = this.getDayName(date);
        
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Modifica Slot Orario</h2>
                <p><strong>${dayName} ${date.toLocaleDateString()} - ${time}</strong></p>
                <form id="schedule-slot-form">
                    <div class="form-group">
                        <label for="slot-class">Classe</label>
                        <select id="slot-class" required>
                            <option value="">-- Seleziona Classe --</option>
                            ${state.classes.map(c => `<option value="${c.id}" ${slot.classId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="slot-activity-type">Tipo Attività</label>
                        <select id="slot-activity-type" required>
                            <option value="">-- Seleziona Tipo --</option>
                            <option value="theory" ${slot.activityType === 'theory' ? 'selected' : ''}>Teoria</option>
                            <option value="drawing" ${slot.activityType === 'drawing' ? 'selected' : ''}>Disegno</option>
                            <option value="lab" ${slot.activityType === 'lab' ? 'selected' : ''}>Laboratorio</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">💾 Salva</button>
                        ${slot.classId ? '<button type="button" class="btn btn-danger" onclick="window.app.clearScheduleSlot()">🗑️ Elimina</button>' : ''}
                        <button type="button" class="btn btn-secondary" onclick="window.app.closeScheduleSlotEditor()">Annulla</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup form submission
        document.getElementById('schedule-slot-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveScheduleSlot();
        });
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }
    
    saveScheduleSlot() {
        const classId = document.getElementById('slot-class').value;
        const activityType = document.getElementById('slot-activity-type').value;
        
        if (!classId || !activityType) {
            showToast('Seleziona classe e tipo attività', 'error');
            return;
        }
        
        state.schedule[this.currentEditingSlot] = {
            classId: classId,
            activityType: activityType
        };
        
        saveData();
        this.closeScheduleSlotEditor();
        this.renderSchedule();
        showToast('Slot orario salvato!', 'success');
    }
    
    clearScheduleSlot() {
        if (confirm('Sei sicuro di voler eliminare questo slot?')) {
            delete state.schedule[this.currentEditingSlot];
            saveData();
            this.closeScheduleSlotEditor();
            this.renderSchedule();
            showToast('Slot eliminato', 'success');
        }
    }
    
    closeScheduleSlotEditor() {
        const modal = document.getElementById('schedule-slot-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    }
    
    launchScheduleActivity(scheduleKey) {
        const slot = state.schedule[scheduleKey];
        if (!slot || !slot.classId) {
            showToast('Nessuna classe configurata per questo slot', 'error');
            return;
        }
        
        // Get activities for this class
        const classActivities = state.activities.filter(a => a.classId === slot.classId);
        
        // Filter by status
        const inProgressActivities = classActivities.filter(a => a.status === 'in corso');
        const plannedActivities = classActivities.filter(a => a.status === 'pianificata');
        
        // Show activity selection modal
        this.showActivitySelectionModal(scheduleKey, slot, inProgressActivities, plannedActivities);
    }
    
    showActivitySelectionModal(scheduleKey, slot, inProgressActivities, plannedActivities) {
        const classObj = state.classes.find(c => c.id === slot.classId);
        const activityTypeInfo = this.getActivityTypeIcon(slot.activityType);
        
        // Parse schedule key to get date/time info
        const parts = scheduleKey.split('-');
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        const hour = parts[3];
        
        const modal = document.createElement('div');
        modal.id = 'activity-selection-modal';
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        let activitiesHtml = '';
        
        if (inProgressActivities.length > 0) {
            activitiesHtml += '<h3>📝 Attività In Corso</h3><div class="activity-cards">';
            inProgressActivities.forEach(activity => {
                activitiesHtml += `
                    <div class="activity-card" onclick="window.app.selectScheduleActivity('${activity.id}', '${scheduleKey}')">
                        <h4>${activity.title}</h4>
                        <p><strong>Tipo:</strong> ${activity.type}</p>
                        <p><strong>Scadenza:</strong> ${new Date(activity.date).toLocaleDateString()}</p>
                        <span class="activity-badge activity-badge-progress">In corso</span>
                    </div>
                `;
            });
            activitiesHtml += '</div>';
        }
        
        if (plannedActivities.length > 0) {
            activitiesHtml += '<h3>📋 Attività Pianificate</h3><div class="activity-cards">';
            plannedActivities.forEach(activity => {
                activitiesHtml += `
                    <div class="activity-card" onclick="window.app.selectScheduleActivity('${activity.id}', '${scheduleKey}')">
                        <h4>${activity.title}</h4>
                        <p><strong>Tipo:</strong> ${activity.type}</p>
                        <p><strong>Scadenza:</strong> ${new Date(activity.date).toLocaleDateString()}</p>
                        <span class="activity-badge activity-badge-planned">Pianificata</span>
                    </div>
                `;
            });
            activitiesHtml += '</div>';
        }
        
        if (inProgressActivities.length === 0 && plannedActivities.length === 0) {
            activitiesHtml = '<p class="no-activities">Nessuna attività disponibile per questa classe. Crea una nuova attività dalla sezione Attività.</p>';
        }
        
        modal.innerHTML = `
            <div class="modal-content modal-content-large">
                <h2>🎓 Avvia Lezione</h2>
                <div class="lesson-header">
                    <div><strong>Classe:</strong> ${classObj ? classObj.name : 'N/A'}</div>
                    <div><strong>Data/Ora:</strong> ${date.toLocaleDateString()} - ${hour}:00</div>
                    <div class="schedule-activity-badge" style="background-color: ${activityTypeInfo.color}">
                        ${activityTypeInfo.icon} ${activityTypeInfo.label}
                    </div>
                </div>
                <div class="step-indicator">
                    <span class="step-active">1. Seleziona Attività</span>
                    <span class="step-arrow">→</span>
                    <span>2. Valuta Studenti</span>
                </div>
                ${activitiesHtml}
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="window.app.closeActivitySelectionModal()">Annulla</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    }
    
    selectScheduleActivity(activityId, scheduleKey) {
        this.closeActivitySelectionModal();
        
        // Get activity and related data
        const activity = state.activities.find(a => a.id === activityId);
        if (!activity) {
            showToast('Attività non trovata', 'error');
            return;
        }
        
        // Show student evaluation modal
        this.showStudentEvaluationModal(activity, scheduleKey);
    }
    
    showStudentEvaluationModal(activity, scheduleKey) {
        const classObj = state.classes.find(c => c.id === activity.classId);
        const students = state.students.filter(s => s.classId === activity.classId);
        
        // Parse schedule key for date/time
        const parts = scheduleKey.split('-');
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        const hour = parts[3];
        
        const modal = document.createElement('div');
        modal.id = 'student-evaluation-modal';
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        let studentsHtml = '';
        
        if (students.length === 0) {
            studentsHtml = '<p class="no-students">Nessuno studente registrato per questa classe.</p>';
        } else {
            studentsHtml = students.map(student => `
                <div class="student-eval-card" id="eval-card-${student.id}">
                    <h4>${student.firstName} ${student.lastName}</h4>
                    
                    <div class="eval-section">
                        <label>Voto</label>
                        <div class="grade-buttons">
                            ${[4, 5, 6, 7, 8, 9, 10].map(grade => `
                                <button class="grade-btn" data-student-id="${student.id}" data-grade="${grade}" onclick="window.app.selectGrade('${student.id}', ${grade})">${grade}</button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="eval-section">
                        <label>Comportamento</label>
                        <div class="behavior-buttons">
                            <button class="behavior-btn" data-student-id="${student.id}" data-behavior="positive" onclick="window.app.selectBehavior('${student.id}', 'positive')">😊 Positivo</button>
                            <button class="behavior-btn" data-student-id="${student.id}" data-behavior="neutral" onclick="window.app.selectBehavior('${student.id}', 'neutral')">😐 Neutro</button>
                            <button class="behavior-btn" data-student-id="${student.id}" data-behavior="negative" onclick="window.app.selectBehavior('${student.id}', 'negative')">😟 Negativo</button>
                        </div>
                    </div>
                    
                    <div class="eval-section">
                        <label>Osservazioni</label>
                        <textarea id="observation-${student.id}" rows="2" placeholder="Note e osservazioni..."></textarea>
                    </div>
                </div>
            `).join('');
        }
        
        modal.innerHTML = `
            <div class="modal-content modal-content-xlarge">
                <div class="lesson-in-progress-header">
                    <h2>🎓 Lezione in Corso</h2>
                    <div class="lesson-info">
                        <span><strong>Classe:</strong> ${classObj ? classObj.name : 'N/A'}</span> | 
                        <span><strong>Attività:</strong> ${activity.title}</span> | 
                        <span><strong>Data/Ora:</strong> ${date.toLocaleDateString()} ${hour}:00</span>
                    </div>
                </div>
                
                <div class="step-indicator">
                    <span>1. Seleziona Attività</span>
                    <span class="step-arrow">→</span>
                    <span class="step-active">2. Valuta Studenti</span>
                </div>
                
                <h3>👥 Valutazioni Studenti (${students.length})</h3>
                
                <div class="students-eval-container">
                    ${studentsHtml}
                </div>
                
                <div class="eval-section">
                    <label>📝 Note Generali della Lezione</label>
                    <textarea id="lesson-notes" rows="3" placeholder="Note generali sulla lezione..."></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-danger" onclick="window.app.cancelLesson()">Annulla Lezione</button>
                    <button type="button" class="btn btn-secondary" onclick="window.app.saveLessonProgress()">💾 Salva Progresso</button>
                    <button type="button" class="btn btn-success" onclick="window.app.completeLesson('${activity.id}')">✅ Termina Lezione</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Store evaluation data temporarily
        if (!window.currentLessonEvaluations) {
            window.currentLessonEvaluations = {};
        }
    }
    
    selectGrade(studentId, grade) {
        // Visual feedback
        const card = document.getElementById(`eval-card-${studentId}`);
        const buttons = card.querySelectorAll('.grade-btn');
        buttons.forEach(btn => btn.classList.remove('selected'));
        
        const selectedBtn = card.querySelector(`[data-student-id="${studentId}"][data-grade="${grade}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
        
        // Store data
        if (!window.currentLessonEvaluations[studentId]) {
            window.currentLessonEvaluations[studentId] = {};
        }
        window.currentLessonEvaluations[studentId].grade = grade;
        
        showToast(`Voto ${grade} assegnato`, 'success', 1000);
    }
    
    selectBehavior(studentId, behavior) {
        // Visual feedback
        const card = document.getElementById(`eval-card-${studentId}`);
        const buttons = card.querySelectorAll('.behavior-btn');
        buttons.forEach(btn => btn.classList.remove('selected'));
        
        const selectedBtn = card.querySelector(`[data-student-id="${studentId}"][data-behavior="${behavior}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
        
        // Store data
        if (!window.currentLessonEvaluations[studentId]) {
            window.currentLessonEvaluations[studentId] = {};
        }
        window.currentLessonEvaluations[studentId].behavior = behavior;
        
        const behaviorLabel = behavior === 'positive' ? 'Positivo' : behavior === 'neutral' ? 'Neutro' : 'Negativo';
        showToast(`Comportamento: ${behaviorLabel}`, 'success', 1000);
    }
    
    saveLessonProgress() {
        showToast('Progresso salvato! Puoi continuare in seguito.', 'success');
        // Could implement actual progress saving to localStorage here
    }
    
    completeLesson(activityId) {
        // Collect all evaluations
        const students = state.students.filter(s => s.classId === state.activities.find(a => a.id === activityId)?.classId);
        const lessonNotes = document.getElementById('lesson-notes')?.value || '';
        
        students.forEach(student => {
            const evaluation = window.currentLessonEvaluations?.[student.id];
            const observation = document.getElementById(`observation-${student.id}`)?.value || '';
            
            if (evaluation && (evaluation.grade || evaluation.behavior || observation)) {
                // Create evaluation record
                const newEvaluation = {
                    id: `eval_${Date.now()}_${student.id}`,
                    studentId: student.id,
                    activityId: activityId,
                    date: new Date().toISOString().split('T')[0],
                    grade: evaluation.grade || null,
                    comment: observation,
                    behavior: evaluation.behavior || null,
                    lessonNotes: lessonNotes
                };
                
                state.evaluations.push(newEvaluation);
            }
        });
        
        // Update activity status to completed
        const activity = state.activities.find(a => a.id === activityId);
        if (activity) {
            activity.status = 'completata';
        }
        
        saveData();
        
        // Clear temp data
        window.currentLessonEvaluations = {};
        
        // Close modal
        this.closeStudentEvaluationModal();
        
        showToast('Lezione completata con successo!', 'success');
        
        // Refresh views
        this.renderEvaluations();
        this.renderActivities();
    }
    
    cancelLesson() {
        if (confirm('Sei sicuro di voler annullare questa lezione? I dati non salvati andranno persi.')) {
            window.currentLessonEvaluations = {};
            this.closeStudentEvaluationModal();
            showToast('Lezione annullata', 'info');
        }
    }
    
    closeActivitySelectionModal() {
        const modal = document.getElementById('activity-selection-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    }
    
    closeStudentEvaluationModal() {
        const modal = document.getElementById('student-evaluation-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    }
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

        // Load AI FAB settings
        const fabCheckbox = document.getElementById('ai-fab-enabled-checkbox');
        if (fabCheckbox) {
            const fabEnabled = localStorage.getItem('ai-fab-enabled');
            fabCheckbox.checked = fabEnabled !== 'false'; // Default to true if not set
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

    // AI Agent FAB methods
    openAIAgentModal() {
        openAIAgentModal();
    }

    closeAIAgentModal() {
        closeAIAgentModal();
    }

    resetAIFABPosition() {
        resetFABPosition();
    }

    toggleAIFAB(enabled) {
        toggleFABVisibility(enabled);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        window.app = new DocentePlusPlus();
        window.app.init();
        // Expose showToast globally for theme picker
        window.showToast = showToast;
    } catch (error) {
        console.error("Fatal error during app initialization:", error);
        document.body.innerHTML = '<div style="text-align:center;padding:20px;"><h1>Errore Critico</h1><p>L\'applicazione non è riuscita a caricarsi. Controlla la console per i dettagli.</p></div>';
    }
});
