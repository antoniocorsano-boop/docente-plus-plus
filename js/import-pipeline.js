
// js/import-pipeline.js
// Enhanced document import pipeline with AI-powered extraction

import { state, saveData } from './data.js';
import { showToast } from './ui.js';

/**
 * Document Import Pipeline
 * Handles structured data extraction from educational documents
 */

export class ImportPipeline {
    constructor() {
        this.supportedTypes = {
            curriculum: {
                name: 'Curriculum/Programma',
                extensions: ['.pdf', '.doc', '.docx', '.txt'],
                icon: '📚'
            },
            activities: {
                name: 'Piano Attività',
                extensions: ['.pdf', '.xlsx', '.csv', '.txt'],
                icon: '📋'
            },
            schedule: {
                name: 'Orario Scolastico',
                extensions: ['.pdf', '.xlsx', '.csv', '.txt'],
                icon: '🗓️'
            },
            students: {
                name: 'Anagrafica Studenti',
                extensions: ['.xlsx', '.csv', '.txt'],
                icon: '👥'
            }
        };
        
        this.currentImport = null;
        this.previewData = null;
    }

    /**
     * Main entry point for document upload
     */
    async handleDocumentUpload(file) {
        if (!file) {
            showToast('Nessun file selezionato', 'warning');
            return null;
        }

        try {
            showToast('Analisi documento in corso...', 'info');
            
            // Step 1: Read file content
            const content = await this.readFileContent(file);
            
            // Step 2: Classify document type (with AI or pattern matching)
            const classification = await this.classifyDocument(file, content);
            
            // Step 3: Extract structured data based on type
            const extractedData = await this.extractStructuredData(content, classification.type, file);
            
            // Step 4: Store for preview
            this.currentImport = {
                file: file,
                classification: classification,
                extractedData: extractedData,
                timestamp: new Date().toISOString()
            };
            
            showToast(`Documento classificato: ${classification.label}`, 'success');
            
            return this.currentImport;
            
        } catch (error) {
            console.error('Import error:', error);
            showToast('Errore durante l\'importazione: ' + error.message, 'error');
            return null;
        }
    }

    /**
     * Read file content based on type
     */
    async readFileContent(file) {
        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        
        if (extension === '.pdf') {
            return await this.readPDF(file);
        } else if (['.xlsx', '.xls'].includes(extension)) {
            return await this.readExcel(file);
        } else if (extension === '.csv') {
            return await this.readCSV(file);
        } else if (['.txt', '.doc', '.docx'].includes(extension)) {
            return await this.readText(file);
        } else {
            throw new Error('Formato file non supportato');
        }
    }

    async readPDF(file) {
        // TODO(AI): Integrate PDF.js for full text extraction
        // For now, return file metadata
        return {
            type: 'pdf',
            name: file.name,
            size: file.size,
            // Placeholder: In real implementation, extract text with PDF.js
            text: `[Contenuto PDF da estrarre: ${file.name}]`
        };
    }

