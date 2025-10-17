# PR-128 Updates: Breadcrumbs, Floating AI Assistant, and In Classe Enhancements

## Overview

This PR implements several key features to improve navigation, AI assistance, and the In Classe experience:

1. **Reusable Breadcrumbs Component** - Mobile-first, responsive, accessible breadcrumb navigation
2. **Floating AI Assistant** - Fixed responsive panel with speech-to-text capability (mock)
3. **In Classe Updates** - Deep-linking support, enhanced sections, and localStorage persistence
4. **Schedule Table Rendering Fixes** - Improved CSS Grid positioning and collision handling
5. **Mock Data and Documentation** - Comprehensive test data and QA instructions

## Features Implemented

### 1. Breadcrumbs Component

**Location:** `components/breadcrumbs/`

**Files:**
- `breadcrumbs.html` - HTML template reference
- `breadcrumbs.css` - Mobile-first responsive styles
- `breadcrumbs.js` - Dynamic breadcrumb generation logic

**Features:**
- ✅ Mobile-first design with horizontal scrolling
- ✅ Responsive layout (mobile → tablet → desktop)
- ✅ Accessible (ARIA attributes, focus management)
- ✅ Automatic breadcrumb generation from page hierarchy
- ✅ Hidden on Home page (non-interactive)
- ✅ Shows context: Home > Section > Subsection
- ✅ `aria-current="page"` on active element
- ✅ Deep-linking support with query parameters

**Integration:**
- Integrated in global header (`index.html`)
- Integrated in In Classe page (`in-classe.html`)
- Auto-updates when switching tabs

**Usage:**
```javascript
import { initBreadcrumbs, updateBreadcrumbs } from './components/breadcrumbs/breadcrumbs.js';

// Initialize on page load
initBreadcrumbs('breadcrumbs-container');

// Update when navigating
updateBreadcrumbs('breadcrumbs-container', 'in-classe', { class: '3A', date: '2024-10-17' });
```

### 2. Floating AI Assistant

**Location:** `ui/floating-assistant/`

**Files:**
- `floating-assistant.css` - Responsive panel styles
- `floating-assistant.js` - Panel logic, focus trap, mock AI

**Features:**
- ✅ Floating Action Button (FAB) in bottom-right
- ✅ Mobile: Full-screen modal
- ✅ Desktop: Right drawer panel (420px width)
- ✅ Text input with send button
- ✅ Microphone button for voice recording (mock)
- ✅ Mock speech-to-text transcription
- ✅ Mock AI responses based on context
- ✅ Focus trap for accessibility
- ✅ ESC key to close
- ✅ `aria-live` region for screen reader announcements
- ✅ Typing indicator animation
- ✅ Context-aware suggestions

**Mock Implementation:**
- Feature flag: `MOCK_AI = true`
- Mock voice recording (2-4 seconds delay)
- Mock AI responses based on current page context
- TODO comments for real API integration

**Integration Points:**
```javascript
// TODO: Replace with real MediaRecorder API
// navigator.mediaDevices.getUserMedia({ audio: true })

// TODO: Replace with real AI API
// fetch('/api/ai/chat', { ... })

// TODO: Replace with real speech-to-text API
// Use Web Speech API or external service
```

### 3. In Classe Enhancements

**Updates to `in-classe.html` and `js/in-classe.js`:**

**Deep-Linking Support:**
- URL format: `/in-classe?date=YYYY-MM-DD&time=HH:MM&class=ClassName&slotId=xxx`
- Automatic prefill of session data from URL parameters
- Breadcrumb context from URL parameters

**New Sections:**
- ✅ Attività (Activities)
- ✅ Compiti (Homework)
- ✅ Valutazioni (Evaluations)
- ✅ Appunti Vocali (Voice Notes) with MediaRecorder + mock transcription
- ✅ Analytics (Mock charts/data)
- ✅ Agenda (Summary and next steps)

**localStorage Persistence:**
- Activities saved per lesson key: `inClasse_activities_${lessonKey}`
- Homework saved per lesson key: `inClasse_homework_${lessonKey}`
- Evaluations saved per lesson key: `inClasse_evaluations_${lessonKey}`
- Recordings saved per lesson key: `inClasse_recordings_${lessonKey}`
- Summary saved per lesson key: `inClasse_summary_${lessonKey}`

**Voice Recording (Mock):**
- Uses browser MediaRecorder API (TODO: integrate real implementation)
- Mock transcription with AI badge
- Save transcription to localStorage
- TODO: Real speech-to-text API integration

### 4. Schedule Table Rendering Fixes

**Updates to `js/schedule-component.js`:**

**Improvements:**
- ✅ Robust CSS Grid positioning with `grid-row` and `grid-column`
- ✅ 1-based day index mapping (1 = Monday, 5 = Friday)
- ✅ Multi-hour slot support with `grid-row-end: span N`
- ✅ Collision detection and warnings
- ✅ Fallback for invalid time/day formats
- ✅ Proper `grid-auto-rows` configuration

**Grid Structure:**
```css
.schedule-grid {
  display: grid;
  grid-template-columns: auto repeat(5, 1fr);
  grid-auto-rows: 60px;
  gap: 1px;
}
```

