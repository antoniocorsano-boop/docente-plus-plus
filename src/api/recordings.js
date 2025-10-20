/**
 * @file Recordings API Client
 * @description API client for managing audio recordings with mock data support
 * @module api/recordings
 */

/**
 * @typedef {Object} Recording
 * @property {string} id - Unique recording identifier
 * @property {string} lessonKey - Lesson key (e.g., "Lunedì-08:00")
 * @property {string} timestamp - ISO 8601 timestamp
 * @property {number} duration - Duration in seconds
 * @property {string} fileName - Original file name
 * @property {number} fileSize - File size in bytes
 * @property {string} mimeType - MIME type (e.g., "audio/webm")
 * @property {string} status - Recording status (uploaded, processing, ready, error)
 * @property {Blob} [blob] - Audio blob (client-side only)
 * @property {string} [url] - Audio URL (for playback)
 * @property {Object} [metadata] - Additional metadata
 */

/**
 * @typedef {Object} RecordingsFilter
 * @property {string} [lessonKey] - Filter by lesson
 * @property {string} [status] - Filter by status
 * @property {string} [dateFrom] - Filter from date (ISO format)
 * @property {string} [dateTo] - Filter to date (ISO format)
 */

/**
 * @typedef {Object} UploadResult
 * @property {boolean} success - Whether upload was successful
 * @property {string} message - Result message
 * @property {Recording} [recording] - Uploaded recording object
 * @property {string} [error] - Error details if failed
 */

/**
 * Storage quota configuration
 * @constant
 */
const QUOTA_LIMITS = {
    maxFileSize: 50 * 1024 * 1024, // 50 MB
    maxTotalSize: 500 * 1024 * 1024, // 500 MB
    maxRecordings: 100,
    maxDuration: 3600 // 1 hour in seconds
};

/**
 * Privacy and retention configuration
 * @constant
 */
const PRIVACY_CONFIG = {
    defaultRetentionDays: 90,
    requiresConsent: true,
    allowTranscription: false // Default opt-out for transcription
};

/**
 * Recordings API client
 * @class
 */
export class RecordingsAPI {
    /**
     * @param {Object} config - Configuration options
     * @param {string} [config.baseURL] - Base URL for API (for future integration)
     * @param {boolean} [config.useMock=true] - Use mock data instead of real API
     * @param {Object} [config.quotaLimits] - Custom quota limits
     * @param {Object} [config.privacyConfig] - Custom privacy configuration
     */
    constructor(config = {}) {
        this.baseURL = config.baseURL || '/api';
        this.useMock = config.useMock !== false; // Default to true
        this.quotaLimits = { ...QUOTA_LIMITS, ...config.quotaLimits };
        this.privacyConfig = { ...PRIVACY_CONFIG, ...config.privacyConfig };
        this.storageKey = 'recordings';
    }

