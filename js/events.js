
// js/events.js

import { completeOnboarding, state } from './data.js';
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
        const settings = {
            teacherName: document.getElementById('onboarding-first-name').value,
            teacherLastName: document.getElementById('onboarding-last-name').value,
            schoolYear: document.getElementById('onboarding-school-year').value,
        };
        completeOnboarding(settings);
        hideOnboarding();
        showToast('Profilo configurato! Benvenuto in Docente++.', 'success');
        window.app.initializeAppUI();
    });

    document.getElementById('ai-chat-send')?.addEventListener('click', () => sendMessageToAI());
    document.getElementById('ai-chat-input')?.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessageToAI();
        }
    });
    document.getElementById('pdf-upload')?.addEventListener('change', e => handleFileUpload(e));
}