    async readExcel(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                    
                    resolve({
                        type: 'excel',
                        name: file.name,
                        sheets: workbook.SheetNames,
                        data: jsonData
                    });
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    async readCSV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const csv = e.target.result;
                Papa.parse(csv, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        resolve({
                            type: 'csv',
                            name: file.name,
                            data: results.data,
                            meta: results.meta
                        });
                    },
                    error: reject
                });
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    async readText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve({
                    type: 'text',
                    name: file.name,
                    text: e.target.result
                });
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    /**
     * Classify document type using AI or pattern matching
     */
    async classifyDocument(file, content) {
        // TODO(AI): Integrate OpenRouter API for intelligent classification
        // For now, use pattern matching and filename heuristics
        
        const fileName = file.name.toLowerCase();
        const text = this.getTextContent(content);
        
        // Pattern matching
        if (this.matchesPattern(fileName, text, 'curriculum')) {
            return { type: 'curriculum', label: 'Curriculum/Programma', confidence: 0.8 };
        } else if (this.matchesPattern(fileName, text, 'activities')) {
            return { type: 'activities', label: 'Piano Attività', confidence: 0.75 };
        } else if (this.matchesPattern(fileName, text, 'schedule')) {
            return { type: 'schedule', label: 'Orario Scolastico', confidence: 0.7 };
        } else if (this.matchesPattern(fileName, text, 'students')) {
            return { type: 'students', label: 'Anagrafica Studenti', confidence: 0.85 };
        } else {
            return { type: 'unknown', label: 'Tipo Sconosciuto', confidence: 0.3 };
        }
    }

    getTextContent(content) {
        if (typeof content === 'string') return content.toLowerCase();
        if (content.text) return content.text.toLowerCase();
        if (content.data && Array.isArray(content.data)) {
            return JSON.stringify(content.data).toLowerCase();
        }
        return '';
    }

    matchesPattern(fileName, text, type) {
        const patterns = {
            curriculum: {
                fileName: ['curriculum', 'programma', 'syllabus', 'piano didattico'],
                content: ['competenze', 'obiettivi', 'traguardi', 'unità di apprendimento']
            },
            activities: {
                fileName: ['attività', 'piano', 'calendario', 'programmazione'],
                content: ['verifica', 'compito', 'laboratorio', 'progetto', 'esercitazione']
            },
            schedule: {
                fileName: ['orario', 'schedule', 'timetable'],
                content: ['lunedì', 'martedì', 'mercoledì', '08:00', '09:00']
            },
            students: {
                fileName: ['studenti', 'alunni', 'anagrafica', 'elenco', 'roster'],
                content: ['nome', 'cognome', 'email', 'classe', 'data di nascita']
            }
        };

        const pattern = patterns[type];
        if (!pattern) return false;

        // Check filename
        const fileNameMatch = pattern.fileName.some(p => fileName.includes(p));
        
        // Check content
        const contentMatch = pattern.content.some(p => text.includes(p));

        return fileNameMatch || contentMatch;
    }

    /**
     * Extract structured data based on document type
     */
    async extractStructuredData(content, type, file) {
        switch (type) {
            case 'curriculum':
                return await this.extractCurriculumData(content);
            case 'activities':
                return await this.extractActivitiesData(content);
            case 'schedule':
                return await this.extractScheduleData(content);
            case 'students':
                return await this.extractStudentsData(content);
            default:
                return { items: [], message: 'Tipo documento non riconosciuto' };
        }
    }

    /**
     * Extract curriculum/syllabus data
     */
    async extractCurriculumData(content) {
        // TODO(AI): Use AI to extract structured curriculum data
        // For now, return structured placeholder
        
        return {
            type: 'curriculum',
            items: [
                {
                    subject: 'Da definire',
                    grade: 'Da definire',
                    units: [],
                    objectives: [],
                    competencies: []
                }
            ],
            message: '⚠️ Estrazione curriculum richiede integrazione IA. Placeholder generato.',
            needsReview: true
        };
    }

    /**
     * Extract activities from document
     */
    async extractActivitiesData(content) {
        // TODO(AI): Enhanced extraction with AI
        const activities = [];
        
        // Simple pattern matching for common activity structures
        const text = this.getTextContent(content);
        const activityTypes = ['verifica', 'compito', 'laboratorio', 'progetto', 'esercitazione', 'lezione'];
        
        // This is a simplified extraction - real implementation would use AI
        activityTypes.forEach(type => {
            if (text.includes(type)) {
                activities.push({
                    title: `${type.charAt(0).toUpperCase() + type.slice(1)} da documento`,
                    type: this.mapActivityType(type),
                    date: new Date().toISOString().split('T')[0],
                    description: `Estratto da: ${content.name || 'documento'}`,
                    status: 'planned',
                    classId: null, // To be assigned by user
                    needsReview: true
                });
            }
        });

        return {
            type: 'activities',
            items: activities,
            message: activities.length > 0 
                ? `${activities.length} attività estratte. Richiede revisione.`
                : '⚠️ Nessuna attività riconosciuta. Considera importazione manuale.',
            needsReview: true
        };
    }

    mapActivityType(keyword) {
        const mapping = {
            'verifica': 'test',
            'compito': 'homework',
            'laboratorio': 'lab',
            'progetto': 'project',
            'esercitazione': 'exercise',
            'lezione': 'lesson'
        };
        return mapping[keyword] || 'other';
    }

    /**
     * Extract schedule data
     */
    async extractScheduleData(content) {
        // TODO(AI): AI-powered schedule extraction
        const slots = [];
        
        // Pattern matching for time slots
        const timePattern = /(\d{1,2}):(\d{2})/g;
        const text = this.getTextContent(content);
        const matches = text.match(timePattern);
        
        if (matches && matches.length > 0) {
            // Basic extraction
            return {
                type: 'schedule',
                items: [{
                    message: `Trovati ${matches.length} riferimenti orari`,
                    slots: matches.slice(0, 6), // First 6 time references
                    needsReview: true
                }],
                message: '⚠️ Estrazione orario richiede integrazione IA completa.',
                needsReview: true
            };
        }

        return {
            type: 'schedule',
            items: [],
            message: '⚠️ Nessun orario riconosciuto. Importazione manuale consigliata.',
            needsReview: true
        };
    }

    /**
     * Extract student roster data
     */
    async extractStudentsData(content) {
        // Reuse existing student extraction logic from app.js
        // This function can delegate to the existing extractStudentsFromTabularData
        
        if (content.type === 'csv' || content.type === 'excel') {
            const data = content.data;
            if (!data || data.length === 0) {
                return {
                    type: 'students',
                    items: [],
                    message: 'File vuoto o formato non valido',
                    needsReview: true
                };
            }

            // Extract headers and data
            const students = this.parseStudentData(data);
            
            return {
                type: 'students',
                items: students,
                message: `${students.length} studenti estratti. Verifica dati prima dell'importazione.`,
                needsReview: true
            };
        }

        return {
            type: 'students',
            items: [],
            message: 'Formato non supportato per anagrafica studenti. Usa CSV o Excel.',
            needsReview: true
        };
    }

    parseStudentData(data) {
        // Simplified student parsing - integrate with existing app.js logic
        const students = [];
        
        // Skip header row if present
        const rows = Array.isArray(data[0]) ? data.slice(1) : data;
        
        rows.forEach((row, index) => {
            if (!row || (Array.isArray(row) && row.length === 0)) return;
            
            const student = {
                id: `imported_${Date.now()}_${index}`,
                name: this.extractField(row, ['nome', 'name', 'cognome e nome']) || `Studente ${index + 1}`,
                email: this.extractField(row, ['email', 'e-mail', 'mail']) || '',
                class: this.extractField(row, ['classe', 'class', 'sezione']) || '',
                birthdate: this.extractField(row, ['data di nascita', 'birthdate', 'nascita']) || '',
                notes: this.extractField(row, ['note', 'notes']) || '',
                needsReview: true
            };
            
            students.push(student);
        });

        return students;
    }

    extractField(row, fieldNames) {
        // Extract field from row based on possible field names
        if (Array.isArray(row)) {
            // Array format (from CSV)
            return row[0] || ''; // Simplified
        } else if (typeof row === 'object') {
            // Object format (from parsed CSV with headers)
            for (const fieldName of fieldNames) {
                const value = row[fieldName] || row[fieldName.toLowerCase()] || row[fieldName.toUpperCase()];
                if (value) return value;
            }
        }
        return '';
    }

    /**
     * Generate preview UI for extracted data
     */
    generatePreviewHTML(importData) {
        if (!importData || !importData.extractedData) {
            return '<p class="error">Nessun dato da visualizzare</p>';
        }

        const { classification, extractedData } = importData;
        const icon = this.supportedTypes[classification.type]?.icon || '📄';
        
        let html = `
            <div class="import-preview">
                <div class="import-preview-header">
                    <h3>${icon} ${classification.label}</h3>
                    <div class="confidence-badge" style="background-color: ${this.getConfidenceColor(classification.confidence)}">
                        Confidenza: ${Math.round(classification.confidence * 100)}%
                    </div>
                </div>
                <div class="import-preview-message ${extractedData.needsReview ? 'warning' : 'success'}">
                    ${extractedData.message}
                </div>
        `;

        // Type-specific preview
        if (extractedData.type === 'students' && extractedData.items.length > 0) {
            html += this.generateStudentsPreview(extractedData.items);
        } else if (extractedData.type === 'activities' && extractedData.items.length > 0) {
            html += this.generateActivitiesPreview(extractedData.items);
        } else if (extractedData.type === 'schedule') {
            html += this.generateSchedulePreview(extractedData.items);
        } else if (extractedData.type === 'curriculum') {
            html += this.generateCurriculumPreview(extractedData.items);
        } else {
            html += '<p class="info">Nessun dato estratto. Considera importazione manuale.</p>';
        }

        html += `
                <div class="import-preview-actions">
                    <button class="btn btn-primary" onclick="window.importPipeline.confirmImport()">
                        ✅ Conferma e Importa
                    </button>
                    <button class="btn btn-secondary" onclick="window.importPipeline.cancelImport()">
                        ❌ Annulla
                    </button>
                    ${extractedData.needsReview ? '<button class="btn btn-accent" onclick="window.importPipeline.refineWithAI()">🤖 Affina con IA</button>' : ''}
                </div>
            </div>
        `;

        return html;
    }

    generateStudentsPreview(students) {
        let html = '<div class="preview-table-wrapper"><table class="preview-table"><thead><tr>';
        html += '<th>Nome</th><th>Email</th><th>Classe</th><th>Data Nascita</th><th>Note</th>';
        html += '</tr></thead><tbody>';
        
        students.slice(0, 10).forEach(student => {
            html += `<tr>
                <td>${student.name || 'N/A'}</td>
                <td>${student.email || 'N/A'}</td>
                <td>${student.class || 'N/A'}</td>
                <td>${student.birthdate || 'N/A'}</td>
                <td>${student.notes || '-'}</td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        
        if (students.length > 10) {
            html += `<p class="table-note">Mostrati primi 10 di ${students.length} studenti</p>`;
        }
        
        html += '</div>';
        return html;
    }

    generateActivitiesPreview(activities) {
        let html = '<div class="preview-list">';
        
        activities.forEach(activity => {
            html += `
                <div class="preview-item">
                    <h4>${activity.title}</h4>
                    <p><strong>Tipo:</strong> ${activity.type} | <strong>Data:</strong> ${activity.date}</p>
                    <p>${activity.description}</p>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    generateSchedulePreview(items) {
        let html = '<div class="preview-info">';
        
        if (items.length > 0 && items[0].slots) {
            html += '<p><strong>Slot orari trovati:</strong></p><ul>';
            items[0].slots.forEach(slot => {
                html += `<li>${slot}</li>`;
            });
            html += '</ul>';
        } else {
            html += '<p>Nessuno slot orario estratto automaticamente.</p>';
        }
        
        html += '</div>';
        return html;
    }

    generateCurriculumPreview(items) {
        return '<div class="preview-info"><p>Preview curriculum non ancora implementata. Integrazione IA necessaria.</p></div>';
    }

    getConfidenceColor(confidence) {
        if (confidence >= 0.8) return '#27ae60';
        if (confidence >= 0.6) return '#f39c12';
        return '#e74c3c';
    }

    /**
     * Confirm and execute import
     */
    async confirmImport() {
        if (!this.currentImport || !this.currentImport.extractedData) {
            showToast('Nessun dato da importare', 'warning');
            return;
        }

        const { extractedData } = this.currentImport;
        let imported = 0;

        try {
            if (extractedData.type === 'students') {
                imported = await this.importStudents(extractedData.items);
                showToast(`${imported} studenti importati con successo!`, 'success');
            } else if (extractedData.type === 'activities') {
                imported = await this.importActivities(extractedData.items);
                showToast(`${imported} attività importate con successo!`, 'success');
            } else if (extractedData.type === 'schedule') {
                showToast('Importazione orario richiede configurazione manuale', 'info');
            } else if (extractedData.type === 'curriculum') {
                showToast('Importazione curriculum richiede integrazione IA', 'info');
            }

            // Record import in history
            this.recordImport(extractedData.type, imported);

            // Clear current import
            this.currentImport = null;
            
            // Refresh UI
            if (window.app) {
                window.app.renderAllTabs();
            }

        } catch (error) {
            console.error('Import error:', error);
            showToast('Errore durante l\'importazione: ' + error.message, 'error');
        }
    }

    async importStudents(students) {
        let count = 0;
        students.forEach(student => {
            // Check for duplicates
            const exists = state.students.find(s => 
                s.name === student.name || 
                (s.email && student.email && s.email === student.email)
            );

            if (!exists) {
                state.students.push({
                    id: `student_${Date.now()}_${count}`,
                    name: student.name,
                    email: student.email,
                    class: student.class,
                    birthdate: student.birthdate,
                    notes: student.notes
                });
                count++;
            }
        });

        saveData();
        return count;
    }

    async importActivities(activities) {
        let count = 0;
        activities.forEach(activity => {
            state.activities.push({
                id: `activity_${Date.now()}_${count}`,
                title: activity.title,
                type: activity.type,
                date: activity.date,
                description: activity.description,
                status: activity.status,
                classId: activity.classId
            });
            count++;
        });

        saveData();
        return count;
    }

    recordImport(type, count) {
        // TODO: Implement import history tracking
        console.log(`Import recorded: ${type}, ${count} items`);
    }

    /**
     * Cancel current import
     */
    cancelImport() {
        this.currentImport = null;
        this.previewData = null;
        showToast('Importazione annullata', 'info');
        
        // Clear preview UI
        const previewContainer = document.getElementById('import-preview-container');
        if (previewContainer) {
            previewContainer.innerHTML = '';
        }
    }

    /**
     * Refine data with AI (future feature)
     */
    async refineWithAI() {
        // TODO(AI): Integrate AI refinement
        showToast('Affinamento IA in arrivo! Per ora, rivedi manualmente i dati.', 'info');
    }
}

// Create singleton instance
export const importPipeline = new ImportPipeline();

// Make available globally for onclick handlers
if (typeof window !== 'undefined') {
    window.importPipeline = importPipeline;
}
