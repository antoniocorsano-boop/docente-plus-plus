/**
 * ThemeProvider - Centralized theme management component
 * Provides theme context and state management for the entire application
 * Similar to React Context API but implemented in vanilla JS
 */

import { 
    initializeTheme, 
    applyTheme, 
    getThemePreference, 
    getThemeColorPreference,
    saveThemePreference,
    saveThemeColorPreference,
    getColorPalettes
} from '../../js/theme.js';

class ThemeProvider {
    constructor() {
        this.listeners = [];
        this.theme = getThemePreference();
        this.color = getThemeColorPreference();
        this.initialized = false;
    }

    /**
     * Initialize the theme provider
     */
    initialize() {
        if (this.initialized) {
            console.warn('ThemeProvider already initialized');
            return;
        }

        initializeTheme();
        this.initialized = true;
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', () => {
                if (this.theme === 'auto') {
                    this.notifyListeners();
                }
            });
        }

        console.log('ThemeProvider initialized with theme:', this.theme, 'color:', this.color);
    }

    /**
     * Get current theme mode
     * @returns {string} Current theme ('light', 'dark', or 'auto')
     */
    getTheme() {
        return this.theme;
    }

    /**
     * Get current color palette
     * @returns {string} Current color palette name
     */
    getColor() {
        return this.color;
    }

    /**
     * Get effective theme (resolved from 'auto' if necessary)
     * @returns {string} Effective theme ('light' or 'dark')
     */
    getEffectiveTheme() {
        if (this.theme === 'auto') {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
            return 'light';
        }
        return this.theme;
    }

    /**
     * Set theme mode
     * @param {string} theme - Theme to set ('light', 'dark', or 'auto')
     */
    setTheme(theme) {
        if (!['light', 'dark', 'auto'].includes(theme)) {
            console.error('Invalid theme:', theme);
            return;
        }

        this.theme = theme;
        saveThemePreference(theme);
        applyTheme(theme, this.color);
        this.notifyListeners();
    }

    /**
     * Set color palette
     * @param {string} color - Color palette name
     */
    setColor(color) {
        const palettes = getColorPalettes();
        if (!palettes[color]) {
            console.error('Invalid color palette:', color);
            return;
        }

        this.color = color;
        saveThemeColorPreference(color);
        applyTheme(this.theme, color);
        this.notifyListeners();
    }

    /**
     * Set both theme and color at once
     * @param {string} theme - Theme to set
     * @param {string} color - Color palette to set
     */
    setThemeAndColor(theme, color) {
        if (!['light', 'dark', 'auto'].includes(theme)) {
            console.error('Invalid theme:', theme);
            return;
        }

        const palettes = getColorPalettes();
        if (!palettes[color]) {
            console.error('Invalid color palette:', color);
            return;
        }

        this.theme = theme;
        this.color = color;
        saveThemePreference(theme);
        saveThemeColorPreference(color);
        applyTheme(theme, color);
        this.notifyListeners();
    }

    /**
     * Subscribe to theme changes
     * @param {Function} listener - Callback function to be called when theme changes
     * @returns {Function} Unsubscribe function
     */
    subscribe(listener) {
        if (typeof listener !== 'function') {
            console.error('Listener must be a function');
            return () => {};
        }

        this.listeners.push(listener);

        // Return unsubscribe function
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    /**
     * Notify all listeners of theme change
     */
    notifyListeners() {
        const state = {
            theme: this.theme,
            color: this.color,
            effectiveTheme: this.getEffectiveTheme()
        };

        this.listeners.forEach(listener => {
            try {
                listener(state);
            } catch (error) {
                console.error('Error in theme listener:', error);
            }
        });
    }

    /**
     * Get available color palettes
     * @returns {Object} Available color palettes
     */
    getAvailablePalettes() {
        return getColorPalettes();
    }

    /**
     * Check if Material Design 3 theme is active
     * This centralizes the isM3 check mentioned in the requirements
     * @returns {boolean} Always true - MD3 is always active in this unified theme
     */
    isM3() {
        return true;
    }

    /**
     * Get theme state for use in components
     * @returns {Object} Current theme state
     */
    getState() {
        return {
            theme: this.theme,
            color: this.color,
            effectiveTheme: this.getEffectiveTheme(),
            isM3: this.isM3(),
            palettes: this.getAvailablePalettes()
        };
    }
}

// Create a singleton instance
const themeProvider = new ThemeProvider();

// Export the singleton instance
export default themeProvider;

// Also export the class for testing or advanced usage
export { ThemeProvider };
