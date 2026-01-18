# FACTURIFY PLATFORM - TECHNICAL ARCHITECTURE

**Document Version:** 2.0  
**Date:** January 2026  
**Classification:** Confidential

---

## ARCHITECTURE OVERVIEW

Facturify employs a modern polyglot microservices architecture, leveraging best-in-class technologies for each use case. The platform is designed for scalability, reliability, and performance, with clear separation of concerns and robust data management strategies.

---

## SYSTEM ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FACTURIFY PLATFORM                              │
│                      Polyglot Microservices Architecture                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  CLIENT LAYER                                                           │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐            │
│  │  Mobile Apps   │  │   Web App      │  │  Admin Portal  │            │
│  │  (iOS/Android) │  │   (Browser)    │  │   (Internal)   │            │
│  │  React Native  │  │   Next.js 14   │  │   Next.js 14   │            │
│  └────────┬───────┘  └────────┬───────┘  └────────┬───────┘            │
│           │                   │                    │                    │
│           └───────────────────┼────────────────────┘                    │
│                               │                                         │
│  ═══════════════════════════════════════════════════════════════        │
│  API GATEWAY / LOAD BALANCER                                            │
│  ┌─────────────────────────────────────────────────────────┐            │
│  │  Kong API Gateway / Nginx                                │            │
│  │  - Authentication        - Rate Limiting                 │            │
│  │  - SSL Termination      - Request Routing                │            │
│  │  - Load Balancing       - API Versioning                 │            │
│  └──────────────────────────┬──────────────────────────────┘            │
│                             │                                           │
│  ═══════════════════════════════════════════════════════════════        │
│  APPLICATION LAYER                                                      │
│  ┌─────────────────────┐           ┌─────────────────────┐              │
│  │   NestJS Core API   │◄─────────►│  Python AI Services │              │
│  │   (TypeScript)      │   HTTP    │  (FastAPI)          │              │
│  ├─────────────────────┤           ├─────────────────────┤              │
│  │ • Auth Module       │           │ • OCR Engine        │              │
│  │ • Users Module      │           │ • ML Predictions    │              │
│  │ • Companies Module  │           │ • NLP Processing    │              │
│  │ • Invoices Module   │           │ • Fraud Detection   │              │
│  │ • Clients Module    │           │ • Analytics AI      │              │
│  │ • Payments Module   │           │ • Report Generator  │              │
│  │ • Expenses Module   │           │                     │              │
│  │ • Reports Module    │           │                     │              │
│  │ • Notifications     │           │                     │              │
│  └─────────┬───────────┘           └──────────┬──────────┘              │
│            │                                  │                         │
│            └──────────────┬───────────────────┘                         │
│                           │                                             │
│  ┌────────────────────────┴────────────────────────┐                    │
│  │         MESSAGE QUEUE (RabbitMQ)                │                    │
│  │  - Async Processing  - Event Sourcing  - CQRS  │                    │
│  └────────────────────────┬────────────────────────┘                    │
│                           │                                             │
│  ═══════════════════════════════════════════════════════════════        │
│  DATA LAYER                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │  PostgreSQL  │  │   MongoDB    │  │    Redis     │                  │
│  │  (Primary)   │  │  (Documents) │  │   (Cache)    │                  │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤                  │
│  │ • Users      │  │ • Audit Logs │  │ • Sessions   │                  │
│  │ • Companies  │  │ • Analytics  │  │ • API Cache  │                  │
│  │ • Invoices   │  │ • OCR Data   │  │ • Rate Limit │                  │
│  │ • Clients    │  │ • ML Results │  │ • Pub/Sub    │                  │
│  │ • Payments   │  │ • Email Logs │  │ • Locks      │                  │
│  │ • Expenses   │  │ • Notifs Log │  │              │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
│                                                                         │
│  ═══════════════════════════════════════════════════════════════        │
│  AUTOMATION LAYER                                                       │
│  ┌─────────────────────────────────────────────────────────┐            │
│  │  n8n Workflow Automation Engine                         │            │
│  │  - Invoice Reminders    - Payment Processing            │            │
│  │  - Email Sequences      - Integration Sync              │            │
│  │  - Report Generation    - Notification Routing          │            │
│  └─────────────────────────────────────────────────────────┘            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## ARCHITECTURAL PRINCIPLES

