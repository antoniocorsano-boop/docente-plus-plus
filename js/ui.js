
// js/ui.js

import { state } from './data.js';

export function createToastContainer() {
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
}

export function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, duration);
}

export function switchTab(tabName) {
    if (!tabName) return;
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));

    const content = document.getElementById(tabName);
    if (content) content.classList.add('active');

    const button = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
    if (button) {
        button.classList.add('active');
        const parentGroup = button.closest('.menu-group');
        if (parentGroup) {
            parentGroup.querySelector('.menu-with-submenu').classList.add('active');
        }
    }

    if (window.innerWidth < 768 && document.getElementById('main-nav').classList.contains('mobile-open')) {
        document.getElementById('menu-toggle').click();
    }

    // Track current active tab for AI Agent context
    if (window.app) {
        window.app.currentActiveTab = tabName;
    }

    const renderFunction = `render${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`;
    if (typeof window.app[renderFunction] === 'function') {
        window.app[renderFunction]();
    } else {
        console.warn(`Render function not found: ${renderFunction}`);
    }
}

export function updateActiveClassBadge() {
    const badge = document.getElementById('active-class-badge-text');
    if (!badge) return;
    if (state.activeClass) {
        const cls = state.classes.find(c => c.id === state.activeClass);
        badge.textContent = cls ? cls.name : 'Workspace';
    } else {
        badge.textContent = 'Workspace';
    }
}

export function showOnboarding() {
    const modal = document.getElementById('onboarding-modal');
    if (modal) {
        modal.style.display = 'flex';
    } else {
        console.error('Onboarding modal not found. Skipping onboarding.');
        // If modal doesn't exist, skip onboarding to not block the app
        import('./data.js').then(({ skipOnboarding }) => {
            skipOnboarding();
            if (window.app && typeof window.app.initializeAppUI === 'function') {
                window.app.initializeAppUI();
            }
        });
    }
}

export function hideOnboarding() {
    document.getElementById('onboarding-modal').style.display = 'none';
}

export function renderTemplate(templateId, containerId, data) {
    const template = document.getElementById(templateId).innerHTML;
    const container = document.getElementById(containerId);
    let html = '';
    if (Array.isArray(data)) {
        data.forEach(item => {
            html += template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
                return item[key.trim()] || '';
            });
        });
    } else {
        html = template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
            return data[key.trim()] || '';
        });
    }
    container.innerHTML = html;
}

export function renderChatMessages() {
    const messagesContainer = document.getElementById('ai-chat-messages');
    if (!messagesContainer) return;
    
    if (state.chatMessages.length === 0) {
        messagesContainer.innerHTML = '<p class="empty-state">Inizia una conversazione con l\'assistente IA!</p>';
        return;
    }
    
    messagesContainer.innerHTML = state.chatMessages.map(msg => {
        const className = msg.sender === 'user' ? 'chat-message-user' : 'chat-message-ai';
        return `<div class="${className}"><strong>${msg.sender === 'user' ? 'Tu' : 'IA'}:</strong> ${msg.text}</div>`;
    }).join('');
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
