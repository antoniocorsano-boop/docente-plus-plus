/**
 * class-session-global.js - Global wrapper for class-session module
 * Makes the class-session functions available globally for non-module scripts
 */
import { 
  setActiveSessionClass, 
  loadActiveSessionClassFromStorage, 
  clearActiveSessionClass,
  ClassSessionConstants
} from '../src/js/class-session.js';

// Expose functions globally
window.setActiveSessionClass = setActiveSessionClass;
window.loadActiveSessionClassFromStorage = loadActiveSessionClassFromStorage;
window.clearActiveSessionClass = clearActiveSessionClass;
window.ClassSessionConstants = ClassSessionConstants;

console.debug('class-session-global: Module functions exposed globally');