**Cell Positioning:**
```javascript
// Example: Monday 08:00 slot
cell.style.gridColumn = '2'; // Column 2 (Monday is day index 1)
cell.style.gridRow = '2';    // Row 2 (08:00 is first time slot)

// Multi-hour slot (2 hours)
cell.style.gridRow = '2 / span 2'; // Spans 2 rows
```

### 5. Mock Data

**File:** `mock/orario-mock.json`

**Contents:**
- 13 schedule slots covering all weekdays
- Multi-hour slots (2-hour labs)
- Various activity types (Teoria, Laboratorio, Verifica, Pratica)
- 5 classes (1A, 1B, 2A, 2B, 3A)
- Schedule configuration (times, working days)

**Usage:**
```javascript
// Load mock data
const response = await fetch('mock/orario-mock.json');
const mockData = await response.json();

// Use slots for testing
mockData.scheduleSlots.forEach(slot => {
  // Render to grid
  renderSlotToGrid(slot);
});
```

## Manual Testing Checklist

### Breadcrumbs Testing

- [ ] **Home Page**: Breadcrumbs hidden or non-interactive
- [ ] **Main Sections**: Shows "Home > Section" (e.g., "Home > Orario")
- [ ] **In Classe**: Shows "Home > Orario > In Classe" (or similar hierarchy)
- [ ] **Deep-Link**: Shows context in breadcrumb (e.g., "In Classe - 3A")
- [ ] **Click Navigation**: Clicking breadcrumb items navigates correctly
- [ ] **Current Page**: Current page has `aria-current="page"` and is non-clickable
- [ ] **Mobile**: Breadcrumbs scroll horizontally on narrow screens
- [ ] **Keyboard**: Tab navigation works, Enter/Space activate links
- [ ] **Screen Reader**: Announces "Breadcrumb" navigation and current page

### Floating Assistant Testing

- [ ] **FAB Visibility**: FAB visible in bottom-right corner
- [ ] **Open Panel**: Click FAB opens panel
  - [ ] Mobile: Full-screen modal
  - [ ] Desktop: Right drawer (420px width)
- [ ] **Backdrop**: Click backdrop closes panel
- [ ] **ESC Key**: ESC key closes panel
- [ ] **Focus Trap**: Tab navigation stays within panel when open
- [ ] **Text Input**: Can type and send messages
- [ ] **AI Response**: Mock AI responds after ~1-2 seconds
- [ ] **Typing Indicator**: Animated dots show while waiting for response
- [ ] **Microphone**: Click mic button starts mock recording
  - [ ] Recording indicator visible
  - [ ] Mock transcription appears in input after 2-4 seconds
- [ ] **Context**: Panel shows current page context (e.g., "In Classe")
- [ ] **Close Button**: Close button closes panel
- [ ] **Return Focus**: Focus returns to FAB when panel closes
- [ ] **Screen Reader**: Announcements work (panel opened/closed, recording status)

### In Classe Testing

- [ ] **Breadcrumbs**: Shows breadcrumb trail on In Classe page
- [ ] **Deep-Link**: URL parameters prefill lesson data
  - [ ] `/in-classe?date=2024-10-17&time=08:00&class=3A&slotId=slot-001`
  - [ ] Lesson info updated correctly
  - [ ] Breadcrumb shows class context
- [ ] **Activities Section**: Can add, view, delete activities
- [ ] **Homework Section**: Can assign, view, mark complete homework
- [ ] **Evaluations Section**: Student cards render, can add evaluations
- [ ] **Voice Notes**: 
  - [ ] Record button starts recording indicator
  - [ ] Stop button stops recording
  - [ ] Audio playback available
  - [ ] Mock transcription displays (with "DEMO" badge)
  - [ ] Can save transcription
- [ ] **Analytics Section**: Mock charts/stats display
- [ ] **Agenda Section**: Can write summary, add next steps, save/export
- [ ] **localStorage**: Data persists across page reloads
- [ ] **Back Button**: Returns to schedule/previous page
- [ ] **Exit Button**: Exits to home or schedule

### Schedule Table Testing

- [ ] **Grid Layout**: Cells align correctly to days and times
- [ ] **Multi-Hour Slots**: 2-hour slots span multiple rows
- [ ] **Day Mapping**: Monday = Column 2, Friday = Column 6
- [ ] **Time Mapping**: 08:00 = Row 2, 13:00 = Row 7
- [ ] **Click Cells**: Clicking cells opens editor (if implemented)
- [ ] **Collision Warning**: Overlapping slots show warning
- [ ] **Empty Slots**: Empty cells are clickable/interactive
- [ ] **Responsive**: Table scrolls/adapts on mobile

## API Integration TODOs

### Floating Assistant

1. **Real Speech-to-Text**:
```javascript
// Replace mock implementation in floating-assistant.js
// Use browser Web Speech API or external service (e.g., OpenAI Whisper, Google Cloud Speech)

navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const mediaRecorder = new MediaRecorder(stream);
    // Record audio, send to API for transcription
  });
```

