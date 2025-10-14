
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

export function loadData() {
    state.settings = JSON.parse(localStorage.getItem('settings')) || {};
    state.classes = JSON.parse(localStorage.getItem('classes')) || [];
    state.students = JSON.parse(localStorage.getItem('students')) || [];
    state.lessons = JSON.parse(localStorage.getItem('lessons')) || [];
    state.activities = JSON.parse(localStorage.getItem('activities')) || [];
    state.evaluations = JSON.parse(localStorage.getItem('evaluations')) || [];
    state.schedule = JSON.parse(localStorage.getItem('schedule')) || {};
    state.chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    state.activeClass = localStorage.getItem('activeClass') || null;
}

export function saveData() {
    localStorage.setItem('settings', JSON.stringify(state.settings));
    localStorage.setItem('classes', JSON.stringify(state.classes));
    localStorage.setItem('students', JSON.stringify(state.students));
    localStorage.setItem('lessons', JSON.stringify(state.lessons));
    localStorage.setItem('activities', JSON.stringify(state.activities));
    localStorage.setItem('evaluations', JSON.stringify(state.evaluations));
    localStorage.setItem('schedule', JSON.stringify(state.schedule));
    localStorage.setItem('chatMessages', JSON.stringify(state.chatMessages));
    localStorage.setItem('activeClass', state.activeClass);
}

export function isOnboardingComplete() {
    return localStorage.getItem('onboardingComplete') === 'true';
}

export function completeOnboarding(settings) {
    state.settings = settings;
    localStorage.setItem('onboardingComplete', 'true');
    saveData();
}
