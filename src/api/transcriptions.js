/**
 * @file Transcriptions API Client
 * @description API client for managing audio transcriptions with AI integration
 * @module api/transcriptions
 */

/**
 * @typedef {Object} Transcription
 * @property {string} id - Unique transcription identifier
 * @property {string} recordingId - Associated recording ID
 * @property {string} status - Transcription status (pending, processing, completed, failed)
 * @property {string} [text] - Transcribed text (when completed)
 * @property {string} [language] - Detected language code (e.g., "it-IT")
 * @property {number} [confidence] - Confidence score (0-1)
 * @property {string} timestamp - ISO 8601 timestamp when job started
 * @property {string} [completedAt] - ISO 8601 timestamp when completed
 * @property {Object} [error] - Error details if failed
 * @property {Object} [metadata] - Additional metadata
 */

/**
 * @typedef {Object} TranscriptionJob
 * @property {string} recordingId - Recording ID to transcribe
 * @property {string} [language] - Target language (default: auto-detect)
 * @property {string} [model] - AI model to use (whisper-1, etc.)
 * @property {Object} [options] - Additional transcription options
 */

/**
 * @typedef {Object} TranscriptionResult
 * @property {boolean} success - Whether job was created successfully
 * @property {string} message - Result message
 * @property {Transcription} [transcription] - Transcription job object
 * @property {string} [error] - Error code if failed
 */

/**
 * AI Provider configuration
 * @constant
 */
const AI_PROVIDERS = {
    openai: {
        name: 'OpenAI Whisper',
        models: ['whisper-1'],
        maxFileSize: 25 * 1024 * 1024, // 25 MB
        supportedFormats: ['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm']
    },
    google: {
        name: 'Google Speech-to-Text',
        models: ['default', 'video', 'phone_call', 'command_and_search'],
        maxFileSize: 10 * 1024 * 1024, // 10 MB (synchronous)
        supportedFormats: ['flac', 'wav', 'mp3', 'ogg', 'webm']
    }
};

/**
 * Transcriptions API client
 * @class
 */
export class TranscriptionsAPI {
    /**
     * @param {Object} config - Configuration options
     * @param {string} [config.baseURL] - Base URL for API
     * @param {boolean} [config.useMock=true] - Use mock data instead of real API
     * @param {string} [config.provider='openai'] - AI provider to use
     * @param {string} [config.apiKey] - API key for AI provider
     * @param {string} [config.defaultModel] - Default model to use
     */
    constructor(config = {}) {
        this.baseURL = config.baseURL || '/api';
        this.useMock = config.useMock !== false; // Default to true
        this.provider = config.provider || 'openai';
        this.apiKey = config.apiKey || null;
        this.defaultModel = config.defaultModel || 'whisper-1';
        this.storageKey = 'transcriptions';
    }

    /**
     * Start a new transcription job
     * @param {TranscriptionJob} jobData - Job configuration
     * @returns {Promise<TranscriptionResult>} Job creation result
     */
    async startTranscription(jobData) {
        // Check if transcription is allowed (privacy)
        if (!this._hasTranscriptionConsent()) {
            return {
                success: false,
                message: 'È necessario fornire il consenso per la trascrizione automatica',
                error: 'CONSENT_REQUIRED'
            };
        }

        // Validate job data
        const validation = this._validateJob(jobData);
        if (!validation.valid) {
            return {
                success: false,
                message: validation.message,
                error: validation.error
            };
        }

        if (this.useMock) {
            return this._mockStartTranscription(jobData);
        }

        // TODO: Replace with real API call
        try {
            const response = await fetch(`${this.baseURL}/transcriptions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
                },
                body: JSON.stringify({
                    recordingId: jobData.recordingId,
                    language: jobData.language || 'auto',
                    model: jobData.model || this.defaultModel,
                    options: jobData.options || {}
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return {
                success: true,
                message: 'Trascrizione avviata con successo',
                transcription: result
            };
        } catch (error) {
            console.error('Error starting transcription:', error);

            // Check if provider is unreachable
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                this._logEvent('provider_unreachable', { provider: this.provider, error: error.message });
                return {
                    success: false,
                    message: 'Provider AI non raggiungibile. Riprova più tardi.',
                    error: 'PROVIDER_UNREACHABLE'
                };
            }

            // Fallback to mock
            return this._mockStartTranscription(jobData);
        }
    }

    /**
     * Get transcription status and result
     * @param {string} id - Transcription ID
     * @returns {Promise<Transcription|null>} Transcription object or null if not found
     */
    async getTranscription(id) {
        if (this.useMock) {
            return this._getMockTranscription(id);
        }

        // TODO: Replace with real API call
        try {
            const response = await fetch(`${this.baseURL}/transcriptions/${id}`, {
                headers: {
                    ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
                }
            });

            if (response.status === 404) {
                return null;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching transcription ${id}:`, error);
            return this._getMockTranscription(id);
        }
    }

