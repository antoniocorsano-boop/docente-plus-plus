# Material Design 3 Theme System Documentation

## Overview

Docente++ utilizes a comprehensive Material Design 3 (MD3) Expressive theme system that provides consistent visual design across the entire application. The theme system supports multiple color palettes and both light and dark modes.

## Architecture

### ThemeProvider

The `ThemeProvider` is a centralized theme management component that handles all theme-related state and operations.

**Location:** `src/components/ThemeProvider.js`

**Features:**
- Singleton pattern for global theme state
- Reactive updates via subscribe/notify pattern
- Support for light, dark, and auto (system preference) modes
- Multiple expressive color palettes
- Centralized M3 verification (`isM3()` method)

**Usage:**

```javascript
import themeProvider from './src/components/ThemeProvider.js';

// Initialize the theme provider (done automatically on app start)
themeProvider.initialize();

// Get current theme state
const state = themeProvider.getState();
console.log(state.theme); // 'light', 'dark', or 'auto'
console.log(state.color); // 'lilac', 'teal', 'orange', etc.

// Change theme
themeProvider.setTheme('dark');

// Change color palette
themeProvider.setColor('teal');

// Change both at once
themeProvider.setThemeAndColor('dark', 'orange');

// Subscribe to theme changes
const unsubscribe = themeProvider.subscribe((newState) => {
    console.log('Theme changed:', newState);
});

// Check if M3 is active (always returns true in this unified system)
const isM3 = themeProvider.isM3();
```

### ThemeSwitcher

The `ThemeSwitcher` provides UI components for theme selection.

**Location:** `src/components/ThemeSwitcher.js`

**Components:**
1. **Full ThemeSwitcher** - Rich UI with visual previews
2. **Compact ThemeSwitcher** - Dropdown-based selector for settings pages

**Usage:**

```javascript
import { createThemeSwitcher, createCompactThemeSwitcher } from './src/components/ThemeSwitcher.js';

// Create full theme switcher
createThemeSwitcher('theme-switcher-container');

// Create compact theme switcher for settings
createCompactThemeSwitcher('compact-theme-switcher');
```

**HTML Setup:**

```html
<!-- For full theme switcher -->
<div id="theme-switcher-container"></div>

<!-- For compact theme switcher -->
<div id="compact-theme-switcher"></div>
```

## Color Palettes

The theme system includes 9 expressive color palettes:

1. **Lilac (Default)** - Purple-based expressive palette
2. **Teal** - Cyan/teal-based palette
3. **Orange** - Warm orange palette
4. **Purple** - Classic Material purple
5. **Blue** - Cool blue palette
6. **Green** - Natural green palette
7. **Red** - Bold red palette
8. **Indigo** - Deep indigo palette
9. **Pink** - Vibrant pink palette

Each palette includes complete light and dark mode variants with:
- Primary, Secondary, Tertiary colors
- Container colors
- On-color variants for proper contrast
- Surface colors
- Error colors

## CSS Variables

All components should use MD3 CSS custom properties for consistency:

### Primary Colors
```css
--md-sys-color-primary
--md-sys-color-on-primary
--md-sys-color-primary-container
--md-sys-color-on-primary-container
```

### Secondary Colors
```css
--md-sys-color-secondary
--md-sys-color-on-secondary
--md-sys-color-secondary-container
--md-sys-color-on-secondary-container
```

### Tertiary Colors
```css
--md-sys-color-tertiary
--md-sys-color-on-tertiary
--md-sys-color-tertiary-container
--md-sys-color-on-tertiary-container
```

### Surface Colors
```css
--md-sys-color-surface
--md-sys-color-on-surface
--md-sys-color-surface-variant
--md-sys-color-on-surface-variant
--md-sys-color-background
--md-sys-color-on-background
```

### Other Colors
```css
--md-sys-color-error
--md-sys-color-on-error
--md-sys-color-outline
```

### Spacing (8px grid)
```css
--md-spacing-xs: 4px
--md-spacing-sm: 8px
--md-spacing-md: 16px
--md-spacing-lg: 24px
```

### Border Radius
```css
--md-shape-small: 10px
--md-shape-medium: 14px
--md-shape-large: 20px
```

