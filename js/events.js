
// js/events.js

import { completeOnboarding, skipOnboarding, clearAllData, state } from './data.js';
import { hideOnboarding, showToast, switchTab } from './ui.js';
import { sendMessageToAI } from './ai.js';
import { handleFileUpload } from './files.js';

export function setupEventListeners() {
    document.getElementById('menu-toggle')?.addEventListener('click', () => {
        document.getElementById('main-nav').classList.toggle('mobile-open');
        document.getElementById('menu-backdrop').classList.toggle('active');
    });
    document.getElementById('menu-backdrop')?.addEventListener('click', () => document.getElementById('menu-toggle').click());
    document.querySelectorAll('.tab-button[data-tab]').forEach(button => {
        if (!button.closest('.menu-group')) {
            button.addEventListener('click', () => {
                if(button.dataset.tab !== 'class-selector'){
                    switchTab(button.dataset.tab)
                }
            });
        }
    });
    document.querySelectorAll('.submenu-item[data-tab]').forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });
    document.querySelectorAll('.menu-with-submenu').forEach(button => {
        button.addEventListener('click', (e) => {
            e.currentTarget.parentElement.classList.toggle('open');
        });
    });

    document.getElementById('onboarding-form')?.addEventListener('submit', e => {
        e.preventDefault();
        try {
            const settings = {
                teacherName: document.getElementById('onboarding-first-name')?.value || '',
                teacherLastName: document.getElementById('onboarding-last-name')?.value || '',
                schoolYear: document.getElementById('onboarding-school-year')?.value || '',
            };
            
            // Basic validation
            if (!settings.teacherName.trim()) {
                showToast('Inserisci almeno il tuo nome.', 'warning');
                return;
            }
            
            completeOnboarding(settings);
            hideOnboarding();
            showToast('Profilo configurato! Benvenuto in Docente++.', 'success');
            window.app.initializeAppUI();
        } catch (error) {
            console.error('Error completing onboarding:', error);
            showToast('Errore durante il salvataggio. Riprova.', 'error');
        }
    });
    
    // Skip onboarding button handler
    document.getElementById('onboarding-skip')?.addEventListener('click', () => {
        try {
            skipOnboarding();
            hideOnboarding();
            showToast('Onboarding saltato. Puoi configurare il tuo profilo nelle impostazioni.', 'info');
            window.app.initializeAppUI();
        } catch (error) {
            console.error('Error skipping onboarding:', error);
            showToast('Errore. Riprova.', 'error');
        }
    });

    document.getElementById('ai-chat-send')?.addEventListener('click', () => sendMessageToAI());
    document.getElementById('ai-chat-input')?.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessageToAI();
        }
    });
    document.getElementById('pdf-upload')?.addEventListener('change', e => handleFileUpload(e));
    
    // Clear all data button (troubleshooting)
    document.getElementById('clear-all-data-btn')?.addEventListener('click', () => {
        if (confirm('⚠️ ATTENZIONE: Questa azione cancellerà TUTTI i tuoi dati salvati (classi, studenti, lezioni, ecc.). Questa azione è irreversibile. Sei sicuro di voler continuare?')) {
            if (confirm('Sei VERAMENTE sicuro? Non potrai recuperare i dati cancellati.')) {
                try {
                    clearAllData();
                    showToast('Tutti i dati sono stati cancellati. La pagina verrà ricaricata.', 'success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } catch (error) {
                    console.error('Error clearing data:', error);
                    showToast('Errore durante la cancellazione dei dati.', 'error');
                }
            }
        }
    });

    // AI FAB Settings Controls
    document.getElementById('ai-fab-enabled-checkbox')?.addEventListener('change', (e) => {
        if (window.app) {
            window.app.toggleAIFAB(e.target.checked);
            showToast(e.target.checked ? 'Agente IA attivato' : 'Agente IA disattivato', 'success');
        }
    });

    document.getElementById('reset-ai-fab-position-btn')?.addEventListener('click', () => {
        if (window.app) {
            window.app.resetAIFABPosition();
        }
    });
    
    // Schedule settings form
    document.getElementById('schedule-settings-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (window.app) {
            window.app.saveScheduleSettings();
        }
    });
    
    // School year settings form
    document.getElementById('school-year-settings-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (window.app) {
            window.app.saveSchoolYearSettings();
        }
    });
    
    // AI settings form
    document.getElementById('ai-settings-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (window.app) {
            window.app.saveAISettings();
        }
    });
    
    // Edit profile button
    document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
        if (window.app) {
            window.app.editProfile();
        }
    });
}
