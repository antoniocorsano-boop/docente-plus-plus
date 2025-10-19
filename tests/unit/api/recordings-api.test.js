/**
 * Unit tests for Recordings API
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { RecordingsAPI } from '../../../src/api/recordings.js';

describe('RecordingsAPI', () => {
    let api;
    let mockBlob;

    beforeEach(() => {
        // Clear localStorage
        localStorage.clear();

        // Initialize API
        api = new RecordingsAPI({ useMock: true });

        // Create mock audio blob
        mockBlob = new Blob(['mock audio data'], { type: 'audio/webm' });
        
        // Set user consent
        api.setUserConsent({ recording: true, transcription: false });
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('uploadRecording', () => {
        it('should successfully upload a valid recording', async () => {
            const recordingData = {
                blob: mockBlob,
                lessonKey: 'Lunedì-08:00',
                duration: 60,
                fileName: 'test.webm'
            };

            const result = await api.uploadRecording(recordingData);

            expect(result.success).toBe(true);
            expect(result.recording).toBeDefined();
            expect(result.recording.id).toBeDefined();
            expect(result.recording.lessonKey).toBe('Lunedì-08:00');
            expect(result.recording.duration).toBe(60);
            expect(result.recording.status).toBe('uploaded');
        });

        it('should fail without user consent', async () => {
            api.setUserConsent({ recording: false, transcription: false });

            const recordingData = {
                blob: mockBlob,
                lessonKey: 'Lunedì-08:00',
                duration: 60
            };

            const result = await api.uploadRecording(recordingData);

            expect(result.success).toBe(false);
            expect(result.error).toBe('CONSENT_REQUIRED');
        });

        it('should fail with missing blob', async () => {
            const recordingData = {
                lessonKey: 'Lunedì-08:00',
                duration: 60
            };

            const result = await api.uploadRecording(recordingData);

            expect(result.success).toBe(false);
            expect(result.error).toBe('MISSING_FILE');
        });

        it('should fail with missing lessonKey', async () => {
            const recordingData = {
                blob: mockBlob,
                duration: 60
            };

            const result = await api.uploadRecording(recordingData);

            expect(result.success).toBe(false);
            expect(result.error).toBe('MISSING_LESSON');
        });

        it('should fail with invalid duration', async () => {
            const recordingData = {
                blob: mockBlob,
                lessonKey: 'Lunedì-08:00',
                duration: 0
            };

            const result = await api.uploadRecording(recordingData);

            expect(result.success).toBe(false);
            expect(result.error).toBe('INVALID_DURATION');
        });

        it('should fail with duration exceeding limit', async () => {
            const recordingData = {
                blob: mockBlob,
                lessonKey: 'Lunedì-08:00',
                duration: 4000 // Exceeds 3600 seconds limit
            };

            const result = await api.uploadRecording(recordingData);

            expect(result.success).toBe(false);
            expect(result.error).toBe('DURATION_EXCEEDED');
        });

        it('should fail with invalid MIME type', async () => {
            const invalidBlob = new Blob(['data'], { type: 'text/plain' });

            const recordingData = {
                blob: invalidBlob,
                lessonKey: 'Lunedì-08:00',
                duration: 60
            };

            const result = await api.uploadRecording(recordingData);

            expect(result.success).toBe(false);
            expect(result.error).toBe('INVALID_MIME_TYPE');
        });

        it('should store recording in localStorage', async () => {
            const recordingData = {
                blob: mockBlob,
                lessonKey: 'Lunedì-08:00',
                duration: 60
            };

            await api.uploadRecording(recordingData);

            const stored = localStorage.getItem('recordings');
            expect(stored).toBeTruthy();

            const recordings = JSON.parse(stored);
            expect(recordings.length).toBe(1);
            expect(recordings[0].lessonKey).toBe('Lunedì-08:00');
        });
    });

    describe('getRecordings', () => {
        beforeEach(async () => {
            // Upload test recordings
            await api.uploadRecording({
                blob: mockBlob,
                lessonKey: 'Lunedì-08:00',
                duration: 60
            });
            await api.uploadRecording({
                blob: mockBlob,
                lessonKey: 'Martedì-10:00',
                duration: 120
            });
        });

        it('should return all recordings', async () => {
            const recordings = await api.getRecordings();

            expect(Array.isArray(recordings)).toBe(true);
            expect(recordings.length).toBe(2);
        });

        it('should filter by lessonKey', async () => {
            const recordings = await api.getRecordings({ lessonKey: 'Lunedì-08:00' });

            expect(recordings.length).toBe(1);
            expect(recordings[0].lessonKey).toBe('Lunedì-08:00');
        });

        it('should filter by status', async () => {
            const recordings = await api.getRecordings({ status: 'uploaded' });

            expect(recordings.length).toBe(2);
            recordings.forEach(r => {
                expect(r.status).toBe('uploaded');
            });
        });

        it('should return empty array when no matches', async () => {
            const recordings = await api.getRecordings({ lessonKey: 'NonExistent' });

            expect(Array.isArray(recordings)).toBe(true);
            expect(recordings.length).toBe(0);
        });
    });

    describe('getRecording', () => {
        let recordingId;

        beforeEach(async () => {
            const result = await api.uploadRecording({
                blob: mockBlob,
                lessonKey: 'Lunedì-08:00',
                duration: 60
            });
            recordingId = result.recording.id;
        });

        it('should return a single recording by ID', async () => {
            const recording = await api.getRecording(recordingId);

            expect(recording).not.toBeNull();
            expect(recording.id).toBe(recordingId);
        });

        it('should return null for non-existent ID', async () => {
            const recording = await api.getRecording('non-existent-id');

            expect(recording).toBeNull();
        });
    });

    describe('deleteRecording', () => {
        let recordingId;

        beforeEach(async () => {
            const result = await api.uploadRecording({
                blob: mockBlob,
                lessonKey: 'Lunedì-08:00',
                duration: 60
            });
            recordingId = result.recording.id;
        });

        it('should successfully delete a recording', async () => {
            const result = await api.deleteRecording(recordingId);

            expect(result.success).toBe(true);

            const recording = await api.getRecording(recordingId);
            expect(recording).toBeNull();
        });

        it('should fail to delete non-existent recording', async () => {
            const result = await api.deleteRecording('non-existent-id');

            expect(result.success).toBe(false);
        });
    });

    describe('getStorageStats', () => {
        beforeEach(async () => {
            await api.uploadRecording({
                blob: mockBlob,
                lessonKey: 'Lunedì-08:00',
                duration: 60
            });
            await api.uploadRecording({
                blob: mockBlob,
                lessonKey: 'Martedì-10:00',
                duration: 120
            });
        });

        it('should return storage statistics', async () => {
            const stats = await api.getStorageStats();

            expect(stats).toHaveProperty('totalSize');
            expect(stats).toHaveProperty('totalCount');
            expect(stats).toHaveProperty('totalDuration');
            expect(stats).toHaveProperty('maxFileSize');
            expect(stats).toHaveProperty('maxTotalSize');
            expect(stats).toHaveProperty('maxRecordings');
            expect(stats).toHaveProperty('percentUsed');
            expect(stats).toHaveProperty('remainingSize');
            expect(stats).toHaveProperty('remainingCount');
        });

        it('should calculate correct totals', async () => {
            const stats = await api.getStorageStats();

            expect(stats.totalCount).toBe(2);
            expect(stats.totalDuration).toBe(180); // 60 + 120
        });
    });

    describe('cleanupOldRecordings', () => {
        it('should delete recordings older than retention period', async () => {
            // Create an old recording by manipulating localStorage
            const oldRecording = {
                id: 'old-rec-1',
                lessonKey: 'Lunedì-08:00',
                timestamp: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(), // 100 days ago
                duration: 60,
                fileSize: 1000,
                status: 'uploaded'
            };

            const recordings = [oldRecording];
            localStorage.setItem('recordings', JSON.stringify(recordings));

            const result = await api.cleanupOldRecordings();

            expect(result.deleted).toBe(1);

            const remaining = await api.getRecordings();
            expect(remaining.length).toBe(0);
        });

        it('should not delete recent recordings', async () => {
            await api.uploadRecording({
                blob: mockBlob,
                lessonKey: 'Lunedì-08:00',
                duration: 60
            });

            const result = await api.cleanupOldRecordings();

            expect(result.deleted).toBe(0);

            const remaining = await api.getRecordings();
            expect(remaining.length).toBe(1);
        });
    });

    describe('consent management', () => {
        it('should set user consent', () => {
            api.setUserConsent({ recording: true, transcription: true });

            const consent = api.getUserConsent();

            expect(consent.recording).toBe(true);
            expect(consent.transcription).toBe(true);
            expect(consent.timestamp).toBeDefined();
        });

        it('should get default consent when not set', () => {
            localStorage.clear();

            const consent = api.getUserConsent();

            expect(consent.recording).toBe(false);
            expect(consent.transcription).toBe(false);
            expect(consent.timestamp).toBeNull();
        });

        it('should update consent', () => {
            api.setUserConsent({ recording: true, transcription: false });
            api.setUserConsent({ recording: true, transcription: true });

            const consent = api.getUserConsent();

            expect(consent.recording).toBe(true);
            expect(consent.transcription).toBe(true);
        });
    });

    describe('quota limits', () => {
        it('should reject upload when max recordings reached', async () => {
            // Create API with low quota
            const limitedApi = new RecordingsAPI({
                useMock: true,
                quotaLimits: { maxRecordings: 2 }
            });
            limitedApi.setUserConsent({ recording: true, transcription: false });

            // Upload recordings up to limit
            await limitedApi.uploadRecording({
                blob: mockBlob,
                lessonKey: 'Lunedì-08:00',
                duration: 60
            });
            await limitedApi.uploadRecording({
                blob: mockBlob,
                lessonKey: 'Martedì-10:00',
                duration: 60
            });

            // Try to upload one more
            const result = await limitedApi.uploadRecording({
                blob: mockBlob,
                lessonKey: 'Mercoledì-12:00',
                duration: 60
            });

            expect(result.success).toBe(false);
            expect(result.error).toBe('QUOTA_EXCEEDED');
        });
    });

    describe('configuration', () => {
        it('should use mock data by default', () => {
            const defaultApi = new RecordingsAPI();
            expect(defaultApi.useMock).toBe(true);
        });

        it('should allow disabling mock data', () => {
            const realApi = new RecordingsAPI({ useMock: false });
            expect(realApi.useMock).toBe(false);
        });

        it('should set custom base URL', () => {
            const customApi = new RecordingsAPI({ baseURL: 'https://custom-api.com' });
            expect(customApi.baseURL).toBe('https://custom-api.com');
        });

        it('should allow custom quota limits', () => {
            const customApi = new RecordingsAPI({
                quotaLimits: { maxRecordings: 50 }
            });
            expect(customApi.quotaLimits.maxRecordings).toBe(50);
        });

        it('should allow custom privacy config', () => {
            const customApi = new RecordingsAPI({
                privacyConfig: { requiresConsent: false }
            });
            expect(customApi.privacyConfig.requiresConsent).toBe(false);
        });
    });
});
