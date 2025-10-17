/**
 * Floating AI Assistant - Mobile-First Responsive Panel
 * Provides contextual AI assistance with speech-to-text capability (mock)
 */

/* Feature flag for mock AI */
const MOCK_AI = true;

/**
 * Floating Assistant Panel State
 */
let assistantState = {
    isOpen: false,
    isRecording: false,
    currentContext: 'general',
    messages: [],
    recordingStartTime: null
};

/**
 * Initialize the floating assistant
 */
export function initFloatingAssistant() {
    const fab = document.getElementById('ai-fab');
    const panel = document.getElementById('floating-assistant-panel');
    
    if (!fab || !panel) {
        console.warn('Floating assistant elements not found');
        return;
    }
    
    // Setup FAB click handler
    fab.addEventListener('click', toggleAssistantPanel);
    
    // Setup panel close button
    const closeBtn = panel.querySelector('.floating-assistant-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeAssistantPanel);
    }
    
    // Setup backdrop click
    const backdrop = document.getElementById('floating-assistant-backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', closeAssistantPanel);
    }
    
    // Setup ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && assistantState.isOpen) {
            closeAssistantPanel();
        }
    });
    
    // Setup input form
    setupInputForm();
    
    // Setup microphone button
    setupMicrophoneButton();
    
    console.log('Floating assistant initialized');
}

/**
 * Toggle assistant panel open/closed
 */
function toggleAssistantPanel() {
    if (assistantState.isOpen) {
        closeAssistantPanel();
    } else {
        openAssistantPanel();
    }
}

/**
 * Open assistant panel
 */
function openAssistantPanel() {
    const panel = document.getElementById('floating-assistant-panel');
    const backdrop = document.getElementById('floating-assistant-backdrop');
    const fab = document.getElementById('ai-fab');
    
    if (!panel) return;
    
    assistantState.isOpen = true;
    
    // Show panel and backdrop
    panel.classList.add('floating-assistant-panel--open');
    if (backdrop) {
        backdrop.classList.add('floating-assistant-backdrop--visible');
    }
    
    // Hide FAB when panel is open
    if (fab) {
        fab.style.display = 'none';
    }
    
    // Update context based on current page
    updateContext();
    
    // Setup focus trap
    setupFocusTrap(panel);
    
    // Focus first input
    const input = panel.querySelector('#floating-assistant-input');
    if (input) {
        setTimeout(() => input.focus(), 100);
    }
    
    // Announce panel opening for screen readers
    announceToScreenReader('Pannello assistente IA aperto');
}

/**
 * Close assistant panel
 */
function closeAssistantPanel() {
    const panel = document.getElementById('floating-assistant-panel');
    const backdrop = document.getElementById('floating-assistant-backdrop');
    const fab = document.getElementById('ai-fab');
    
    if (!panel) return;
    
    assistantState.isOpen = false;
    
    // Stop recording if active
    if (assistantState.isRecording) {
        stopRecording();
    }
    
    // Hide panel and backdrop
    panel.classList.remove('floating-assistant-panel--open');
    if (backdrop) {
        backdrop.classList.remove('floating-assistant-backdrop--visible');
    }
    
    // Show FAB again
    if (fab) {
        fab.style.display = '';
    }
    
    // Return focus to FAB
    if (fab) {
        fab.focus();
    }
    
    // Announce panel closing for screen readers
    announceToScreenReader('Pannello assistente IA chiuso');
}

/**
 * Update context based on current page/tab
 */
function updateContext() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const [page] = hash.split('?');
    assistantState.currentContext = page;
    
    const contextDisplay = document.getElementById('floating-assistant-context');
    if (contextDisplay) {
        const contextNames = {
            home: 'Home',
            schedule: 'Orario',
            'in-classe': 'In Classe',
            lessons: 'Lezioni',
            students: 'Studenti',
            classes: 'Classi',
            activities: 'Attività',
            evaluations: 'Valutazioni',
            agenda: 'Agenda'
        };
        contextDisplay.textContent = contextNames[page] || 'Generale';
    }
}

/**
 * Setup input form submission
 */
function setupInputForm() {
    const form = document.getElementById('floating-assistant-form');
    const input = document.getElementById('floating-assistant-input');
    
    if (!form || !input) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = input.value.trim();
        
        if (message) {
            sendMessage(message);
            input.value = '';
        }
    });
}

/**
 * Send message to AI assistant (mock)
 * TODO: Replace with real API integration
 */
function sendMessage(message) {
    // Add user message to chat
    addMessageToChat('user', message);
    
    // Show typing indicator
    showTypingIndicator();
    
    // Mock AI response after delay
    if (MOCK_AI) {
        setTimeout(() => {
            hideTypingIndicator();
            const response = generateMockResponse(message, assistantState.currentContext);
            addMessageToChat('assistant', response);
        }, 1000 + Math.random() * 1000);
    } else {
        // TODO: Real API call would go here
        // fetch('/api/ai/chat', { ... })
    }
}

/**
 * Generate mock AI response
 * TODO: Replace with real AI API integration
 */
