# QA Checklist - Theme Consistency and Navigation

## Overview
This document provides a comprehensive QA checklist to verify all bug fixes and improvements related to:
- SPA navigation (no full page reloads)
- Daily timeline widget
- Theme consistency between pages
- AI Agent availability
- Chat input visibility on mobile

## Test Environment
- **Desktop Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: Chrome Mobile, Safari iOS (iOS 14+, Android 10+)
- **Screen Sizes**: 
  - Mobile: 375px - 767px width
  - Tablet: 768px - 1023px width
  - Desktop: 1024px+ width

## QA Test Cases

### 1. Navigation and SPA Behavior

#### 1.1 Home to In Classe Navigation
**Steps:**
1. Open `index.html` in browser
2. Click on "Entra in Classe" landing card on Home page
3. Observe browser behavior

**Expected:**
- ✅ Page navigates to `in-classe.html` without opening a new tab/window
- ✅ URL changes to `in-classe.html`
- ✅ No new browser window is created
- ✅ Browser back button returns to Home

**Desktop Result:** ⬜ Pass ⬜ Fail  
**Mobile Result:** ⬜ Pass ⬜ Fail

#### 1.2 Breadcrumb Navigation
**Steps:**
1. Navigate to In Classe page
2. Click on "Home" link in breadcrumb
3. Click browser back button
4. On In Classe, click "Orario" link in breadcrumb

**Expected:**
- ✅ Clicking breadcrumb links navigates without full page reload
- ✅ Browser history is preserved
- ✅ Back button works correctly
- ✅ No new tabs/windows are opened

**Desktop Result:** ⬜ Pass ⬜ Fail  
**Mobile Result:** ⬜ Pass ⬜ Fail

#### 1.3 Exit and Back Buttons
**Steps:**
1. Open In Classe page
2. Click the back arrow button (top left)
3. Return to In Classe
4. Click the "Esci" (Exit) button

**Expected:**
- ✅ Back button uses history.back() when available
- ✅ Exit button navigates properly
- ✅ No full page reloads
- ✅ URL hash updates correctly

**Desktop Result:** ⬜ Pass ⬜ Fail  
**Mobile Result:** ⬜ Pass ⬜ Fail

### 2. Daily Timeline Widget

#### 2.1 Timeline Display
**Steps:**
1. Add some lessons to schedule in localStorage:
   ```javascript
   const schedule = {
     "Lunedì-08:00": { classId: "3A", subject: "Matematica", activityType: "Teoria" },
     "Lunedì-09:00": { classId: "3B", subject: "Italiano", activityType: "Laboratorio" }
   };
   localStorage.setItem('schedule', JSON.stringify(schedule));
   ```
2. Reload In Classe page on Monday
3. Observe the daily timeline section

**Expected:**
- ✅ Daily timeline section is visible at top of page
- ✅ Current date is displayed correctly
- ✅ Today's lessons are shown in chronological order
- ✅ Lesson details (class, subject, type) are correct

**Desktop Result:** ⬜ Pass ⬜ Fail  
**Mobile Result:** ⬜ Pass ⬜ Fail

#### 2.2 Current Lesson Highlighting
**Steps:**
1. Set up a lesson for current hour in localStorage
2. Reload In Classe page during lesson time
3. Check the timeline display

**Expected:**
- ✅ Current lesson has "In Corso" badge
- ✅ Current lesson is highlighted with distinct styling
- ✅ Icon shows play_circle for current lesson
- ✅ Past lessons are faded
- ✅ Future lessons have normal styling

**Desktop Result:** ⬜ Pass ⬜ Fail  
**Mobile Result:** ⬜ Pass ⬜ Fail

#### 2.3 Auto-scroll to Current Lesson
**Steps:**
1. Add many lessons throughout the day
2. Reload page during a lesson in middle of day
3. Observe scroll behavior

**Expected:**
- ✅ Page auto-scrolls to current lesson
- ✅ Scroll is smooth (not jarring)
- ✅ Current lesson is centered in viewport
- ✅ Scroll happens after 300ms delay

**Desktop Result:** ⬜ Pass ⬜ Fail  
**Mobile Result:** ⬜ Pass ⬜ Fail

#### 2.4 Empty State
**Steps:**
1. Clear localStorage schedule
2. Reload In Classe page
3. Check daily timeline section

**Expected:**
- ✅ Empty state message is shown
- ✅ Icon (event_busy) is displayed
- ✅ Message reads "Nessuna lezione programmata per oggi"
- ✅ No errors in console

**Desktop Result:** ⬜ Pass ⬜ Fail  
**Mobile Result:** ⬜ Pass ⬜ Fail

### 3. Style Consistency

#### 3.1 Card Styling
**Steps:**
1. Open Home page (index.html)
2. Note card styling (borders, shadows, radius)
3. Navigate to In Classe page
4. Compare section styling

**Expected:**
- ✅ Both pages use same MD3 theme variables
- ✅ Border radius values are consistent
- ✅ Box shadow values are consistent
- ✅ No extra borders appear on In Classe only
- ✅ Background colors match theme

**Desktop Result:** ⬜ Pass ⬜ Fail  
**Mobile Result:** ⬜ Pass ⬜ Fail

#### 3.2 Typography
**Steps:**
1. Compare font families, sizes, weights
2. Check heading styles (h1, h2, h3)
3. Check body text
4. Check button text

**Expected:**
- ✅ Same font family (Roboto) on both pages
- ✅ Heading sizes are consistent
- ✅ Body text size matches
- ✅ Button text follows MD3 spec

