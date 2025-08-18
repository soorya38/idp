# Internal Developer Platform - Backend Requirements

## Overview

This document outlines the backend architecture and requirements for the Internal Developer Platform (IDP). The platform provides a unified interface for managing applications, infrastructure, deployments, and team collaboration in a modern DevOps environment.

## Architecture Overview

The backend follows a microservices architecture with the following core principles:
- **API-First Design**: All services expose RESTful APIs with OpenAPI specifications
- **Event-Driven Architecture**: Services communicate via message queues for async operations
- **Container-Native**: All services are containerized and orchestrated via Kubernetes
- **Observability**: Comprehensive logging, metrics, and tracing across all services
- **Security**: Zero-trust security model with RBAC and service mesh

## Core Services

### 1. Authentication & Authorization Service
**Purpose**: Centralized identity management and access control

**Technologies**: 
- Node.js/Express or Go
- JWT tokens with refresh mechanism
- OAuth 2.0/OIDC integration
- Redis for session storage

**Key Features**:
- User authentication (email/password, SSO)
- Role-based access control (RBAC)
- Team and organization management
- API key management
- Multi-factor authentication (MFA)

**Database Schema**:
```sql
-- Users table
users (id, email, password_hash, name, avatar_url, status, created_at, updated_at)

-- Roles and permissions
roles (id, name, description, permissions)
user_roles (user_id, role_id, scope, created_at)

-- Organizations and teams
organizations (id, name, slug, settings)
teams (id, org_id, name, description, members)
team_memberships (user_id, team_id, role, joined_at)

-- API keys
api_keys (id, user_id, name, key_hash, permissions, expires_at, last_used)
```

**API Endpoints**:
- `POST /auth/login` - User authentication
- `POST /auth/refresh` - Token refresh
- `GET /auth/me` - Current user profile
- `GET /users` - List users (admin)
- `POST /users` - Create user
- `GET /teams` - List teams
- `POST /api-keys` - Generate API key

### 2. Service Catalog Service
**Purpose**: Manage application services and their metadata

**Technologies**:
- Node.js/Express or Python/FastAPI
- PostgreSQL for service metadata
- Integration with Git repositories
- Docker registry integration

**Key Features**:
- Service registration and discovery
- Service health monitoring
- Dependency mapping
- Version management
- Documentation integration

**Database Schema**:
```sql
-- Services
services (id, name, description, repository_url, owner_team_id, created_at, updated_at)

-- Service versions and deployments
service_versions (id, service_id, version, git_sha, dockerfile_path, config)
service_deployments (id, service_id, version_id, environment_id, status, deployed_at)

-- Service dependencies
service_dependencies (service_id, depends_on_service_id, type, version_constraint)

-- Health checks
health_checks (id, service_id, endpoint, method, expected_status, interval_seconds)
```

**API Endpoints**:
- `GET /services` - List all services
- `POST /services` - Register new service
- `GET /services/{id}` - Get service details
- `PUT /services/{id}` - Update service
- `GET /services/{id}/health` - Service health status
- `GET /services/{id}/dependencies` - Service dependency graph

### 3. Environment Management Service
**Purpose**: Manage deployment environments and their configurations

**Technologies**:
- Go or Node.js
- PostgreSQL for environment metadata
- Kubernetes API integration
- Terraform/Pulumi for infrastructure

**Key Features**:
- Environment lifecycle management
- Resource allocation and limits
- Configuration management
- Environment promotion workflows
- Cost tracking per environment

**Database Schema**:
```sql
-- Environments
environments (id, name, type, status, cluster_id, namespace, config, created_at)

-- Environment resources
environment_resources (id, env_id, resource_type, resource_id, limits, requests)

-- Environment variables and secrets
environment_configs (id, env_id, key, value, is_secret, created_at)

-- Environment access controls
environment_access (id, env_id, user_id, team_id, permissions, granted_at)
```

**API Endpoints**:
- `GET /environments` - List environments
- `POST /environments` - Create environment
- `GET /environments/{id}` - Environment details
- `PUT /environments/{id}/config` - Update configuration
- `POST /environments/{id}/deploy` - Deploy to environment
- `GET /environments/{id}/resources` - Resource usage

### 4. CI/CD Pipeline Service
**Purpose**: Manage continuous integration and deployment pipelines

**Technologies**:
- Node.js or Go
- PostgreSQL for pipeline metadata
- Redis for job queues
- Integration with Git webhooks
- Docker for build environments

**Key Features**:
- Pipeline definition and execution
- Build artifact management
- Deployment automation
- Pipeline templates
- Integration with external CI systems

**Database Schema**:
```sql
-- Pipelines
pipelines (id, name, service_id, config, triggers, created_at, updated_at)

-- Pipeline runs
pipeline_runs (id, pipeline_id, trigger_type, git_sha, status, started_at, completed_at)

-- Pipeline stages and steps
pipeline_stages (id, run_id, name, status, started_at, completed_at, logs)
pipeline_steps (id, stage_id, name, command, status, output, duration)

-- Build artifacts
build_artifacts (id, run_id, name, type, location, size, checksum)
```

