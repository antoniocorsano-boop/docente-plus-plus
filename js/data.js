
// js/data.js

export const state = {
    settings: {},
    classes: [],
    students: [],
    lessons: [],
    activities: [],
    evaluations: [],
    schedule: {},
    chatMessages: [],
    activeClass: null,
};

// Safe JSON parse with fallback
function safeJSONParse(value, fallback) {
    if (!value) return fallback;
    try {
        const parsed = JSON.parse(value);
        // Validate that parsed data matches expected type
        if (Array.isArray(fallback)) {
            return Array.isArray(parsed) ? parsed : fallback;
        } else if (typeof fallback === 'object') {
            return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : fallback;
        }
        return parsed;
    } catch (error) {
        console.warn('Failed to parse localStorage item:', error);
        return fallback;
    }
}

export function loadData() {
    try {
        state.settings = safeJSONParse(localStorage.getItem('settings'), {});
        state.classes = safeJSONParse(localStorage.getItem('classes'), []);
        state.students = safeJSONParse(localStorage.getItem('students'), []);
        state.lessons = safeJSONParse(localStorage.getItem('lessons'), []);
        state.activities = safeJSONParse(localStorage.getItem('activities'), []);
        state.evaluations = safeJSONParse(localStorage.getItem('evaluations'), []);
        state.schedule = safeJSONParse(localStorage.getItem('schedule'), {});
        state.chatMessages = safeJSONParse(localStorage.getItem('chatMessages'), []);
        state.activeClass = localStorage.getItem('activeClass') || null;
        
        // Validate activeClass exists in classes array
        if (state.activeClass && !state.classes.find(c => c.id === state.activeClass)) {
            console.warn('Active class not found in classes array, resetting');
            state.activeClass = null;
        }
        
        return true;
    } catch (error) {
        console.error('Critical error loading data:', error);
        // Reset to defaults if data is completely corrupted
        resetToDefaults();
        return false;
    }
}

export function saveData() {
    try {
        localStorage.setItem('settings', JSON.stringify(state.settings));
        localStorage.setItem('classes', JSON.stringify(state.classes));
        localStorage.setItem('students', JSON.stringify(state.students));
        localStorage.setItem('lessons', JSON.stringify(state.lessons));
        localStorage.setItem('activities', JSON.stringify(state.activities));
        localStorage.setItem('evaluations', JSON.stringify(state.evaluations));
        localStorage.setItem('schedule', JSON.stringify(state.schedule));
        localStorage.setItem('chatMessages', JSON.stringify(state.chatMessages));
        localStorage.setItem('activeClass', state.activeClass);
        return true;
    } catch (error) {
        console.error('Error saving data to localStorage:', error);
        // Could be quota exceeded or other storage error
        return false;
    }
}

export function isOnboardingComplete() {
    return localStorage.getItem('onboardingComplete') === 'true';
}

export function completeOnboarding(settings) {
    state.settings = settings;
    localStorage.setItem('onboardingComplete', 'true');
    saveData();
}

export function skipOnboarding() {
    // Allow users to skip onboarding and use app with minimal config
    localStorage.setItem('onboardingComplete', 'true');
    state.settings = {
        teacherName: 'Docente',
        teacherLastName: '',
        schoolYear: new Date().getFullYear() + '/' + (new Date().getFullYear() + 1)
    };
    saveData();
}

export function resetToDefaults() {
    // Reset all state to defaults
    state.settings = {};
    state.classes = [];
    state.students = [];
    state.lessons = [];
    state.activities = [];
    state.evaluations = [];
    state.schedule = {};
    state.chatMessages = [];
    state.activeClass = null;
    
    console.warn('State reset to defaults due to corrupted data');
}

export function clearAllData() {
    // Clear all app data - for troubleshooting
    try {
        localStorage.clear();
        resetToDefaults();
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

export function checkStorageHealth() {
    // Check if localStorage is accessible and working
    try {
        const testKey = '__docente_storage_test__';
        localStorage.setItem(testKey, 'test');
        const value = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        return value === 'test';
    } catch (error) {
        console.error('localStorage is not available:', error);
        return false;
    }
}
