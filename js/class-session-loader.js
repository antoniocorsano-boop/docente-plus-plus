/**
 * class-session-loader.js
 * Loads the class-session module and exposes functions globally
 */
import { 
  setActiveSessionClass, 
  getActiveSessionClass, 
  clearActiveSessionClass,
  loadActiveSessionClassFromStorage 
} from '../src/js/class-session.js';

// Expose functions globally for non-module scripts
window.setActiveSessionClass = setActiveSessionClass;
window.getActiveSessionClass = getActiveSessionClass;
window.clearActiveSessionClass = clearActiveSessionClass;
window.loadActiveSessionClassFromStorage = loadActiveSessionClassFromStorage;
