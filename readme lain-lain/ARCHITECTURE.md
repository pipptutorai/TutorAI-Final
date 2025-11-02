# 🏗️ System Architecture - TutorAI

Dokumentasi arsitektur sistem TutorAI dengan penjelasan detail setiap komponen.

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Browser                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         React Frontend (Port 5173)                        │  │
│  │  - 3D Avatar (Three.js)                                   │  │
│  │  - Speech Recognition (Web Speech API)                    │  │
│  │  - UI Components                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTP/REST API
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              Node.js Backend API (Port 3000)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  - Express.js REST API                                    │  │
│  │  - JWT Authentication                                     │  │
│  │  - Rate Limiting & Security                               │  │
│  │  - Gemini AI Integration                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────┬─────────────────────────────────┬──────────────────┘
           │                                 │
           │ PostgreSQL                      │ HTTP API
           │ Queries                         │
           ▼                                 ▼
┌──────────────────────────┐   ┌─────────────────────────────────┐
│  PostgreSQL Database     │   │  Python Indexer (Port 8000)     │
│  (Port 5432)             │   │  ┌────────────────────────────┐ │
│  ┌────────────────────┐  │   │  │  - FastAPI                 │ │
│  │ - profiles         │  │   │  │  - PDF Processing          │ │
│  │ - documents        │  │   │  │  - Text Chunking           │ │
│  │ - chunks (vector)  │◄─┼───┼──│  - Gemini Embeddings       │ │
│  │ - chat_history     │  │   │  │  - Semantic Search         │ │
│  │ - feedback         │  │   │  └────────────────────────────┘ │
│  └────────────────────┘  │   └─────────────────────────────────┘
│  + pgvector extension    │
└──────────────────────────┘
           │
           │ Vector Similarity
           │ Search
           ▼
┌──────────────────────────┐
│   Google Gemini API      │
│  - Text Embeddings       │
│  - Text Generation       │
└──────────────────────────┘
```

## 🔄 Data Flow

### 1. User Registration Flow

```
User → Frontend → Backend API
                     ↓
              Validate Input
                     ↓
              Hash Password (bcrypt)
                     ↓
              Save to Database (profiles table)
                     ↓
              Return Success
                     ↓
              Frontend → Redirect to Login
```

### 2. Authentication Flow

```
User Login → Frontend → POST /api/auth/login
                           ↓
                    Backend validates credentials
                           ↓
                    Compare password hash
                           ↓
                    Generate JWT token
                           ↓
                    Return token to Frontend
                           ↓
                    Frontend stores in localStorage
                           ↓
                    Subsequent requests include token in headers
```

### 3. Document Upload & Indexing Flow

```
Admin uploads PDF → Frontend → POST /api/admin/documents/upload
                                  ↓
                          Backend validates file
                                  ↓
                          Save PDF to local storage
                                  ↓
                          Create document record in DB
                                  ↓
                          POST to Indexer → /index
                                              ↓
                                    Indexer reads PDF
                                              ↓
                                    Extract text content
                                              ↓
                                    Split into chunks
                                              ↓
                                    Generate embeddings (Gemini)
                                              ↓
                                    Store chunks with vectors in DB
                                              ↓
                                    Return success
                                  ↓
                          Update document status
                                  ↓
                          Return to Frontend
```

### 4. Chat with RAG Flow

```
User asks question → Frontend → POST /api/chat
                                   ↓
                          Backend receives message
                                   ↓
                          POST to Indexer → /retrieve
                                              ↓
                                    Convert query to embedding
                                              ↓
                                    Semantic search in vector DB
                                              ↓
                                    Retrieve top K similar chunks
                                              ↓
                                    Return relevant context
                                   ↓
                          Backend constructs prompt
                          (system + context + user query)
                                   ↓
                          Send to Gemini API
                                   ↓
                          Receive AI response
                                   ↓
                          Save to chat_history table
                                   ↓
                          Return response + sources to Frontend
                                   ↓
                          Frontend displays message
                                   ↓
                          Text-to-Speech (if enabled)
