/* src/utils/ics-export.js */
export function exportScheduleToICS(slots = []) {
  const pad = (n) => String(n).padStart(2, '0');

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  function formatLocalDateTime(d) {
    return (
      d.getFullYear().toString() +
      pad(d.getMonth() + 1) +
      pad(d.getDate()) +
      'T' +
      pad(d.getHours()) +
      pad(d.getMinutes()) +
      pad(d.getSeconds())
    );
  }

  function italianDayToWeekdayNumber(day) {
    const map = {
      'Domenica': 0,
      'Lunedì': 1,
      'Lunedi': 1,
      'Martedì': 2,
      'Martedi': 2,
      'Mercoledì': 3,
      'Mercoledi': 3,
      'Giovedì': 4,
      'Giovedi': 4,
      'Venerdì': 5,
      'Venerdi': 5,
      'Sabato': 6
    };
    return map[day] !== undefined ? map[day] : null;
  }

  function getNextDateForWeekday(weekday, fromDate = new Date()) {
    // weekday: 0 (Sun) .. 6 (Sat)
    const d = new Date(fromDate);
    const diff = (weekday + 7 - d.getDay()) % 7;
    if (diff === 0) return d; // today
    d.setDate(d.getDate() + diff);
    return d;
  }

  function uidForSlot(slot) {
    const base = slot.lessonKey || slot.id || (slot.day + '-' + slot.startTime);
    const rand = Math.random().toString(36).slice(2, 9);
    return `${base}-${rand}@docente-plus-plus`;
  }

  function escapeText(s = '') {
    return String(s)
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  }

  const lines = [];
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('PRODID:-//Docente++//iCal Export//IT');
  lines.push('CALSCALE:GREGORIAN');

  slots.forEach(slot => {
    try {
      const dayName = slot.day || slot.giorno || slot.weekday || '';
      const weekday = italianDayToWeekdayNumber(dayName);
      const startTime = slot.startTime || slot.time || (slot.orario && slot.orario.split('-')[0]) || '';
      let endTime = slot.endTime || '';
      if (!startTime) return; // skip invalid

      if (!endTime) {
        // default 1 hour
        const [h, m] = startTime.split(':').map(x => parseInt(x, 10));
        const d = new Date();
        d.setHours(h || 0, m || 0, 0, 0);
        d.setHours(d.getHours() + 1);
        endTime = pad(d.getHours()) + ':' + pad(d.getMinutes());
      }

      const nextDate = (weekday !== null) ? getNextDateForWeekday(weekday) : new Date();

      const [sh, sm] = startTime.split(':').map(x => parseInt(x, 10));
      const [eh, em] = endTime.split(':').map(x => parseInt(x, 10));

      const dtStart = new Date(nextDate);
      dtStart.setHours(sh || 0, sm || 0, 0, 0);
      const dtEnd = new Date(nextDate);
      dtEnd.setHours(eh || (sh + 1) || 0, em || 0, 0, 0);

      const dtStartStr = formatLocalDateTime(dtStart);
      const dtEndStr = formatLocalDateTime(dtEnd);

      const uid = uidForSlot(slot);
      const summary = escapeText(`${slot.subject || slot.materia || slot.title || ''}${slot.class ? ' (' + slot.class + ')' : ''}`);
      const descriptionParts = [];
      if (slot.room) descriptionParts.push(`Sala: ${slot.room}`);
      if (slot.notes) descriptionParts.push(`Note: ${slot.notes}`);
      if (slot.type) descriptionParts.push(`Tipo: ${slot.type}`);
      const description = escapeText(descriptionParts.join('\n'));

      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${uid}`);
      // Use TZID for local time
      lines.push(`DTSTART;TZID=${tz}:${dtStartStr}`);
      lines.push(`DTEND;TZID=${tz}:${dtEndStr}`);
      lines.push(`SUMMARY:${summary}`);
      if (description) lines.push(`DESCRIPTION:${description}`);
      if (slot.room) lines.push(`LOCATION:${escapeText(slot.room)}`);
      lines.push('RRULE:FREQ=WEEKLY');
      lines.push('END:VEVENT');
    } catch (err) {
      // skip malformed slot
      // eslint-disable-next-line no-console
      console.error('ics-export: error building event for slot', slot, err);
    }
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadICS(filename = 'docente-plus-plus-schedule.ics', icsContent) {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
} * Get weekday number from day name
 * @param {string} dayName - Day name (e.g., "Lunedì", "Monday")
 * @returns {number} Weekday number (0-6, Sunday=0) or -1 if invalid
 */
export function getWeekdayNumber(dayName) {
  if (!dayName || typeof dayName !== 'string') {
    return -1;
  }
  const normalized = dayName.toLowerCase().trim();
  return DAY_TO_WEEKDAY[normalized] ?? -1;
}

/**
 * Calculate the next date for a specific weekday
 * @param {number} targetWeekday - Target weekday number (0-6, Sunday=0)
 * @param {Date} fromDate - Starting date (defaults to today)
 * @returns {Date} Next occurrence of the target weekday
 */
export function getNextDateForWeekday(targetWeekday, fromDate = new Date()) {
  const date = new Date(fromDate);
  const currentWeekday = date.getDay();
  
  // Calculate days to add
  let daysToAdd = targetWeekday - currentWeekday;
  if (daysToAdd <= 0) {
    daysToAdd += 7; // Move to next week if target day has passed
  }
  
  date.setDate(date.getDate() + daysToAdd);
  return date;
}

/**
 * Format a Date object to iCalendar date-time format (YYYYMMDDTHHMMSS)
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatICalDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * Parse time string (HH:MM) and return hours and minutes
 * @param {string} timeStr - Time string (e.g., "08:00", "14:30")
 * @returns {{hours: number, minutes: number}} Hours and minutes
 */
export function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(num => parseInt(num, 10));
  return { hours: hours || 0, minutes: minutes || 0 };
}

/**
 * Create a Date object for a specific day and time
 * @param {number} weekday - Weekday number (0-6)
 * @param {string} timeStr - Time string (HH:MM)
 * @param {Date} baseDate - Base date for calculation
 * @returns {Date} Date object with the specified day and time
 */
export function createDateTime(weekday, timeStr, baseDate = new Date()) {
  const nextDate = getNextDateForWeekday(weekday, baseDate);
  const { hours, minutes } = parseTime(timeStr);
  
  nextDate.setHours(hours, minutes, 0, 0);
  return nextDate;
}

/**
 * Generate a unique UID for an iCalendar event
 * @param {Object} slot - Schedule slot
 * @returns {string} Unique identifier
 */
export function generateUID(slot) {
  const id = slot.lessonKey || slot.id || `${slot.day}-${slot.startTime}`;
  // Use timestamp for uniqueness instead of Math.random() for better entropy
  const timestamp = Date.now().toString(36);
  const counter = (Math.floor(performance.now() * 1000) % 1000000).toString(36);
  return `${id}-${timestamp}-${counter}@docente-plus-plus`;
}

/**
 * Escape special characters for iCalendar text fields
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeICalText(text) {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Convert a schedule slot to an iCalendar VEVENT string
 * @param {Object} slot - Schedule slot object
 * @returns {string|null} VEVENT string or null if invalid
 */
export function slotToVEvent(slot) {
  if (!slot || !slot.day || !slot.startTime) {
    console.warn('Invalid slot: missing day or startTime', slot);
    return null;
  }

  const weekday = getWeekdayNumber(slot.day);
  if (weekday === -1) {
    console.warn('Invalid day name:', slot.day);
    return null;
  }

  // Calculate start and end times
  const endTime = slot.endTime || (() => {
    // If no endTime, calculate it from startTime + 1 hour or duration
    const { hours, minutes } = parseTime(slot.startTime);
    const endHours = hours + (slot.duration || 1);
    return `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  })();

  const dtStart = createDateTime(weekday, slot.startTime);
  const dtEnd = createDateTime(weekday, endTime);

  // Build event summary
  const summary = slot.subject && slot.class 
    ? `${slot.subject} (${slot.class})`
    : slot.subject || 'Lezione';

  // Build description
  const descriptionParts = [];
  if (slot.room) descriptionParts.push(`Aula: ${slot.room}`);
  if (slot.type) descriptionParts.push(`Tipo: ${slot.type}`);
  if (slot.notes) descriptionParts.push(`Note: ${slot.notes}`);
  const description = descriptionParts.join('\\n');

  // Build location
  const location = slot.room || '';

  // Generate UID
  const uid = generateUID(slot);

  // Create VEVENT
  const vevent = [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART:${formatICalDateTime(dtStart)}`,
    `DTEND:${formatICalDateTime(dtEnd)}`,
    `SUMMARY:${escapeICalText(summary)}`,
    description ? `DESCRIPTION:${escapeICalText(description)}` : null,
    location ? `LOCATION:${escapeICalText(location)}` : null,
    'RRULE:FREQ=WEEKLY',
    `DTSTAMP:${formatICalDateTime(new Date())}`,
    'END:VEVENT'
  ].filter(line => line !== null).join('\r\n');

  return vevent;
}

/**
 * Export schedule slots to iCalendar format
 * @param {Array<Object>} scheduleSlots - Array of schedule slot objects
 * @returns {string} iCalendar content as string
 */
export function exportScheduleToICS(scheduleSlots) {
  if (!Array.isArray(scheduleSlots) || scheduleSlots.length === 0) {
    console.warn('No schedule slots to export');
    return null;
  }

  // Generate VEVENTs for all valid slots
  const vevents = scheduleSlots
    .map(slot => slotToVEvent(slot))
    .filter(vevent => vevent !== null)
    .join('\r\n');

  if (!vevents) {
    console.warn('No valid events to export');
    return null;
  }

  // Build complete iCalendar content
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Docente++//Schedule Export//IT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    vevents,
    'END:VCALENDAR'
  ].join('\r\n');

  return icsContent;
}

/**
 * Trigger download of ICS file
 * @param {string} filename - Name of the file to download
 * @param {string} icsContent - iCalendar content as string
 */
export function downloadICS(filename, icsContent) {
  if (!icsContent) {
    console.error('No content to download');
    return;
  }

  // Create blob
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'schedule.ics';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