### 1. SEPARATION OF CONCERNS
Each service has a single, well-defined responsibility:
- **NestJS Core:** Business logic, CRUD operations, authentication
- **Python AI:** Machine learning, OCR, predictions, analytics
- **MongoDB:** Flexible document storage for logs and analytics
- **PostgreSQL:** Transactional data with ACID guarantees
- **Redis:** High-speed caching and real-time operations

### 2. POLYGLOT PERSISTENCE
Multiple database technologies chosen for optimal use cases:
- **PostgreSQL:** Relational data requiring consistency
- **MongoDB:** Unstructured data, logs, analytics
- **Redis:** Ephemeral data, caching, sessions

### 3. API-FIRST DESIGN
All functionality exposed through well-documented RESTful APIs:
- Versioned endpoints (v1, v2)
- Consistent response formats
- Comprehensive error handling
- OpenAPI/Swagger documentation

### 4. SCALABILITY BY DESIGN
Horizontal scaling capability at every layer:
- Stateless application servers
- Database replication and sharding
- Cache distribution
- Load balancing across instances

### 5. SECURITY IN DEPTH
Multiple layers of security controls:
- Network isolation
- Authentication and authorization
- Encryption at rest and in transit
- Regular security audits

---

## CORE MODULES

### BACKEND - NESTJS CORE API

#### Authentication Module
**Responsibilities:**
- User registration and login
- JWT token generation and validation
- Password reset workflows
- Session management

**Technologies:**
- Passport.js for authentication strategies
- bcrypt for password hashing
- JWT for stateless authentication

**Endpoints:**
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
```

#### Users Module
**Responsibilities:**
- User profile management
- User preferences
- Multi-company associations

**Database:** PostgreSQL (users table)

#### Companies Module
**Responsibilities:**
- Company creation and management
- Company settings and branding
- Team member management

**Database:** PostgreSQL (companies, company_users tables)

#### Invoices Module
**Responsibilities:**
- Invoice CRUD operations
- PDF generation
- Email delivery
- Status tracking

**Database:** PostgreSQL (invoices, invoice_items tables)  
**Document Store:** MongoDB (PDF metadata, versions)

#### Clients Module
**Responsibilities:**
- Client database management
- Contact information
- Client analytics

**Database:** PostgreSQL (clients table)

#### Payments Module
**Responsibilities:**
- Payment recording
- Stripe integration
- Payment history
- Reconciliation

**Database:** PostgreSQL (payments table)

#### Expenses Module
**Responsibilities:**
- Expense tracking
- Category management
- Receipt upload

**Database:** PostgreSQL (expenses table)  
**AI Integration:** Python OCR service

#### Reports Module
**Responsibilities:**
- Financial report generation
- Data aggregation
- Export functionality

**Database:** PostgreSQL (queries)  
**Cache:** Redis (report results)

#### Notifications Module
**Responsibilities:**
- Real-time notifications
- Email notifications
- Push notifications
- Notification preferences

**Database:** PostgreSQL (notifications table)  
**Document Store:** MongoDB (notification logs)  
**Real-time:** Redis Pub/Sub

---

### BACKEND - PYTHON AI SERVICES

#### OCR Service
**Responsibilities:**
- Receipt image processing
- Invoice document scanning
- Text extraction
- Data structuring

**Technologies:**
- Tesseract OCR
- EasyOCR
- Google Vision API (optional)
- OpenCV for image preprocessing

**Endpoints:**
```
POST   /ai/v1/ocr/receipt
POST   /ai/v1/ocr/invoice
POST   /ai/v1/ocr/business-card
```

#### Predictions Service
**Responsibilities:**
- Cash flow forecasting
- Revenue predictions
- Client churn analysis

**Technologies:**
- scikit-learn
- TensorFlow
- Prophet (time series)
- Pandas, NumPy

**Endpoints:**
```
GET    /ai/v1/predictions/cashflow/{companyId}
GET    /ai/v1/predictions/revenue/{companyId}
GET    /ai/v1/predictions/churn/{companyId}
```

#### Analytics AI Service
**Responsibilities:**
- Business insights generation
- Anomaly detection
- Pattern recognition
- Recommendation engine

**Technologies:**
- Pandas for data processing
- Matplotlib for visualizations
- Custom ML models

**Endpoints:**
```
GET    /ai/v1/analytics/insights/{companyId}
GET    /ai/v1/analytics/anomalies/{companyId}
POST   /ai/v1/analytics/benchmark
```

#### NLP Service
**Responsibilities:**
- Expense categorization
- Entity extraction
- Text summarization

**Technologies:**
- spaCy
- NLTK
- Transformers (BERT)

**Endpoints:**
```
POST   /ai/v1/nlp/categorize
POST   /ai/v1/nlp/extract
POST   /ai/v1/nlp/summarize
```

#### Fraud Detection Service
**Responsibilities:**
- Transaction monitoring
- Risk scoring
- Pattern analysis

**Technologies:**
- Isolation Forest
- XGBoost
- Custom rule engine

**Endpoints:**
```
POST   /ai/v1/fraud/check
GET    /ai/v1/fraud/report/{companyId}
```

---

## DATA ARCHITECTURE

### POSTGRESQL DATABASE

#### Schema Design
**Users and Authentication:**
```
users
  - id (UUID, PK)
  - email (VARCHAR, UNIQUE)
  - password_hash (VARCHAR)
  - first_name, last_name (VARCHAR)
  - created_at, updated_at (TIMESTAMP)

