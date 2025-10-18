/**
 * class-session.js
 * Helper module for managing active class session state
 * Uses sessionStorage for persistence within browser session
 */

const ACTIVE_SESSION_KEY = 'activeSessionClass';

/**
 * Set the active session class
 * @param {Object} classData - Object containing class information
 * @param {string} classData.classId - Class ID (e.g., "3A")
 * @param {string} classData.className - Display name (e.g., "Classe 3A")
 * @param {string} classData.subject - Subject name (e.g., "Matematica")
 * @param {string} [classData.day] - Day of week
 * @param {string} [classData.time] - Time slot
 * @param {string} [classData.activityType] - Type of activity
 */
export function setActiveSessionClass(classData) {
  if (!classData || !classData.classId || !classData.subject) {
    console.error('setActiveSessionClass: invalid classData', classData);
    return false;
  }

  try {
    sessionStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(classData));
    
    // Dispatch event for listeners
    window.dispatchEvent(new CustomEvent('activeSessionClassChanged', {
      detail: { classData }
    }));
    
    return true;
  } catch (e) {
    console.error('setActiveSessionClass: failed to save', e);
    return false;
  }
}

/**
 * Get the active session class
 * @returns {Object|null} - Class data or null if not set
 */
export function getActiveSessionClass() {
  try {
    const data = sessionStorage.getItem(ACTIVE_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('getActiveSessionClass: failed to load', e);
    return null;
  }
}

/**
 * Clear the active session class
 */
export function clearActiveSessionClass() {
  try {
    sessionStorage.removeItem(ACTIVE_SESSION_KEY);
    
    // Dispatch event for listeners
    window.dispatchEvent(new CustomEvent('activeSessionClassChanged', {
      detail: { classData: null }
    }));
    
    return true;
  } catch (e) {
    console.error('clearActiveSessionClass: failed', e);
    return false;
  }
}

/**
 * Load active session class from storage (alias for getActiveSessionClass)
 * @returns {Object|null}
 */
export function loadActiveSessionClassFromStorage() {
  return getActiveSessionClass();
}