**Desktop Result:** ⬜ Pass ⬜ Fail  
**Mobile Result:** ⬜ Pass ⬜ Fail

#### 3.3 Spacing and Layout
**Steps:**
1. Compare padding, margins, gaps
2. Check section spacing
3. Check component spacing

**Expected:**
- ✅ Same spacing scale used (--spacing-*)
- ✅ Section margins consistent
- ✅ Component gaps match
- ✅ Mobile responsive behavior is same

**Desktop Result:** ⬜ Pass ⬜ Fail  
**Mobile Result:** ⬜ Pass ⬜ Fail

### 4. AI Agent and Chat

#### 4.1 AI Agent Availability
**Steps:**
1. Open Home page
2. Look for AI FAB button (bottom right)
3. Click the FAB button
4. Navigate to In Classe
5. Check AI FAB is still available

**Expected:**
- ✅ AI FAB visible on Home page
- ✅ AI FAB visible on In Classe page
- ✅ FAB opens floating assistant panel
- ✅ Same assistant appears on both pages

**Desktop Result:** ⬜ Pass ⬜ Fail  
**Mobile Result:** ⬜ Pass ⬜ Fail

#### 4.2 Chat Input Visibility (Mobile)
**Steps:**
1. On mobile device, open floating assistant
2. Tap on text input field
3. Observe keyboard and input visibility
4. Try scrolling messages while keyboard is open

**Expected:**
- ✅ Input field scrolls into view when focused
- ✅ Input field is not hidden by keyboard
- ✅ Messages container has bottom padding
- ✅ Smooth scroll animation (300ms)
- ✅ Can still scroll messages

**Mobile Result:** ⬜ Pass ⬜ Fail

#### 4.3 Chat Functionality
**Steps:**
1. Open AI assistant
2. Type a message and send
3. Observe message appears in chat
4. Test voice button (if applicable)

**Expected:**
- ✅ Text messages send successfully
- ✅ Messages appear in chat history
- ✅ Chat scrolls to show new messages
- ✅ Input clears after sending

**Desktop Result:** ⬜ Pass ⬜ Fail  
**Mobile Result:** ⬜ Pass ⬜ Fail

### 5. Icon Set Consistency

#### 5.1 Icon Provider
**Steps:**
1. Inspect icons on Home page
2. Inspect icons on In Classe page
3. Check browser DevTools for icon sources

**Expected:**
- ✅ Both pages use `material-symbols-outlined`
- ✅ No mixed icon sets (Material Icons vs Material Symbols)
- ✅ Icon size and weight are consistent
- ✅ Icon colors follow theme

**Desktop Result:** ⬜ Pass ⬜ Fail  
**Mobile Result:** ⬜ Pass ⬜ Fail

### 6. Theme Provider

#### 6.1 Global Theme State
**Steps:**
1. Open Home page
2. Open DevTools console
3. Check `window.themeProvider` exists
4. Navigate to In Classe
5. Check `window.themeProvider` still exists

**Expected:**
- ✅ ThemeProvider initialized on both pages
- ✅ Same theme mode (light/dark/auto)
- ✅ Same color palette
- ✅ Theme persists across navigation

**Desktop Result:** ⬜ Pass ⬜ Fail  
**Mobile Result:** ⬜ Pass ⬜ Fail

#### 6.2 Theme Switching
**Steps:**
1. Open theme picker from settings
2. Change theme mode (light → dark → auto)
3. Change primary color
4. Navigate between pages

**Expected:**
- ✅ Theme change applies immediately
- ✅ Theme persists after navigation
- ✅ Same theme on both pages
- ✅ CSS variables update correctly

**Desktop Result:** ⬜ Pass ⬜ Fail  
**Mobile Result:** ⬜ Pass ⬜ Fail

## Regression Testing

### Browser Compatibility
Test on:
- ⬜ Chrome (Windows/Mac/Linux)
- ⬜ Firefox (Windows/Mac/Linux)
- ⬜ Safari (Mac/iOS)
- ⬜ Edge (Windows)
- ⬜ Chrome Mobile (Android)
- ⬜ Safari iOS

### Accessibility
- ⬜ Keyboard navigation works
- ⬜ Screen reader announces changes
- ⬜ Focus indicators visible
- ⬜ ARIA labels present and correct
- ⬜ Color contrast meets WCAG AA

### Performance
- ⬜ No memory leaks after multiple navigations
- ⬜ Page load time < 3s
- ⬜ No console errors
- ⬜ Smooth animations (60fps)

## Bug Reproduction Steps

### Original Issues (For Reference)

#### Issue 1: Multiple Page Creation
**Original Behavior:**
- Clicking "Entra in Classe" opened new tab/window
- Browser history became confusing
- Multiple instances of app running

**Fixed Behavior:**
- Single page navigation
- Proper history management
- No new tabs/windows

#### Issue 2: Missing Daily Timeline
**Original Behavior:**
- Hourly timeline widget was missing
- No visual indicator of current lesson
- Hard to see today's schedule at a glance

**Fixed Behavior:**
- Daily timeline widget visible
- Current lesson highlighted
- Easy to see day's schedule

#### Issue 3: Chat Input Hidden on Mobile
**Original Behavior:**
- Keyboard covered input field
- Couldn't see what you were typing
- Had to close keyboard to see input

**Fixed Behavior:**
- Input scrolls into view
- Always visible above keyboard
- Proper padding for keyboard

## Sign-off

**Tester Name:** _________________  
**Date:** _________________  
**Version:** _________________  

**Overall Result:** ⬜ All Tests Pass ⬜ Issues Found

**Notes:**
_____________________________________________________
_____________________________________________________
_____________________________________________________
