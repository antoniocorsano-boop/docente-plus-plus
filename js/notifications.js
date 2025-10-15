
// js/notifications.js
// Proactive notification system for reminders and institutional commitments

import { state, saveData } from './data.js';
import { showToast } from './ui.js';

/**
 * Proactive Notifications System
 * Manages day-after reminders and institutional commitments
 */

export class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.reminders = [];
        this.institutionalCommitments = [];
        
        // Initialize from localStorage
        this.loadNotifications();
        
        // Auto-check interval (every hour)
        this.autoCheckInterval = null;
    }

    /**
     * Load notifications from localStorage
     */
    loadNotifications() {
        try {
            this.notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            this.reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
            this.institutionalCommitments = JSON.parse(localStorage.getItem('institutionalCommitments') || '[]');
        } catch (error) {
            console.error('Error loading notifications:', error);
            this.notifications = [];
            this.reminders = [];
            this.institutionalCommitments = [];
        }
    }

    /**
     * Save notifications to localStorage
     */
    saveNotifications() {
        try {
            localStorage.setItem('notifications', JSON.stringify(this.notifications));
            localStorage.setItem('reminders', JSON.stringify(this.reminders));
            localStorage.setItem('institutionalCommitments', JSON.stringify(this.institutionalCommitments));
        } catch (error) {
            console.error('Error saving notifications:', error);
        }
    }

    /**
     * Initialize auto-check system
     */
    startAutoCheck() {
        // Check immediately
        this.checkAndGenerateNotifications();
        
        // Check every hour
        this.autoCheckInterval = setInterval(() => {
            this.checkAndGenerateNotifications();
        }, 60 * 60 * 1000); // 1 hour
    }

    /**
     * Stop auto-check system
     */
    stopAutoCheck() {
        if (this.autoCheckInterval) {
            clearInterval(this.autoCheckInterval);
            this.autoCheckInterval = null;
        }
    }

    /**
     * Main notification generation logic
     */
    async checkAndGenerateNotifications() {
        try {
            // Generate day-after reminders
            await this.generateDayAfterReminders();
            
            // Check institutional commitments
            await this.checkInstitutionalCommitments();
            
            // Check activity deadlines
            await this.checkActivityDeadlines();
            
            // Clean old notifications
            this.cleanOldNotifications();
            
            // Save
            this.saveNotifications();
            
            // Update UI if available
            if (window.app && window.app.renderNotifications) {
                window.app.renderNotifications();
            }
            
        } catch (error) {
            console.error('Error generating notifications:', error);
        }
    }

    /**
     * Generate day-after reminders for completed lessons
     */
    async generateDayAfterReminders() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // Find lessons from yesterday
        const yesterdayLessons = state.lessons.filter(lesson => {
            return lesson.date === yesterdayStr;
        });

        yesterdayLessons.forEach(lesson => {
            // Check if we already created a reminder for this lesson
            const exists = this.reminders.find(r => 
                r.type === 'day_after' && 
                r.lessonId === lesson.id
            );

            if (!exists) {
                // Create day-after reminder
                const reminder = {
                    id: `reminder_${Date.now()}_${lesson.id}`,
                    type: 'day_after',
                    lessonId: lesson.id,
                    title: `Revisione Lezione: ${lesson.title}`,
                    message: `Ricordati di verificare se gli studenti hanno compreso gli argomenti della lezione di ieri.`,
                    classId: lesson.classId,
                    date: yesterdayStr,
                    createdAt: new Date().toISOString(),
                    priority: 'medium',
                    status: 'active',
                    actions: [
                        {
                            label: 'Aggiungi Nota',
                            action: 'add_note',
                            lessonId: lesson.id
                        },
                        {
                            label: 'Programma Follow-up',
                            action: 'schedule_followup',
                            lessonId: lesson.id
                        }
                    ]
                };

                this.reminders.push(reminder);
                
                // Create notification
                this.createNotification({
                    title: '📅 Promemoria Giorno Dopo',
                    message: reminder.message,
                    type: 'day_after',
                    priority: 'medium',
                    relatedId: lesson.id
                });
            }
        });
    }

    /**
     * Check and notify about institutional commitments
     */
    async checkInstitutionalCommitments() {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentDay = today.getDate();

        // Predefined institutional commitments (Italian school calendar)
        const defaultCommitments = [
            {
                name: 'Scrutini Primo Quadrimestre',
                month: 1, // February
                dayStart: 1,
                dayEnd: 15,
                priority: 'high',
                daysBeforeNotify: 7
            },
            {
                name: 'Consigli di Classe - Primo Periodo',
                month: 10, // November
                dayStart: 15,
                dayEnd: 30,
                priority: 'medium',
                daysBeforeNotify: 5
            },
            {
                name: 'Scrutini Finali',
                month: 5, // June
                dayStart: 1,
                dayEnd: 15,
                priority: 'critical',
                daysBeforeNotify: 10
            },
            {
                name: 'Colloqui con le Famiglie',
                month: 11, // December
                dayStart: 10,
                dayEnd: 20,
                priority: 'medium',
                daysBeforeNotify: 7
            },
            {
                name: 'Colloqui con le Famiglie',
                month: 3, // April
                dayStart: 10,
                dayEnd: 20,
                priority: 'medium',
                daysBeforeNotify: 7
            }
        ];

        // Merge with custom commitments
        const allCommitments = [
            ...defaultCommitments,
            ...this.institutionalCommitments
        ];

        allCommitments.forEach(commitment => {
            if (commitment.month === currentMonth) {
                const daysUntilStart = commitment.dayStart - currentDay;
                
                // Notify if within notification window
                if (daysUntilStart > 0 && daysUntilStart <= commitment.daysBeforeNotify) {
                    // Check if already notified
                    const exists = this.notifications.find(n => 
                        n.type === 'institutional' && 
                        n.commitmentName === commitment.name &&
                        n.month === currentMonth
                    );

                    if (!exists) {
                        this.createNotification({
                            title: '🏫 Impegno Istituzionale Imminente',
                            message: `${commitment.name} tra ${daysUntilStart} giorni (${commitment.dayStart}-${commitment.dayEnd} del mese)`,
                            type: 'institutional',
                            priority: commitment.priority,
                            commitmentName: commitment.name,
                            month: currentMonth,
                            actions: [
                                {
                                    label: 'Prepara Documentazione',
                                    action: 'prepare_docs'
                                }
                            ]
                        });
                    }
                }
            }
        });
    }

    /**
     * Check activity deadlines
     */
    async checkActivityDeadlines() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        state.activities.forEach(activity => {
            if (activity.status === 'completed') return;

            const activityDate = new Date(activity.date);
            activityDate.setHours(0, 0, 0, 0);
            
            const daysUntil = Math.floor((activityDate - today) / (1000 * 60 * 60 * 24));

            // Notify 3 days before, 1 day before, and on due date
            const notifyDays = [3, 1, 0];
            
            if (notifyDays.includes(daysUntil)) {
                // Check if already notified for this day
                const exists = this.notifications.find(n => 
                    n.type === 'activity_deadline' && 
                    n.activityId === activity.id &&
                    n.daysUntil === daysUntil
                );

                if (!exists) {
                    let message = '';
                    let priority = 'low';

                    if (daysUntil === 0) {
                        message = `Scadenza OGGI: ${activity.title}`;
                        priority = 'critical';
                    } else if (daysUntil === 1) {
                        message = `Scadenza domani: ${activity.title}`;
                        priority = 'high';
                    } else {
                        message = `Scadenza tra ${daysUntil} giorni: ${activity.title}`;
                        priority = 'medium';
                    }

                    this.createNotification({
                        title: '⏰ Scadenza Attività',
                        message: message,
                        type: 'activity_deadline',
                        priority: priority,
                        activityId: activity.id,
                        daysUntil: daysUntil,
                        actions: [
                            {
                                label: 'Visualizza Attività',
                                action: 'view_activity',
                                activityId: activity.id
                            }
                        ]
                    });
                }
            }
        });
    }

    /**
     * Create a new notification
     */
    createNotification(notificationData) {
        const notification = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: notificationData.title,
            message: notificationData.message,
            type: notificationData.type,
            priority: notificationData.priority || 'medium',
            createdAt: new Date().toISOString(),
            read: false,
            dismissed: false,
            actions: notificationData.actions || [],
            ...notificationData
        };

        this.notifications.push(notification);
        
        // Show toast for high/critical priority
        if (['high', 'critical'].includes(notification.priority)) {
            showToast(notification.message, 'warning', 5000);
        }

        return notification;
    }

    /**
     * Add custom institutional commitment
     */
    addInstitutionalCommitment(commitment) {
        const newCommitment = {
            id: `commit_${Date.now()}`,
            name: commitment.name,
            month: commitment.month,
            dayStart: commitment.dayStart,
            dayEnd: commitment.dayEnd,
            priority: commitment.priority || 'medium',
            daysBeforeNotify: commitment.daysBeforeNotify || 7,
            custom: true,
            createdAt: new Date().toISOString()
        };

        this.institutionalCommitments.push(newCommitment);
        this.saveNotifications();
        
        showToast('Impegno istituzionale aggiunto', 'success');
        
        return newCommitment;
    }

    /**
     * Mark notification as read
     */
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
        }
    }

    /**
     * Dismiss notification
     */
    dismissNotification(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.dismissed = true;
            this.saveNotifications();
        }
    }

    /**
     * Clean old notifications (older than 30 days)
     */
    cleanOldNotifications() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        this.notifications = this.notifications.filter(n => {
            const createdAt = new Date(n.createdAt);
            return createdAt > thirtyDaysAgo || !n.dismissed;
        });

        this.reminders = this.reminders.filter(r => {
            const createdAt = new Date(r.createdAt);
            return createdAt > thirtyDaysAgo || r.status === 'active';
        });
    }

    /**
     * Get active notifications
     */
    getActiveNotifications() {
        return this.notifications
            .filter(n => !n.dismissed)
            .sort((a, b) => {
                // Sort by priority then date
                const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
                const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
                
                if (priorityDiff !== 0) return priorityDiff;
                
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
    }

    /**
     * Get unread count
     */
    getUnreadCount() {
        return this.notifications.filter(n => !n.read && !n.dismissed).length;
    }

    /**
     * Get notifications by type
     */
    getNotificationsByType(type) {
        return this.notifications.filter(n => n.type === type && !n.dismissed);
    }

    /**
     * Get notifications by priority
     */
    getNotificationsByPriority(priority) {
        return this.notifications.filter(n => n.priority === priority && !n.dismissed);
    }

    /**
     * Handle notification action
     */
    async handleAction(notificationId, action) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification) return;

        switch (action.action) {
            case 'view_activity':
                if (window.app) {
                    window.app.switchTab('activities');
                    // TODO: Highlight specific activity
                }
                break;
                
            case 'add_note':
                // TODO: Open note dialog
                showToast('Funzionalità note in sviluppo', 'info');
                break;
                
            case 'schedule_followup':
                // TODO: Open schedule dialog
                showToast('Funzionalità follow-up in sviluppo', 'info');
                break;
                
            case 'prepare_docs':
                showToast('Promemoria impostato per preparazione documentazione', 'info');
                break;
                
            default:
                console.log('Unknown action:', action);
        }

        // Mark as read after action
        this.markAsRead(notificationId);
    }

    /**
     * Generate notification HTML
     */
    generateNotificationHTML() {
        const activeNotifications = this.getActiveNotifications();
        
        if (activeNotifications.length === 0) {
            return '<div class="notifications-empty"><p>📭 Nessuna notifica</p></div>';
        }

        let html = '<div class="notifications-list">';
        
        activeNotifications.forEach(notification => {
            const priorityClass = `priority-${notification.priority}`;
            const readClass = notification.read ? 'read' : 'unread';
            const iconMap = {
                'day_after': '📅',
                'institutional': '🏫',
                'activity_deadline': '⏰',
                'reminder': '🔔'
            };
            const icon = iconMap[notification.type] || '📢';

            html += `
                <div class="notification-item ${priorityClass} ${readClass}" data-id="${notification.id}">
                    <div class="notification-header">
                        <span class="notification-icon">${icon}</span>
                        <h4>${notification.title}</h4>
                        <button class="btn-icon btn-dismiss" onclick="window.notificationSystem.dismissNotification('${notification.id}')" title="Ignora">
                            ✕
                        </button>
                    </div>
                    <p class="notification-message">${notification.message}</p>
                    <div class="notification-meta">
                        <span class="notification-time">${this.formatTime(notification.createdAt)}</span>
                        <span class="notification-priority-badge">${this.formatPriority(notification.priority)}</span>
                    </div>
                    ${notification.actions && notification.actions.length > 0 ? `
                        <div class="notification-actions">
                            ${notification.actions.map(action => `
                                <button class="btn btn-sm btn-secondary" onclick="window.notificationSystem.handleAction('${notification.id}', ${JSON.stringify(action).replace(/"/g, '&quot;')})">
                                    ${action.label}
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        });

        html += '</div>';
        
        return html;
    }

    formatTime(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Adesso';
        if (diffMins < 60) return `${diffMins}m fa`;
        if (diffHours < 24) return `${diffHours}h fa`;
        if (diffDays < 7) return `${diffDays}g fa`;
        
        return date.toLocaleDateString('it-IT');
    }

    formatPriority(priority) {
        const labels = {
            'critical': '🔴 Critico',
            'high': '🟠 Alto',
            'medium': '🟡 Medio',
            'low': '🟢 Basso'
        };
        return labels[priority] || priority;
    }
}

// Create singleton instance
export const notificationSystem = new NotificationSystem();

// Make available globally
if (typeof window !== 'undefined') {
    window.notificationSystem = notificationSystem;
}

// Auto-start on load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        notificationSystem.startAutoCheck();
    });
}
