/**
 * Schedule Patch for In-Classe Page
 * 
 * This patch enhances the In-Classe page by:
 * 1. Loading schedule data from localStorage or window.opener
 * 2. Rendering a proper schedule grid table
 * 3. Providing fallback UI when schedule is missing
 * 4. Wiring enter-lesson buttons to navigate to in-classe.html with lesson data
 */

(function() {
    'use strict';

    // ===================
    // Sanitization Helpers
    // ===================

    /**
     * Sanitize text content to prevent XSS attacks
     * @param {string} text - Text to sanitize
     * @returns {string} Sanitized text
     */
    function sanitizeText(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Sanitize HTML attributes
     * @param {string} attr - Attribute value to sanitize
     * @returns {string} Sanitized attribute
     */
    function sanitizeAttribute(attr) {
        if (!attr) return '';
        return String(attr).replace(/['"<>&]/g, function(char) {
            const entities = {
                '"': '&quot;',
                "'": '&#39;',
                '<': '&lt;',
                '>': '&gt;',
                '&': '&amp;'
            };
            return entities[char] || char;
        });
    }

    // ===================
    // Schedule Data Loading
    // ===================

    /**
     * Load schedule from localStorage or window.opener
     * @returns {Object|null} Schedule data or null if not found
     */
    function loadScheduleFromStorageOrOpener() {
        // Try localStorage first
        try {
            const scheduleStr = localStorage.getItem('schedule');
            if (scheduleStr) {
                const schedule = JSON.parse(scheduleStr);
                if (schedule && typeof schedule === 'object') {
                    return schedule;
                }
            }
        } catch (e) {
            console.warn('Error loading schedule from localStorage:', e);
        }

        // Try window.opener if available
        if (window.opener && window.opener.state && window.opener.state.schedule) {
            try {
                return window.opener.state.schedule;
            } catch (e) {
                console.warn('Error accessing schedule from opener:', e);
            }
        }

        return null;
    }

    /**
     * Get class name from class ID
     * @param {string} classId - Class identifier
     * @returns {string} Class name
     */
    function getClassName(classId) {
        try {
            // Try localStorage classes
            const classesStr = localStorage.getItem('classes');
            if (classesStr) {
                const classes = JSON.parse(classesStr);
                const classObj = classes.find(c => c.id === classId);
                if (classObj && classObj.name) {
                    return classObj.name;
                }
            }
        } catch (e) {
            console.warn('Error loading classes:', e);
        }

        // Try window.opener
        if (window.opener && window.opener.state && window.opener.state.classes) {
            try {
                const classObj = window.opener.state.classes.find(c => c.id === classId);
                if (classObj && classObj.name) {
                    return classObj.name;
                }
            } catch (e) {
                console.warn('Error accessing classes from opener:', e);
            }
        }

        return classId || 'N/A';
    }

    /**
     * Get activity type information
     * @param {string} activityType - Activity type identifier
     * @returns {Object} Activity type info with label and icon
     */
    function getActivityTypeInfo(activityType) {
        const types = {
            'theory': { label: 'Teoria', icon: 'menu_book', color: '#6750A4' },
            'practice': { label: 'Pratica', icon: 'draw', color: '#7D5260' },
            'lab': { label: 'Laboratorio', icon: 'science', color: '#006A6A' },
            'test': { label: 'Verifica', icon: 'quiz', color: '#984061' },
            'group': { label: 'Gruppo', icon: 'groups', color: '#6750A4' },
            'other': { label: 'Altro', icon: 'more_horiz', color: '#625B71' }
        };
        return types[activityType] || types['other'];
    }

    // ===================
    // Navigation
    // ===================

    /**
     * Navigate to in-classe.html with lesson data
     * @param {string} lessonKey - Lesson key (e.g., "Lunedì-08:00")
     */
    function enterLessonFromSchedule(lessonKey) {
        if (!lessonKey) {
            console.error('Invalid lesson key');
            return;
        }

        // If we're already on in-classe.html, just update the URL parameter
        if (window.location.pathname.includes('in-classe.html')) {
            const newUrl = `in-classe.html?lesson=${encodeURIComponent(lessonKey)}`;
            window.location.href = newUrl;
        } else {
            // Navigate to in-classe.html
            window.location.href = `in-classe.html?lesson=${encodeURIComponent(lessonKey)}`;
        }
    }

    // Make it globally accessible
    window.enterLessonFromSchedule = enterLessonFromSchedule;

    // ===================
    // Schedule Rendering
    // ===================

    /**
     * Render schedule view with grid table
     * This overrides or extends InClasseUI.renderScheduleView
     */
    function renderScheduleView() {
        const schedule = loadScheduleFromStorageOrOpener();
        
        // Create schedule section if it doesn't exist
        let scheduleSection = document.querySelector('[data-section="schedule"]');
        
        if (!scheduleSection) {
            // Insert schedule section before activities section
            const activitiesSection = document.querySelector('[data-section="activities"]');
            if (!activitiesSection) {
                console.warn('Cannot find activities section to insert schedule');
                return;
            }

            scheduleSection = document.createElement('section');
            scheduleSection.className = 'collapsible-section';
            scheduleSection.setAttribute('data-section', 'schedule');
            
            scheduleSection.innerHTML = `
                <div class="section-header" role="button" tabindex="0" aria-expanded="true" aria-controls="schedule-content">
                    <div class="section-title">
                        <span class="material-symbols-outlined">calendar_month</span>
                        <h2>Orario Settimanale</h2>
                    </div>
                    <span class="material-symbols-outlined expand-icon">expand_more</span>
                </div>
                <div class="section-content" id="schedule-content">
                    <div id="schedule-grid-container"></div>
                </div>
            `;
            
            activitiesSection.parentNode.insertBefore(scheduleSection, activitiesSection);
            
            // Add collapsible functionality
            const header = scheduleSection.querySelector('.section-header');
            const content = scheduleSection.querySelector('.section-content');
            
            header.addEventListener('click', function() {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                header.setAttribute('aria-expanded', !isExpanded);
                content.style.display = isExpanded ? 'none' : 'block';
            });
            
            header.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    header.click();
                }
            });
        }

        const container = document.getElementById('schedule-grid-container');
        if (!container) {
            console.warn('Schedule container not found');
            return;
        }

        // Render schedule or fallback
        if (!schedule || Object.keys(schedule).length === 0) {
            renderScheduleFallback(container);
        } else {
            renderScheduleGrid(container, schedule);
        }
    }

    /**
     * Render fallback UI when schedule is missing
     * @param {HTMLElement} container - Container element
     */
    function renderScheduleFallback(container) {
        container.innerHTML = `
            <div class="schedule-fallback">
                <div class="empty-state">
                    <span class="material-symbols-outlined" style="font-size: 48px; color: #6750A4;">calendar_month</span>
                    <h3>Nessun Orario Disponibile</h3>
                    <p>Non è stato trovato un orario configurato. Configura il tuo orario nella sezione Orario per visualizzarlo qui.</p>
                    <button class="btn btn-primary" onclick="window.location.href='index.html#schedule'">
                        <span class="material-symbols-outlined">add</span>
                        Vai alla Configurazione Orario
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Render schedule grid table
     * @param {HTMLElement} container - Container element
     * @param {Object} schedule - Schedule data
     */
    function renderScheduleGrid(container, schedule) {
        // Define time slots and days
        const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì'];
        const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];

        // Start building the table
        let html = `
            <div class="schedule-table-wrapper">
                <table class="schedule-table">
                    <thead>
                        <tr>
                            <th>Ora</th>
                            ${days.map(day => `<th>${sanitizeText(day)}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Create rows for each time slot
        timeSlots.forEach(time => {
            html += '<tr>';
            html += `<td class="schedule-time">${sanitizeText(time)}</td>`;

            days.forEach(day => {
                const key = `${day}-${time}`;
                const slot = schedule[key];

                html += '<td class="schedule-cell">';

                if (slot && slot.classId) {
                    const className = getClassName(slot.classId);
                    const subject = slot.subject || '';
                    const activityInfo = getActivityTypeInfo(slot.activityType);

                    html += `
                        <div class="schedule-slot-content">
                            <div class="schedule-class-name">${sanitizeText(className)}</div>
                            ${subject ? `<div class="schedule-subject">${sanitizeText(subject)}</div>` : ''}
                            <div class="schedule-activity-badge" style="background-color: ${sanitizeAttribute(activityInfo.color)}">
                                <span class="material-symbols-outlined" style="font-size: 14px;">${sanitizeText(activityInfo.icon)}</span>
                                ${sanitizeText(activityInfo.label)}
                            </div>
                            <button class="btn btn-sm btn-primary schedule-enter-btn" 
                                    onclick="enterLessonFromSchedule('${sanitizeAttribute(key)}')"
                                    title="Entra in questa lezione">
                                <span class="material-symbols-outlined">login</span>
                                Entra
                            </button>
                        </div>
                    `;
                } else {
                    html += '<div class="schedule-slot-empty">-</div>';
                }

                html += '</td>';
            });

            html += '</tr>';
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    }

    // ===================
    // Polling Patch Logic
    // ===================

    /**
     * Wait for InClasseUI to be defined and patch it
     */
    function patchInClasseUI() {
        // Check if InClasseUI is defined
        if (window.InClasseUI) {
            // Patch the class
            if (!InClasseUI.prototype.renderScheduleView) {
                InClasseUI.prototype.renderScheduleView = renderScheduleView;
                console.log('InClasseUI.renderScheduleView patched successfully');
            }
            return true;
        }
        return false;
    }

    /**
     * Poll until InClasseUI is available or timeout
     */
    function waitForInClasseUI() {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max
        const interval = 100; // Check every 100ms

        const pollInterval = setInterval(() => {
            attempts++;

            if (patchInClasseUI()) {
                clearInterval(pollInterval);
                
                // Render schedule view after patching
                if (typeof renderScheduleView === 'function') {
                    // Wait a bit more for DOM to be ready
                    setTimeout(renderScheduleView, 100);
                }
            } else if (attempts >= maxAttempts) {
                clearInterval(pollInterval);
                console.warn('InClasseUI not found after polling. Rendering schedule directly.');
                
                // Render directly if InClasseUI is not found
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', renderScheduleView);
                } else {
                    renderScheduleView();
                }
            }
        }, interval);
    }

    // ===================
    // Initialize
    // ===================

    // Start polling when script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForInClasseUI);
    } else {
        waitForInClasseUI();
    }

})();
