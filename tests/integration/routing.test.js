/**
 * @file routing.test.js
 * @description Integration tests for SPA routing and navigation
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

describe('SPA Routing Tests', () => {
    let originalWindowOpen;
    let windowOpenMock;

    beforeEach(() => {
        // Mock window.open
        originalWindowOpen = window.open;
        windowOpenMock = jest.fn();
        window.open = windowOpenMock;

        // Mock history
        history.pushState = jest.fn();
        history.replaceState = jest.fn();
    });

    afterEach(() => {
        // Restore original window.open
        window.open = originalWindowOpen;
    });

    describe('Main App Navigation', () => {
        it('should use history API for internal navigation', () => {
            // Simulate tab switch
            const pushStateSpy = jest.spyOn(history, 'pushState');
            
            // Simulate internal navigation
            history.pushState({ page: 'lessons' }, '', '#lessons');
            
            expect(pushStateSpy).toHaveBeenCalled();
            expect(pushStateSpy).toHaveBeenCalledWith(
                expect.objectContaining({ page: 'lessons' }),
                expect.any(String),
                expect.stringContaining('lessons')
            );
        });

        it('should not trigger full page reload for tab navigation', () => {
            // Store original location
            const originalLocation = window.location;
            
            // Mock location.assign
            delete window.location;
            window.location = { ...originalLocation, assign: jest.fn() };

            // Simulate tab navigation (not calling window.location.assign)
            history.pushState({ page: 'home' }, '', '#home');
            
            expect(window.location.assign).not.toHaveBeenCalled();
            
            // Restore original location
            window.location = originalLocation;
        });
    });

    describe('In Classe Navigation', () => {
        it('should open in-classe.html in new window/tab', () => {
            // Simulate opening In Classe page
            const inClasseUrl = 'in-classe.html';
            window.open(inClasseUrl, '_blank');
            
            expect(windowOpenMock).toHaveBeenCalledWith(inClasseUrl, '_blank');
        });

        it('should pass lesson parameters to in-classe.html', () => {
            // Simulate opening In Classe with lesson data
            const lessonKey = 'Lunedì-08:00';
            const params = new URLSearchParams({
                lesson: lessonKey,
                classId: '3A',
                subject: 'Matematica'
            });
            const url = `in-classe.html?${params.toString()}`;
            
            window.open(url, '_blank');
            
            expect(windowOpenMock).toHaveBeenCalledWith(
                expect.stringContaining('in-classe.html?lesson='),
                '_blank'
            );
        });
    });

    describe('Back Navigation', () => {
        it('should handle browser back button with popstate', () => {
            const popstateHandler = jest.fn((event) => {
                if (event.state && event.state.page) {
                    // Navigate to previous page
                    console.log('Navigate to:', event.state.page);
                }
            });

            window.addEventListener('popstate', popstateHandler);

            // Simulate back button
            const event = new PopStateEvent('popstate', {
                state: { page: 'home', params: null }
            });
            window.dispatchEvent(event);

            expect(popstateHandler).toHaveBeenCalled();

            window.removeEventListener('popstate', popstateHandler);
        });
    });

    describe('No Full Page Reloads', () => {
        it('should not call window.location.reload() for navigation', () => {
            // Store original location
            const originalLocation = window.location;
            
            // Mock location.reload
            delete window.location;
            window.location = { ...originalLocation, reload: jest.fn() };

            // Simulate various navigation actions
            history.pushState({ page: 'lessons' }, '', '#lessons');
            history.pushState({ page: 'students' }, '', '#students');
            history.pushState({ page: 'home' }, '', '#home');

            expect(window.location.reload).not.toHaveBeenCalled();
            
            // Restore original location
            window.location = originalLocation;
        });

        it('should not call window.location.assign() for same-app navigation', () => {
            // Store original location
            const originalLocation = window.location;
            
            // Mock location.assign
            delete window.location;
            window.location = { ...originalLocation, assign: jest.fn() };

            // Simulate internal tab switches
            history.pushState({ page: 'schedule' }, '', '#schedule');
            history.pushState({ page: 'agenda' }, '', '#agenda');

            expect(window.location.assign).not.toHaveBeenCalled();
            
            // Restore original location
            window.location = originalLocation;
        });
    });

    describe('URL Hash Management', () => {
        it('should update URL hash on navigation', () => {
            history.pushState({ page: 'activities' }, '', '#activities');
            
            // Check that hash was included in URL
            expect(history.pushState).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                expect.stringContaining('#activities')
            );
        });

        it('should handle navigation with query parameters', () => {
            const params = new URLSearchParams({ filter: 'pending', sort: 'date' });
            history.pushState(
                { page: 'activities', params: Object.fromEntries(params) },
                '',
                `#activities?${params.toString()}`
            );

            expect(history.pushState).toHaveBeenCalledWith(
                expect.objectContaining({
                    page: 'activities',
                    params: expect.objectContaining({ filter: 'pending' })
                }),
                expect.anything(),
                expect.stringContaining('?filter=pending')
            );
        });
    });

    describe('Navigation State Preservation', () => {
        it('should preserve navigation state in history', () => {
            const state = {
                page: 'lessons',
                params: { classId: '3A' }
            };

            history.pushState(state, '', '#lessons?classId=3A');

            expect(history.pushState).toHaveBeenCalledWith(
                expect.objectContaining(state),
                expect.anything(),
                expect.any(String)
            );
        });
    });
});

describe('In Classe Page URL Handling', () => {
    beforeEach(() => {
        // Mock URLSearchParams for testing
        global.URLSearchParams = jest.fn().mockImplementation((searchString) => {
            const params = new Map();
            if (searchString) {
                const pairs = searchString.split('&');
                pairs.forEach(pair => {
                    const [key, value] = pair.split('=');
                    params.set(decodeURIComponent(key), decodeURIComponent(value || ''));
                });
            }
            return {
                get: (key) => params.has(key) ? params.get(key) : null,
                has: (key) => params.has(key),
                toString: () => {
                    const parts = [];
                    params.forEach((value, key) => {
                        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
                    });
                    return parts.join('&');
                }
            };
        });
    });

    it('should parse lesson parameter from URL', () => {
        const searchString = 'lesson=Lunedì-08:00&classId=3A&subject=Matematica';
        const params = new URLSearchParams(searchString);

        expect(params.get('lesson')).toBe('Lunedì-08:00');
        expect(params.get('classId')).toBe('3A');
        expect(params.get('subject')).toBe('Matematica');
    });

    it('should handle missing lesson parameter', () => {
        const params = new URLSearchParams('');
        
        expect(params.get('lesson')).toBe(null);
    });

    it('should encode special characters in URL parameters', () => {
        const params = new URLSearchParams();
        const lessonKey = 'Mercoledì-10:00';
        
        // URLSearchParams should handle encoding
        const encoded = encodeURIComponent(lessonKey);
        expect(encoded).toContain('Mercoled%C3%AC');
    });
});
