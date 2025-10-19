/**
 * @file daily-timeline.test.js
 * @description Unit tests for DailyTimeline component
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { DailyTimeline, fetchLessons } from '../../src/components/DailyTimeline.js';

describe('DailyTimeline Component', () => {
    let container;

    beforeEach(() => {
        // Create container element
        container = document.createElement('div');
        container.id = 'daily-timeline';
        document.body.appendChild(container);

        // Mock localStorage
        global.localStorage = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            clear: jest.fn()
        };
    });

    afterEach(() => {
        // Clean up
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
    });

    describe('Initialization', () => {
        it('should create timeline instance with default config', () => {
            const timeline = new DailyTimeline({
                containerId: 'daily-timeline'
            });

            expect(timeline.containerId).toBe('daily-timeline');
            expect(timeline.date).toBeInstanceOf(Date);
            expect(timeline.lessons).toEqual([]);
        });

        it('should accept custom date', () => {
            const customDate = new Date('2024-01-15');
            const timeline = new DailyTimeline({
                containerId: 'daily-timeline',
                date: customDate
            });

            expect(timeline.date).toEqual(customDate);
        });

        it('should accept onLessonClick callback', () => {
            const callback = jest.fn();
            const timeline = new DailyTimeline({
                containerId: 'daily-timeline',
                onLessonClick: callback
            });

            expect(timeline.onLessonClick).toBe(callback);
        });
    });

    describe('Fetch Lessons', () => {
        beforeEach(() => {
            // Mock schedule data
            const mockSchedule = {
                'Lunedì-08:00': {
                    classId: '3A',
                    className: 'Classe 3A',
                    subject: 'Matematica',
                    activityType: 'Lezione'
                },
                'Lunedì-09:00': {
                    classId: '3B',
                    className: 'Classe 3B',
                    subject: 'Italiano',
                    activityType: 'Verifica'
                },
                'Martedì-08:00': {
                    classId: '3A',
                    className: 'Classe 3A',
                    subject: 'Storia'
                }
            };

            global.localStorage.getItem.mockImplementation((key) => {
                if (key === 'schedule') {
                    return JSON.stringify(mockSchedule);
                }
                return null;
            });
        });

        it('should fetch lessons for a specific date', async () => {
            // Test for Monday
            const monday = new Date('2024-01-15'); // A Monday
            const lessons = await fetchLessons(monday);

            expect(lessons).toBeInstanceOf(Array);
            expect(lessons.length).toBeGreaterThan(0);
        });

        it('should return mock data when API is unavailable', async () => {
            const date = new Date('2024-01-15'); // Monday
            const lessons = await fetchLessons(date);

            // Should have lessons for Monday
            expect(lessons.length).toBe(2);
            expect(lessons[0].time).toBe('08:00');
            expect(lessons[1].time).toBe('09:00');
        });

        it('should return empty array for days with no lessons', async () => {
            const sunday = new Date('2024-01-14'); // Sunday
            const lessons = await fetchLessons(sunday);

            expect(lessons).toEqual([]);
        });

        it('should sort lessons by time', async () => {
            const monday = new Date('2024-01-15');
            const lessons = await fetchLessons(monday);

            if (lessons.length > 1) {
                for (let i = 0; i < lessons.length - 1; i++) {
                    expect(lessons[i].time.localeCompare(lessons[i + 1].time)).toBeLessThanOrEqual(0);
                }
            }
        });
    });

    describe('Rendering', () => {
        beforeEach(() => {
            const mockSchedule = {
                'Lunedì-08:00': {
                    classId: '3A',
                    className: 'Classe 3A',
                    subject: 'Matematica'
                }
            };

            global.localStorage.getItem.mockImplementation((key) => {
                if (key === 'schedule') {
                    return JSON.stringify(mockSchedule);
                }
                return null;
            });
        });

        it('should render timeline with lessons', async () => {
            const monday = new Date('2024-01-15');
            const timeline = new DailyTimeline({
                containerId: 'daily-timeline',
                date: monday
            });

            await timeline.init();

            expect(container.querySelector('.daily-timeline')).toBeTruthy();
            expect(container.querySelector('.timeline-header')).toBeTruthy();
        });

        it('should show loading state initially', () => {
            const timeline = new DailyTimeline({
                containerId: 'daily-timeline'
            });

            timeline.loading = true;
            timeline.render();

            expect(container.querySelector('.timeline-loading')).toBeTruthy();
        });

        it('should show empty state when no lessons', () => {
            const timeline = new DailyTimeline({
                containerId: 'daily-timeline'
            });

            timeline.lessons = [];
            timeline.loading = false;
            timeline.render();

            expect(container.querySelector('.timeline-empty')).toBeTruthy();
        });

        it('should render lesson items', () => {
            const timeline = new DailyTimeline({
                containerId: 'daily-timeline'
            });

            timeline.lessons = [{
                id: 'Lunedì-08:00',
                time: '08:00',
                endTime: '09:00',
                className: 'Classe 3A',
                subject: 'Matematica',
                activityType: 'Lezione'
            }];
            timeline.loading = false;
            timeline.render();

            expect(container.querySelector('.timeline-lesson')).toBeTruthy();
            expect(container.textContent).toContain('08:00');
            expect(container.textContent).toContain('Classe 3A');
            expect(container.textContent).toContain('Matematica');
        });
    });

    describe('Current Lesson Detection', () => {
        it('should identify current lesson correctly', () => {
            const timeline = new DailyTimeline({
                containerId: 'daily-timeline'
            });

            // Mock current time to be 08:30
            const now = new Date();
            now.setHours(8, 30, 0, 0);
            jest.spyOn(global, 'Date').mockImplementation(() => now);

            const lesson = {
                time: '08:00',
                endTime: '09:00'
            };

            // Set timeline date to today
            timeline.date = now;

            const isNow = timeline.isLessonNow(lesson);
            expect(isNow).toBe(true);
        });

        it('should return false for past lessons', () => {
            const timeline = new DailyTimeline({
                containerId: 'daily-timeline'
            });

            const now = new Date();
            now.setHours(10, 0, 0, 0);
            timeline.date = now;

            const lesson = {
                time: '08:00',
                endTime: '09:00'
            };

            const isNow = timeline.isLessonNow(lesson);
            expect(isNow).toBe(false);
        });

        it('should return false for future lessons', () => {
            const timeline = new DailyTimeline({
                containerId: 'daily-timeline'
            });

            const now = new Date();
            now.setHours(7, 0, 0, 0);
            timeline.date = now;

            const lesson = {
                time: '08:00',
                endTime: '09:00'
            };

            const isNow = timeline.isLessonNow(lesson);
            expect(isNow).toBe(false);
        });
    });

    describe('Event Handling', () => {
        it('should call onLessonClick when lesson is clicked', async () => {
            const callback = jest.fn();
            const timeline = new DailyTimeline({
                containerId: 'daily-timeline',
                onLessonClick: callback
            });

            timeline.lessons = [{
                id: 'Lunedì-08:00',
                time: '08:00',
                endTime: '09:00',
                className: 'Classe 3A',
                subject: 'Matematica'
            }];
            timeline.loading = false;
            timeline.render();

            const lessonElement = container.querySelector('.timeline-lesson');
            lessonElement.click();

            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 'Lunedì-08:00',
                    className: 'Classe 3A'
                })
            );
        });

        it('should not attach click handlers when no callback provided', () => {
            const timeline = new DailyTimeline({
                containerId: 'daily-timeline'
            });

            timeline.lessons = [{
                id: 'Lunedì-08:00',
                time: '08:00',
                endTime: '09:00',
                className: 'Classe 3A',
                subject: 'Matematica'
            }];
            timeline.loading = false;
            timeline.render();

            // Should not have action button
            expect(container.querySelector('.timeline-lesson-action')).toBeFalsy();
        });
    });

    describe('Update Date', () => {
        it('should reload lessons when date is updated', async () => {
            const timeline = new DailyTimeline({
                containerId: 'daily-timeline'
            });

            await timeline.init();
            const initialDate = timeline.date;

            const newDate = new Date('2024-01-16'); // Tuesday
            await timeline.updateDate(newDate);

            expect(timeline.date).toEqual(newDate);
            expect(timeline.date).not.toEqual(initialDate);
        });
    });

    describe('Cleanup', () => {
        it('should clear container on destroy', async () => {
            const timeline = new DailyTimeline({
                containerId: 'daily-timeline'
            });

            await timeline.init();
            expect(container.innerHTML).not.toBe('');

            timeline.destroy();
            expect(container.innerHTML).toBe('');
        });
    });

    describe('HTML Escaping', () => {
        it('should escape HTML in lesson data', () => {
            const timeline = new DailyTimeline({
                containerId: 'daily-timeline'
            });

            const escaped = timeline.escapeHtml('<script>alert("xss")</script>');
            expect(escaped).not.toContain('<script>');
            expect(escaped).toContain('&lt;script&gt;');
        });

        it('should handle null values in escapeHtml', () => {
            const timeline = new DailyTimeline({
                containerId: 'daily-timeline'
            });

            expect(timeline.escapeHtml(null)).toBe('');
            expect(timeline.escapeHtml(undefined)).toBe('');
        });
    });
});
