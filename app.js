
// app.js
window.onerror = function(message, source, lineno, colno, error) {
    alert("JS ERROR:\n" + message + "\nIn: " + source + ":" + lineno);
};
import { loadData, saveData, isOnboardingComplete, skipOnboarding, clearAllData, checkStorageHealth, state } from './js/data.js';
import { createToastContainer, showToast, switchTab, updateActiveClassBadge, showOnboarding, renderChatMessages } from './js/ui.js';
import { setupEventListeners } from './js/events.js';

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
        list.innerHTML = state.lessons.map(lesson => `
            <div class="lesson-item">
                <h4>${lesson.title} (${lesson.subject})</h4>
                <p>${new Date(lesson.date).toLocaleDateString()} - ${lesson.time}</p>
                <p>${lesson.description}</p>
            </div>
        `).join('');
    }

    renderStudents() { /* ... */ }
    renderClasses() { /* ... */ }
    renderActivities() {
        const list = document.getElementById('activities-list');
        if (!list) return;
        if (state.activities.length === 0) {
            list.innerHTML = '<p>Nessuna attività creata.</p>';
            return;
        }
        list.innerHTML = state.activities.map(act => `
            <div class="activity-item">
                <h4>${act.title}</h4>
                <p>Tipo: ${act.type} | Stato: ${act.status}</p>
                <p>Data: ${new Date(act.date).toLocaleDateString()}</p>
            </div>
        `).join('');
    }
    renderEvaluations() { /* ... */ }
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