companies
  - id (UUID, PK)
  - name (VARCHAR)
  - email, phone (VARCHAR)
  - address, city, country (VARCHAR)
  - logo_url (VARCHAR)
  - settings (JSONB)
  - created_at (TIMESTAMP)

company_users
  - id (UUID, PK)
  - user_id (UUID, FK → users)
  - company_id (UUID, FK → companies)
  - role (ENUM: owner, admin, member)
  - is_default (BOOLEAN)
  - created_at (TIMESTAMP)
```

**Business Data:**
```
clients
  - id (UUID, PK)
  - company_id (UUID, FK → companies)
  - name, email, phone (VARCHAR)
  - address details (VARCHAR)
  - tax_id, vat_number (VARCHAR)
  - created_at (TIMESTAMP)

invoices
  - id (UUID, PK)
  - company_id (UUID, FK → companies)
  - client_id (UUID, FK → clients)
  - invoice_number (VARCHAR, UNIQUE)
  - subtotal, tax_amount, total (DECIMAL)
  - status (ENUM)
  - issue_date, due_date (DATE)
  - created_at (TIMESTAMP)

invoice_items
  - id (UUID, PK)
  - invoice_id (UUID, FK → invoices)
  - description (TEXT)
  - quantity, unit_price, amount (DECIMAL)

payments
  - id (UUID, PK)
  - invoice_id (UUID, FK → invoices)
  - amount (DECIMAL)
  - payment_method (ENUM)
  - paid_at (TIMESTAMP)

expenses
  - id (UUID, PK)
  - company_id (UUID, FK → companies)
  - description (TEXT)
  - amount (DECIMAL)
  - category (ENUM)
  - expense_date (DATE)
  - receipt_url (VARCHAR)
