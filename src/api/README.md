# API Module Documentation

This directory contains API client modules for the Docente++ application. These clients are designed to work with both mock data (for development/demo) and real backend services (for production).

## Architecture

All API clients follow a consistent pattern:

1. **Mock-first approach**: By default, use localStorage and mock data
2. **Backend-ready**: Easy to switch to real API calls
3. **Error handling**: Graceful fallback to mock data on errors
4. **Type documentation**: JSDoc types for all methods and parameters

## Available APIs

### RecordingsAPI (`recordings.js`)

Manages audio recordings with support for upload, storage, retrieval, and deletion.

**Key Features:**
- Upload audio recordings (multipart/form-data)
- List recordings with filtering
- Delete recordings
- Storage quota management
- Privacy consent management
- Automatic cleanup based on retention policy

**Usage:**
```javascript
import { recordingsAPI } from './src/api/recordings.js';

// Set user consent
recordingsAPI.setUserConsent({
    recording: true,
    transcription: true
});

// Upload recording
const result = await recordingsAPI.uploadRecording({
    blob: audioBlob,
    lessonKey: 'Lunedì-08:00',
    duration: 120,
    fileName: 'recording.webm'
});

// List recordings
const recordings = await recordingsAPI.getRecordings({
    lessonKey: 'Lunedì-08:00'
});

// Get storage statistics
const stats = await recordingsAPI.getStorageStats();

// Delete recording
await recordingsAPI.deleteRecording(recordingId);
```

**Backend Integration:**

To integrate with a real backend, set `useMock: false`:

```javascript
const recordingsAPI = new RecordingsAPI({
    useMock: false,
    baseURL: 'https://api.docente-plus-plus.com'
});
```

**Expected Backend Endpoints:**

```
POST   /api/recordings              # Upload audio (multipart/form-data)
GET    /api/recordings              # List recordings
GET    /api/recordings/:id          # Get single recording
DELETE /api/recordings/:id          # Delete recording
```

**Request Format (POST):**
```
Content-Type: multipart/form-data

Fields:
- audio: File (required)
- lessonKey: String (required)
- duration: Number (required)
```

**Response Format:**
```json
{
    "id": "rec_123",
    "lessonKey": "Lunedì-08:00",
    "timestamp": "2025-10-19T19:42:53.272Z",
    "duration": 120,
    "fileName": "recording.webm",
    "fileSize": 1234567,
    "mimeType": "audio/webm",
    "status": "uploaded",
    "url": "https://storage.example.com/recordings/rec_123.webm"
}
```

### TranscriptionsAPI (`transcriptions.js`)

Manages AI-powered audio transcription jobs with support for multiple providers (OpenAI Whisper, Google Speech-to-Text).

**Key Features:**
- Start transcription jobs
- Poll for transcription status
- Support for multiple AI providers
- Automatic status updates
- Cancel in-progress transcriptions

**Usage:**
```javascript
import { transcriptionsAPI } from './src/api/transcriptions.js';

// Start transcription
const result = await transcriptionsAPI.startTranscription({
    recordingId: 'rec_123',
    language: 'it-IT',
    model: 'whisper-1'
});

// Poll for completion
const completed = await transcriptionsAPI.pollTranscription(
    result.transcription.id,
    {
        interval: 2000,
        timeout: 300000,
        onProgress: (t) => console.log('Status:', t.status)
    }
);

console.log('Transcribed text:', completed.text);
```

**Backend Integration:**

```javascript
const transcriptionsAPI = new TranscriptionsAPI({
    useMock: false,
    baseURL: 'https://api.docente-plus-plus.com',
    provider: 'openai',
    apiKey: 'your-api-key'
});
```

**Expected Backend Endpoints:**

```
POST   /api/transcriptions              # Start transcription job
GET    /api/transcriptions/:id          # Get transcription status
POST   /api/transcriptions/:id/cancel   # Cancel transcription
GET    /api/transcriptions              # List transcriptions
```

**Request Format (POST):**
```json
{
    "recordingId": "rec_123",
    "language": "it-IT",
    "model": "whisper-1",
    "options": {}
}
```

**Response Format:**
```json
{
    "id": "trans_456",
    "recordingId": "rec_123",
    "status": "pending|processing|completed|failed|cancelled",
    "text": "Transcribed text here",
    "language": "it-IT",
    "confidence": 0.95,
    "timestamp": "2025-10-19T19:42:53.272Z",
    "completedAt": "2025-10-19T19:45:53.272Z"
}
```

### LessonsAPI (`lessons.js`)

Manages lesson data with filtering and enrollment capabilities.

**Usage:**
```javascript
import { lessonsAPI } from './src/api/lessons.js';

// Get all lessons
const lessons = await lessonsAPI.getLessons();

// Filter lessons
const filtered = await lessonsAPI.getLessons({
    subject: 'Matematica',
    status: 'scheduled'
});

// Get single lesson
const lesson = await lessonsAPI.getLesson('lesson-001');
```

## Integration Patterns

### Firebase Backend

For Firebase integration, implement a middleware layer:

