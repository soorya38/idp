# API Reference

## Authentication

All API requests require authentication using JWT tokens or API keys.

### JWT Authentication
```bash
curl -H "Authorization: Bearer <jwt_token>" \
  https://api.platform.company.com/v1/services
```

### API Key Authentication
```bash
curl -H "X-API-Key: <api_key>" \
  https://api.platform.company.com/v1/services
```

## Services API

### List Services
```http
GET /api/v1/services
```

**Parameters:**
- `environment` (optional): Filter by environment
- `status` (optional): Filter by status
- `limit` (optional): Number of results per page (default: 20)
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "services": [
    {
      "id": "user-service",
      "name": "User Service",
      "description": "Handles user authentication and profiles",
      "status": "running",
      "version": "v2.4.1",
      "environment": "production",
      "health_score": 98,
      "instances": 5,
      "endpoints": ["/api/v1/users", "/api/v1/auth"],
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T14:30:00Z"
    }
  ],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```

### Get Service Details
```http
GET /api/v1/services/{service_id}
```

**Response:**
```json
{
  "id": "user-service",
  "name": "User Service",
  "description": "Handles user authentication and profiles",
  "status": "running",
  "version": "v2.4.1",
  "environment": "production",
  "health_score": 98,
  "instances": 5,
  "resources": {
    "cpu": 45,
    "memory": 62,
    "storage": 35
  },
  "endpoints": ["/api/v1/users", "/api/v1/auth"],
  "dependencies": ["postgres-db", "redis-cache"],
  "repository": "github.com/company/user-service",
  "owner": "Backend Team",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T14:30:00Z"
}
```

### Deploy Service
```http
POST /api/v1/services/{service_id}/deploy
```

**Request Body:**
```json
{
  "environment": "staging",
  "version": "v2.4.2",
  "config": {
    "replicas": 3,
    "resources": {
      "cpu": "500m",
      "memory": "1Gi"
    }
  }
}
```

## Environments API

### List Environments
```http
GET /api/v1/environments
```

### Create Environment
```http
POST /api/v1/environments
```

**Request Body:**
```json
{
  "name": "staging-v2",
  "type": "staging",
  "cluster": "staging-cluster",
  "namespace": "staging-v2",
  "config": {
    "auto_deploy": true,
    "resource_limits": {
      "cpu": "10",
      "memory": "20Gi"
    }
  }
}
```

## Pipelines API

### List Pipelines
```http
GET /api/v1/pipelines
```

### Trigger Pipeline
```http
POST /api/v1/pipelines/{pipeline_id}/run
```

**Request Body:**
```json
{
  "branch": "main",
  "environment": "production",
  "parameters": {
    "skip_tests": false,
    "deploy_immediately": true
  }
}
```

## Infrastructure API

### List Resources
```http
GET /api/v1/infrastructure/resources
```

### Provision Resource
```http
POST /api/v1/infrastructure/resources
```

**Request Body:**
```json
{
  "type": "server",
  "provider": "aws",
  "region": "us-east-1",
  "specs": {
    "instance_type": "t3.large",
    "storage": "100GB"
  },
  "tags": {
    "environment": "production",
    "team": "platform"
  }
}
```

## Error Responses

All API endpoints return consistent error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "environment",
        "message": "Environment 'invalid' does not exist"
      }
    ]
  }
}
```

### Common Error Codes

- `AUTHENTICATION_REQUIRED`: Missing or invalid authentication
- `AUTHORIZATION_DENIED`: Insufficient permissions
- `VALIDATION_ERROR`: Invalid request parameters
- `RESOURCE_NOT_FOUND`: Requested resource does not exist
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Rate Limiting

API requests are rate limited:
- **Authenticated users**: 1000 requests per hour
- **API keys**: 5000 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642694400
```