    /**
     * Upload a new audio recording
     * @param {Object} recordingData - Recording data
     * @param {Blob} recordingData.blob - Audio blob
     * @param {string} recordingData.lessonKey - Lesson identifier
     * @param {number} recordingData.duration - Duration in seconds
     * @param {string} [recordingData.fileName] - Original file name
     * @returns {Promise<UploadResult>} Upload result
     */
    async uploadRecording(recordingData) {
        // Check consent
        if (!this._hasUserConsent()) {
            return {
                success: false,
                message: 'È necessario fornire il consenso per registrare audio',
                error: 'CONSENT_REQUIRED'
            };
        }

        // Validate recording
        const validation = this._validateRecording(recordingData);
        if (!validation.valid) {
            return {
                success: false,
                message: validation.message,
                error: validation.error
            };
        }

        // Check quota
        const quotaCheck = await this._checkQuota(recordingData.blob.size);
        if (!quotaCheck.allowed) {
            return {
                success: false,
                message: quotaCheck.message,
                error: 'QUOTA_EXCEEDED'
            };
        }

        if (this.useMock) {
            return this._mockUploadRecording(recordingData);
        }

        // TODO: Replace with real API call when backend is ready
        try {
            const formData = new FormData();
            formData.append('audio', recordingData.blob, recordingData.fileName || 'recording.webm');
            formData.append('lessonKey', recordingData.lessonKey);
            formData.append('duration', recordingData.duration.toString());

            const response = await fetch(`${this.baseURL}/recordings`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return {
                success: true,
                message: 'Registrazione caricata con successo',
                recording: result
            };
        } catch (error) {
            console.error('Error uploading recording:', error);
            // Fallback to mock on error
            return this._mockUploadRecording(recordingData);
        }
    }

    /**
     * Get all recordings with optional filtering
     * @param {RecordingsFilter} [filter={}] - Filter options
     * @returns {Promise<Recording[]>} Array of recordings
     */
    async getRecordings(filter = {}) {
        if (this.useMock) {
            return this._getMockRecordings(filter);
        }

        // TODO: Replace with real API call
        try {
            const queryParams = new URLSearchParams(filter).toString();
            const response = await fetch(`${this.baseURL}/recordings?${queryParams}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching recordings:', error);
            return this._getMockRecordings(filter);
        }
    }

    /**
     * Get a single recording by ID
     * @param {string} id - Recording ID
     * @returns {Promise<Recording|null>} Recording object or null if not found
     */
    async getRecording(id) {
        if (this.useMock) {
            return this._getMockRecording(id);
        }

        // TODO: Replace with real API call
        try {
            const response = await fetch(`${this.baseURL}/recordings/${id}`);

            if (response.status === 404) {
                return null;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching recording ${id}:`, error);
            return this._getMockRecording(id);
        }
    }

    /**
     * Delete a recording
     * @param {string} id - Recording ID
     * @returns {Promise<{success: boolean, message: string}>} Deletion result
     */
    async deleteRecording(id) {
        if (this.useMock) {
            return this._mockDeleteRecording(id);
        }

        // TODO: Replace with real API call
        try {
            const response = await fetch(`${this.baseURL}/recordings/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error deleting recording ${id}:`, error);
            return { success: false, message: 'Errore durante la cancellazione' };
        }
    }

    /**
     * Get current storage usage statistics
     * @returns {Promise<Object>} Storage statistics
     */
    async getStorageStats() {
        const recordings = await this.getRecordings();
        const totalSize = recordings.reduce((sum, r) => sum + (r.fileSize || 0), 0);
        const totalCount = recordings.length;
        const totalDuration = recordings.reduce((sum, r) => sum + (r.duration || 0), 0);

        return {
            totalSize,
            totalCount,
            totalDuration,
            maxFileSize: this.quotaLimits.maxFileSize,
            maxTotalSize: this.quotaLimits.maxTotalSize,
            maxRecordings: this.quotaLimits.maxRecordings,
            percentUsed: this.quotaLimits.maxTotalSize > 0 ? (totalSize / this.quotaLimits.maxTotalSize) * 100 : 0,
            remainingSize: this.quotaLimits.maxTotalSize - totalSize,
            remainingCount: this.quotaLimits.maxRecordings - totalCount
        };
    }

    /**
     * Clean up old recordings based on retention policy
     * @returns {Promise<{deleted: number, message: string}>} Cleanup result
     */
    async cleanupOldRecordings() {
        const recordings = await this.getRecordings();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.privacyConfig.defaultRetentionDays);

        const toDelete = recordings.filter(r => new Date(r.timestamp) < cutoffDate);

        let deleted = 0;
        for (const recording of toDelete) {
            const result = await this.deleteRecording(recording.id);
            if (result.success) {
                deleted++;
            }
        }

        return {
            deleted,
            message: `${deleted} registrazioni vecchie eliminate secondo la policy di retention`
        };
    }

    /**
     * Set user consent for recording and transcription
     * @param {Object} consent - Consent settings
     * @param {boolean} consent.recording - Allow recording
     * @param {boolean} consent.transcription - Allow transcription
     */
    setUserConsent(consent) {
        localStorage.setItem('recording_consent', JSON.stringify({
            recording: consent.recording || false,
            transcription: consent.transcription || false,
            timestamp: new Date().toISOString()
        }));
    }

    /**
     * Get user consent status
     * @returns {Object} Current consent settings
     */
    getUserConsent() {
        try {
            const consent = localStorage.getItem('recording_consent');
            return consent ? JSON.parse(consent) : {
                recording: false,
                transcription: false,
                timestamp: null
            };
        } catch (e) {
            console.error('Error reading consent:', e);
            return { recording: false, transcription: false, timestamp: null };
        }
    }

    // Private methods

    /**
     * Check if user has given consent for recording
     * @private
     * @returns {boolean} Whether consent is granted
     */
    _hasUserConsent() {
        if (!this.privacyConfig.requiresConsent) {
            return true; // Consent not required
        }
        const consent = this.getUserConsent();
        return consent.recording === true;
    }

    /**
     * Validate recording data
     * @private
     * @param {Object} recordingData - Recording data to validate
     * @returns {Object} Validation result
     */
    _validateRecording(recordingData) {
        if (!recordingData.blob) {
            return { valid: false, message: 'File audio mancante', error: 'MISSING_FILE' };
        }

        if (!recordingData.lessonKey) {
            return { valid: false, message: 'Lezione non specificata', error: 'MISSING_LESSON' };
        }

        if (!recordingData.duration || recordingData.duration <= 0) {
            return { valid: false, message: 'Durata non valida', error: 'INVALID_DURATION' };
        }

        if (recordingData.duration > this.quotaLimits.maxDuration) {
            return {
                valid: false,
                message: `Durata massima superata (max ${this.quotaLimits.maxDuration}s)`,
                error: 'DURATION_EXCEEDED'
            };
        }

        if (recordingData.blob.size > this.quotaLimits.maxFileSize) {
            return {
                valid: false,
                message: `File troppo grande (max ${this._formatBytes(this.quotaLimits.maxFileSize)})`,
                error: 'FILE_TOO_LARGE'
            };
        }

        // Validate MIME type
        const validTypes = ['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg', 'audio/wav'];
        if (!validTypes.includes(recordingData.blob.type)) {
            return {
                valid: false,
                message: `Tipo di file non supportato: ${recordingData.blob.type}`,
                error: 'INVALID_MIME_TYPE'
            };
        }

        return { valid: true };
    }