```

#### Indexing Strategy
- Primary keys on all tables
- Foreign key indexes for joins
- Composite indexes on frequently queried columns
- Full-text search indexes on description fields

#### Data Integrity
- Foreign key constraints
- Check constraints for status fields
- Triggers for audit logging
- Cascading deletes where appropriate

---

### MONGODB DATABASE

#### Collections

**audit_logs:**
```json
{
  "_id": ObjectId,
  "timestamp": ISODate,
  "userId": "UUID",
  "companyId": "UUID",
  "action": "invoice.created",
  "entityType": "invoice",
  "entityId": "UUID",
  "changes": {
    "before": {},
    "after": {}
  },
  "metadata": {
    "ipAddress": "192.168.1.1",
    "userAgent": "..."
  }
}
```

**analytics_events:**
```json
{
  "_id": ObjectId,
  "eventType": "invoice.viewed",
  "timestamp": ISODate,
  "userId": "UUID",
  "properties": {},
  "context": {}
}
```

**ocr_results:**
```json
{
  "_id": ObjectId,
  "companyId": "UUID",
  "fileName": "receipt.jpg",
  "extractedData": {
    "vendor": "...",
    "total": 125.99,
    "items": []
  },
  "confidence": 0.92,
  "processedAt": ISODate
}
```

**ml_predictions:**
```json
{
  "_id": ObjectId,
  "companyId": "UUID",
  "predictionType": "cashflow_forecast",
  "predictions": {},
  "modelVersion": "1.0.0",
  "generatedAt": ISODate,
  "validUntil": ISODate
}
```

#### Indexes
- Compound indexes on userId/companyId + timestamp
- TTL indexes for auto-expiring old logs
- Text indexes for search functionality

---

### REDIS DATA STRUCTURES

#### Sessions
```
Key: session:{sessionId}
Value: JSON { userId, companyId, permissions, expiresAt }
TTL: 7 days
```

#### API Cache
```
Key: cache:invoice:{invoiceId}
Value: JSON { invoice data }
TTL: 1 hour
```

#### Rate Limiting
```
Key: ratelimit:{userId}:{endpoint}
Value: Counter
TTL: 60 seconds
```

#### Real-time Pub/Sub
```
Channel: notifications:{userId}
Message: { type, data }
```

---

## COMMUNICATION PATTERNS

### SYNCHRONOUS (HTTP/REST)
- Client applications → API Gateway → NestJS
- NestJS → Python AI (when immediate response needed)
- Frontend → Backend API calls

**Benefits:**
- Simple request-response
- Immediate feedback
- Easy debugging

### ASYNCHRONOUS (MESSAGE QUEUE)
- NestJS → RabbitMQ → Python AI (for heavy processing)
- Background job processing
- Event-driven workflows

**Benefits:**
- Decoupling of services
- Resilience to failures
- Load leveling

### REAL-TIME (WEBSOCKETS / REDIS PUB/SUB)
- Notification delivery
- Live dashboard updates
- Collaborative editing

**Benefits:**
- Low latency
- Bi-directional communication
- Efficient for streaming data

---

## DEPLOYMENT ARCHITECTURE

### DEVELOPMENT ENVIRONMENT
```
Local Development:
- Docker Compose for all services
- Hot reload enabled
- Local databases
- Mock external services
```

### STAGING ENVIRONMENT
```
Cloud Infrastructure:
- Kubernetes cluster (3 nodes)
- Managed databases (RDS, Atlas)
- Redis cluster
- Load balancer
- Identical to production
```

### PRODUCTION ENVIRONMENT
```
Multi-region Deployment:
- Primary: US-East
- Secondary: EU-West
- Auto-scaling groups (2-10 instances)
- Multi-AZ database deployment
- CDN for static assets (CloudFlare)
- DDoS protection
```

---

## SCALABILITY CONSIDERATIONS

### HORIZONTAL SCALING
**Application Tier:**
- Stateless NestJS instances
- Scale behind load balancer
- Auto-scaling based on CPU/memory

**Database Tier:**
- PostgreSQL read replicas
- MongoDB replica sets
- Redis cluster mode

### VERTICAL SCALING
**Limits:**
- Application: Up to 16 vCPUs, 64GB RAM
- Database: Up to 32 vCPUs, 128GB RAM

### CACHING STRATEGY
**Multiple Layers:**
1. CDN caching (static assets)
2. Redis caching (application data)
3. Database query caching
4. Browser caching

### LOAD TESTING TARGETS
- 10,000 concurrent users
- 1,000 requests/second
- <100ms API response time (p95)
- <2s page load time

---

## MONITORING & OBSERVABILITY

### APPLICATION MONITORING
**Tools:** Sentry, New Relic, Datadog (planned)
**Metrics:**
- Error rates
- Response times
- Throughput
- Resource utilization

### INFRASTRUCTURE MONITORING
**Tools:** Prometheus, Grafana
**Metrics:**
- Server health
- Database performance
- Network traffic
- Disk I/O

### LOGGING STRATEGY
**Centralized Logging:** ELK Stack (Elasticsearch, Logstash, Kibana)
**Log Levels:**
- ERROR: Application errors
- WARN: Recoverable issues
- INFO: Important events
- DEBUG: Detailed diagnostics

### ALERTING
**Alert Examples:**
- CPU usage > 80% for 5 minutes
- Error rate > 1% for 1 minute
- Database connections > 90% of pool
- Disk space < 10% free

---

## DISASTER RECOVERY

### BACKUP STRATEGY
**Database Backups:**
- PostgreSQL: Daily full + WAL archiving
- MongoDB: Hourly snapshots
- Retention: 30 days

**Application Backups:**
- Configuration files
- Uploaded documents
- ML models

### RECOVERY PROCEDURES
**RTO (Recovery Time Objective):** 4 hours  
**RPO (Recovery Point Objective):** 1 hour

**Failover Process:**
1. Detect failure (automated monitoring)
2. Promote standby database
3. Redirect traffic to backup region
4. Restore application state
5. Verify functionality

---

## CONCLUSION

The Facturify platform architecture is designed for:
- **Reliability:** 99.9% uptime
- **Scalability:** Support growth from 100 to 100,000 users
- **Performance:** Sub-second response times
- **Security:** Enterprise-grade data protection
- **Maintainability:** Clear separation of concerns

This architecture provides a solid foundation for current operations and future growth.

---

**END OF DOCUMENT**