### Focus Indicators
```css
--md-focus-outline
--md-focus-width: 2px
--md-focus-offset: 2px
```

## Styling Components

### Button Example

```css
.btn-primary {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  border-radius: var(--md-shape-small);
  padding: var(--md-spacing-sm) var(--md-spacing-md);
}

.btn-primary:hover {
  background: var(--md-sys-color-secondary);
}

.btn-primary:focus {
  outline: var(--md-focus-width) solid var(--md-focus-outline);
  outline-offset: var(--md-focus-offset);
}
```

### Card Example

```css
.card {
  background: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  border-radius: var(--md-shape-medium);
  padding: var(--md-spacing-md);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-header {
  background: var(--md-sys-color-surface-variant);
  color: var(--md-sys-color-on-surface-variant);
  padding: var(--md-spacing-sm);
  border-radius: var(--md-shape-small);
}
```

## Migration Guide

To migrate existing components to the unified MD3 theme:

1. **Replace hardcoded colors** with CSS variables
   ```css
   /* Before */
   background: #6750A4;
   
   /* After */
   background: var(--md-sys-color-primary);
   ```

2. **Use consistent spacing**
   ```css
   /* Before */
   padding: 16px;
   
   /* After */
   padding: var(--md-spacing-md);
   ```

3. **Use MD3 border radius**
   ```css
   /* Before */
   border-radius: 8px;
   
   /* After */
   border-radius: var(--md-shape-small);
   ```

4. **Add proper focus indicators**
   ```css
   .element:focus {
     outline: var(--md-focus-width) solid var(--md-focus-outline);
     outline-offset: var(--md-focus-offset);
   }
   ```

5. **Remove isM3 checks** - All pages now use MD3 by default
   ```javascript
   // Before
   if (isM3()) {
     // Use MD3 styles
   } else {
     // Use legacy styles
   }
   
   // After - No need for checks, always MD3
   // Just use MD3 styles directly
   ```

## Theme Files

- `js/theme.js` - Core theme logic and color palettes
- `src/components/ThemeProvider.js` - Theme state management
- `src/components/ThemeSwitcher.js` - UI components for theme selection
- `src/components/ThemeSwitcher.css` - ThemeSwitcher styles
- `src/styles/generated-md3-expressive.css` - MD3 system color variables
- `src/styles/theme-md3-expressive.css` - Additional MD3 utilities
- `styles.css` - Global styles with MD3 variables

## Best Practices

1. **Always use CSS variables** instead of hardcoded colors
2. **Use semantic color names** (primary, surface, etc.) not color values
3. **Test in both light and dark modes** before committing changes
4. **Test with different color palettes** to ensure consistency
5. **Use proper contrast ratios** - MD3 on-color variants ensure this
6. **Add focus indicators** to all interactive elements
7. **Use the spacing system** for consistent layout
8. **Avoid @media (prefers-color-scheme)** - theme classes handle this

## Accessibility

The MD3 theme system is designed with accessibility in mind:

- All color combinations meet WCAG contrast requirements
- Focus indicators are visible and consistent
- Keyboard navigation fully supported
- Screen reader labels included in ThemeSwitcher
- System preference (auto mode) supported

## Testing

Test your themed components:

```javascript
// Test with different themes
themeProvider.setThemeAndColor('light', 'lilac');
// Verify appearance

themeProvider.setThemeAndColor('dark', 'teal');
// Verify appearance

themeProvider.setThemeAndColor('light', 'orange');
// Verify appearance
```

## Troubleshooting

**Colors not updating:**
- Ensure you're using CSS variables, not hardcoded colors
- Check that the element is not using inline styles
- Verify the theme is properly initialized

**Dark mode not working:**
- Check that dark mode styles are using `.dark-theme` class
- Verify ThemeProvider is initialized
- Check browser console for errors

**Custom colors needed:**
- Add new palette to `COLOR_PALETTES` in `js/theme.js`
- Update ThemeSwitcher to include new option
- Test in both light and dark modes

## Further Reading

- [Material Design 3 Guidelines](https://m3.material.io/)
- [Material Design Color System](https://m3.material.io/styles/color/overview)
- [Material Design Typography](https://m3.material.io/styles/typography/overview)
- [Material Design Elevation](https://m3.material.io/styles/elevation/overview)
