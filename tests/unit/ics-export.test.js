import { exportScheduleToICS } from '../../src/utils/ics-export.js';

describe('ICS export', () => {
  test('generates basic VCALENDAR with VEVENT and RRULE', () => {
    const slots = [
      {
        day: 'Lunedì',
        startTime: '08:00',
        endTime: '09:00',
        subject: 'Matematica',
        class: '3A',
        room: 'Aula 1',
        lessonKey: 'Lunedì-08:00'
      }
    ];
    const ics = exportScheduleToICS(slots);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('RRULE:FREQ=WEEKLY');
    expect(ics).toMatch(/UID:.+@docente-plus-plus/);
    expect(ics).toContain('SUMMARY:Matematica (3A)');
  });
});      expect(getWeekdayNumber(null)).toBe(-1);
      expect(getWeekdayNumber('InvalidDay')).toBe(-1);
    });
  });

  describe('getNextDateForWeekday', () => {
    test('calculates next Monday from a Sunday', () => {
      const sunday = new Date('2025-10-19'); // Sunday
      const nextMonday = getNextDateForWeekday(1, sunday);
      expect(nextMonday.getDay()).toBe(1); // Monday
      expect(nextMonday.getDate()).toBe(20);
    });

    test('calculates next Friday from a Monday', () => {
      const monday = new Date('2025-10-20'); // Monday
      const nextFriday = getNextDateForWeekday(5, monday);
      expect(nextFriday.getDay()).toBe(5); // Friday
      expect(nextFriday.getDate()).toBe(24);
    });

    test('wraps to next week if target day has passed', () => {
      const thursday = new Date('2025-10-23'); // Thursday
      const nextMonday = getNextDateForWeekday(1, thursday);
      expect(nextMonday.getDay()).toBe(1); // Monday
      expect(nextMonday.getDate()).toBe(27); // Next week's Monday
    });
  });

  describe('formatICalDateTime', () => {
    test('formats date correctly', () => {
      const date = new Date('2025-10-22T14:30:00');
      const formatted = formatICalDateTime(date);
      expect(formatted).toMatch(/^\d{8}T\d{6}$/);
      expect(formatted).toContain('20251022');
      expect(formatted).toContain('T143000');
    });

    test('pads single digits', () => {
      const date = new Date('2025-03-05T08:05:00');
      const formatted = formatICalDateTime(date);
      expect(formatted).toContain('20250305');
      expect(formatted).toContain('T080500');
    });
  });

  describe('parseTime', () => {
    test('parses HH:MM format', () => {
      expect(parseTime('08:00')).toEqual({ hours: 8, minutes: 0 });
      expect(parseTime('14:30')).toEqual({ hours: 14, minutes: 30 });
      expect(parseTime('23:59')).toEqual({ hours: 23, minutes: 59 });
    });

    test('handles single digit hours and minutes', () => {
      expect(parseTime('8:5')).toEqual({ hours: 8, minutes: 5 });
      expect(parseTime('9:0')).toEqual({ hours: 9, minutes: 0 });
    });
  });

  describe('createDateTime', () => {
    test('creates date with correct weekday and time', () => {
      const baseDate = new Date('2025-10-19'); // Sunday
      const dateTime = createDateTime(1, '08:00', baseDate); // Monday 08:00
      
      expect(dateTime.getDay()).toBe(1); // Monday
      expect(dateTime.getHours()).toBe(8);
      expect(dateTime.getMinutes()).toBe(0);
    });
  });

  describe('generateUID', () => {
    test('generates UID with slot id', () => {
      const slot = { id: 'slot-1', day: 'Lunedì', startTime: '08:00' };
      const uid = generateUID(slot);
      expect(uid).toContain('slot-1');
      expect(uid).toContain('@docente-plus-plus');
    });

    test('generates UID with lessonKey if available', () => {
      const slot = { lessonKey: 'math-101', id: 'slot-1', day: 'Lunedì', startTime: '08:00' };
      const uid = generateUID(slot);
      expect(uid).toContain('math-101');
      expect(uid).toContain('@docente-plus-plus');
    });

    test('generates UID from day and time if no id', () => {
      const slot = { day: 'Lunedì', startTime: '08:00' };
      const uid = generateUID(slot);
      expect(uid).toContain('Lunedì-08:00');
      expect(uid).toContain('@docente-plus-plus');
    });

    test('includes random suffix for uniqueness', () => {
      const slot = { id: 'slot-1', day: 'Lunedì', startTime: '08:00' };
      const uid1 = generateUID(slot);
      const uid2 = generateUID(slot);
      expect(uid1).not.toBe(uid2); // Should be different due to random suffix
    });
  });

  describe('escapeICalText', () => {
    test('escapes special characters', () => {
      expect(escapeICalText('Test;Text')).toBe('Test\\;Text');
      expect(escapeICalText('Test,Text')).toBe('Test\\,Text');
      expect(escapeICalText('Test\\Text')).toBe('Test\\\\Text');
      expect(escapeICalText('Test\nText')).toBe('Test\\nText');
    });

    test('handles empty or null text', () => {
      expect(escapeICalText('')).toBe('');
      expect(escapeICalText(null)).toBe('');
    });
  });

  describe('slotToVEvent', () => {
    test('converts valid slot to VEVENT', () => {
      const slot = {
        id: 'slot-1',
        day: 'Lunedì',
        startTime: '08:00',
        endTime: '09:00',
        subject: 'Matematica',
        class: '3A',
        room: 'Aula 12',
        type: 'Teoria'
      };
      
      const vevent = slotToVEvent(slot);
      
      expect(vevent).toContain('BEGIN:VEVENT');
      expect(vevent).toContain('END:VEVENT');
      expect(vevent).toContain('UID:');
      expect(vevent).toContain('DTSTART:');
      expect(vevent).toContain('DTEND:');
      expect(vevent).toContain('SUMMARY:Matematica (3A)');
      expect(vevent).toContain('LOCATION:Aula 12');
      expect(vevent).toContain('RRULE:FREQ=WEEKLY');
      expect(vevent).toContain('DTSTAMP:');
    });

    test('handles slot without endTime', () => {
      const slot = {
        id: 'slot-1',
        day: 'Lunedì',
        startTime: '08:00',
        subject: 'Matematica',
        class: '3A'
      };
      
      const vevent = slotToVEvent(slot);
      
      expect(vevent).toContain('BEGIN:VEVENT');
      expect(vevent).toContain('DTSTART:');
      expect(vevent).toContain('DTEND:');
      expect(vevent).toContain('SUMMARY:Matematica (3A)');
    });

    test('returns null for invalid slot', () => {
      expect(slotToVEvent(null)).toBeNull();
      expect(slotToVEvent({})).toBeNull();
      expect(slotToVEvent({ day: 'Lunedì' })).toBeNull();
      expect(slotToVEvent({ startTime: '08:00' })).toBeNull();
    });

    test('returns null for invalid day name', () => {
      const slot = {
        id: 'slot-1',
        day: 'InvalidDay',
        startTime: '08:00',
        subject: 'Test'
      };
      
      expect(slotToVEvent(slot)).toBeNull();
    });
  });

  describe('exportScheduleToICS', () => {
    test('generates valid iCalendar content', () => {
      const slots = [
        {
          id: 'slot-1',
          day: 'Lunedì',
          startTime: '08:00',
          endTime: '09:00',
          subject: 'Matematica',
          class: '3A',
          room: 'Aula 12'
        },
        {
          id: 'slot-2',
          day: 'Martedì',
          startTime: '10:00',
          endTime: '11:00',
          subject: 'Italiano',
          class: '2B',
          room: 'Aula 5'
        }
      ];
      
      const ics = exportScheduleToICS(slots);
      
      expect(ics).toContain('BEGIN:VCALENDAR');
      expect(ics).toContain('END:VCALENDAR');
      expect(ics).toContain('VERSION:2.0');
      expect(ics).toContain('PRODID:-//Docente++//Schedule Export//IT');
      expect(ics).toContain('BEGIN:VEVENT');
      expect(ics).toContain('END:VEVENT');
      expect(ics).toContain('SUMMARY:Matematica (3A)');
      expect(ics).toContain('SUMMARY:Italiano (2B)');
      expect(ics).toContain('RRULE:FREQ=WEEKLY');
    });

    test('filters out invalid slots', () => {
      const slots = [
        {
          id: 'slot-1',
          day: 'Lunedì',
          startTime: '08:00',
          endTime: '09:00',
          subject: 'Matematica',
          class: '3A'
        },
        {
          id: 'slot-invalid',
          // Missing day and startTime
          subject: 'Invalid'
        }
      ];
      
      const ics = exportScheduleToICS(slots);
      
      expect(ics).toContain('BEGIN:VCALENDAR');
      expect(ics).toContain('SUMMARY:Matematica (3A)');
      expect(ics).not.toContain('SUMMARY:Invalid');
    });

    test('returns null for empty array', () => {
      expect(exportScheduleToICS([])).toBeNull();
    });

    test('returns null for non-array input', () => {
      expect(exportScheduleToICS(null)).toBeNull();
      expect(exportScheduleToICS({})).toBeNull();
    });
  });

  describe('downloadICS', () => {
    test('creates blob and triggers download', () => {
      // Mock DOM and URL APIs
      const mockLink = {
        click: () => {},
        href: '',
        download: '',
        style: {}
      };
      
      const originalCreateElement = document.createElement.bind(document);
      document.createElement = (tag) => {
        if (tag === 'a') return mockLink;
        return originalCreateElement(tag);
      };
      
      const originalAppendChild = document.body.appendChild.bind(document.body);
      document.body.appendChild = () => mockLink;
      
      const originalRemoveChild = document.body.removeChild.bind(document.body);
      document.body.removeChild = () => {};
      
      const originalCreateObjectURL = URL.createObjectURL;
      URL.createObjectURL = () => 'blob:mock-url';
      
      const originalRevokeObjectURL = URL.revokeObjectURL;
      URL.revokeObjectURL = () => {};
      
      // Test
      const content = 'BEGIN:VCALENDAR\r\nEND:VCALENDAR';
      downloadICS('test.ics', content);
      
      expect(mockLink.download).toBe('test.ics');
      expect(mockLink.href).toBe('blob:mock-url');
      
      // Restore
      document.createElement = originalCreateElement;
      document.body.appendChild = originalAppendChild;
      document.body.removeChild = originalRemoveChild;
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
    });

    test('does not trigger download for null content', () => {
      const originalCreateElement = document.createElement;
      let createElementCalled = false;
      document.createElement = () => {
        createElementCalled = true;
        return {};
      };
      
      downloadICS('test.ics', null);
      
      expect(createElementCalled).toBe(false);
      
      // Restore
      document.createElement = originalCreateElement;
    });
  });
});