    /**
     * Poll transcription status until completion
     * @param {string} id - Transcription ID
     * @param {Object} [options] - Polling options
     * @param {number} [options.interval=2000] - Poll interval in milliseconds
     * @param {number} [options.timeout=300000] - Timeout in milliseconds (5 minutes)
     * @param {Function} [options.onProgress] - Progress callback
     * @returns {Promise<Transcription>} Completed transcription
     */
    async pollTranscription(id, options = {}) {
        const interval = options.interval || 2000;
        const timeout = options.timeout || 300000;
        const onProgress = options.onProgress || (() => {});
        const startTime = Date.now();

        while (true) {
            // Check timeout
            if (Date.now() - startTime > timeout) {
                throw new Error('Transcription polling timeout');
            }

            const transcription = await this.getTranscription(id);

            if (!transcription) {
                throw new Error('Transcription not found');
            }

            // Call progress callback
            onProgress(transcription);

            // Check if completed or failed
            if (transcription.status === 'completed') {
                this._logEvent('transcription_completed', { id, duration: Date.now() - startTime });
                return transcription;
            }

            if (transcription.status === 'failed') {
                this._logEvent('transcription_failed', { id, error: transcription.error });
                throw new Error(`Transcription failed: ${transcription.error?.message || 'Unknown error'}`);
            }

            // Wait before next poll
            await this._delay(interval);
        }
    }

