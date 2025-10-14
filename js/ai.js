
// js/ai.js

import { state, saveData } from './data.js';
import { renderChatMessages } from './ui.js';

export function sendMessageToAI() {
    const input = document.getElementById('ai-chat-input');
    if (!input) return;
    const messageText = input.value.trim();
    if (!messageText) return;

    state.chatMessages.push({ sender: 'user', text: messageText });
    renderChatMessages();
    input.value = '';

    setTimeout(() => getAIResponse(messageText), 800);
}

function getAIResponse(message) {
    let responseText = "Non ho capito. Prova a chiedere: \"suggerisci un'attività\" o \"crea una lezione sulla fotosintesi\".";
    message = message.toLowerCase();

    if (message.includes('suggerisci') || message.includes('idea')) {
        responseText = 'Certo! Che ne dici di un dibattito in classe sull\'impatto dei social media? Oppure una verifica sulla Seconda Guerra Mondiale.';
    } else if (message.includes('crea') && message.includes('lezione')) {
        const topic = message.split('lezione su')[1]?.trim() || 'un argomento a scelta';
        responseText = `Ok, ho creato una bozza di lezione su "${topic}". La trovi nella sezione Lezioni.`;
        state.lessons.push({ id: `les_${Date.now()}`, title: `Bozza AI: ${topic.charAt(0).toUpperCase() + topic.slice(1)}`, date: new Date().toISOString().split('T')[0], time: '10:00', subject: 'Varie', description: 'Lezione generata da IA.' });
        saveData();
        window.app.renderLessons(); // This will need to be updated to call the render function directly
    }

    state.chatMessages.push({ sender: 'ai', text: responseText });
    saveData();
    renderChatMessages();
}
