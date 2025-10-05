# OpenRouter API Integration Example

## Endpoint
```
https://openrouter.ai/api/v1/chat/completions
```

## Authentication
The API key is sent in the `Authorization` header as a Bearer token:
```
Authorization: Bearer YOUR_OPENROUTER_API_KEY
```

## Free Model Used
```
alibaba/tongyi-deepresearch-30b-a3b
```

## Example Request

### JavaScript Fetch Example
```javascript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_OPENROUTER_API_KEY`
    },
    body: JSON.stringify({
        model: 'alibaba/tongyi-deepresearch-30b-a3b',
        messages: [
            {
                role: 'system',
                content: 'Sei un assistente IA specializzato nell\'aiutare gli insegnanti con la pianificazione didattica, la creazione di materiali educativi e la gestione della classe. Rispondi sempre in italiano in modo chiaro e professionale.'
            },
            {
                role: 'user',
                content: 'Genera un piano di lezione per matematica'
            }
        ],
        temperature: 0.7,
        max_tokens: 2000
    })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### cURL Example
```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OPENROUTER_API_KEY" \
  -d '{
    "model": "alibaba/tongyi-deepresearch-30b-a3b",
    "messages": [
      {
        "role": "system",
        "content": "Sei un assistente IA specializzato nell'\''aiutare gli insegnanti con la pianificazione didattica, la creazione di materiali educativi e la gestione della classe. Rispondi sempre in italiano in modo chiaro e professionale."
      },
      {
        "role": "user",
        "content": "Genera un piano di lezione per matematica"
      }
    ],
    "temperature": 0.7,
    "max_tokens": 2000
  }'
```

## Response Format
The response follows the OpenAI-compatible format:
```json
{
  "id": "gen-xxxxxxxxxxxxx",
  "choices": [
    {
      "finish_reason": "stop",
      "message": {
        "content": "Ecco un piano di lezione per matematica...",
        "role": "assistant"
      },
      "index": 0
    }
  ],
  "created": 1234567890,
  "model": "alibaba/tongyi-deepresearch-30b-a3b",
  "object": "chat.completion"
}
```

## Getting Your API Key

1. Visit [https://openrouter.ai](https://openrouter.ai)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the key and paste it in the application settings

## Notes

- The `alibaba/tongyi-deepresearch-30b-a3b` model is a free model available on OpenRouter
- The API is compatible with OpenAI's chat completions format
- All messages and parameters are preserved from the original DeepSeek integration
- The application uses the same message structure and parameters (temperature, max_tokens)
