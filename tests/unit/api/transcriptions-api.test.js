/**
 * Unit tests for Transcriptions API
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { TranscriptionsAPI } from '../../../src/api/transcriptions.js';

describe('TranscriptionsAPI', () => {
    let api;

    beforeEach(() => {
        // Clear localStorage
        localStorage.clear();

        // Initialize API
        api = new TranscriptionsAPI({ useMock: true });

        // Set user consent for transcription
        localStorage.setItem('recording_consent', JSON.stringify({
            recording: true,
            transcription: true,
            timestamp: new Date().toISOString()
        }));
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('startTranscription', () => {
        it('should successfully start a transcription job', async () => {
            const jobData = {
                recordingId: 'rec_123',
                language: 'it-IT',
                model: 'whisper-1'
            };

            const result = await api.startTranscription(jobData);

            expect(result.success).toBe(true);
            expect(result.transcription).toBeDefined();
            expect(result.transcription.id).toBeDefined();
            expect(result.transcription.recordingId).toBe('rec_123');
            expect(result.transcription.status).toBe('pending');
        });

        it('should fail without user consent', async () => {
            localStorage.setItem('recording_consent', JSON.stringify({
                recording: true,
                transcription: false,
                timestamp: new Date().toISOString()
            }));

            const jobData = {
                recordingId: 'rec_123'
            };

            const result = await api.startTranscription(jobData);

            expect(result.success).toBe(false);
            expect(result.error).toBe('CONSENT_REQUIRED');
        });

        it('should fail with missing recordingId', async () => {
            const jobData = {
                language: 'it-IT'
            };

            const result = await api.startTranscription(jobData);

            expect(result.success).toBe(false);
            expect(result.error).toBe('MISSING_RECORDING_ID');
        });

        it('should use default model when not specified', async () => {
            const jobData = {
                recordingId: 'rec_123'
            };

            const result = await api.startTranscription(jobData);

            expect(result.success).toBe(true);
            expect(result.transcription.metadata.model).toBe('whisper-1');
        });

        it('should store transcription in localStorage', async () => {
            const jobData = {
                recordingId: 'rec_123'
            };

            await api.startTranscription(jobData);

            const stored = localStorage.getItem('transcriptions');
            expect(stored).toBeTruthy();

            const transcriptions = JSON.parse(stored);
            expect(transcriptions.length).toBe(1);
            expect(transcriptions[0].recordingId).toBe('rec_123');
        });
    });

    describe('getTranscription', () => {
        let transcriptionId;

        beforeEach(async () => {
            const result = await api.startTranscription({
                recordingId: 'rec_123'
            });
            transcriptionId = result.transcription.id;
        });

        it('should return a single transcription by ID', async () => {
            const transcription = await api.getTranscription(transcriptionId);

            expect(transcription).not.toBeNull();
            expect(transcription.id).toBe(transcriptionId);
        });

        it('should return null for non-existent ID', async () => {
            const transcription = await api.getTranscription('non-existent-id');

            expect(transcription).toBeNull();
        });

        it('should return updated status for processing transcription', async () => {
            // Wait for status to update (mock processing happens async)
            await new Promise(resolve => setTimeout(resolve, 1500));

            const transcription = await api.getTranscription(transcriptionId);

            expect(['processing', 'completed']).toContain(transcription.status);
        });
    });

    describe('getTranscriptions', () => {
        beforeEach(async () => {
            await api.startTranscription({ recordingId: 'rec_1' });
            await api.startTranscription({ recordingId: 'rec_2' });
        });

        it('should return all transcriptions', async () => {
            const transcriptions = await api.getTranscriptions();

            expect(Array.isArray(transcriptions)).toBe(true);
            expect(transcriptions.length).toBe(2);
        });

        it('should filter by recordingId', async () => {
            const transcriptions = await api.getTranscriptions({ recordingId: 'rec_1' });

            expect(transcriptions.length).toBe(1);
            expect(transcriptions[0].recordingId).toBe('rec_1');
        });

        it('should filter by status', async () => {
            const transcriptions = await api.getTranscriptions({ status: 'pending' });

            transcriptions.forEach(t => {
                expect(t.status).toBe('pending');
            });
        });
    });

    describe('pollTranscription', () => {
        it('should poll until transcription is completed', async () => {
            const result = await api.startTranscription({ recordingId: 'rec_123' });
            const transcriptionId = result.transcription.id;

            let progressCalls = 0;
            const onProgress = () => {
                progressCalls++;
            };

            // Poll with short timeout
            const transcription = await api.pollTranscription(transcriptionId, {
                interval: 1000,
                timeout: 10000,
                onProgress
            });

            expect(transcription.status).toBe('completed');
            expect(transcription.text).toBeDefined();
            expect(transcription.confidence).toBeDefined();
            expect(progressCalls).toBeGreaterThan(0);
        }, 10000); // Increase test timeout

        it('should call progress callback on each poll', async () => {
            const result = await api.startTranscription({ recordingId: 'rec_123' });
            const transcriptionId = result.transcription.id;

            const statuses = [];
            const onProgress = (t) => {
                statuses.push(t.status);
            };

            await api.pollTranscription(transcriptionId, {
                interval: 1000,
                timeout: 10000,
                onProgress
            });

            expect(statuses.length).toBeGreaterThan(0);
        }, 10000);

        it('should throw error if transcription not found', async () => {
            await expect(
                api.pollTranscription('non-existent-id', { interval: 100, timeout: 1000 })
            ).rejects.toThrow('Transcription not found');
        });
    });

    describe('cancelTranscription', () => {
        let transcriptionId;

        beforeEach(async () => {
            const result = await api.startTranscription({ recordingId: 'rec_123' });
            transcriptionId = result.transcription.id;
        });

        it('should successfully cancel a pending transcription', async () => {
            const result = await api.cancelTranscription(transcriptionId);

            expect(result.success).toBe(true);

            const transcription = await api.getTranscription(transcriptionId);
            expect(transcription.status).toBe('cancelled');
        });

        it('should fail to cancel non-existent transcription', async () => {
            const result = await api.cancelTranscription('non-existent-id');

            expect(result.success).toBe(false);
        });

        it('should fail to cancel completed transcription', async () => {
            // Wait for completion
            await new Promise(resolve => setTimeout(resolve, 3500));

            const result = await api.cancelTranscription(transcriptionId);

            expect(result.success).toBe(false);
        }, 10000);
    });

    describe('provider management', () => {
        it('should get available providers', () => {
            const providers = api.getProviders();

            expect(providers).toHaveProperty('openai');
            expect(providers).toHaveProperty('google');
            expect(providers.openai).toHaveProperty('name');
            expect(providers.openai).toHaveProperty('models');
        });

        it('should set provider', () => {
            api.setProvider('google', 'test-api-key');

            expect(api.provider).toBe('google');
            expect(api.apiKey).toBe('test-api-key');
        });

        it('should throw error for unknown provider', () => {
            expect(() => {
                api.setProvider('unknown-provider');
            }).toThrow('Unknown provider: unknown-provider');
        });
    });

    describe('mock transcription processing', () => {
        it('should simulate async processing', async () => {
            const result = await api.startTranscription({ recordingId: 'rec_123' });
            const transcriptionId = result.transcription.id;

            // Initial status should be pending
            let transcription = await api.getTranscription(transcriptionId);
            expect(transcription.status).toBe('pending');

            // Wait for processing to start
            await new Promise(resolve => setTimeout(resolve, 1500));

            transcription = await api.getTranscription(transcriptionId);
            expect(['processing', 'completed']).toContain(transcription.status);

            // Wait for completion
            await new Promise(resolve => setTimeout(resolve, 1500));

            transcription = await api.getTranscription(transcriptionId);
            expect(transcription.status).toBe('completed');
            expect(transcription.text).toBeDefined();
            expect(transcription.confidence).toBeGreaterThanOrEqual(0.85);
            expect(transcription.confidence).toBeLessThanOrEqual(1.0);
            expect(transcription.completedAt).toBeDefined();
        }, 10000);
    });

    describe('configuration', () => {
        it('should use mock data by default', () => {
            const defaultApi = new TranscriptionsAPI();
            expect(defaultApi.useMock).toBe(true);
        });

        it('should allow disabling mock data', () => {
            const realApi = new TranscriptionsAPI({ useMock: false });
            expect(realApi.useMock).toBe(false);
        });

        it('should set custom base URL', () => {
            const customApi = new TranscriptionsAPI({ baseURL: 'https://custom-api.com' });
            expect(customApi.baseURL).toBe('https://custom-api.com');
        });

        it('should set default provider', () => {
            const customApi = new TranscriptionsAPI({ provider: 'google' });
            expect(customApi.provider).toBe('google');
        });

        it('should set API key', () => {
            const customApi = new TranscriptionsAPI({ apiKey: 'test-key' });
            expect(customApi.apiKey).toBe('test-key');
        });
    });

    describe('error handling', () => {
        it('should handle invalid model for provider', async () => {
            const jobData = {
                recordingId: 'rec_123',
                model: 'invalid-model'
            };

            const result = await api.startTranscription(jobData);

            expect(result.success).toBe(false);
            expect(result.error).toBe('INVALID_MODEL');
        });
    });
});