```javascript
// firebase-recordings.js
import { recordingsAPI } from './src/api/recordings.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

class FirebaseRecordingsAdapter {
    constructor() {
        this.storage = getStorage();
        this.db = getFirestore();
        this.recordingsAPI = recordingsAPI;
    }

    async uploadRecording(data) {
        // Upload to Firebase Storage
        const storageRef = ref(this.storage, `recordings/${data.lessonKey}/${Date.now()}.webm`);
        const snapshot = await uploadBytes(storageRef, data.blob);
        const url = await getDownloadURL(snapshot.ref);

        // Store metadata in Firestore
        const docRef = await addDoc(collection(this.db, 'recordings'), {
            lessonKey: data.lessonKey,
            duration: data.duration,
            fileName: data.fileName,
            fileSize: data.blob.size,
            mimeType: data.blob.type,
            status: 'uploaded',
            url: url,
            timestamp: new Date().toISOString()
        });

        return {
            success: true,
            recording: {
                id: docRef.id,
                ...data,
                url: url,
                status: 'uploaded'
            }
        };
    }

    async getRecordings(filter) {
        let q = collection(this.db, 'recordings');
        
        if (filter.lessonKey) {
            q = query(q, where('lessonKey', '==', filter.lessonKey));
        }

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }
}

export const firebaseRecordings = new FirebaseRecordingsAdapter();
```

### REST API Backend

For a Node.js/Express backend:

```javascript
// server/routes/recordings.js
const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// POST /api/recordings
router.post('/', upload.single('audio'), async (req, res) => {
    try {
        const { lessonKey, duration } = req.body;
        const audioFile = req.file;

        // Validate consent
        // Check quotas
        // Upload to storage (S3, GCS, etc.)
        // Save metadata to database
        
        res.json({
            id: 'rec_123',
            lessonKey,
            duration: parseInt(duration),
            fileName: audioFile.originalname,
            fileSize: audioFile.size,
            mimeType: audioFile.mimetype,
            status: 'uploaded',
            url: 'https://storage.example.com/...'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/recordings
router.get('/', async (req, res) => {
    const { lessonKey, status } = req.query;
    // Query database with filters
    // Return recordings
    res.json(recordings);
});

module.exports = router;
```

## Privacy and Consent

All recording and transcription operations require user consent:

```javascript
// Check consent before recording
const consent = recordingsAPI.getUserConsent();
if (!consent.recording) {
    // Show consent dialog
    recordingsAPI.setUserConsent({
        recording: true,
        transcription: false
    });
}

// Check transcription consent separately
if (consent.transcription) {
    await transcriptionsAPI.startTranscription({...});
}
```

## Error Handling

All API methods follow consistent error handling patterns:

```javascript
try {
    const result = await recordingsAPI.uploadRecording(data);
    if (result.success) {
        // Handle success
    } else {
        // Handle API-level error
        console.error(result.error, result.message);
    }
} catch (error) {
    // Handle network/system error
    console.error('System error:', error);
}
```

**Common Error Codes:**

- `CONSENT_REQUIRED`: User consent not given
- `MISSING_FILE`: Required file not provided
- `INVALID_DURATION`: Duration validation failed
- `DURATION_EXCEEDED`: Exceeds max duration limit
- `FILE_TOO_LARGE`: File size exceeds quota
- `INVALID_MIME_TYPE`: Unsupported file format
- `QUOTA_EXCEEDED`: Storage quota exceeded
- `PROVIDER_UNREACHABLE`: AI provider not available

## Monitoring and Logging

All APIs include built-in logging hooks:

```javascript
// APIs automatically log events
// In development: console.log
// In production: integrate with analytics service

// Example events logged:
// - recording_uploaded
// - recording_deleted
// - transcription_started
// - transcription_completed
// - transcription_failed
// - provider_unreachable
```

## Testing

Comprehensive test suites are available in `tests/unit/api/`:

```bash
# Run all API tests
npm test -- tests/unit/api/

# Run specific API tests
npm test -- tests/unit/api/recordings-api.test.js
npm test -- tests/unit/api/transcriptions-api.test.js
```

## Configuration

### Quota Limits

```javascript
const recordingsAPI = new RecordingsAPI({
    quotaLimits: {
        maxFileSize: 50 * 1024 * 1024,    // 50 MB
        maxTotalSize: 500 * 1024 * 1024,  // 500 MB
        maxRecordings: 100,
        maxDuration: 3600                  // 1 hour
    }
});
```

### Retention Policy

```javascript
const recordingsAPI = new RecordingsAPI({
    privacyConfig: {
        defaultRetentionDays: 90,
        requiresConsent: true,
        allowTranscription: false
    }
});

// Manual cleanup
await recordingsAPI.cleanupOldRecordings();
```

### AI Providers

```javascript
// OpenAI Whisper
transcriptionsAPI.setProvider('openai', 'sk-...');

// Google Speech-to-Text
transcriptionsAPI.setProvider('google', 'AIza...');

// Get provider capabilities
const providers = transcriptionsAPI.getProviders();
console.log(providers.openai.models); // ['whisper-1']
```

## Future Enhancements

Planned features for future releases:

1. **Batch processing**: Process multiple recordings at once
2. **Webhooks**: Real-time notifications for transcription completion
3. **Multiple languages**: Auto-detect and support more languages
4. **Speaker diarization**: Identify different speakers in recordings
5. **Sentiment analysis**: Analyze tone and sentiment
6. **Summary generation**: Auto-generate lesson summaries from transcriptions
7. **Export formats**: Support for PDF, DOCX, SRT subtitles

## Support

For issues or questions:
- Check existing tests for usage examples
- Review JSDoc comments in source files
- Open an issue on GitHub

## License

MIT License - See LICENSE file in project root
