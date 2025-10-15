// theme.js - Theme management for Docente++

const THEME_STORAGE_KEY = 'docente-plus-plus-theme';
const THEME_AUTO = 'auto';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

/**
 * Get the current theme preference from localStorage
 * @returns {string} The current theme ('light', 'dark', or 'auto')
 */
export function getThemePreference() {
    return localStorage.getItem(THEME_STORAGE_KEY) || THEME_AUTO;
}

/**
 * Save the theme preference to localStorage
 * @param {string} theme - The theme to save ('light', 'dark', or 'auto')
 */
export function saveThemePreference(theme) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * Get the system color scheme preference
 * @returns {string} 'light' or 'dark'
 */
function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return THEME_DARK;
    }
    return THEME_LIGHT;
}

/**
 * Apply the theme to the document
 * @param {string} theme - The theme to apply ('light', 'dark', or 'auto')
 */
export function applyTheme(theme) {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove existing theme classes
    root.classList.remove('light-theme', 'dark-theme');
    body.classList.remove('light-theme', 'dark-theme');
    
    let effectiveTheme;
    if (theme === THEME_AUTO) {
        effectiveTheme = getSystemTheme();
    } else {
        effectiveTheme = theme;
    }
    
    // Apply the effective theme
    if (effectiveTheme === THEME_DARK) {
        root.classList.add('dark-theme');
        body.classList.add('dark-theme');
    } else {
        root.classList.add('light-theme');
        body.classList.add('light-theme');
    }
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        const primaryColor = effectiveTheme === THEME_DARK ? '#4F378B' : '#6750A4';
        metaThemeColor.setAttribute('content', primaryColor);
    }
}

/**
 * Initialize the theme system
 */
export function initializeTheme() {
    const savedTheme = getThemePreference();
    applyTheme(savedTheme);
    
    // Listen for system theme changes if auto mode is selected
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            const currentTheme = getThemePreference();
            if (currentTheme === THEME_AUTO) {
                applyTheme(THEME_AUTO);
            }
        });
    }
}

/**
 * Setup the theme picker dialog
 */
export function setupThemePicker() {
    const dialog = document.getElementById('theme-picker-dialog');
    const openButton = document.getElementById('theme-picker-btn');
    const form = document.getElementById('theme-picker-form');
    const cancelBtn = document.getElementById('theme-cancel-btn');
    const applyBtn = document.getElementById('theme-apply-btn');
    
    if (!dialog || !openButton || !form) {
        console.error('Theme picker elements not found');
        return;
    }
    
    // Open dialog when button is clicked
    openButton.addEventListener('click', () => {
        // Set current theme in radio buttons
        const currentTheme = getThemePreference();
        const radioToCheck = document.getElementById(`theme-${currentTheme}`);
        if (radioToCheck) {
            radioToCheck.checked = true;
        }
        dialog.style.display = 'flex';
        
        // Focus the apply button
        setTimeout(() => applyBtn.focus(), 100);
    });
    
    // Close dialog function
    const closeDialog = () => {
        dialog.style.display = 'none';
    };
    
    // Handle cancel button
    cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeDialog();
    });
    
    // Handle form submit (apply button)
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get selected theme from radio buttons
        const selectedRadio = form.querySelector('input[name="theme"]:checked');
        if (selectedRadio) {
            const selectedTheme = selectedRadio.value;
            saveThemePreference(selectedTheme);
            applyTheme(selectedTheme);
            
            // Show confirmation toast
            if (window.showToast) {
                const themeNames = {
                    light: 'Chiaro',
                    dark: 'Scuro',
                    auto: 'Automatico'
                };
                window.showToast(`Tema ${themeNames[selectedTheme]} applicato`, 'success');
            }
        }
        
        closeDialog();
    });
    
    // Close on backdrop click
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            closeDialog();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dialog.style.display === 'flex') {
            closeDialog();
        }
    });
}