    /**
     * Get all transcriptions with optional filtering
     * @param {Object} [filter={}] - Filter options
     * @param {string} [filter.recordingId] - Filter by recording ID
     * @param {string} [filter.status] - Filter by status
     * @returns {Promise<Transcription[]>} Array of transcriptions
     */
    async getTranscriptions(filter = {}) {
        if (this.useMock) {
            return this._getMockTranscriptions(filter);
        }

        // TODO: Replace with real API call
        try {
            const queryParams = new URLSearchParams(filter).toString();
            const response = await fetch(`${this.baseURL}/transcriptions?${queryParams}`, {
                headers: {
                    ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching transcriptions:', error);
            return this._getMockTranscriptions(filter);
        }
    }

    /**
     * Cancel a pending transcription job
     * @param {string} id - Transcription ID
     * @returns {Promise<{success: boolean, message: string}>} Cancellation result
     */
    async cancelTranscription(id) {
        if (this.useMock) {
            return this._mockCancelTranscription(id);
        }

        // TODO: Replace with real API call
        try {
            const response = await fetch(`${this.baseURL}/transcriptions/${id}/cancel`, {
                method: 'POST',
                headers: {
                    ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error cancelling transcription ${id}:`, error);
            return { success: false, message: 'Errore durante l\'annullamento' };
        }
    }

    /**
     * Get supported AI providers and their capabilities
     * @returns {Object} AI providers information
     */
    getProviders() {
        return AI_PROVIDERS;
    }

    /**
     * Set AI provider configuration
     * @param {string} provider - Provider name
     * @param {string} [apiKey] - API key
     */
    setProvider(provider, apiKey) {
        if (!AI_PROVIDERS[provider]) {
            throw new Error(`Unknown provider: ${provider}`);
        }
        this.provider = provider;
        if (apiKey) {
            this.apiKey = apiKey;
        }
    }

    // Private methods

    /**
     * Check if user has given consent for transcription
     * @private
     * @returns {boolean} Whether consent is granted
     */
    _hasTranscriptionConsent() {
        try {
            const consent = localStorage.getItem('recording_consent');
            if (!consent) return false;
            const parsed = JSON.parse(consent);
            return parsed.transcription === true;
        } catch (e) {
            console.error('Error reading consent:', e);
            return false;
        }
    }

    /**
     * Validate transcription job data
     * @private
     * @param {TranscriptionJob} jobData - Job data to validate
     * @returns {Object} Validation result
     */
    _validateJob(jobData) {
        if (!jobData.recordingId) {
            return { valid: false, message: 'ID registrazione mancante', error: 'MISSING_RECORDING_ID' };
        }

        const providerConfig = AI_PROVIDERS[this.provider];
        if (!providerConfig) {
            return { valid: false, message: 'Provider AI non configurato', error: 'INVALID_PROVIDER' };
        }

        if (jobData.model && !providerConfig.models.includes(jobData.model)) {
            return {
                valid: false,
                message: `Modello non supportato dal provider ${this.provider}`,
                error: 'INVALID_MODEL'
            };
        }

        return { valid: true };
    }

    /**
     * Simulate network delay
     * @private
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise<void>}
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Mock data methods

    /**
     * Mock start transcription
     * @private
     * @param {TranscriptionJob} jobData - Job data
     * @returns {Promise<TranscriptionResult>} Job result
     */
    async _mockStartTranscription(jobData) {
        await this._delay(500);

        const transcription = {
            id: `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            recordingId: jobData.recordingId,
            status: 'pending',
            timestamp: new Date().toISOString(),
            language: jobData.language || 'it-IT',
            metadata: {
                provider: this.provider,
                model: jobData.model || this.defaultModel,
                options: jobData.options || {}
            }
        };

        // Store in localStorage
        const transcriptions = this._getStoredTranscriptions();
        transcriptions.push(transcription);
        this._saveStoredTranscriptions(transcriptions);

        // Simulate async processing
        this._simulateTranscriptionProcessing(transcription.id);

        this._logEvent('transcription_started', { id: transcription.id, recordingId: jobData.recordingId });

        return {
            success: true,
            message: 'Trascrizione avviata con successo',
            transcription
        };
    }

    /**
     * Simulate transcription processing (mock)
     * @private
     * @param {string} id - Transcription ID
     */
    async _simulateTranscriptionProcessing(id) {
        // Simulate processing delay (shorter for tests)
        const delay = 1000 + Math.random() * 500;

        setTimeout(() => {
            const transcriptions = this._getStoredTranscriptions();
            const transcription = transcriptions.find(t => t.id === id);

            if (!transcription) return;

            // Update status to processing
            transcription.status = 'processing';
            this._saveStoredTranscriptions(transcriptions);

            // Wait a bit more before completion
            setTimeout(() => {
                const transcriptions2 = this._getStoredTranscriptions();
                const transcription2 = transcriptions2.find(t => t.id === id);

                if (!transcription2) return;

                // Generate mock transcription text
                const mockTexts = [
                    'Oggi abbiamo studiato il teorema di Pitagora e le sue applicazioni pratiche.',
                    'Gli studenti hanno mostrato grande interesse durante la lezione di oggi.',
                    'Ricordarsi di assegnare gli esercizi da pagina 45 a 50 per la prossima settimana.',
                    'Ottima partecipazione della classe durante la discussione sul metodo scientifico.',
                    'Necessario rivedere i concetti di base prima di procedere con argomenti più avanzati.'
                ];

                transcription2.status = 'completed';
                transcription2.text = mockTexts[Math.floor(Math.random() * mockTexts.length)];
                transcription2.confidence = 0.85 + Math.random() * 0.15; // 0.85-1.0
                transcription2.completedAt = new Date().toISOString();

                this._saveStoredTranscriptions(transcriptions2);
            }, 1000);
        }, delay);
    }

    /**
     * Get single mock transcription by ID
     * @private
     * @param {string} id - Transcription ID
     * @returns {Promise<Transcription|null>} Transcription or null
     */
    async _getMockTranscription(id) {
        await this._delay(200);
        const transcriptions = this._getStoredTranscriptions();
        return transcriptions.find(t => t.id === id) || null;
    }

    /**
     * Get filtered mock transcriptions
     * @private
     * @param {Object} filter - Filter options
     * @returns {Promise<Transcription[]>} Filtered transcriptions
     */
    async _getMockTranscriptions(filter) {
        await this._delay(200);

        let transcriptions = this._getStoredTranscriptions();

        if (filter.recordingId) {
            transcriptions = transcriptions.filter(t => t.recordingId === filter.recordingId);
        }

        if (filter.status) {
            transcriptions = transcriptions.filter(t => t.status === filter.status);
        }

        return transcriptions;
    }

    /**
     * Mock cancel transcription
     * @private
     * @param {string} id - Transcription ID
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async _mockCancelTranscription(id) {
        await this._delay(300);

        const transcriptions = this._getStoredTranscriptions();
        const transcription = transcriptions.find(t => t.id === id);

        if (!transcription) {
            return { success: false, message: 'Trascrizione non trovata' };
        }

        if (transcription.status === 'completed' || transcription.status === 'failed') {
            return { success: false, message: 'Impossibile annullare una trascrizione completata o fallita' };
        }

        transcription.status = 'cancelled';
        this._saveStoredTranscriptions(transcriptions);

        this._logEvent('transcription_cancelled', { id });

        return { success: true, message: 'Trascrizione annullata con successo' };
    }

    /**
     * Get transcriptions from localStorage
     * @private
     * @returns {Transcription[]} Array of transcriptions
     */
    _getStoredTranscriptions() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error reading transcriptions from localStorage:', e);
            return [];
        }
    }

    /**
     * Save transcriptions to localStorage
     * @private
     * @param {Transcription[]} transcriptions - Transcriptions to save
     */
    _saveStoredTranscriptions(transcriptions) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(transcriptions));
        } catch (e) {
            console.error('Error saving transcriptions to localStorage:', e);
            throw new Error('Impossibile salvare la trascrizione');
        }
    }

    /**
     * Log event for monitoring
     * @private
     * @param {string} eventName - Event name
     * @param {Object} [data] - Event data
     */
    _logEvent(eventName, data = {}) {
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[TranscriptionsAPI Event] ${eventName}:`, data);
        }

        // TODO: In production, send to analytics/monitoring service
        // Example: analytics.track(eventName, data);
    }
}

// Export singleton instance
export const transcriptionsAPI = new TranscriptionsAPI();