**API Endpoints**:
- `GET /pipelines` - List pipelines
- `POST /pipelines` - Create pipeline
- `POST /pipelines/{id}/run` - Trigger pipeline
- `GET /pipelines/runs/{id}` - Get run details
- `GET /pipelines/runs/{id}/logs` - Stream logs
- `POST /pipelines/{id}/cancel` - Cancel running pipeline

### 5. Infrastructure Management Service
**Purpose**: Manage cloud infrastructure and resources

**Technologies**:
- Go or Python
- PostgreSQL for resource inventory
- Integration with cloud providers (AWS, GCP, Azure)
- Terraform/Pulumi for IaC
- Prometheus for metrics collection

**Key Features**:
- Resource provisioning and deprovisioning
- Cost monitoring and optimization
- Infrastructure as Code (IaC) management
- Resource tagging and organization
- Compliance and security scanning

**Database Schema**:
```sql
-- Infrastructure providers
providers (id, name, type, credentials, regions, created_at)

-- Resources
resources (id, provider_id, type, identifier, name, region, tags, status, cost_monthly)

-- Resource relationships
resource_relationships (parent_id, child_id, relationship_type)

-- Cost tracking
cost_records (id, resource_id, date, cost, currency, usage_metrics)
```

**API Endpoints**:
- `GET /infrastructure/resources` - List resources
- `POST /infrastructure/provision` - Provision resource
- `DELETE /infrastructure/resources/{id}` - Destroy resource
- `GET /infrastructure/costs` - Cost analysis
- `GET /infrastructure/compliance` - Compliance status

### 6. Monitoring & Observability Service
**Purpose**: Collect and analyze system metrics, logs, and traces

**Technologies**:
- Go or Node.js
- InfluxDB or Prometheus for metrics
- Elasticsearch for logs
- Jaeger for distributed tracing
- Grafana for visualization

**Key Features**:
- Metrics collection and aggregation
- Log aggregation and search
- Distributed tracing
- Alerting and notification
- Custom dashboards

**Database Schema**:
```sql
-- Monitoring targets
monitoring_targets (id, service_id, type, endpoint, config, created_at)

-- Alert rules
alert_rules (id, name, query, threshold, severity, notification_channels)

-- Alert instances
alerts (id, rule_id, status, fired_at, resolved_at, labels, annotations)

-- Dashboards
dashboards (id, name, config, team_id, created_at, updated_at)
```

**API Endpoints**:
- `GET /metrics` - Query metrics
- `GET /logs` - Search logs
- `GET /traces` - Query traces
- `POST /alerts/rules` - Create alert rule
- `GET /dashboards` - List dashboards

### 7. Notification Service
**Purpose**: Handle all platform notifications and communications

**Technologies**:
- Node.js or Go
- Redis for message queues
- Integration with email, Slack, webhooks
- Template engine for notifications

**Key Features**:
- Multi-channel notifications (email, Slack, webhooks)
- Notification templates and personalization
- Delivery tracking and retry logic
- User notification preferences
- Audit trail for all notifications

**Database Schema**:
```sql
-- Notification channels
notification_channels (id, type, name, config, team_id, created_at)

-- Notification templates
notification_templates (id, name, subject, body, channel_type, variables)

-- Notification history
notifications (id, template_id, recipient, channel_id, status, sent_at, delivered_at)

-- User preferences
user_notification_preferences (user_id, channel_type, enabled, settings)
```

## Shared Infrastructure

### Database
- **Primary**: PostgreSQL 14+ with read replicas
- **Caching**: Redis 6+ for sessions and caching
- **Search**: Elasticsearch 8+ for logs and full-text search
- **Metrics**: InfluxDB 2+ or Prometheus for time-series data

### Message Queue
- **Primary**: Apache Kafka or RabbitMQ for event streaming
- **Job Queue**: Redis with Bull/BullMQ for background jobs

### API Gateway
- **Technology**: Kong, Envoy, or AWS API Gateway
- **Features**: Rate limiting, authentication, request/response transformation
- **Load Balancing**: Nginx or cloud load balancer

### Service Mesh
- **Technology**: Istio or Linkerd
- **Features**: mTLS, traffic management, observability

## Security Requirements

### Authentication & Authorization
- JWT tokens with short expiration (15 minutes)
- Refresh tokens with rotation
- API key authentication for service-to-service
- RBAC with fine-grained permissions

### Data Protection
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Secrets management (HashiCorp Vault or cloud KMS)
- PII data anonymization

### Network Security
- Service mesh with mTLS
- Network policies in Kubernetes
- WAF for external-facing services
- VPN/bastion for administrative access

### Compliance
- SOC 2 Type II compliance
- GDPR compliance for EU users
- Audit logging for all operations
- Regular security scanning and penetration testing

## Performance Requirements

### Scalability
- Horizontal scaling for all services
- Auto-scaling based on CPU/memory/custom metrics
- Database read replicas for read-heavy operations
- CDN for static assets

### Response Times
- API responses: < 200ms (95th percentile)
- Dashboard loading: < 2 seconds
- Pipeline execution: Start within 30 seconds
- Real-time updates: < 1 second latency

