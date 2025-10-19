# 🎨 Theme System Documentation

## Overview

Docente++ uses a comprehensive Material Design 3 (MD3) theme system with support for light/dark modes and multiple color palettes. The theme system is built with vanilla JavaScript and CSS custom properties (CSS variables).

## Table of Contents

- [Architecture](#architecture)
- [Color Palettes](#color-palettes)
- [Using the Theme System](#using-the-theme-system)
- [Extending Palettes](#extending-palettes)
- [MD3 System Properties](#md3-system-properties)
- [Theme Context Pattern](#theme-context-pattern)
- [Best Practices](#best-practices)

---

## Architecture

### Components

The theme system consists of three main components:

1. **CSS Variables** (`styles.css`, `schedule-theme.css`)
   - Define MD3 system color properties
   - Provide light and dark theme variants
   - Use semantic naming for maintainability

2. **Theme Manager** (`js/theme.js`)
   - Manages theme state in localStorage
   - Applies color palettes dynamically
   - Handles system preference detection
   - Provides API for theme operations

3. **Theme Switcher UI** (`index.html`)
   - User interface for theme selection
   - Live preview of theme changes
   - Radio button groups for mode and color selection

### Theme Modes

The system supports three theme modes:

- **Light**: Bright theme for well-lit environments
- **Dark**: Dark theme to reduce eye strain
- **Auto** (Dynamic): Follows system preferences automatically

---

## Color Palettes

Docente++ includes 9 expressive color palettes:

| Palette  | Italian Name | Light Primary | Dark Primary | Use Case                  |
|----------|--------------|---------------|--------------|---------------------------|
| purple   | Viola        | `#6750A4`     | `#D0BCFF`    | Default, professional     |
| lilla    | Lilla        | `#9C27B0`     | `#CE93D8`    | Creative, expressive      |
| blue     | Blu          | `#1976D2`     | `#90CAF9`    | Trust, corporate          |
| teal     | Teal         | `#00796B`     | `#4DB6AC`    | Balance, calm             |
| green    | Verde        | `#388E3C`     | `#81C784`    | Nature, growth            |
| orange   | Arancione    | `#EF6C00`     | `#FFB74D`    | Energy, enthusiasm        |
| pink     | Rosa         | `#C2185B`     | `#F06292`    | Warmth, playfulness       |
| red      | Rosso        | `#C62828`     | `#EF5350`    | Urgency, importance       |
| indigo   | Indigo       | `#303F9F`     | `#7986CB`    | Stability, depth          |

Each palette includes:
- Primary color
- Primary container color
- On-primary color (text on primary)
- On-primary-container color (text on container)

---

## Using the Theme System

### Importing the Theme Module

```javascript
import { 
    initializeTheme, 
    applyTheme, 
    getThemePreference, 
    saveThemePreference,
    getThemeColorPreference,
    saveThemeColorPreference,
    setupThemePicker 
} from './js/theme.js';
```

### Initialize Theme on Page Load

```javascript
// Initialize theme system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupThemePicker();
});
```

### Change Theme Programmatically

```javascript
// Change theme mode
applyTheme('dark');
saveThemePreference('dark');

// Change color palette
applyTheme('light', 'teal');
saveThemeColorPreference('teal');
```

### Get Current Theme

```javascript
const currentTheme = getThemePreference(); // 'light', 'dark', or 'auto'
const currentColor = getThemeColorPreference(); // 'purple', 'blue', etc.
```

### Using MD3 Colors in CSS

Always use MD3 system properties instead of hardcoded colors:

```css
/* ✅ Good - Uses MD3 system properties */
.my-component {
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    border: 1px solid var(--md-sys-color-outline);
}

/* ❌ Bad - Hardcoded colors */
.my-component {
    background: #6750A4;
    color: white;
    border: 1px solid #ddd;
}
```

### Using MD3 Colors in JavaScript

```javascript
// Get computed value of a CSS variable
const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--md-sys-color-primary');

// Set a CSS variable
document.documentElement.style
    .setProperty('--md-sys-color-primary', '#FF5722');
```

---

## Extending Palettes

### Adding a New Color Palette

To add a new color palette, follow these steps:

#### 1. Add Palette to `js/theme.js`

```javascript
const COLOR_PALETTES = {
    // ... existing palettes ...
    
    // New palette
    cyan: {
        name: 'Ciano',
        light: {
            primary: '#00BCD4',
            primaryContainer: '#B2EBF2',
            onPrimary: '#FFFFFF',
            onPrimaryContainer: '#006064'
        },
        dark: {
            primary: '#4DD0E1',
            primaryContainer: '#00838F',
            onPrimary: '#006064',
            onPrimaryContainer: '#B2EBF2'
        }
    }
};
```

#### 2. Add UI Option in `index.html`

Find the theme color options section and add:

```html
<label class="theme-color-option">
    <input type="radio" name="themeColor" value="cyan" id="color-cyan">
    <span class="theme-color-swatch" style="background: #00BCD4;" title="Ciano"></span>
</label>
```

#### 3. Add Color Name Translation

In `js/theme.js`, add to the `colorNames` object:

```javascript
const colorNames = {
    // ... existing names ...
    cyan: 'Ciano'
};
```

### Palette Design Guidelines

When creating a new palette, follow these MD3 guidelines:

1. **Sufficient Contrast**: Ensure text is readable on all surfaces
   - Primary on On-Primary: minimum 4.5:1 contrast ratio
   - On-Surface on Surface: minimum 4.5:1 contrast ratio

2. **Color Harmony**: Choose colors that work well together
   - Use complementary or analogous color relationships
   - Consider color psychology for the use case

3. **Accessibility**: Test with color blindness simulators
   - Don't rely solely on color to convey information
   - Provide sufficient contrast for WCAG AA compliance

4. **Dark Theme**: Create appropriate dark theme variants
   - Light versions of primary colors work better
   - Reduce saturation for dark backgrounds
   - Maintain sufficient contrast

---

## MD3 System Properties

### Primary System Colors

```css
/* Light Theme (defined in :root) */
--md-sys-color-primary: #6750A4;
--md-sys-color-primary-container: #EADDFF;
--md-sys-color-on-primary: #FFFFFF;
--md-sys-color-on-primary-container: #21005D;

/* Dark Theme (defined in :root.dark-theme) */
--md-sys-color-primary: #D0BCFF;
--md-sys-color-primary-container: #4F378B;
--md-sys-color-on-primary: #371E73;
--md-sys-color-on-primary-container: #EADDFF;
```

### Surface System Colors

```css
--md-sys-color-surface: #FEF7FF;
--md-sys-color-surface-container: #F3EDF7;
--md-sys-color-surface-container-low: #F7F2FA;
--md-sys-color-surface-container-high: #ECE6F0;
--md-sys-color-on-surface: #1C1B1F;
--md-sys-color-on-surface-variant: #49454F;
```

### Semantic Colors

```css
--md-sys-color-error: #BA1A1A;
--md-sys-color-success: #4caf50;
--md-sys-color-warning: #ff9800;
--md-sys-color-info: #2196f3;
```

### Legacy Aliases

For backwards compatibility, legacy properties are aliased:

```css
--md-primary: var(--md-sys-color-primary);
--md-surface: var(--md-sys-color-surface);
--md-on-surface: var(--md-sys-color-on-surface);
```

**Note**: New code should use MD3 system properties (`--md-sys-color-*`).

---

## Theme Context Pattern

### Vanilla JS Theme Context

Docente++ implements a theme context pattern using vanilla JavaScript and localStorage:

```javascript
// Theme state is stored in localStorage
const THEME_STORAGE_KEY = 'docente-plus-plus-theme';
const THEME_COLOR_STORAGE_KEY = 'docente-plus-plus-theme-color';

// Get current theme state
function getThemeState() {
    return {
        mode: localStorage.getItem(THEME_STORAGE_KEY) || 'auto',
        color: localStorage.getItem(THEME_COLOR_STORAGE_KEY) || 'purple'
    };
}

// Update theme state
function setThemeState(mode, color) {
    if (mode) localStorage.setItem(THEME_STORAGE_KEY, mode);
    if (color) localStorage.setItem(THEME_COLOR_STORAGE_KEY, color);
    applyTheme(mode, color);
}
```

### Theme Context Hook Pattern (for components)

Create a theme context hook for consistent access:

```javascript
// themeContext.js
export function useTheme() {
    return {
        mode: getThemePreference(),
        color: getThemeColorPreference(),
        setMode: (mode) => {
            saveThemePreference(mode);
            applyTheme(mode);
        },
        setColor: (color) => {
            saveThemeColorPreference(color);
            applyTheme(getThemePreference(), color);
        }
    };
}
```

### Component Integration Example

```javascript
// Example component using theme context
class MyComponent {
    constructor() {
        this.theme = useTheme();
        this.render();
        
        // Listen for theme changes
        window.addEventListener('storage', (e) => {
            if (e.key === THEME_STORAGE_KEY || e.key === THEME_COLOR_STORAGE_KEY) {
                this.theme = useTheme();
                this.render();
            }
        });
    }
    
    render() {
        // Use theme.mode and theme.color
        console.log(`Current theme: ${this.theme.mode}, Color: ${this.theme.color}`);
    }
}
```

---

## Best Practices

### DO ✅

1. **Always use MD3 system properties** for colors
   ```css
   background: var(--md-sys-color-primary);
   ```

2. **Use semantic color names** rather than specific colors
   ```css
   color: var(--md-sys-color-error); /* Not: color: red; */
   ```

3. **Test in both light and dark modes**
   - Check contrast ratios
   - Verify readability
   - Test with real content

4. **Use the theme context pattern** for component state
   ```javascript
   const theme = useTheme();
   ```

5. **Follow Material Design 3 guidelines**
   - Use proper elevation
   - Respect spacing systems
   - Follow typography scale

### DON'T ❌

1. **Don't hardcode colors**
   ```css
   /* ❌ Avoid */
   background: #6750A4;
   
   /* ✅ Use instead */
   background: var(--md-sys-color-primary);
   ```

2. **Don't override theme colors inline**
   ```html
   <!-- ❌ Avoid -->
   <div style="color: blue;">
   
   <!-- ✅ Use CSS classes -->
   <div class="text-primary">
   ```

3. **Don't create custom color variables** outside the system
   ```css
   /* ❌ Avoid */
   --my-custom-blue: #1976D2;
   
   /* ✅ Use MD3 properties */
   --md-sys-color-primary: #1976D2;
   ```

4. **Don't mix theme systems**
   - Stick to MD3 system properties
   - Don't mix with other design systems

5. **Don't ignore accessibility**
   - Always check contrast ratios
   - Test with screen readers
   - Support keyboard navigation

---

## Theme Switcher UI

### Live Preview Feature

The theme switcher includes a live preview that updates in real-time:

```html
<div class="theme-preview-container" id="theme-preview">
    <!-- Preview updates automatically when theme/color changes -->
</div>
```

The preview shows:
- Sample cards with primary colors
- Button styles (primary and secondary)
- Text samples (primary and secondary)
- Surface colors with icons

### User Flow

1. User clicks theme icon in header or sidebar
2. Theme picker modal opens
3. User selects theme mode (light/dark/auto)
4. User selects color palette
5. Preview updates in real-time
6. User clicks "Applica" to save changes

---

## Testing Themes

### Manual Testing Checklist

- [ ] Test all 9 color palettes
- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Test auto mode with system light
- [ ] Test auto mode with system dark
- [ ] Verify preview updates correctly
- [ ] Check contrast ratios (WCAG AA)
- [ ] Test on mobile devices
- [ ] Verify localStorage persistence
- [ ] Test theme transitions

### Automated Testing

Theme system tests can be added to the test suite:

```javascript
import { applyTheme, getThemePreference } from './js/theme.js';

describe('Theme System', () => {
    test('applies light theme', () => {
        applyTheme('light', 'purple');
        expect(document.documentElement.classList.contains('light-theme')).toBe(true);
    });
    
    test('stores theme preference', () => {
        saveThemePreference('dark');
        expect(getThemePreference()).toBe('dark');
    });
});
```

---

## Migration from Legacy Code

### Converting Old Theme Code

**Before:**
```javascript
// Old theme.js approach
function setTheme(isDark) {
    document.body.classList.toggle('dark', isDark);
}
```

**After:**
```javascript
// New MD3 approach
import { applyTheme, saveThemePreference } from './js/theme.js';

function setTheme(isDark) {
    const mode = isDark ? 'dark' : 'light';
    applyTheme(mode);
    saveThemePreference(mode);
}
```

### Converting CSS

**Before:**
```css
.card {
    background: #ffffff;
    color: #333333;
}

body.dark .card {
    background: #1a1a1a;
    color: #e0e0e0;
}
```

**After:**
```css
.card {
    background: var(--md-sys-color-surface-container);
    color: var(--md-sys-color-on-surface);
}
/* Dark theme handled automatically by CSS variables */
```

---

## Troubleshooting

### Theme Not Applying

1. Check console for errors
2. Verify theme.js is loaded as ES6 module
3. Ensure initializeTheme() is called
4. Check if localStorage is available

### Preview Not Updating

1. Verify theme-preview element exists in DOM
2. Check if event listeners are attached
3. Inspect console for JavaScript errors

### Colors Look Wrong

1. Verify MD3 system properties are defined
2. Check if both light and dark variants exist
3. Ensure no inline styles override colors
4. Clear browser cache

### Theme Not Persisting

1. Check localStorage permissions
2. Verify storage keys are correct
3. Test in incognito mode
4. Check for conflicting scripts

---

## Resources

- [Material Design 3 Guidelines](https://m3.material.io/)
- [Color System](https://m3.material.io/styles/color/overview)
- [Design Tokens Documentation](./DESIGN_TOKENS.md)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Last Updated:** 2025-10-19  
**Version:** 2.0.0  
**Maintainers:** Docente++ Team