    /**
     * Check storage quota
     * @private
     * @param {number} newFileSize - Size of file to be added
     * @returns {Promise<Object>} Quota check result
     */
    async _checkQuota(newFileSize) {
        const stats = await this.getStorageStats();

        if (stats.totalCount >= this.quotaLimits.maxRecordings) {
            return {
                allowed: false,
                message: `Numero massimo di registrazioni raggiunto (${this.quotaLimits.maxRecordings})`
            };
        }

        if (stats.totalSize + newFileSize > this.quotaLimits.maxTotalSize) {
            return {
                allowed: false,
                message: `Spazio di archiviazione insufficiente. Elimina alcune registrazioni vecchie.`
            };
        }

        return { allowed: true };
    }

    /**
     * Format bytes to human-readable string
     * @private
     * @param {number} bytes - Number of bytes
     * @returns {string} Formatted string
     */
    _formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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
     * Mock upload recording
     * @private
     * @param {Object} recordingData - Recording data
     * @returns {Promise<UploadResult>} Upload result
     */
    async _mockUploadRecording(recordingData) {
        await this._delay(500);

        const recording = {
            id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            lessonKey: recordingData.lessonKey,
            timestamp: new Date().toISOString(),
            duration: recordingData.duration,
            fileName: recordingData.fileName || `recording_${Date.now()}.webm`,
            fileSize: recordingData.blob.size,
            mimeType: recordingData.blob.type,
            status: 'uploaded',
            url: typeof URL !== 'undefined' && URL.createObjectURL ? URL.createObjectURL(recordingData.blob) : 'blob:mock-url',
            metadata: {
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'test',
                timestamp: Date.now()
            }
        };

        // Store in localStorage
        const recordings = this._getStoredRecordings();
        recordings.push(recording);
        this._saveStoredRecordings(recordings);

        this._logEvent('recording_uploaded', { id: recording.id, lessonKey: recording.lessonKey });

        return {
            success: true,
            message: 'Registrazione caricata con successo',
            recording
        };
    }

    /**
     * Get filtered mock recordings
     * @private
     * @param {RecordingsFilter} filter - Filter options
     * @returns {Promise<Recording[]>} Filtered recordings
     */
    async _getMockRecordings(filter) {
        await this._delay(200);

        let recordings = this._getStoredRecordings();

        // Apply filters
        if (filter.lessonKey) {
            recordings = recordings.filter(r => r.lessonKey === filter.lessonKey);
        }

        if (filter.status) {
            recordings = recordings.filter(r => r.status === filter.status);
        }

        if (filter.dateFrom) {
            recordings = recordings.filter(r => r.timestamp >= filter.dateFrom);
        }

        if (filter.dateTo) {
            recordings = recordings.filter(r => r.timestamp <= filter.dateTo);
        }

        return recordings;
    }

    /**
     * Get single mock recording by ID
     * @private
     * @param {string} id - Recording ID
     * @returns {Promise<Recording|null>} Recording or null
     */
    async _getMockRecording(id) {
        await this._delay(200);
        const recordings = this._getStoredRecordings();
        return recordings.find(r => r.id === id) || null;
    }

    /**
     * Mock delete recording
     * @private
     * @param {string} id - Recording ID
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async _mockDeleteRecording(id) {
        await this._delay(300);

        const recordings = this._getStoredRecordings();
        const index = recordings.findIndex(r => r.id === id);

        if (index === -1) {
            return { success: false, message: 'Registrazione non trovata' };
        }

        recordings.splice(index, 1);
        this._saveStoredRecordings(recordings);

        this._logEvent('recording_deleted', { id });

        return { success: true, message: 'Registrazione eliminata con successo' };
    }

    /**
     * Get recordings from localStorage
     * @private
     * @returns {Recording[]} Array of recordings
     */
    _getStoredRecordings() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error reading recordings from localStorage:', e);
            return [];
        }
    }

    /**
     * Save recordings to localStorage
     * @private
     * @param {Recording[]} recordings - Recordings to save
     */
    _saveStoredRecordings(recordings) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(recordings));
        } catch (e) {
            console.error('Error saving recordings to localStorage:', e);
            throw new Error('Impossibile salvare la registrazione');
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
            console.log(`[RecordingsAPI Event] ${eventName}:`, data);
        }

        // TODO: In production, send to analytics/monitoring service
        // Example: analytics.track(eventName, data);
    }
}

// Export singleton instance
export const recordingsAPI = new RecordingsAPI();