function generateMockResponse(message, context) {
    const responses = {
        'in-classe': [
            'Per questa lezione, suggerisco di concentrarsi sugli obiettivi principali e di variare le attività per mantenere l\'attenzione degli studenti.',
            'Ho notato che questa classe risponde bene alle attività pratiche. Considera di aggiungere un\'esercitazione.',
            'Ricorda di assegnare i compiti prima della fine della lezione per massimizzare il completamento.'
        ],
        schedule: [
            'Il tuo orario sembra bilanciato. Considera pause strategiche tra le materie più impegnative.',
            'Ho notato sovrapposizioni potenziali. Vuoi che le evidenzi?',
            'Suggerisco di raggruppare le lezioni della stessa materia quando possibile.'
        ],
        lessons: [
            'Per pianificare lezioni efficaci, considera gli obiettivi di apprendimento e il tempo disponibile.',
            'Le lezioni interattive tendono ad avere migliori risultati di apprendimento.',
            'Ricorda di includere momenti di verifica della comprensione.'
        ],
        default: [
            'Come posso aiutarti con la gestione della didattica?',
            'Sono qui per supportarti nella pianificazione e organizzazione.',
            'Hai bisogno di suggerimenti per una specifica attività?'
        ]
    };
    
    const contextResponses = responses[context] || responses.default;
    return contextResponses[Math.floor(Math.random() * contextResponses.length)];
}

/**
 * Add message to chat display
 */
function addMessageToChat(role, content) {
    const messagesContainer = document.getElementById('floating-assistant-messages');
    if (!messagesContainer) return;
    
    const messageEl = document.createElement('div');
    messageEl.className = `floating-assistant-message floating-assistant-message--${role}`;
    messageEl.setAttribute('role', 'log');
    messageEl.setAttribute('aria-live', 'polite');
    
    const avatarEl = document.createElement('div');
    avatarEl.className = 'floating-assistant-message-avatar';
    avatarEl.innerHTML = role === 'user' 
        ? '<span class="material-symbols-outlined">person</span>'
        : '<span class="material-symbols-outlined">smart_toy</span>';
    
    const contentEl = document.createElement('div');
    contentEl.className = 'floating-assistant-message-content';
    contentEl.textContent = content;
    
    messageEl.appendChild(avatarEl);
    messageEl.appendChild(contentEl);
    
    messagesContainer.appendChild(messageEl);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Store in state
    assistantState.messages.push({ role, content, timestamp: Date.now() });
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const messagesContainer = document.getElementById('floating-assistant-messages');
    if (!messagesContainer) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'floating-assistant-typing';
    indicator.id = 'typing-indicator';
    indicator.setAttribute('aria-live', 'polite');
    indicator.setAttribute('aria-label', 'Assistente sta scrivendo');
    indicator.innerHTML = `
        <div class="floating-assistant-typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    messagesContainer.appendChild(indicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Hide typing indicator
 */
function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

/**
 * Setup microphone button for voice input (mock)
 */
function setupMicrophoneButton() {
    const micBtn = document.getElementById('floating-assistant-mic-btn');
    if (!micBtn) return;
    
    micBtn.addEventListener('click', toggleRecording);
}

/**
 * Toggle voice recording
 * TODO: Replace with real speech-to-text API integration
 */
function toggleRecording() {
    if (assistantState.isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

/**
 * Start voice recording (mock)
 * TODO: Integrate real MediaRecorder and speech-to-text API
 */
function startRecording() {
    const micBtn = document.getElementById('floating-assistant-mic-btn');
    if (!micBtn) return;
    
    assistantState.isRecording = true;
    assistantState.recordingStartTime = Date.now();
    
    micBtn.classList.add('recording');
    micBtn.setAttribute('aria-label', 'Ferma registrazione');
    
    announceToScreenReader('Registrazione avviata');
    
    // Mock recording - in production, use MediaRecorder API
    if (MOCK_AI) {
        // Simulate recording for 2-4 seconds
        setTimeout(() => {
            if (assistantState.isRecording) {
                stopRecording();
                const mockTranscription = 'Esempio di trascrizione vocale. In produzione, questo sarà il testo convertito dal parlato.';
                const input = document.getElementById('floating-assistant-input');
                if (input) {
                    input.value = mockTranscription;
                    input.focus();
                }
            }
        }, 2000 + Math.random() * 2000);
    } else {
        // TODO: Real MediaRecorder implementation
        // navigator.mediaDevices.getUserMedia({ audio: true })
        //   .then(stream => { ... })
    }
}

/**
 * Stop voice recording
 */
function stopRecording() {
    const micBtn = document.getElementById('floating-assistant-mic-btn');
    if (!micBtn) return;
    
    assistantState.isRecording = false;
    
    micBtn.classList.remove('recording');
    micBtn.setAttribute('aria-label', 'Registra messaggio vocale');
    
    announceToScreenReader('Registrazione fermata');
}

/**
 * Setup focus trap for accessibility
 */
function setupFocusTrap(panel) {
    const focusableElements = panel.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    };
    
    panel.addEventListener('keydown', handleTabKey);
}

/**
 * Announce message to screen readers
 */
function announceToScreenReader(message) {
    const liveRegion = document.getElementById('floating-assistant-live-region');
    if (liveRegion) {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

/**
 * Clear chat history
 */
export function clearChatHistory() {
    assistantState.messages = [];
    const messagesContainer = document.getElementById('floating-assistant-messages');
    if (messagesContainer) {
        messagesContainer.innerHTML = '';
    }
}

/**
 * Get current assistant state (for debugging)
 */
export function getAssistantState() {
    return { ...assistantState };
}

// Export functions
export default {
    initFloatingAssistant,
    clearChatHistory,
    getAssistantState
};