### Availability
- 99.9% uptime SLA
- Multi-region deployment for critical services
- Automated failover and recovery
- Circuit breakers for external dependencies

## Development & Deployment

### Development Environment
- Docker Compose for local development
- Kubernetes (minikube/kind) for local testing
- Hot reloading for rapid development
- Comprehensive test suites (unit, integration, e2e)

### CI/CD Pipeline
- Automated testing on every commit
- Security scanning (SAST/DAST)
- Container image scanning
- Automated deployment to staging
- Manual approval for production

### Monitoring & Alerting
- Application metrics (RED/USE methodology)
- Infrastructure metrics (CPU, memory, disk, network)
- Business metrics (user activity, feature usage)
- Error tracking and alerting
- Performance monitoring and APM

## API Standards

### REST API Guidelines
- RESTful resource naming
- HTTP status codes (2xx, 4xx, 5xx)
- Consistent error response format
- API versioning (header-based)
- Pagination for list endpoints

### OpenAPI Specification
- Complete API documentation
- Request/response schemas
- Authentication requirements
- Example requests and responses

### Rate Limiting
- Per-user rate limits
- Per-API key rate limits
- Burst allowances
- Rate limit headers in responses

## Data Models

### Common Fields
All entities should include:
- `id`: UUID primary key
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `created_by`: User ID
- `updated_by`: User ID

### Soft Deletes
Implement soft deletes for critical data:
- `deleted_at`: Timestamp (null for active records)
- `deleted_by`: User ID

### Audit Trail
Maintain audit logs for sensitive operations:
- `audit_logs` table with operation details
- Before/after state for updates
- User context and IP address

## Integration Requirements

### Git Integration
- GitHub, GitLab, Bitbucket support
- Webhook handling for repository events
- Branch protection and PR requirements
- Commit status updates

### Container Registry
- Docker Hub, ECR, GCR, ACR support
- Image vulnerability scanning
- Image signing and verification
- Garbage collection policies

### Cloud Providers
- AWS, GCP, Azure support
- Service account management
- Resource tagging standards
- Cost allocation and tracking

### Monitoring Tools
- Prometheus/Grafana integration
- Datadog, New Relic support
- Custom metrics export
- Alert manager integration

## Deployment Architecture

### Kubernetes Deployment
```yaml
# Example service deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: service-catalog
spec:
  replicas: 3
  selector:
    matchLabels:
      app: service-catalog
  template:
    metadata:
      labels:
        app: service-catalog
    spec:
      containers:
      - name: service-catalog
        image: idp/service-catalog:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

### Service Configuration
Each service should support configuration via:
- Environment variables
- Configuration files (YAML/JSON)
- Command-line arguments
- Remote configuration (etcd/Consul)

## Testing Strategy

### Unit Tests
- 80%+ code coverage
- Mock external dependencies
- Test business logic thoroughly
- Fast execution (< 10 seconds)

### Integration Tests
- Test service interactions
- Database integration tests
- API contract testing
- Message queue integration

### End-to-End Tests
- Critical user journeys
- Cross-service workflows
- Performance testing
- Security testing

## Documentation Requirements

### API Documentation
- OpenAPI 3.0 specifications
- Interactive API explorer
- Code examples in multiple languages
- Authentication examples

### Architecture Documentation
- Service architecture diagrams
- Data flow diagrams
- Deployment architecture
- Security architecture

### Operational Documentation
- Runbooks for common issues
- Monitoring and alerting guides
- Disaster recovery procedures
- Scaling and capacity planning

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Kubernetes cluster (local or cloud)
- PostgreSQL database
- Redis instance
- Git repository access

### Local Development Setup
```bash
# Clone the repository
git clone https://github.com/company/idp-backend
cd idp-backend

# Start dependencies
docker-compose up -d postgres redis

# Install dependencies
npm install

# Run database migrations
npm run migrate

# Start the development server
npm run dev
```

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/idp
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# External Services
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Monitoring
PROMETHEUS_URL=http://localhost:9090
GRAFANA_URL=http://localhost:3000
```

## Contributing

### Code Standards
- ESLint/Prettier for JavaScript/TypeScript
- golangci-lint for Go
- Black/flake8 for Python
- Conventional commits for commit messages

### Pull Request Process
1. Create feature branch from main
2. Implement changes with tests
3. Update documentation
4. Submit pull request
5. Code review and approval
6. Automated testing and deployment

### Release Process
- Semantic versioning (semver)
- Automated changelog generation
- Tagged releases with release notes
- Automated deployment to staging/production

---

This backend architecture provides a solid foundation for building a comprehensive Internal Developer Platform that can scale with your organization's needs while maintaining security, reliability, and developer productivity.

---

## Quick start (local dev)

See `docs/integrations.md` for the new backend integrations service, setup, and usage.

Commands:

```bash
npm install
npm run dev:all      # run frontend + backend
# or
npm run dev:front    # frontend only
npm run dev:server   # backend only
```

Health check:

```bash
curl http://localhost:3001/api/health
```