# TutorAI - AI-Powered Educational Assistant

TutorAI adalah platform pembelajaran berbasis AI dengan fitur RAG (Retrieval-Augmented Generation) yang menggunakan Gemini API, dilengkapi dengan 3D avatar interaktif dan dukungan speech-to-text/text-to-speech.



## 📑 Table of Contents

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start Guide](#-quick-start-guide)
- [Development](#-development)
- [Features Detail](#-features-detail)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#️-environment-variables)
- [Troubleshooting](#-troubleshooting)
- [Database Schema](#-database-schema)
- [Security](#-security)
- [Deployment](#-deployment)
- [Team & Contribution](#-team--contribution)


---

## 🎯 Fitur Utama

- 💬 **Chat Cerdas**: AI tutor dengan RAG untuk jawaban akurat dari dokumen
- 🤖 **3D Avatar Interaktif**: Avatar animasi 3D yang responsive
- 🎤 **Speech-to-Text**: Berbicara langsung ke AI tutor
- 🔊 **Text-to-Speech**: AI berbicara balik dengan suara natural
- 📚 **Document Management**: Upload dan index PDF untuk knowledge base
- 👥 **Admin Dashboard**: Kelola user, dokumen, dan monitor chat
- 🔐 **Authentication**: JWT-based authentication yang aman

## 🛠 Tech Stack

### Backend

- **API**: Node.js + Express.js
- **Indexer**: Python + FastAPI + Uvicorn
- **Database**: PostgreSQL 14+ dengan pgvector extension
- **AI**: Google Gemini API (embedding + generation)
- **Auth**: JWT dengan bcrypt
- **Storage**: Local file system untuk PDF uploads

### Frontend

- **Framework**: React 19 + Vite
- **Router**: React Router DOM v7
- **3D**: React Three Fiber + Drei
- **Speech**: Web Speech API
- **Styling**: CSS Modern dengan variabel

## 📁 Project Structure

```
TutorAI-Final/
├── 📂 database/
│   ├── schema.sql              # Database schema dengan pgvector
│
├── 📂 indexer/                 # Python FastAPI service
│   ├── indexer_rag.py          # Main FastAPI app untuk RAG
│   ├── chunker_embedder.py     # Text chunking & embedding
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example            # Template environment variables
│   └── .env                    # Your environment variables (create this)
│
├── 📂 tutor-cerdas-api/        # Node.js Express API
│   ├── src/
│   │   ├── server.js           # Main server file
│   │   ├── routes/             # API endpoints
│   │   │   ├── auth.js         # Authentication routes
│   │   │   ├── chat.js         # Chat routes
│   │   │   ├── adminUsers.js   # Admin user management
│   │   │   ├── adminDocuments.js # Admin document management
│   │   │   ├── adminChats.js   # Admin chat monitoring
│   │   │   └── adminStats.js   # Admin statistics
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT authentication middleware
│   │   ├── services/
│   │   │   └── ragService.js   # RAG integration service
│   │   └── utils/
│   │       └── db.js           # Database connection
│   ├── uploads/documents/      # Uploaded PDF storage
│   ├── package.json
│   ├── .env.example            # Template environment variables
│   └── .env                    # Your environment variables (create this)
│
├── 📂 trial-web/               # React frontend
│   ├── src/
│   │   ├── main.jsx            # React entry point
│   │   ├── App.jsx             # Main app component
│   │   ├── pages/              # Page components
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Register.jsx    # Register page
│   │   │   ├── UserPage.jsx    # User chat interface
│   │   │   ├── History.jsx     # Chat history page
│   │   │   └── admin/          # Admin pages
│   │   │       ├── AdminPage.jsx
│   │   │       ├── AdminUsers.jsx
│   │   │       ├── AdminDocuments.jsx
│   │   │       └── AdminChats.jsx
│   │   ├── components/         # Reusable components
│   │   │   ├── Avatar3D.jsx    # 3D avatar component
│   │   │   └── ChatMessage.jsx # Chat message component
│   │   ├── lib/
│   │   │   └── api.js          # Axios API client
│   │   └── utils/
│   │       └── auth.js         # Auth utilities
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.example            # Template environment variables
│   └── .env                    # Your environment variables (create this)
│
├── README.md                   # This file
├── SETUP_GUIDE.md              # Detailed setup guide
└── .gitignore
```

## 🚀 Quick Start Guide

### Prerequisites

Pastikan sudah terinstall:

- **Node.js** v18+ dan npm ([Download](https://nodejs.org/))
- **Python** 3.10+ ([Download](https://www.python.org/downloads/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))
- **Google Gemini API Key** ([Get API Key](https://makersuite.google.com/app/apikey))

### Step 1: Clone Repository

```bash
git clone https://github.com/your-username/TutorAI-Final.git
cd TutorAI-Final
```

### Step 2: Setup Database

#### Install pgvector Extension

**Windows:**

```powershell
# Download dan install pgvector dari https://github.com/pgvector/pgvector/releases
# Atau gunakan instalasi manual:
git clone https://github.com/pgvector/pgvector.git
cd pgvector
# Ikuti instruksi instalasi di README pgvector
```

**Linux/Mac:**

```bash
git clone https://github.com/pgvector/pgvector.git
cd pgvector
make
sudo make install
```

#### Create Database

```bash
# Buka psql atau pgAdmin
psql -U postgres

# Di dalam psql:
CREATE DATABASE tutorai;
\c tutorai

# Jalankan schema (atau bisa lewat pgAdmin)
\i database/schema.sql

# Verify installation
SELECT * FROM pg_extension WHERE extname = 'vector';
```

**Atau menggunakan file:**

```bash
# Dari root folder TutorAI-Final
psql -U postgres -d tutorai -f database/schema.sql
```

### Step 3: Setup Indexer (Python Service)

```bash
cd indexer

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
venv\Scripts\Activate.ps1
# Windows CMD:
venv\Scripts\activate.bat
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac

# Edit .env file dengan text editor, isi:
# DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/tutorai
# GEMINI_API_KEY=your_gemini_api_key_here
```

**Run Indexer:**

```bash
# Pastikan virtual environment aktif
uvicorn indexer_rag:app --reload --port 8000
```

Indexer akan berjalan di `http://localhost:8000`

### Step 4: Setup Backend API (Node.js)

**Buka terminal baru:**

```bash
cd tutor-cerdas-api

# Install dependencies
npm install

# Setup environment variables
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac

# Edit .env file, isi:
# DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/tutorai
# GEMINI_API_KEY=your_gemini_api_key_here
# JWT_SECRET=your_random_secret_key_minimum_32_characters
# PORT=3000
# NODE_ENV=development
# INDEXER_URL=http://localhost:8000
```

**Generate JWT Secret:**

```bash
# Gunakan Node.js untuk generate random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Run Backend API:**

```bash
npm run dev
```

Backend akan berjalan di `http://localhost:3000`

### Step 5: Setup Frontend (React)

**Buka terminal baru:**

```bash
cd trial-web

# Install dependencies
npm install

# Setup environment variables
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac

# Edit .env file, isi:
# VITE_API_BASE_URL=http://localhost:3000/api
```

**Run Frontend:**

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

### Step 6: Create Admin User

Setelah semua service berjalan, buka browser dan:

1. Go to `http://localhost:5173/register`
2. Register akun pertama
3. Buka database dan update role user pertama menjadi 'admin':

```sql
-- Di psql atau pgAdmin:
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### Step 7: Test the Application

1. **Login** sebagai admin di `http://localhost:5173/login`
2. **Upload PDF** di Admin Dashboard → Documents
3. **Chat** dengan AI tutor di User Page
4. **Test Speech**: Klik microphone icon untuk voice input
5. **Test TTS**: AI akan berbicara otomatis (pastikan browser support TTS)

---

## 🔧 Development

### Running All Services

Anda perlu **3 terminal** yang berjalan bersamaan:

**Terminal 1 - Indexer:**

```bash
cd indexer
venv\Scripts\Activate.ps1  # Windows PowerShell
uvicorn indexer_rag:app --reload --port 8000
```

**Terminal 2 - Backend API:**

```bash
cd tutor-cerdas-api
npm run dev
```

**Terminal 3 - Frontend:**

```bash
cd trial-web
npm run dev
```

### Default Ports

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Indexer**: http://localhost:8000
- **Database**: localhost:5432

## 📋 Features Detail

### User Features

- ✅ **AI Chat dengan RAG**: Tanya jawab dengan AI yang didukung dokumen
- ✅ **3D Avatar Interaktif**: Avatar 3D dengan animasi idle dan talking
- ✅ **Voice Input**: Berbicara langsung menggunakan microphone
- ✅ **Voice Output**: AI berbicara dengan Text-to-Speech
- ✅ **Chat History**: Riwayat percakapan dengan pagination
- ✅ **Auto Language Detection**: Deteksi Bahasa Indonesia & Inggris otomatis
- ✅ **Source Citations**: Tampilkan sumber jawaban dari dokumen
- ✅ **Responsive Design**: Bekerja di desktop dan mobile

### Admin Features

- ✅ **Dashboard Statistics**: Overview user, dokumen, dan chat
- ✅ **User Management**:
  - List semua users dengan pencarian
  - Edit user (name, email, role)
  - Deactivate/Activate user
  - Delete user
- ✅ **Document Management**:
  - Upload PDF dokumen
  - Auto indexing dengan chunking & embedding
  - List dokumen dengan metadata
  - Delete dokumen
- ✅ **Chat Monitoring**:
  - View semua chat history
  - Filter by user
  - Search dalam chat
  - Export to CSV
- ✅ **Real-time Updates**: Data refresh otomatis

## 🔌 API Endpoints

### Authentication

| Method | Endpoint             | Description                | Auth Required |
| ------ | -------------------- | -------------------------- | ------------- |
| POST   | `/api/auth/register` | Register user baru         | ❌            |
| POST   | `/api/auth/login`    | Login & dapatkan JWT token | ❌            |

### Chat (User)

| Method | Endpoint                | Description                        | Auth Required |
| ------ | ----------------------- | ---------------------------------- | ------------- |
| POST   | `/api/chat`             | Kirim pesan ke AI                  | ✅ User       |
| GET    | `/api/chat/history`     | Get chat history dengan pagination | ✅ User       |
| DELETE | `/api/chat/history/:id` | Delete specific chat               | ✅ User       |

### Admin - Statistics

| Method | Endpoint           | Description          | Auth Required |
| ------ | ------------------ | -------------------- | ------------- |
| GET    | `/api/admin/stats` | Dashboard statistics | ✅ Admin      |

### Admin - Users

| Method | Endpoint               | Description    | Auth Required |
| ------ | ---------------------- | -------------- | ------------- |
| GET    | `/api/admin/users`     | List all users | ✅ Admin      |
| PATCH  | `/api/admin/users/:id` | Update user    | ✅ Admin      |
| DELETE | `/api/admin/users/:id` | Delete user    | ✅ Admin      |

### Admin - Documents

| Method | Endpoint                      | Description              | Auth Required |
| ------ | ----------------------------- | ------------------------ | ------------- |
| GET    | `/api/admin/documents`        | List all documents       | ✅ Admin      |
| POST   | `/api/admin/documents/upload` | Upload PDF & auto index  | ✅ Admin      |
| DELETE | `/api/admin/documents/:id`    | Delete document & chunks | ✅ Admin      |

### Admin - Chats

| Method | Endpoint                  | Description                 | Auth Required |
| ------ | ------------------------- | --------------------------- | ------------- |
| GET    | `/api/admin/chats`        | List all chats with filters | ✅ Admin      |
| POST   | `/api/admin/chats/export` | Export chats to CSV         | ✅ Admin      |

### Indexer (Internal API)

| Method | Endpoint    | Description            | Auth Required |
| ------ | ----------- | ---------------------- | ------------- |
| POST   | `/index`    | Index document PDF     | ❌ (Internal) |
| POST   | `/retrieve` | Semantic search chunks | ❌ (Internal) |
| GET    | `/health`   | Health check           | ❌            |

## ⚙️ Environment Variables

### Indexer Service (indexer/.env)

```env
# Database connection
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/tutorai

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
```

**Cara mendapatkan Gemini API Key:**

1. Kunjungi https://makersuite.google.com/app/apikey
2. Login dengan Google Account
3. Klik "Create API Key"
4. Copy API key dan paste ke .env file

### Backend API (tutor-cerdas-api/.env)

```env
# Database connection
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/tutorai

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Secret (minimum 32 characters)
# Generate dengan: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_random_secret_key_here_change_in_production

# Server configuration
PORT=3000
NODE_ENV=development

# Indexer service URL
INDEXER_URL=http://localhost:8000

# File upload settings
UPLOAD_DIR=./uploads/documents
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

### Frontend (trial-web/.env)

```env
# Backend API base URL
VITE_API_BASE_URL=http://localhost:3000/api
```

**Note:** File `.env` tidak di-commit ke Git (ada di `.gitignore`). Setiap developer harus membuat `.env` sendiri dari `.env.example`.

## 🐛 Troubleshooting

### Database Issues

**Error: "pgvector extension not found"**

```sql
-- Cek apakah pgvector sudah terinstall:
SELECT * FROM pg_available_extensions WHERE name = 'vector';

-- Jika belum ada, install pgvector extension dulu
-- Lihat Step 2 di Quick Start Guide
```

**Error: "database tutorai does not exist"**

```sql
-- Create database dulu:
CREATE DATABASE tutorai;
```

**Error: "connection refused"**

- Pastikan PostgreSQL service sudah running
- Cek PORT di environment variables (default: 5432)
- Cek username & password di DATABASE_URL

### Python/Indexer Issues

**Error: "No module named 'google.generativeai'"**

```bash
# Pastikan virtual environment aktif:
venv\Scripts\Activate.ps1  # Windows PowerShell

# Install ulang dependencies:
pip install -r requirements.txt
```

**Error: "uvicorn command not found"**

```bash
# Install uvicorn di virtual environment:
pip install uvicorn[standard]
```

**Port 8000 already in use**

```bash
# Gunakan port lain:
uvicorn indexer_rag:app --reload --port 8001

# Jangan lupa update INDEXER_URL di tutor-cerdas-api/.env
```

### Node.js/Backend Issues

**Error: "Cannot find module"**

```bash
# Hapus node_modules dan install ulang:
rm -rf node_modules package-lock.json  # Linux/Mac
# Remove-Item -Recurse -Force node_modules, package-lock.json  # PowerShell

npm install
```

**Error: "JWT malformed"**

- Pastikan JWT_SECRET sudah di-set di .env
- Pastikan JWT_SECRET minimal 32 karakter
- Clear localStorage di browser (F12 → Application → Clear)

**Port 3000 already in use**

```bash
# Ubah PORT di .env:
PORT=3001

# Atau kill process di port 3000:
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### React/Frontend Issues

**Error: "Network Error" saat login/register**

- Pastikan Backend API sudah running di port 3000
- Cek VITE_API_BASE_URL di trial-web/.env
- Cek CORS settings di backend

**Avatar 3D tidak muncul**

- Clear browser cache (Ctrl + Shift + Delete)
- Pastikan browser support WebGL
- Cek console (F12) untuk error

**Speech tidak bekerja**

- Web Speech API hanya bekerja di Chrome/Edge
- Pastikan browser sudah allow microphone access
- Test di localhost (bukan 127.0.0.1)

### General Issues

**Services tidak connect ke database**

1. Cek DATABASE_URL format: `postgresql://username:password@host:port/database`
2. Test koneksi database:

```bash
psql -U postgres -d tutorai -c "SELECT version();"
```

**Gemini API error**

1. Cek API key valid di https://makersuite.google.com/app/apikey
2. Pastikan API key sama di indexer dan backend .env
3. Cek quota Gemini API belum habis

## 📝 Database Schema

### Tables

**profiles** - User accounts

- id, email, password_hash, name, role (user/admin), is_active, timestamps

**documents** - Uploaded PDF files

- id, title, filename, file_path, file_size, upload_by, status, timestamps

**chunks** - Text chunks from documents

- id, document_id, chunk_text, chunk_index, embedding (vector), metadata, timestamps

**chat_history** - User chat conversations

- id, user_id, message (user input), response (AI reply), sources, timestamps

**feedback** - User feedback on responses

- id, chat_id, user_id, rating, comment, timestamps

### Indexes

- Vector similarity search on chunks.embedding (pgvector)
- User email unique index
- Foreign keys with CASCADE delete

## 🔒 Security

- ✅ JWT authentication with bcrypt password hashing
- ✅ Rate limiting on API endpoints
- ✅ Input validation with express-validator
- ✅ CORS configuration
- ✅ Helmet.js for security headers
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection
- ✅ File upload validation (PDF only, max 10MB)

## 🚀 Deployment

### Production Checklist

- [ ] Update DATABASE_URL ke production database
- [ ] Generate strong JWT_SECRET (64+ characters)
- [ ] Set NODE_ENV=production
- [ ] Enable SSL/HTTPS
- [ ] Setup backup database
- [ ] Configure file storage (AWS S3 / Cloud Storage)
- [ ] Setup monitoring & logging
- [ ] Configure domain & DNS
- [ ] Setup CI/CD pipeline

### Recommended Hosting

- **Frontend**: Vercel, Netlify, atau Cloudflare Pages
- **Backend API**: Railway, Render, atau Heroku
- **Indexer**: Railway atau Render
- **Database**: Supabase, Neon, atau Railway PostgreSQL
- **File Storage**: AWS S3, Cloudinary, atau Supabase Storage