2. **Real AI Chat API**:
```javascript
// Replace mock responses in sendMessage()
async function sendMessage(message) {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      context: assistantState.currentContext,
      history: assistantState.messages
    })
  });
  const data = await response.json();
  addMessageToChat('assistant', data.response);
}
```

### In Classe Voice Notes

1. **Real MediaRecorder Integration**:
```javascript
// In js/in-classe.js VoiceRecorder class
async startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  this.mediaRecorder = new MediaRecorder(stream);
  this.chunks = [];
  
  this.mediaRecorder.ondataavailable = (e) => {
    this.chunks.push(e.data);
  };
  
  this.mediaRecorder.onstop = async () => {
    const blob = new Blob(this.chunks, { type: 'audio/webm' });
    await this.transcribeAudio(blob);
  };
  
  this.mediaRecorder.start();
}
```

2. **Real Transcription API**:
```javascript
async transcribeAudio(audioBlob) {
  const formData = new FormData();
  formData.append('audio', audioBlob);
  
  const response = await fetch('/api/speech-to-text', {
    method: 'POST',
    body: formData
  });
  const data = await response.json();
  this.displayTranscription(data.transcript);
}
```

## QA Instructions

### Setup

1. Clone repository and checkout this branch
2. Install dependencies: `npm install`
3. Start local server: `npm run serve` (or `python3 -m http.server 8080`)
4. Open browser: `http://localhost:8080`

### Test Scenarios

#### Scenario 1: Basic Navigation with Breadcrumbs

1. Navigate to Home → Breadcrumbs should be hidden
2. Click "Orario" → Breadcrumbs show "Home > Orario"
3. Click a schedule cell to enter In Classe
4. Breadcrumbs should show "Home > Orario > In Classe"
5. Click "Home" in breadcrumbs → Returns to Home page

#### Scenario 2: Deep-Link to In Classe

1. Open URL: `http://localhost:8080/in-classe.html?date=2024-10-17&time=08:00&class=3A`
2. Verify lesson info is prefilled (Class 3A, time 08:00-09:00)
3. Verify breadcrumb shows context
4. Add an activity and save
5. Reload page → Activity should persist

#### Scenario 3: Floating AI Assistant

1. Click FAB in bottom-right
2. Panel opens (full-screen on mobile, drawer on desktop)
3. Type a message and send
4. Wait for mock AI response (~1-2 seconds)
5. Click microphone button
6. Wait for mock transcription (~2-4 seconds)
7. Send transcribed message
8. Press ESC or click close button
9. Panel closes, focus returns to FAB

#### Scenario 4: Voice Recording in In Classe

1. Navigate to In Classe page
2. Scroll to "Appunti Vocali" section
3. Click "Registra" button
4. Recording indicator appears
5. Click "Ferma" button
6. Audio playback controls appear
7. Mock transcription displays (with "DEMO" badge)
8. Click "Salva Trascrizione"
9. Reload page → Saved recordings should persist

### Browser Testing

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Accessibility Testing

- [ ] Keyboard navigation (Tab, Enter, Space, ESC)
- [ ] Screen reader (NVDA, JAWS, VoiceOver)
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] ARIA attributes correct

### Performance Testing

- [ ] Page load time < 3 seconds
- [ ] Breadcrumb update instant (<100ms)
- [ ] Panel open/close smooth animation
- [ ] No console errors
- [ ] localStorage size reasonable

## Known Limitations

1. **Mock AI**: Responses are pre-defined, not real AI
2. **Mock Transcription**: Voice recording produces fake transcription
3. **No Backend**: All data stored in localStorage only
4. **Schedule Rendering**: Some edge cases in collision detection may need refinement
5. **Browser Support**: MediaRecorder API requires modern browsers

## Future Enhancements

1. Real AI integration with OpenAI/Claude API
2. Real speech-to-text with Whisper or Google Cloud Speech
3. Backend API for data persistence
4. Advanced schedule conflict resolution
5. Multi-language support for breadcrumbs
6. Customizable FAB position
7. Voice commands for hands-free operation

## Files Modified

### New Files
- `components/breadcrumbs/breadcrumbs.html`
- `components/breadcrumbs/breadcrumbs.css`
- `components/breadcrumbs/breadcrumbs.js`
- `ui/floating-assistant/floating-assistant.css`
- `ui/floating-assistant/floating-assistant.js`
- `mock/orario-mock.json`
- `docs/PR-128-UPDATES.md` (this file)

### Modified Files
- `index.html` - Added breadcrumbs container and floating assistant panel
- `in-classe.html` - Added breadcrumbs, floating assistant, voice notes section
- `app.js` - Imported and initialized breadcrumbs and floating assistant
- `js/ui.js` - Updated switchTab to update breadcrumbs
- `js/in-classe.js` - Added deep-linking support, enhanced localStorage persistence
- `js/schedule-component.js` - Fixed grid rendering and collision detection (TODO)

## Version

- **PR Number**: #128
- **Branch**: `feature/in-classe-breadcrumbs-assistant`
- **Version**: 1.0.0
- **Date**: 2024-10-17
- **Author**: Docente++ Development Team

## Contact

For questions or issues, please contact the development team or open an issue in the repository.
