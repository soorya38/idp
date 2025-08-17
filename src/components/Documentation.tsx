import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Eye,
  Clock,
  User,
  Tag,
  FileText,
  Code,
  Book,
  HelpCircle,
  ExternalLink,
  X,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import mermaid from 'mermaid';

const MermaidDiagram: React.FC<{ code: string }> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    try {
      mermaid.initialize({ startOnLoad: false });
    } catch {
      // ignore init errors (e.g., already initialized)
    }
    (async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, code);
        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        if (containerRef.current) {
          containerRef.current.textContent = 'Failed to render diagram';
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [code]);

  return <div ref={containerRef} className="overflow-auto" />;
};

interface OpenApiSpec {
  openapi?: string;
  info?: { title?: string; version?: string; description?: string };
  servers?: Array<{ url: string; description?: string }>;
  paths?: Record<string, any>;
}

const isOpenApiSpec = (content: string): OpenApiSpec | null => {
  try {
    const obj = JSON.parse(content) as OpenApiSpec;
    if (obj && obj.openapi && obj.paths) return obj;
    return null;
  } catch {
    return null;
  }
};

const OpenApiRenderer: React.FC<{ spec: OpenApiSpec }> = ({ spec }) => {
  const paths = spec.paths || {};
  const entries = Object.entries(paths) as Array<[string, Record<string, any>]>;

  const generateSampleFromSchema = (schema: any, depth = 0): any => {
    if (!schema || depth > 3) return null;
    if (schema.example !== undefined) return schema.example;
    if (schema.default !== undefined) return schema.default;
    const schemaType = schema.type || (schema.properties ? 'object' : schema.items ? 'array' : undefined);
    switch (schemaType) {
      case 'string':
        return schema.format === 'date-time' ? new Date().toISOString() : schema.format === 'email' ? 'user@example.com' : 'string';
      case 'integer':
      case 'number':
        return 0;
      case 'boolean':
        return true;
      case 'array':
        return [generateSampleFromSchema(schema.items, depth + 1)];
      case 'object': {
        const result: Record<string, any> = {};
        const props = schema.properties || {};
        Object.keys(props).slice(0, 10).forEach((key) => {
          result[key] = generateSampleFromSchema(props[key], depth + 1);
        });
        return result;
      }
      default:
        return null;
    }
  };

  const pickJsonMedia = (content: any) => {
    if (!content) return null;
    return content['application/json'] || content['application/*+json'] || null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/10 p-4">
        <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
          {spec.info?.title} {spec.info?.version ? `v${spec.info.version}` : ''}
        </h3>
        {spec.info?.description && (
          <p className="text-blue-800 dark:text-blue-200 mt-1">{spec.info.description}</p>
        )}
        {spec.servers && spec.servers.length > 0 && (
          <div className="mt-2 text-sm text-blue-800 dark:text-blue-200">
            Servers:
            <ul className="list-disc list-inside">
              {spec.servers.map((s, i) => (
                <li key={i}>
                  <span className="font-mono">{s.url}</span>
                  {s.description ? ` — ${s.description}` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {entries.map(([path, methods]) => (
          <div key={path} className="border border-gray-200 dark:border-gray-700 p-4">
            <h4 className="font-mono text-lg font-semibold text-gray-900 dark:text-white mb-3">{path}</h4>
            <div className="space-y-4">
              {Object.entries(methods).map(([method, details]: [string, any]) => {
                const reqMedia = pickJsonMedia(details?.requestBody?.content);
                const reqSchema = reqMedia?.schema;
                const reqSample = generateSampleFromSchema(reqSchema);
                const res200 = details?.responses?.['200'] || details?.responses?.['201'];
                const resMedia = pickJsonMedia(res200?.content);
                const resSchema = resMedia?.schema;
                const resSample = generateSampleFromSchema(resSchema);
                return (
                  <div key={method} className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium ${
                        method.toUpperCase() === 'GET'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          : method.toUpperCase() === 'POST'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : method.toUpperCase() === 'PUT'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : method.toUpperCase() === 'DELETE'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                      }`}>{method.toUpperCase()}</span>
                      <span className="text-gray-900 dark:text-white">
                        {details?.summary || '(no summary)'}
                      </span>
                    </div>
                    {reqSample && (
                      <div className="ml-6">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Request JSON</div>
                        <pre className="bg-gray-900 text-white p-3 overflow-auto text-xs">
{JSON.stringify(reqSample, null, 2)}
                        </pre>
                      </div>
                    )}
                    {resSample && (
                      <div className="ml-6">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Response JSON</div>
                        <pre className="bg-gray-900 text-white p-3 overflow-auto text-xs">
{JSON.stringify(resSample, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface Document {
  id: string;
  title: string;
  type: 'guide' | 'api' | 'runbook' | 'architecture' | 'tutorial';
  content: string;
  author: string;
  lastModified: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  views: number;
  category: string;
}

const documents: Document[] = [
  {
    id: '1',
    title: 'User Authentication API',
    type: 'api',
    content: `{
  "openapi": "3.0.0",
  "info": {
    "title": "User Authentication API",
    "version": "2.1.0",
    "description": "Complete API for user authentication, registration, and profile management"
  },
  "servers": [
    {
      "url": "https://api.platform.company.com/v1",
      "description": "Production server"
    }
  ],
  "paths": {
    "/auth/login": {
      "post": {
        "summary": "User login",
        "description": "Authenticate user with email and password",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["email", "password"],
                "properties": {
                  "email": {
                    "type": "string",
                    "format": "email",
                    "example": "user@example.com"
                  },
                  "password": {
                    "type": "string",
                    "minLength": 8,
                    "example": "securePassword123"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Login successful",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "token": {
                      "type": "string",
                      "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    },
                    "user": {
                      "$ref": "#/components/schemas/User"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Invalid credentials"
          }
        }
      }
    },
    "/auth/register": {
      "post": {
        "summary": "User registration",
        "description": "Create a new user account",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["email", "password", "firstName", "lastName"],
                "properties": {
                  "email": {
                    "type": "string",
                    "format": "email"
                  },
                  "password": {
                    "type": "string",
                    "minLength": 8
                  },
                  "firstName": {
                    "type": "string"
                  },
                  "lastName": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "User created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          }
        }
      }
    },
    "/users/profile": {
      "get": {
        "summary": "Get user profile",
        "security": [{"bearerAuth": []}],
        "responses": {
          "200": {
            "description": "User profile",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          }
        }
      },
      "put": {
        "summary": "Update user profile",
        "security": [{"bearerAuth": []}],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UserUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Profile updated",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "User": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "example": "123e4567-e89b-12d3-a456-426614174000"
          },
          "email": {
            "type": "string",
            "format": "email",
            "example": "user@example.com"
          },
          "firstName": {
            "type": "string",
            "example": "John"
          },
          "lastName": {
            "type": "string",
            "example": "Doe"
          },
          "avatar": {
            "type": "string",
            "format": "uri",
            "example": "https://example.com/avatar.jpg"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "UserUpdate": {
        "type": "object",
        "properties": {
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "avatar": {
            "type": "string",
            "format": "uri"
          }
        }
      }
    },
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  }
}`,
    author: 'Backend Team',
    lastModified: '2 hours ago',
    tags: ['api', 'authentication', 'users'],
    status: 'published',
    views: 245,
    category: 'API Reference',
  },
  {
    id: '2',
    title: 'Platform Architecture Overview',
    type: 'architecture',
    content: `graph TB
    subgraph "Client Layer"
        WEB[Web Application]
        MOBILE[Mobile App]
        API_CLIENT[API Clients]
    end
    
    subgraph "API Gateway Layer"
        GATEWAY[API Gateway]
        LB[Load Balancer]
        RATE[Rate Limiter]
    end
    
    subgraph "Authentication Layer"
        AUTH[Auth Service]
        JWT[JWT Validator]
        OAUTH[OAuth Provider]
    end
    
    subgraph "Core Services"
        USER[User Service]
        PAYMENT[Payment Service]
        NOTIFICATION[Notification Service]
        ANALYTICS[Analytics Service]
    end
    
    subgraph "Data Layer"
        POSTGRES[(PostgreSQL)]
        REDIS[(Redis Cache)]
        S3[(S3 Storage)]
        ELASTIC[(Elasticsearch)]
    end
    
    subgraph "External Services"
        STRIPE[Stripe API]
        SENDGRID[SendGrid]
        CLOUDFLARE[Cloudflare CDN]
    end
    
    subgraph "Infrastructure"
        K8S[Kubernetes]
        DOCKER[Docker Registry]
        MONITORING[Prometheus/Grafana]
    end
    
    %% Client connections
    WEB --> GATEWAY
    MOBILE --> GATEWAY
    API_CLIENT --> GATEWAY
    
    %% Gateway layer
    GATEWAY --> LB
    LB --> RATE
    RATE --> AUTH
    
    %% Authentication flow
    AUTH --> JWT
    AUTH --> OAUTH
    JWT --> USER
    
    %% Service connections
    USER --> POSTGRES
    USER --> REDIS
    PAYMENT --> POSTGRES
    PAYMENT --> STRIPE
    NOTIFICATION --> SENDGRID
    ANALYTICS --> ELASTIC
    
    %% Storage connections
    USER --> S3
    NOTIFICATION --> S3
    
    %% Infrastructure
    K8S --> DOCKER
    MONITORING --> K8S
    
    %% CDN
    CLOUDFLARE --> WEB
    
    style WEB fill:#e1f5fe
    style GATEWAY fill:#f3e5f5
    style AUTH fill:#e8f5e8
    style POSTGRES fill:#fff3e0
    style K8S fill:#ffebee
    style STRIPE fill:#f0f4c3`,
    author: 'Platform Team',
    lastModified: '1 day ago',
    tags: ['architecture', 'overview', 'microservices'],
    status: 'published',
    views: 298,
    category: 'Architecture',
  },
  {
    id: '3',
    title: 'Getting Started Guide',
    type: 'guide',
    content: `# Getting Started with the Developer Platform

Welcome to our Internal Developer Platform! This guide will help you get up and running quickly.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **Docker Desktop** (latest version)
- **Git** (version 2.30 or higher)
- **kubectl** (for Kubernetes management)

## Quick Start

### 1. Account Setup

First, you'll need to get access to the platform:

1. Request access from your team lead
2. Check your email for the invitation link
3. Set up your password and enable 2FA
4. Join your team's Slack channels

### 2. Development Environment

Clone the starter template:

\`\`\`bash
git clone https://github.com/company/service-template
cd service-template
npm install
\`\`\`

### 3. Local Development

Start the development environment:

\`\`\`bash
# Start local services
docker-compose up -d

# Run the application
npm run dev
\`\`\`

Your service will be available at \`http://localhost:3000\`

### 4. Platform Access

Access the developer platform at:
- **Production**: https://platform.company.com
- **Staging**: https://staging-platform.company.com

## Core Concepts

### Services
Services are the building blocks of our platform. Each service:
- Has its own repository
- Runs in its own container
- Has independent deployment cycles
- Communicates via APIs

### Environments
We have three main environments:
- **Development**: For local and feature development
- **Staging**: For testing and integration
- **Production**: For live user traffic

### Pipelines
Every service has automated CI/CD pipelines that:
- Run tests on every commit
- Build and scan container images
- Deploy to staging automatically
- Require approval for production

## Your First Deployment

### 1. Create a Service

Use our service generator:

\`\`\`bash
npx @company/create-service my-new-service
cd my-new-service
\`\`\`

### 2. Configure the Service

Edit the \`service.yaml\` file:

\`\`\`yaml
name: my-new-service
description: "My awesome new service"
owner: "My Team"
runtime: nodejs
port: 3000
healthCheck: /health
\`\`\`

### 3. Deploy to Staging

Push your code to trigger the pipeline:

\`\`\`bash
git add .
git commit -m "Initial service setup"
git push origin main
\`\`\`

### 4. Monitor Your Service

Once deployed, you can:
- View logs in the platform dashboard
- Monitor metrics and alerts
- Check deployment status
- Review performance data

## Best Practices

### Code Quality
- Write comprehensive tests (aim for 80%+ coverage)
- Use TypeScript for better type safety
- Follow our coding standards
- Document your APIs with OpenAPI

### Security
- Never commit secrets to Git
- Use environment variables for configuration
- Implement proper authentication
- Keep dependencies updated

### Performance
- Implement health checks
- Add proper logging
- Monitor resource usage
- Use caching where appropriate

## Getting Help

### Documentation
- [API Reference](/docs/api)
- [Architecture Guide](/docs/architecture)
- [Deployment Guide](/docs/deployment)

### Support Channels
- **Slack**: #platform-support
- **Email**: platform-team@company.com
- **Office Hours**: Tuesdays 2-4 PM

### Emergency Contacts
- **On-call Engineer**: Use PagerDuty
- **Platform Team Lead**: @platform-lead on Slack

## Next Steps

Now that you're set up, explore these topics:

1. [Service Architecture Patterns](/docs/patterns)
2. [Database Best Practices](/docs/database)
3. [Monitoring and Alerting](/docs/monitoring)
4. [Security Guidelines](/docs/security)

Happy coding! 🚀`,
    author: 'Sarah Chen',
    lastModified: '2 hours ago',
    tags: ['onboarding', 'basics', 'setup'],
    status: 'published',
    views: 245,
    category: 'Getting Started',
  },
  {
    id: '4',
    title: 'Payment Processing Flow',
    type: 'architecture',
    content: `sequenceDiagram
    participant Client
    participant Gateway as API Gateway
    participant Auth as Auth Service
    participant Payment as Payment Service
    participant Stripe as Stripe API
    participant DB as Database
    participant Queue as Message Queue
    participant Notification as Notification Service
    
    Note over Client,Notification: Payment Processing Flow
    
    Client->>Gateway: POST /api/v1/payments
    Gateway->>Auth: Validate JWT Token
    Auth-->>Gateway: Token Valid
    
    Gateway->>Payment: Process Payment Request
    Payment->>DB: Create Payment Record
    DB-->>Payment: Payment ID Created
    
    Payment->>Stripe: Create Payment Intent
    Stripe-->>Payment: Payment Intent Response
    
    alt Payment Successful
        Payment->>DB: Update Payment Status (completed)
        Payment->>Queue: Publish Payment Success Event
        Queue->>Notification: Send Success Notification
        Notification->>Client: Email/SMS Confirmation
        Payment-->>Gateway: Payment Success Response
    else Payment Failed
        Payment->>DB: Update Payment Status (failed)
        Payment->>Queue: Publish Payment Failed Event
        Queue->>Notification: Send Failure Notification
        Payment-->>Gateway: Payment Error Response
    end
    
    Gateway-->>Client: Final Response
    
    Note over Payment,Stripe: Webhook Handling
    Stripe->>Payment: Webhook: payment_intent.succeeded
    Payment->>DB: Confirm Payment Status
    Payment->>Queue: Publish Confirmation Event`,
    author: 'Finance Team',
    lastModified: '1 day ago',
    tags: ['payment', 'flow', 'architecture'],
    status: 'published',
    views: 156,
    category: 'Architecture',
  },
  {
    id: '5',
    title: 'Incident Response Runbook',
    type: 'runbook',
    content: `# Incident Response Runbook

## Overview

This runbook provides step-by-step procedures for handling production incidents in our platform.

## Severity Levels

### SEV-1 (Critical)
- **Definition**: Complete service outage or data loss
- **Response Time**: Immediate (< 5 minutes)
- **Examples**: 
  - Platform completely down
  - Payment processing stopped
  - Data corruption detected

### SEV-2 (High)
- **Definition**: Major feature degradation
- **Response Time**: < 30 minutes
- **Examples**:
  - Login issues affecting > 50% of users
  - API response times > 5 seconds
  - Database connection issues

### SEV-3 (Medium)
- **Definition**: Minor feature issues
- **Response Time**: < 2 hours
- **Examples**:
  - Non-critical feature not working
  - Performance degradation < 50%
  - Monitoring alerts

### SEV-4 (Low)
- **Definition**: Cosmetic or minor issues
- **Response Time**: Next business day
- **Examples**:
  - UI inconsistencies
  - Documentation errors
  - Non-critical warnings

## Incident Response Process

### 1. Detection & Alert (0-5 minutes)

**Automated Detection:**
- Monitoring alerts (Prometheus/Grafana)
- Health check failures
- Error rate spikes
- Performance degradation

**Manual Detection:**
- User reports
- Support tickets
- Team member observations

**Immediate Actions:**
1. Acknowledge the alert in PagerDuty
2. Join the incident Slack channel: #incident-response
3. Assess the severity level
4. Page additional team members if SEV-1 or SEV-2

### 2. Initial Response (5-15 minutes)

**Assessment:**
1. Check the platform dashboard: https://status.company.com
2. Review recent deployments in the last 2 hours
3. Check infrastructure status (AWS, Kubernetes)
4. Identify affected services and user impact

**Communication:**
1. Update the incident channel with initial findings
2. Create incident in PagerDuty with proper severity
3. For SEV-1/SEV-2: Update status page immediately
4. Notify stakeholders via pre-defined escalation matrix

### 3. Investigation (15-30 minutes)

**Technical Investigation:**
1. Check service logs:
   \`\`\`bash
   kubectl logs -f deployment/service-name -n production
   \`\`\`

2. Review metrics in Grafana:
   - CPU/Memory usage
   - Request rates and latency
   - Error rates
   - Database performance

3. Check recent changes:
   - Recent deployments
   - Configuration changes
   - Infrastructure modifications

**Common Investigation Commands:**
\`\`\`bash
# Check pod status
kubectl get pods -n production

# Check service endpoints
kubectl get endpoints -n production

# Check recent events
kubectl get events -n production --sort-by='.lastTimestamp'

# Check node status
kubectl get nodes

# Check resource usage
kubectl top pods -n production
\`\`\`

### 4. Mitigation (30-60 minutes)

**Immediate Mitigation Options:**

1. **Rollback Recent Deployment:**
   \`\`\`bash
   kubectl rollout undo deployment/service-name -n production
   \`\`\`

2. **Scale Up Resources:**
   \`\`\`bash
   kubectl scale deployment service-name --replicas=10 -n production
   \`\`\`

3. **Restart Services:**
   \`\`\`bash
   kubectl rollout restart deployment/service-name -n production
   \`\`\`

4. **Enable Maintenance Mode:**
   - Activate maintenance page
   - Redirect traffic to backup systems
   - Disable non-critical features

5. **Database Issues:**
   - Switch to read replica
   - Enable connection pooling
   - Clear problematic queries

### 5. Resolution & Recovery

**Verification Steps:**
1. Confirm all services are healthy
2. Verify user-facing functionality
3. Check error rates have returned to normal
4. Monitor for 15 minutes to ensure stability

**Communication:**
1. Update incident channel with resolution
2. Update status page with "All Systems Operational"
3. Send resolution notification to stakeholders
4. Close PagerDuty incident

## Post-Incident Process

### Immediate (Within 24 hours)
1. **Timeline Documentation:**
   - Create detailed incident timeline
   - Document all actions taken
   - Note what worked and what didn't

2. **Initial Assessment:**
   - Estimate user impact
   - Calculate downtime duration
   - Identify immediate lessons learned

### Follow-up (Within 1 week)
1. **Post-Mortem Meeting:**
   - Schedule within 48 hours
   - Include all responders
   - Review timeline and decisions
   - Identify improvement opportunities

2. **Action Items:**
   - Create tickets for preventive measures
   - Update monitoring and alerting
   - Improve documentation
   - Schedule follow-up reviews

## Emergency Contacts

### On-Call Rotation
- **Primary**: Check PagerDuty schedule
- **Secondary**: Check PagerDuty schedule
- **Escalation**: Platform Team Lead

### Key Personnel
- **Platform Team Lead**: @platform-lead
- **SRE Lead**: @sre-lead
- **Security Lead**: @security-lead
- **Engineering Manager**: @eng-manager

### External Contacts
- **AWS Support**: Enterprise Support Case
- **Stripe Support**: Priority Support
- **Monitoring Vendor**: Check support portal

## Tools & Resources

### Monitoring & Alerting
- **Grafana**: https://grafana.company.com
- **Prometheus**: https://prometheus.company.com
- **PagerDuty**: https://company.pagerduty.com
- **Status Page**: https://status.company.com

### Communication
- **Slack**: #incident-response
- **Zoom**: Incident Response Room (always available)
- **Email**: incident-response@company.com

### Documentation
- **Runbooks**: https://docs.company.com/runbooks
- **Architecture**: https://docs.company.com/architecture
- **API Docs**: https://api-docs.company.com

## Common Scenarios

### Database Connection Issues
1. Check connection pool status
2. Verify database server health
3. Check network connectivity
4. Review recent schema changes
5. Consider switching to read replica

### High CPU/Memory Usage
1. Identify resource-heavy processes
2. Check for memory leaks
3. Review recent code changes
4. Scale up resources temporarily
5. Implement circuit breakers

### API Rate Limiting
1. Check current rate limit settings
2. Identify traffic sources
3. Implement temporary rate increases
4. Block malicious traffic
5. Scale API gateway

### Payment Processing Issues
1. Check Stripe dashboard
2. Verify webhook endpoints
3. Review payment logs
4. Check for API key issues
5. Contact Stripe support if needed

Remember: **Safety first**. If unsure about any action, escalate immediately rather than risk making the situation worse.`,
    author: 'DevOps Team',
    lastModified: '3 days ago',
    tags: ['incident', 'production', 'emergency'],
    status: 'published',
    views: 156,
    category: 'Operations',
  },
  {
    id: '6',
    title: 'Database Migration Guide',
    type: 'runbook',
    content: `# Database Migration Guide

## Overview

This guide covers best practices for creating and executing database migrations safely in our platform.

## Migration Types

### Schema Migrations
- Adding/removing tables
- Adding/removing columns
- Changing column types
- Adding/removing indexes
- Adding/removing constraints

### Data Migrations
- Populating new columns
- Transforming existing data
- Moving data between tables
- Cleaning up obsolete data

## Safety Guidelines

### Before Creating Migrations

1. **Plan Backwards Compatibility**
   - Ensure new code works with old schema
   - Plan rollback strategy
   - Consider gradual rollout

2. **Test Thoroughly**
   - Test on production-like data
   - Measure execution time
   - Verify rollback procedures

3. **Coordinate with Team**
   - Review with database team
   - Schedule during maintenance window
   - Notify dependent services

### Migration Best Practices

1. **Use Transactions**
   \`\`\`sql
   BEGIN;
   -- Your migration here
   COMMIT;
   \`\`\`

2. **Add Columns as Nullable First**
   \`\`\`sql
   -- Step 1: Add nullable column
   ALTER TABLE users ADD COLUMN phone VARCHAR(20);
   
   -- Step 2: Populate data
   UPDATE users SET phone = '000-000-0000' WHERE phone IS NULL;
   
   -- Step 3: Add constraint (in separate migration)
   ALTER TABLE users ALTER COLUMN phone SET NOT NULL;
   \`\`\`

3. **Create Indexes Concurrently**
   \`\`\`sql
   CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
   \`\`\`

4. **Use IF EXISTS/IF NOT EXISTS**
   \`\`\`sql
   CREATE TABLE IF NOT EXISTS new_table (...);
   DROP INDEX IF EXISTS old_index;
   \`\`\`

## Execution Process

### 1. Development
1. Create migration file
2. Test locally
3. Create rollback script
4. Document changes

### 2. Staging
1. Deploy to staging environment
2. Run full test suite
3. Verify performance impact
4. Test rollback procedure

### 3. Production
1. Schedule maintenance window
2. Create database backup
3. Execute migration
4. Verify success
5. Monitor performance

## Common Patterns

### Adding a New Column
\`\`\`sql
-- Migration Up
ALTER TABLE users 
ADD COLUMN created_by UUID REFERENCES users(id);

-- Migration Down
ALTER TABLE users DROP COLUMN created_by;
\`\`\`

### Renaming a Column
\`\`\`sql
-- Step 1: Add new column
ALTER TABLE users ADD COLUMN full_name VARCHAR(255);

-- Step 2: Populate new column
UPDATE users SET full_name = CONCAT(first_name, ' ', last_name);

-- Step 3: Drop old columns (in separate migration)
ALTER TABLE users DROP COLUMN first_name;
ALTER TABLE users DROP COLUMN last_name;
\`\`\`

### Creating Indexes
\`\`\`sql
-- For large tables, use CONCURRENTLY
CREATE INDEX CONCURRENTLY idx_orders_created_at 
ON orders(created_at DESC);

-- For small tables
CREATE INDEX idx_settings_user_id ON settings(user_id);
\`\`\`

## Rollback Procedures

### Automatic Rollback
- Use database transactions when possible
- Set statement timeout for long operations
- Monitor for errors during execution

### Manual Rollback
1. Stop application traffic
2. Execute rollback script
3. Restore from backup if necessary
4. Verify data integrity
5. Resume application traffic

## Monitoring & Alerts

### During Migration
- Monitor database CPU/Memory
- Watch for lock contention
- Check replication lag
- Monitor application error rates

### After Migration
- Verify query performance
- Check index usage
- Monitor storage usage
- Validate data integrity

## Emergency Procedures

### Migration Stuck/Hanging
1. Check for blocking queries
2. Identify lock contention
3. Consider killing long-running queries
4. Rollback if necessary

### Data Corruption Detected
1. Stop all write operations
2. Assess corruption scope
3. Restore from backup
4. Re-run migration with fixes

### Performance Degradation
1. Check query execution plans
2. Verify index usage
3. Consider adding missing indexes
4. Scale database resources if needed

## Tools & Commands

### PostgreSQL Specific
\`\`\`sql
-- Check migration status
SELECT * FROM schema_migrations ORDER BY version;

-- Check table sizes
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Check for blocking queries
SELECT blocked_locks.pid AS blocked_pid,
       blocked_activity.usename AS blocked_user,
       blocking_locks.pid AS blocking_pid,
       blocking_activity.usename AS blocking_user,
       blocked_activity.query AS blocked_statement,
       blocking_activity.query AS current_statement_in_blocking_process
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
\`\`\`

### Migration Commands
\`\`\`bash
# Run pending migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback

# Check migration status
npm run migrate:status

# Create new migration
npm run migrate:create add_user_preferences
\`\`\`

## Checklist

### Pre-Migration
- [ ] Migration tested locally
- [ ] Rollback script prepared
- [ ] Team notified
- [ ] Maintenance window scheduled
- [ ] Database backup created
- [ ] Monitoring alerts configured

### During Migration
- [ ] Migration executed successfully
- [ ] No errors in logs
- [ ] Performance metrics normal
- [ ] Application functionality verified

### Post-Migration
- [ ] Data integrity verified
- [ ] Performance benchmarks met
- [ ] Monitoring alerts updated
- [ ] Documentation updated
- [ ] Team notified of completion

Remember: **When in doubt, don't migrate**. It's better to delay and get it right than to cause a production incident.`,
    author: 'Data Team',
    lastModified: '2 weeks ago',
    tags: ['database', 'migration', 'procedures'],
    status: 'published',
    views: 134,
    category: 'Operations',
  },
  {
    id: '7',
    title: 'Deploying Your First Service',
    type: 'tutorial',
    content: `# Deploying Your First Service

## Overview

This tutorial will walk you through deploying your first service to our platform, from initial setup to production deployment.

## Prerequisites

- Platform account with developer access
- Local development environment set up
- Basic knowledge of Docker and Kubernetes
- Service code ready for deployment

## Step 1: Service Configuration

Create a \`service.yaml\` file in your project root:

\`\`\`yaml
apiVersion: platform.company.com/v1
kind: Service
metadata:
  name: my-first-service
  namespace: my-team
spec:
  description: "My first service on the platform"
  owner: "My Team"
  repository: "https://github.com/company/my-first-service"
  
  runtime:
    type: nodejs
    version: "18"
    port: 3000
    
  health:
    path: /health
    interval: 30s
    timeout: 5s
    
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 500m
      memory: 512Mi
      
  scaling:
    minReplicas: 2
    maxReplicas: 10
    targetCPU: 70
    
  environment:
    - name: NODE_ENV
      value: production
    - name: DATABASE_URL
      valueFrom:
        secretKeyRef:
          name: database-credentials
          key: url
\`\`\`

## Step 2: Dockerfile

Create a \`Dockerfile\` for your service:

\`\`\`dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"]
\`\`\`

## Step 3: Health Check Endpoint

Add a health check endpoint to your service:

\`\`\`javascript
// health.js
const express = require('express');
const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await checkDatabase();
    
    // Check external dependencies
    await checkExternalServices();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

async function checkDatabase() {
  // Implement database health check
  // Throw error if unhealthy
}

async function checkExternalServices() {
  // Check external API dependencies
  // Throw error if any are unhealthy
}

module.exports = router;
\`\`\`

## Step 4: CI/CD Pipeline

Create \`.github/workflows/deploy.yml\`:

\`\`\`yaml
name: Deploy Service

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test
      - run: npm run lint
      
  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v3
        with:
          context: .
          push: true
          tags: |
            registry.company.com/my-first-service:latest
            registry.company.com/my-first-service:\$\{\{ github.sha \}\}
            
  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    
    steps:
      - name: Deploy to staging
        run: |
          platform deploy my-first-service \\
            --environment staging \\
            --image registry.company.com/my-first-service:\${\{ github.sha \}}
            
  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Deploy to production
        run: |
          platform deploy my-first-service \\
            --environment production \\
            --image registry.company.com/my-first-service:\${\{ github.sha \}}
\`\`\`

## Step 5: Local Testing

Test your service locally before deploying:

\`\`\`bash
# Build the Docker image
docker build -t my-first-service .

# Run locally
docker run -p 3000:3000 my-first-service

# Test health endpoint
curl http://localhost:3000/health

# Test your API endpoints
curl http://localhost:3000/api/v1/test
\`\`\`

## Step 6: Deploy to Staging

Push your code to trigger the deployment:

\`\`\`bash
git add .
git commit -m "Initial service deployment"
git push origin main
\`\`\`

Monitor the deployment in the platform dashboard:
1. Go to https://platform.company.com
2. Navigate to "Pipelines"
3. Find your service deployment
4. Watch the progress

## Step 7: Verify Deployment

Once deployed to staging:

1. **Check Service Status**
   - Visit the platform dashboard
   - Verify service is "Running"
   - Check all instances are healthy

2. **Test Functionality**
   \`\`\`bash
   # Test staging endpoint
   curl https://staging-api.company.com/my-first-service/health
   
   # Test your API
   curl https://staging-api.company.com/my-first-service/api/v1/test
   \`\`\`

3. **Check Logs**
   \`\`\`bash
   # View recent logs
   platform logs my-first-service --environment staging --tail 100
   \`\`\`

4. **Monitor Metrics**
   - CPU and memory usage
   - Request rates and latency
   - Error rates

## Step 8: Deploy to Production

After verifying staging deployment:

1. **Manual Approval**
   - Go to GitHub Actions
   - Approve the production deployment
   - Monitor the deployment progress

2. **Post-Deployment Verification**
   \`\`\`bash
   # Test production endpoint
   curl https://api.company.com/my-first-service/health
   \`\`\`

3. **Set Up Monitoring**
   - Configure alerts for error rates
   - Set up performance monitoring
   - Create dashboard for key metrics

## Step 9: Ongoing Maintenance

### Monitoring
- Set up alerts for high error rates
- Monitor response times
- Track resource usage
- Set up log aggregation

### Updates
- Follow semantic versioning
- Test thoroughly in staging
- Use blue-green deployments for zero downtime
- Keep dependencies updated

### Scaling
- Monitor traffic patterns
- Adjust resource limits as needed
- Configure auto-scaling rules
- Plan for peak traffic events

## Troubleshooting

### Common Issues

1. **Service Won't Start**
   - Check Dockerfile syntax
   - Verify port configuration
   - Check environment variables
   - Review application logs

2. **Health Check Failing**
   - Verify health endpoint returns 200
   - Check database connectivity
   - Ensure all dependencies are available
   - Review timeout settings

3. **High Resource Usage**
   - Profile your application
   - Check for memory leaks
   - Optimize database queries
   - Consider caching strategies

### Getting Help

- **Slack**: #platform-support
- **Documentation**: https://docs.company.com
- **Office Hours**: Tuesdays 2-4 PM

## Next Steps

Now that your service is deployed:

1. [Set up monitoring and alerts](/docs/monitoring)
2. [Configure database connections](/docs/database)
3. [Implement API authentication](/docs/auth)
4. [Add integration tests](/docs/testing)

Congratulations! You've successfully deployed your first service to the platform! 🎉`,
    author: 'Emily Rodriguez',
    lastModified: '5 days ago',
    tags: ['deployment', 'tutorial', 'beginner'],
    status: 'draft',
    views: 67,
    category: 'Tutorials',
  },
  {
    id: '8',
    title: 'Monitoring and Alerting Setup',
    type: 'guide',
    content: `# Monitoring and Alerting Setup Guide

## Overview

This guide covers how to set up comprehensive monitoring and alerting for your services on our platform.

## Monitoring Stack

Our platform uses:
- **Prometheus** for metrics collection
- **Grafana** for visualization and dashboards
- **AlertManager** for alert routing and notifications
- **Jaeger** for distributed tracing
- **ELK Stack** for log aggregation

## Metrics Collection

### Application Metrics

Expose metrics from your application:

\`\`\`javascript
const prometheus = require('prom-client');

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new prometheus.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

// Middleware to collect metrics
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
      
    httpRequestTotal
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .inc();
  });
  
  next();
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(prometheus.register.metrics());
});
\`\`\`

### Business Metrics

Track business-specific metrics:

\`\`\`javascript
const userRegistrations = new prometheus.Counter({
  name: 'user_registrations_total',
  help: 'Total number of user registrations'
});

const orderValue = new prometheus.Histogram({
  name: 'order_value_dollars',
  help: 'Order value in dollars',
  buckets: [10, 50, 100, 500, 1000, 5000]
});

const activeUsers = new prometheus.Gauge({
  name: 'active_users',
  help: 'Number of currently active users'
});
\`\`\`

## Dashboard Creation

### Service Dashboard Template

Create a Grafana dashboard for your service:

\`\`\`json
{
  "dashboard": {
    "title": "My First Service",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{service=\"my-first-service\"}[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{service=\"my-first-service\"}[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{service=\"my-first-service\",status_code=~\"5..\"}[5m])",
            "legendFormat": "5xx errors"
          }
        ]
      }
    ]
  }
}
\`\`\`

## Alert Configuration

### Alert Rules

Create \`alerts.yml\` for your service:

\`\`\`yaml
groups:
  - name: my-first-service
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{service="my-first-service",status_code=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: critical
          service: my-first-service
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"
          
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{service="my-first-service"}[5m])) > 1
        for: 5m
        labels:
          severity: warning
          service: my-first-service
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is {{ $value }}s"
          
      - alert: ServiceDown
        expr: up{service="my-first-service"} == 0
        for: 1m
        labels:
          severity: critical
          service: my-first-service
        annotations:
          summary: "Service is down"
          description: "Service {{ $labels.instance }} is not responding"
          
      - alert: HighMemoryUsage
        expr: (container_memory_usage_bytes{service="my-first-service"} / container_spec_memory_limit_bytes) > 0.8
        for: 5m
        labels:
          severity: warning
          service: my-first-service
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value | humanizePercentage }}"
\`\`\`

### Notification Channels

Configure alert routing in \`alertmanager.yml\`:

\`\`\`yaml
route:
  group_by: ['alertname', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'default'
  routes:
    - match:
        service: my-first-service
        severity: critical
      receiver: 'critical-alerts'
    - match:
        service: my-first-service
        severity: warning
      receiver: 'warning-alerts'

receivers:
  - name: 'default'
    slack_configs:
      - api_url: 'YOUR_SLACK_WEBHOOK_URL'
        channel: '#alerts'
        
  - name: 'critical-alerts'
    slack_configs:
      - api_url: 'YOUR_SLACK_WEBHOOK_URL'
        channel: '#critical-alerts'
        title: 'CRITICAL: {{ .GroupLabels.service }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
    pagerduty_configs:
      - service_key: 'YOUR_PAGERDUTY_KEY'
        
  - name: 'warning-alerts'
    slack_configs:
      - api_url: 'YOUR_SLACK_WEBHOOK_URL'
        channel: '#warnings'
        title: 'WARNING: {{ .GroupLabels.service }}'
\`\`\`

## Log Management

### Structured Logging

Use structured logging in your application:

\`\`\`javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'my-first-service',
    version: process.env.npm_package_version 
  },
  transports: [
    new winston.transports.Console()
  ]
});

// Usage
logger.info('User registered', { 
  userId: user.id, 
  email: user.email,
  registrationMethod: 'email'
});

logger.error('Database connection failed', { 
  error: error.message,
  stack: error.stack,
  connectionString: 'postgres://...'
});
\`\`\`

### Log Queries

Common Elasticsearch queries for your logs:

\`\`\`json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "service": "my-first-service" } },
        { "range": { "@timestamp": { "gte": "now-1h" } } }
      ],
      "filter": [
        { "term": { "level": "error" } }
      ]
    }
  },
  "sort": [
    { "@timestamp": { "order": "desc" } }
  ]
}
\`\`\`

## Distributed Tracing

### OpenTelemetry Setup

Add tracing to your service:

\`\`\`javascript
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

const jaegerExporter = new JaegerExporter({
  endpoint: 'http://jaeger-collector:14268/api/traces',
});

const sdk = new NodeSDK({
  traceExporter: jaegerExporter,
  instrumentations: [getNodeAutoInstrumentations()],
  serviceName: 'my-first-service',
});

sdk.start();
\`\`\`

### Custom Spans

Add custom tracing:

\`\`\`javascript
const { trace } = require('@opentelemetry/api');

const tracer = trace.getTracer('my-first-service');

async function processOrder(orderId) {
  const span = tracer.startSpan('process_order');
  
  try {
    span.setAttributes({
      'order.id': orderId,
      'user.id': userId
    });
    
    // Your business logic here
    const result = await businessLogic(orderId);
    
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    span.recordException(error);
    span.setStatus({ 
      code: SpanStatusCode.ERROR, 
      message: error.message 
    });
    throw error;
  } finally {
    span.end();
  }
}
\`\`\`

## Health Checks

### Comprehensive Health Check

\`\`\`javascript
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    uptime: process.uptime(),
    checks: {}
  };
  
  try {
    // Database check
    await checkDatabase();
    health.checks.database = { status: 'healthy' };
    
    // Redis check
    await checkRedis();
    health.checks.redis = { status: 'healthy' };
    
    // External API check
    await checkExternalAPI();
    health.checks.externalAPI = { status: 'healthy' };
    
    res.status(200).json(health);
  } catch (error) {
    health.status = 'unhealthy';
    health.error = error.message;
    
    // Mark specific check as failed
    if (error.type === 'database') {
      health.checks.database = { status: 'unhealthy', error: error.message };
    }
    
    res.status(503).json(health);
  }
});
\`\`\`

## Performance Monitoring

### Key Metrics to Track

1. **Golden Signals**
   - Latency (response time)
   - Traffic (request rate)
   - Errors (error rate)
   - Saturation (resource utilization)

2. **Business Metrics**
   - User registrations
   - Order completion rate
   - Revenue per hour
   - Feature usage

3. **Infrastructure Metrics**
   - CPU usage
   - Memory usage
   - Disk I/O
   - Network traffic

### SLI/SLO Definition

Define Service Level Indicators and Objectives:

\`\`\`yaml
slis:
  - name: availability
    description: "Percentage of successful requests"
    query: "rate(http_requests_total{status_code!~'5..'}[5m]) / rate(http_requests_total[5m])"
    
  - name: latency
    description: "95th percentile response time"
    query: "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))"

slos:
  - name: availability_slo
    sli: availability
    target: 0.999  # 99.9% availability
    
  - name: latency_slo
    sli: latency
    target: 0.5    # 500ms 95th percentile
\`\`\`

## Runbook Integration

### Alert Runbooks

Link alerts to runbooks:

\`\`\`yaml
- alert: HighErrorRate
  annotations:
    summary: "High error rate detected"
    description: "Error rate is {{ $value }} errors per second"
    runbook_url: "https://docs.company.com/runbooks/high-error-rate"
    dashboard_url: "https://grafana.company.com/d/service-overview"
\`\`\`

### Automated Remediation

\`\`\`yaml
- alert: HighMemoryUsage
  annotations:
    summary: "High memory usage detected"
    remediation: |
      1. Check for memory leaks in application logs
      2. Consider scaling up the service
      3. Review recent deployments for issues
      4. If critical, restart the service pods
\`\`\`

## Best Practices

### Monitoring
- Monitor what matters to users
- Use consistent naming conventions
- Set appropriate alert thresholds
- Avoid alert fatigue
- Document your metrics

### Alerting
- Alert on symptoms, not causes
- Make alerts actionable
- Include context in alert messages
- Test your alerts regularly
- Have escalation procedures

### Dashboards
- Focus on key metrics
- Use consistent time ranges
- Add annotations for deployments
- Share dashboards with your team
- Keep dashboards up to date

## Troubleshooting

### Common Issues

1. **Missing Metrics**
   - Check Prometheus targets
   - Verify service discovery
   - Check firewall rules

2. **Alerts Not Firing**
   - Verify alert rules syntax
   - Check AlertManager configuration
   - Test notification channels

3. **High Cardinality Metrics**
   - Limit label values
   - Use recording rules
   - Consider sampling

This comprehensive monitoring setup will help you maintain visibility into your service's health and performance!`,
    author: 'Platform Team',
    lastModified: '1 week ago',
    tags: ['monitoring', 'alerting', 'observability'],
    status: 'published',
    views: 187,
    category: 'Monitoring',
  },
];

const getTypeIcon = (type: Document['type']) => {
  switch (type) {
    case 'guide':
      return BookOpen;
    case 'api':
      return Code;
    case 'runbook':
      return FileText;
    case 'architecture':
      return Book;
    case 'tutorial':
      return HelpCircle;
  }
};

const getTypeColor = (type: Document['type']) => {
  switch (type) {
    case 'guide':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'api':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'runbook':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'architecture':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
    case 'tutorial':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
  }
};

const getStatusColor = (status: Document['status']) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'archived':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
  }
};

export const Documentation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showNewDoc, setShowNewDoc] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showDocModal, setShowDocModal] = useState(false);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const categories = [...new Set(documents.map(doc => doc.category))];

  const handleViewDocument = (doc: Document) => {
    setSelectedDoc(doc);
    setShowDocModal(true);
  };

  const handleEditDocument = (doc: Document) => {
    alert(`Editing document: ${doc.title}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Documentation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Platform guides, API references, and operational runbooks
          </p>
        </div>
        <button 
          onClick={() => setShowNewDoc(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Document</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Docs</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {documents.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Published</p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">
                {documents.filter(d => d.status === 'published').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Drafts</p>
              <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400 mt-1">
                {documents.filter(d => d.status === 'draft').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <Edit className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {documents.reduce((sum, doc) => sum + doc.views, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="guide">Guides</option>
          <option value="api">API Reference</option>
          <option value="runbook">Runbooks</option>
          <option value="architecture">Architecture</option>
          <option value="tutorial">Tutorials</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => {
          const TypeIcon = getTypeIcon(doc.type);
          return (
            <div
              key={doc.id}
              className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <TypeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {doc.category}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleViewDocument(doc)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Content Preview */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {doc.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {doc.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
                {doc.tags.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{doc.tags.length - 3} more
                  </span>
                )}
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{doc.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{doc.lastModified}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{doc.views}</span>
                </div>
              </div>

              {/* Status and Type */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(doc.type)}`}>
                    {doc.type}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleViewDocument(doc)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                  <button 
                    onClick={() => handleEditDocument(doc)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Document Modal */}
      {showNewDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New Document
              </h2>
              <button
                onClick={() => setShowNewDoc(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Document title"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="guide">Guide</option>
                    <option value="api">API Reference</option>
                    <option value="runbook">Runbook</option>
                    <option value="architecture">Architecture</option>
                    <option value="tutorial">Tutorial</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Getting Started"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="tag1, tag2, tag3"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  rows={12}
                  placeholder="Write your documentation content here..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowNewDoc(false)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Document created successfully!');
                  setShowNewDoc(false);
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Create Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document View Modal */}
      {showDocModal && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedDoc.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedDoc.category} • {selectedDoc.type}
                </p>
              </div>
              <button
                onClick={() => setShowDocModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="prose max-w-none">
                {/* OpenAPI/Swagger JSON */}
                {isOpenApiSpec(selectedDoc.content) ? (
                  <OpenApiRenderer spec={isOpenApiSpec(selectedDoc.content)!} />
                ) : /^\s*(graph|sequenceDiagram|flowchart)\b/.test(selectedDoc.content.trim()) ? (
                  <MermaidDiagram code={selectedDoc.content} />
                ) : (
                  <div className="prose max-w-none text-gray-900 dark:text-white">
                    <ReactMarkdown>{selectedDoc.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                By {selectedDoc.author} • Last updated {selectedDoc.lastModified} • {selectedDoc.views} views
              </div>
              <button
                onClick={() => handleEditDocument(selectedDoc)}
                className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Edit Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};