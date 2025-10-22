
// js/files.js

import { showToast } from './ui.js';

export let selectedFile = null;
export let currentImportData = null;

export function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    selectedFile = file;

    const feedbackEl = document.getElementById('pdf-upload-feedback');
    const optionsEl = document.getElementById('pdf-import-options');

    if(feedbackEl) feedbackEl.innerHTML = `<p>File selezionato: <strong>${file.name}</strong></p>`;
    if(optionsEl) optionsEl.style.display = 'block';

    showToast('File pronto per l\'elaborazione.', 'info');

    // Mock text extraction and analysis
    currentImportData = {
        summary: `Il documento "${file.name}" è stato analizzato. I punti chiave includono: l'importanza dell'acqua, il ciclo di evaporazione e le precipitazioni.`,
        keywords: ['acqua', 'ciclo', 'evaporazione', 'precipitazioni']
    };
    const outputEl = document.getElementById('pdf-processing-output');
    if(outputEl) outputEl.innerHTML = `
        <h4>Analisi Preliminare Completata</h4>
        <p><strong>Riepilogo:</strong> ${currentImportData.summary}</p>
    `;
}

export function processPdfForLessons() {
    if(!currentImportData || !selectedFile) {
        showToast('Nessun dato da importare. Carica prima un file.', 'error');
        return;
    }

    const newLesson = {
        id: `les_${Date.now()}`,
        title: `Lezione da file: ${selectedFile.name}`,
        subject: 'Da Documento',
        description: currentImportData.summary,
        date: new Date().toISOString().split('T')[0],
        time: '09:00'
    };
    // This will need to be updated to add the lesson to the state and save it
    window.app.lessons.push(newLesson);
    window.app.saveData();
    window.app.renderLessons();
    window.app.switchTab('lessons');
    showToast('Bozza di lezione creata con successo!', 'success');
}
