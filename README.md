# Yes/No Oracle API

An AI-powered API that answers any yes-or-no question.

## Base URL

`hackathon-test-api-production.up.railway.app`

## Authentication

Requires an `OPENAI_API_KEY` environment variable set on the server. No client-side authentication needed.

## Response Format

All responses follow a consistent envelope:

| Field     | Type    | Description                  |
|-----------|---------|------------------------------|
| `success` | boolean | Whether the request succeeded |
| `data`    | object  | Present on success           |
| `error`   | object  | Present on failure           |

## Endpoints

### Health Check

```
GET /api/hello
```

**Response** `200 OK`

```json
{
  "success": true,
  "data": {
    "message": "hello"
  }
}
```

### Ask the Oracle

```
POST /api/oracle/ask
Content-Type: application/json
```

**Request body:**

| Field      | Type   | Required | Description                    |
|------------|--------|----------|--------------------------------|
| `question` | string | Yes      | A non-empty yes-or-no question |

**Example request:**

```json
{
  "question": "Will it rain tomorrow?"
}
```

**Response** `200 OK`

```json
{
  "success": true,
  "data": {
    "question": "Will it rain tomorrow?",
    "answer": "yes"
  }
}
```

**Response fields:**

| Field      | Type   | Description                      |
|------------|--------|----------------------------------|
| `question` | string | The submitted question (trimmed) |
| `answer`   | string | `"yes"` or `"no"`               |

### Errors

**Missing or empty question** `400 Bad Request`

```json
{
  "success": false,
  "error": {
    "message": "A non-empty 'question' string is required in the request body."
  }
}
```

**Not a yes/no question** `400 Bad Request`

```json
{
  "success": false,
  "error": {
    "message": "That is not a yes-or-no question."
  }
}
```

**Malformed JSON** `400 Bad Request`

```json
{
  "success": false,
  "error": {
    "message": "Malformed JSON in request body."
  }
}
```

**Oracle unavailable or failed** `502 Bad Gateway`

```json
{
  "success": false,
  "error": {
    "message": "Could not reach the oracle. Please try again."
  }
}
```

**Rate limited** `503 Service Unavailable`

```json
{
  "success": false,
  "error": {
    "message": "Oracle is overwhelmed. Please try again later."
  }
}
```

**Unknown route** `404 Not Found`

```json
{
  "success": false,
  "error": {
    "message": "Cannot POST /api/unknown"
  }
}
```