```

### 5. Speech-to-Text Flow

```
User clicks mic → Web Speech API starts listening
                        ↓
                  User speaks
                        ↓
                  Browser converts to text
                        ↓
                  Frontend receives text
                        ↓
                  Display in input field
                        ↓
                  User can edit or send directly
```

## 🗃️ Database Schema Details

### profiles Table

```sql
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user',  -- 'user' or 'admin'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Relationships:**

- One-to-many with chat_history
- One-to-many with documents (uploaded_by)
- One-to-many with feedback

### documents Table

```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    uploaded_by INTEGER REFERENCES profiles(id),
    status TEXT DEFAULT 'pending',  -- 'pending', 'indexed', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Relationships:**

- Many-to-one with profiles (uploaded_by)
- One-to-many with chunks

### chunks Table

```sql
CREATE TABLE chunks (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    embedding VECTOR(768),  -- pgvector type
    metadata JSONB,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vector similarity search index
CREATE INDEX idx_chunks_embedding ON chunks
USING ivfflat (embedding vector_cosine_ops);
```

**Key Features:**

- Vector similarity search using pgvector
- Cascade delete when document deleted
- Metadata for additional chunk information

### chat_history Table

```sql
CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES profiles(id),
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    sources JSONB,  -- Array of source document references
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Sources JSON Format:**

```json
[
  {
    "document_id": 1,
    "document_title": "Introduction to AI",
    "chunk_text": "AI is...",
    "similarity": 0.92
  }
]
```

## 🔐 Security Architecture

### Authentication & Authorization

**JWT Token Structure:**

```json
{
  "userId": 123,
  "email": "user@example.com",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234671490
}
```

**Middleware Chain:**

```
Request → Rate Limiter → CORS → Helmet → Auth Middleware → Route Handler
```

**Role-Based Access:**

- **User**: Access to chat, own history
- **Admin**: Access to all user data, documents, chats

### Input Validation

**Backend (Express Validator):**

```javascript
// Example: Login validation
[
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
];
```

**Frontend (React):**

```javascript
// Client-side validation before API call
if (!email || !password) {
  return showError("All fields required");
}
```

### File Upload Security

**Validations:**

1. File type: Only PDF allowed
2. File size: Max 10MB (configurable)
3. Content type verification
4. Sanitize filename
5. Store in isolated directory

## 🚀 Performance Optimizations

### Database Indexing

```sql
-- Email lookup (frequent for auth)
CREATE INDEX idx_profiles_email ON profiles(email);

-- Role filtering
CREATE INDEX idx_profiles_role ON profiles(role);

-- Vector similarity search
CREATE INDEX idx_chunks_embedding ON chunks
USING ivfflat (embedding vector_cosine_ops);

-- Chat history lookup
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_created_at ON chat_history(created_at DESC);
```

### Caching Strategy

**Current:**

- JWT tokens cached in localStorage (frontend)
- No server-side caching yet

**Future Improvements:**

- Redis for session caching
- Cache frequent queries
- Vector search result caching

### Rate Limiting

```javascript
// Backend: express-rate-limit
{
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,  // Max 100 requests per IP
    message: 'Too many requests'
}
```

## 🧩 Component Architecture

### Frontend Components

```
App.jsx
├── Router
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── UserPage.jsx
│   │   ├── Avatar3D.jsx
│   │   ├── ChatMessage.jsx
│   │   └── VoiceInput.jsx
│   ├── History.jsx
│   └── admin/
│       ├── AdminPage.jsx
│       ├── AdminUsers.jsx
│       ├── AdminDocuments.jsx
│       └── AdminChats.jsx
├── utils/
│   └── auth.js
└── lib/
    └── api.js (Axios instance)
```

### Backend API Structure

```
src/
├── server.js (Entry point)
├── routes/
│   ├── auth.js (POST /register, /login)
│   ├── chat.js (POST /chat, GET /history)
│   ├── adminUsers.js (CRUD users)
│   ├── adminDocuments.js (Upload, list, delete)
│   ├── adminChats.js (Monitor, export)
│   └── adminStats.js (Dashboard stats)
├── middleware/
│   └── auth.js (JWT verification)
├── services/
│   └── ragService.js (Indexer communication)
└── utils/
    └── db.js (PostgreSQL connection pool)
```

### Indexer Service Structure

```
indexer/
├── indexer_rag.py (FastAPI app)
├── chunker_embedder.py (Text processing)
└── requirements.txt
```

## 🔄 API Integration Points

### Backend ↔ Indexer Communication

**Document Indexing:**

```javascript
// Backend → Indexer
POST http://localhost:8000/index
{
    "document_id": 123,
    "file_path": "/path/to/file.pdf"
}

// Indexer Response
{
    "success": true,
    "chunks_created": 45
}
```

**Semantic Search:**

```javascript
// Backend → Indexer
POST http://localhost:8000/retrieve
{
    "query": "What is machine learning?",
    "top_k": 5
}

// Indexer Response
{
    "results": [
        {
            "chunk_text": "...",
            "document_title": "...",
            "similarity": 0.92
        }
    ]
}
```

### Backend ↔ Gemini API

**Text Generation:**

```javascript
// Backend → Gemini
const response = await model.generateContent({
  contents: [{ role: "user", parts: [{ text: prompt }] }],
});
```

## 📊 Monitoring & Logging

### Current Logging

**Backend:**

```javascript
console.log("Server running on port", PORT);
console.error("Database error:", error);
```

**Indexer:**

```python
print(f"Processing document {doc_id}")
print(f"Error: {str(e)}")
```

### Future Improvements

- [ ] Structured logging (Winston/Pino)
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (New Relic)
- [ ] Analytics (Google Analytics)
- [ ] Log aggregation (ELK Stack)

## 🔮 Scalability Considerations

### Current Architecture Limitations

1. **Single Server**: All services on one machine
2. **File Storage**: Local disk storage
3. **No Load Balancing**: Single instance per service
4. **No Caching**: Every request hits database

### Scaling Strategy

**Horizontal Scaling:**

```
                    Load Balancer
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   Backend 1         Backend 2         Backend 3
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
                   Database Pool
```

**Microservices Evolution:**

```
Current: Monolithic Backend + Separate Indexer

Future:
- Auth Service
- Chat Service
- Document Service
- Admin Service
- Search Service (Indexer)
- Notification Service
```

## 📚 Technology Decisions

### Why PostgreSQL + pgvector?

**Pros:**

- Single database for all data
- ACID compliance
- Native vector search
- Mature ecosystem

**Alternatives Considered:**

- MongoDB + separate vector DB (Pinecone, Weaviate)
- Fully managed vector DBs

### Why Gemini API?

**Pros:**

- Free tier available
- Good embedding quality
- Fast generation speed
- Multimodal capabilities

**Alternatives:**

- OpenAI (ChatGPT, Ada embeddings)
- Anthropic (Claude)
- Open-source LLMs (Llama, Mistral)

### Why React Three Fiber?

**Pros:**

- React-friendly 3D
- Good documentation
- Active community
- Performant

**Alternatives:**

- Plain Three.js
- Babylon.js
- PlayCanvas

## 🛣️ Future Architecture Plans

1. **Microservices**: Split monolith into services
2. **Message Queue**: RabbitMQ/Redis for async processing
3. **CDN**: Serve static assets via CDN
4. **Object Storage**: S3 for file uploads
5. **Container Orchestration**: Docker + Kubernetes
6. **API Gateway**: Kong/AWS API Gateway
7. **Service Mesh**: Istio for microservices

---

**Architecture Version: 1.0**  
**Last Updated: November 2025**
