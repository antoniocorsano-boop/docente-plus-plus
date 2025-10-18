/**
 * class-session.js - Helper module for managing active class session
 * Uses sessionStorage to persist the active class session between pages
 */

const STORAGE_KEY = 'activeSessionClass';
const EVENT_NAME = 'activeSessionClassChanged';

/**
 * Set the active session class and persist it to sessionStorage
 * @param {Object} classData - The class data to set as active
 * @param {string} classData.classId - The class ID (e.g., "3A")
 * @param {string} classData.className - The class name (e.g., "Classe 3A")
 * @param {string} classData.subject - The subject (e.g., "Matematica")
 * @param {string} [classData.day] - The day of the lesson
 * @param {string} [classData.time] - The time of the lesson
 * @param {string} [classData.activityType] - The activity type
 * @param {string} [classData.lessonKey] - The lesson key
 */
export function setActiveSessionClass(classData) {
  if (!classData) {
    console.warn('class-session: setActiveSessionClass called with no data');
    return;
  }

  try {
    // Store in sessionStorage
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(classData));
    
    // Dispatch custom event for listeners
    const event = new CustomEvent(EVENT_NAME, {
      detail: classData,
      bubbles: true
    });
    window.dispatchEvent(event);
    
    console.debug('class-session: Active session class set:', classData);
  } catch (e) {
    console.error('class-session: Failed to set active session class:', e);
  }
}

/**
 * Load the active session class from sessionStorage
 * @returns {Object|null} The active session class data, or null if not set
 */
export function loadActiveSessionClassFromStorage() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }
    
    const classData = JSON.parse(stored);
    console.debug('class-session: Loaded active session class:', classData);
    return classData;
  } catch (e) {
    console.error('class-session: Failed to load active session class:', e);
    return null;
  }
}

/**
 * Clear the active session class
 */
export function clearActiveSessionClass() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    
    // Dispatch event with null detail
    const event = new CustomEvent(EVENT_NAME, {
      detail: null,
      bubbles: true
    });
    window.dispatchEvent(event);
    
    console.debug('class-session: Active session class cleared');
  } catch (e) {
    console.error('class-session: Failed to clear active session class:', e);
  }
}

/**
 * Get the storage key and event name for external use
 */
export const ClassSessionConstants = {
  STORAGE_KEY,
  EVENT_NAME
};
