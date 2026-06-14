# Git-like Version Control System for PromptVault

This document describes the comprehensive version control system implemented for PromptVault prompts, providing git-like functionality for tracking prompt changes.

## Overview

The version control system allows users to:
- Track multiple versions of their prompts
- Add commit messages explaining changes
- Record which AI models were tested
- View diffs between versions
- Maintain a complete history of prompt evolution

## API Endpoints

### List Versions
```http
GET /api/prompts/{prompt_id}/versions
```
Returns all versions for a prompt, ordered by most recent first.

### Create Version
```http
POST /api/prompts/{prompt_id}/versions
```
Creates a new version with automatic version numbering.

**Request Body:**
```json
{
  "content": "string",
  "message": "string (optional)",
  "model_tested": "string (optional)"
}
```

### Get Specific Version
```http
GET /api/prompts/{prompt_id}/versions/{version_id}
```
Retrieves a specific version by ID.

### Get Latest Version
```http
GET /api/prompts/{prompt_id}/versions/latest
```
Retrieves the most recent version of a prompt.

### Get Version Diff
```http
GET /api/prompts/{prompt_id}/versions/{version_id}/diff
```
Returns a unified diff between the specified version and:
- A specific target version (if `target_version_id` query parameter provided)
- The previous version (if no target specified)

### Compare Versions
```http
GET /api/prompts/{prompt_id}/versions/{version_id}/compare/{target_version_id}
```
Compares two specific versions and returns both versions plus their diff.

## Database Schema

### PromptVersion Model
```python
class PromptVersion(Base):
    __tablename__ = "prompt_versions"

    id = Column(Integer, primary_key=True, index=True)
    prompt_id = Column(Integer, ForeignKey("prompts.id"), nullable=False)
    content = Column(String, nullable=False)
    version_number = Column(Integer, nullable=False)
    message = Column(String)
    model_tested = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    prompt = relationship("Prompt", back_populates="versions")
```

### Prompt Model (updated)
```python
class Prompt(Base):
    __tablename__ = "prompts"

    # ... existing fields ...
    versions = relationship(
        "PromptVersion",
        back_populates="prompt",
        cascade="all, delete-orphan",
        lazy="select",
    )
```

## Key Features

### Automatic Version Numbering
- Versions are automatically numbered sequentially (1, 2, 3, ...)
- The system determines the next version number based on existing versions
- Version numbers are immutable once created

### Commit Messages
- Users can provide optional commit messages explaining changes
- Messages are stored with each version for historical context

### Model Testing Tracking
- Users can record which AI models were tested with each version
- Helps track prompt performance across different models

### Diff Calculation
- Uses Python's `difflib.unified_diff` for accurate diff generation
- Supports comparison between any two versions
- Returns standard unified diff format

### Authorization
- Only prompt owners can access version history
- Comprehensive permission checking on all endpoints
- Prevents unauthorized access to prompt versions

## Error Handling

The system includes comprehensive error handling:

- **404 Not Found**: Prompt or version doesn't exist
- **403 Forbidden**: User doesn't own the prompt
- **400 Bad Request**: Invalid input (e.g., empty content)
- **409 Conflict**: Version numbering conflicts

## Usage Examples

### Creating a New Version
```python
import requests

# Create initial version
response = requests.post(
    "/api/prompts/123/versions",
    json={
        "content": "Initial prompt content",
        "message": "First version",
        "model_tested": "gpt-3.5-turbo"
    },
    headers={"Authorization": "Bearer <token>"}
)

# Create updated version
response = requests.post(
    "/api/prompts/123/versions", 
    json={
        "content": "Improved prompt content",
        "message": "Optimized for clarity",
        "model_tested": "gpt-4"
    },
    headers={"Authorization": "Bearer <token>"}
)
```

### Viewing Version History
```python
# List all versions
versions = requests.get(
    "/api/prompts/123/versions",
    headers={"Authorization": "Bearer <token>"}
).json()

# Get diff between versions v2 and v1
diff = requests.get(
    "/api/prompts/123/versions/2/diff?target_version_id=1",
    headers={"Authorization": "Bearer <token>"}
).json()
```

## Testing

Run the comprehensive test suite:

```bash
python backend/test_versions.py
```

The test script verifies:
- Version creation with automatic numbering
- Version listing and retrieval
- Diff calculation
- Authorization checks
- Error handling

## Integration with Frontend

The version control system is designed to work seamlessly with the PromptVault frontend:

1. **Create Version**: Call when users save prompt changes
2. **List Versions**: Display version history in UI
3. **View Diffs**: Show changes between versions
4. **Revert**: Allow reverting to previous versions

## Security Considerations

- All endpoints require authentication
- Users can only access their own prompt versions
- Input validation prevents malicious content
- No version deletion (maintains complete history)

## Performance

- Database queries are optimized with proper indexing
- Version listing uses efficient ordering
- Diff calculation happens server-side
- Caching strategies can be implemented for frequently accessed versions

## Future Enhancements

Potential future features:
- Version tagging (e.g., "stable", "experimental")
- Branching and merging capabilities
- Collaborative versioning
- Version export/import
- Bulk operations on versions