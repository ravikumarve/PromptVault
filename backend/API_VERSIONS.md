# Version Control API Documentation

## Overview

The version control API provides git-like functionality for managing prompt versions with automatic version numbering, commit messages, and diff capabilities.

## Base URL
```
http://localhost:8000/api
```

## Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer <access_token>
```

## Endpoints

### List Versions
```http
GET /prompts/{prompt_id}/versions
```

Returns all versions for a specific prompt, ordered by most recent first.

**Parameters:**
- `prompt_id` (path): ID of the prompt

**Response:**
```json
[
  {
    "id": 1,
    "prompt_id": 123,
    "content": "Prompt content",
    "version_number": 2,
    "message": "Improved wording",
    "model_tested": "gpt-4",
    "created_at": "2024-01-01T12:00:00Z"
  },
  {
    "id": 2,
    "prompt_id": 123,
    "content": "Initial prompt content",
    "version_number": 1,
    "message": "Initial version",
    "model_tested": "gpt-3.5-turbo",
    "created_at": "2024-01-01T11:00:00Z"
  }
]
```

**Error Responses:**
- `404 Not Found`: Prompt doesn't exist
- `403 Forbidden`: User doesn't own the prompt

---

### Create Version
```http
POST /prompts/{prompt_id}/versions
```

Creates a new version with automatic version numbering.

**Parameters:**
- `prompt_id` (path): ID of the prompt

**Request Body:**
```json
{
  "content": "string (required)",
  "message": "string (optional)",
  "model_tested": "string (optional)"
}
```

**Response:**
```json
{
  "id": 3,
  "prompt_id": 123,
  "content": "New prompt content",
  "version_number": 3,
  "message": "Final optimization",
  "model_tested": "gpt-4-turbo",
  "created_at": "2024-01-01T13:00:00Z"
}
```

**Error Responses:**
- `404 Not Found`: Prompt doesn't exist
- `403 Forbidden`: User doesn't own the prompt
- `400 Bad Request`: Content is empty

---

### Get Specific Version
```http
GET /prompts/{prompt_id}/versions/{version_id}
```

Retrieves a specific version by ID.

**Parameters:**
- `prompt_id` (path): ID of the prompt
- `version_id` (path): ID of the version

**Response:**
```json
{
  "id": 2,
  "prompt_id": 123,
  "content": "Initial prompt content",
  "version_number": 1,
  "message": "Initial version",
  "model_tested": "gpt-3.5-turbo",
  "created_at": "2024-01-01T11:00:00Z"
}
```

**Error Responses:**
- `404 Not Found`: Prompt or version doesn't exist
- `403 Forbidden`: User doesn't own the prompt

---

### Get Latest Version
```http
GET /prompts/{prompt_id}/versions/latest
```

Retrieves the most recent version of a prompt.

**Parameters:**
- `prompt_id` (path): ID of the prompt

**Response:**
```json
{
  "id": 3,
  "prompt_id": 123,
  "content": "New prompt content",
  "version_number": 3,
  "message": "Final optimization",
  "model_tested": "gpt-4-turbo",
  "created_at": "2024-01-01T13:00:00Z"
}
```

**Error Responses:**
- `404 Not Found`: Prompt doesn't exist or has no versions
- `403 Forbidden`: User doesn't own the prompt

---

### Get Version Diff
```http
GET /prompts/{prompt_id}/versions/{version_id}/diff
```

Returns a unified diff between the specified version and another version.

**Parameters:**
- `prompt_id` (path): ID of the prompt
- `version_id` (path): ID of the source version
- `target_version_id` (query, optional): ID of the target version

**Query Parameters:**
- `target_version_id`: If provided, compares with this specific version
- If not provided, compares with the previous version

**Response:**
```json
{
  "source_version_id": 3,
  "source_version_number": 3,
  "target_version_id": 2,
  "target_version_number": 2,
  "diff": "--- old\n+++ new\n@@ -1,1 +1,1 @@\n-Old content\n+New content\n"
}
```

**Error Responses:**
- `404 Not Found`: Prompt, source version, or target version doesn't exist
- `403 Forbidden`: User doesn't own the prompt
- `404 Not Found`: No previous version found (when target_version_id not provided)

---

### Compare Versions
```http
GET /prompts/{prompt_id}/versions/{version_id}/compare/{target_version_id}
```

Compares two specific versions and returns both versions plus their diff.

**Parameters:**
- `prompt_id` (path): ID of the prompt
- `version_id` (path): ID of the first version
- `target_version_id` (path): ID of the second version

**Response:**
```json
{
  "versions": {
    "source": {
      "id": 3,
      "prompt_id": 123,
      "content": "New prompt content",
      "version_number": 3,
      "message": "Final optimization",
      "model_tested": "gpt-4-turbo",
      "created_at": "2024-01-01T13:00:00Z"
    },
    "target": {
      "id": 1,
      "prompt_id": 123,
      "content": "Initial prompt content",
      "version_number": 1,
      "message": "Initial version",
      "model_tested": "gpt-3.5-turbo",
      "created_at": "2024-01-01T11:00:00Z"
    }
  },
  "diff": "--- old\n+++ new\n@@ -1,1 +1,1 @@\n-Old content\n+New content\n"
}
```

**Error Responses:**
- `404 Not Found`: Prompt or either version doesn't exist
- `403 Forbidden`: User doesn't own the prompt

## Usage Examples

### Creating a Version History

```bash
# Create initial version
curl -X POST "http://localhost:8000/api/prompts/123/versions" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "You are a helpful assistant",
    "message": "Initial version",
    "model_tested": "gpt-3.5-turbo"
  }'

# Create improved version
curl -X POST "http://localhost:8000/api/prompts/123/versions" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "You are an exceptionally helpful assistant",
    "message": "Added emphasis",
    "model_tested": "gpt-4"
  }'
```

### Viewing Version History

```bash
# List all versions
curl "http://localhost:8000/api/prompts/123/versions" \
  -H "Authorization: Bearer <token>"

# Get diff between versions 2 and 1
curl "http://localhost:8000/api/prompts/123/versions/2/diff?target_version_id=1" \
  -H "Authorization: Bearer <token>"

# Compare versions 3 and 1
curl "http://localhost:8000/api/prompts/123/versions/3/compare/1" \
  -H "Authorization: Bearer <token>"
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 403 | Forbidden - User doesn't own the prompt |
| 404 | Not Found - Prompt or version doesn't exist |
| 409 | Conflict - Version numbering issue |
| 500 | Internal Server Error |

## Rate Limiting

Version creation is rate-limited to prevent abuse:
- 100 requests per 15 minutes per IP address
- Additional limits may apply based on user authentication

## Best Practices

1. **Always provide meaningful commit messages** to track changes
2. **Record model testing information** to understand prompt performance
3. **Use version comparison** before creating new versions
4. **Regularly review version history** to maintain prompt quality
5. **Consider creating major versions** for significant changes

## Version Numbering Strategy

- Versions are numbered sequentially starting from 1
- Each new version increments the previous version number
- Version numbers are immutable once created
- The system automatically manages version numbering

## Diff Format

The diff uses standard unified diff format:
```
--- old
+++ new
@@ -1,3 +1,3 @@
-Line 1 old
-Line 2 old
-Line 3 old
+Line 1 new
+Line 2 new
+Line 3 new
```

This format is compatible with most diff viewers and tools.