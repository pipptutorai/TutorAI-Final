# Installation Guide - TutorAI

Panduan lengkap instalasi TutorAI dengan troubleshooting untuk berbagai platform.

## Prerequisites Installation

### 1. Node.js Installation

**Windows:**

1. Download installer dari https://nodejs.org/ (LTS version)
2. Run installer, ikuti wizard
3. Verify installation:

```powershell
node --version  # Should show v18+
npm --version
```

**Mac (using Homebrew):**

```bash
brew install node@18
node --version
npm --version
```

**Linux (Ubuntu/Debian):**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
```

### 2. Python Installation

**Windows:**

1. Download dari https://www.python.org/downloads/
2. ️ **PENTING**: Check "Add Python to PATH"
3. Install dan verify:

```powershell
python --version  # Should show 3.10+
pip --version
```

**Mac:**

```bash
brew install python@3.10
python3 --version
pip3 --version
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install python3.10 python3-pip python3-venv
python3 --version
pip3 --version
```

### 3. PostgreSQL Installation

**Windows:**

1. Download dari https://www.postgresql.org/download/windows/
2. Run installer EDB Postgres
3. Remember your password!
4. Default port: 5432
5. Verify:

```powershell
psql --version
# Test connection:
psql -U postgres
```

**Mac:**

```bash
brew install postgresql@14
brew services start postgresql@14
psql --version
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install postgresql-14 postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
psql --version
```

### 4. pgvector Extension Installation

**Windows:**

1. Download pre-built binary dari https://github.com/pgvector/pgvector/releases
2. Extract ke PostgreSQL directory (biasanya `C:\Program Files\PostgreSQL\14\`)
3. Copy files:
   - `vector.dll` → `lib/`
   - `vector.control` → `share/extension/`
   - `vector--*.sql` → `share/extension/`
4. Restart PostgreSQL service
5. Test di psql:

```sql
CREATE EXTENSION vector;
SELECT * FROM pg_available_extensions WHERE name = 'vector';
```

**Mac:**

```bash
brew install pgvector
# Or build from source:
git clone https://github.com/pgvector/pgvector.git
cd pgvector
make
make install
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt install postgresql-14-pgvector
# Or build from source:
git clone https://github.com/pgvector/pgvector.git
cd pgvector
make
sudo make install
```

### 5. Git Installation

**Windows:**

- Download dari https://git-scm.com/download/win
- Install dengan default settings

**Mac:**

```bash
brew install git
```

**Linux:**

```bash
sudo apt install git
```

Verify:

```bash
git --version
```

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/TutorAI-Final.git
cd TutorAI-Final
```

### 2. Database Setup - Detailed

#### Create Database User (Optional but Recommended)

```sql
-- Connect as postgres user
psql -U postgres

-- Create dedicated user for TutorAI
CREATE USER tutorai_user WITH PASSWORD 'strong_password_here';

-- Create database
CREATE DATABASE tutorai OWNER tutorai_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE tutorai TO tutorai_user;

-- Exit psql
\q
```

#### Run Schema

**Option 1: Via psql command line**

```bash
# From TutorAI-Final root directory
psql -U postgres -d tutorai -f database/schema.sql

# Or with dedicated user:
psql -U tutorai_user -d tutorai -f database/schema.sql
```

**Option 2: Via pgAdmin**

1. Open pgAdmin
2. Connect to PostgreSQL server
3. Right-click on Databases → Create → Database
4. Name: `tutorai`
5. Right-click on `tutorai` → Query Tool
6. Open `database/schema.sql`
7. Execute (F5)

#### Verify Database Setup

```sql
-- Connect to database
psql -U postgres -d tutorai

-- List all tables
\dt

-- Should see: profiles, documents, chunks, chat_history, feedback

-- Check pgvector extension
\dx

-- Should see vector extension listed

-- Check sample data
SELECT COUNT(*) FROM profiles;
```

### 3. Indexer Setup - Detailed

```bash
cd indexer

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
venv\Scripts\Activate.ps1

# Windows CMD:
venv\Scripts\activate.bat

# Git Bash on Windows:
source venv/Scripts/activate

# Mac/Linux:
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# If you get SSL errors on Windows:
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt
```

#### Create .env file

**Windows:**

```powershell
copy .env.example .env
notepad .env
```

**Mac/Linux:**

```bash
cp .env.example .env
nano .env  # or vim, code, etc.
```

#### Edit .env content:

```env
DATABASE_URL=postgresql://tutorai_user:strong_password_here@localhost:5432/tutorai
GEMINI_API_KEY=your_actual_gemini_api_key
```

**Getting Gemini API Key:**

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google Account
3. Click "Create API Key"
4. Select existing project or create new
5. Copy the API key
6. Paste into .env file

#### Test Indexer

```bash
# Make sure venv is activated
# Run indexer
uvicorn indexer_rag:app --reload --port 8000

# If uvicorn not found:
pip install uvicorn[standard]

# Test in browser: http://localhost:8000/health
# Should see: {"status":"healthy"}
```

### 4. Backend API Setup - Detailed

**Open NEW terminal (keep indexer running)**

```bash
cd tutor-cerdas-api

# Install dependencies
npm install

# If you get errors, try:
npm install --legacy-peer-deps

# Create .env file
# Windows:
copy .env.example .env
notepad .env

# Mac/Linux:
cp .env.example .env
nano .env
```

#### Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output (64 character hex string).

#### Edit .env content:

```env
DATABASE_URL=postgresql://tutorai_user:strong_password_here@localhost:5432/tutorai
GEMINI_API_KEY=your_actual_gemini_api_key
JWT_SECRET=paste_generated_hex_string_here
PORT=3000
NODE_ENV=development
INDEXER_URL=http://localhost:8000
UPLOAD_DIR=./uploads/documents
MAX_FILE_SIZE=10485760
```

#### Create uploads directory

```bash
# Windows PowerShell:
mkdir -p uploads/documents

# Mac/Linux:
mkdir -p uploads/documents
```

#### Test Backend

```bash
npm run dev

# Should see:
# Server running on port 3000
# Database connected successfully

# Test in browser: http://localhost:3000/api/auth/login
# Should see: {"error":"Email and password required"}
```

### 5. Frontend Setup - Detailed

**Open ANOTHER new terminal (keep backend running)**

```bash
cd trial-web

# Install dependencies
npm install

# If errors, try:
npm install --legacy-peer-deps

# Create .env file
# Windows:
copy .env.example .env
notepad .env

# Mac/Linux:
cp .env.example .env
nano .env
```

#### Edit .env content:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

#### Test Frontend

```bash
npm run dev

# Should see:
# VITE v7.x.x ready in xxx ms
#  Local: http://localhost:5173/

# Open browser: http://localhost:5173
```

## Verification Checklist

Run through this checklist to ensure everything is working:

- [ ] **Database**: Can connect to PostgreSQL and see tables

  ```sql
  psql -U postgres -d tutorai -c "\dt"
  ```

- [ ] **Indexer**: Running on port 8000

  - Visit: http://localhost:8000/health
  - Should return: `{"status":"healthy"}`

- [ ] **Backend API**: Running on port 3000

  - Visit: http://localhost:3000/api/auth/login
  - Should return error message (expected)

- [ ] **Frontend**: Running on port 5173

  - Visit: http://localhost:5173
  - Should see login page

- [ ] **Register**: Can create new account

  - Go to register page
  - Fill form and submit
  - Should redirect to login

- [ ] **Login**: Can login with created account

  - Enter email and password
  - Should redirect to user page

- [ ] **Chat**: Can send message (without documents)

  - Type message and send
  - AI should respond (may say no documents available)

- [ ] **Admin Access**: Can promote user to admin

  ```sql
  psql -U postgres -d tutorai
  UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
  ```

- [ ] **Upload Document**: Can upload PDF as admin

  - Login as admin
  - Go to Documents tab
  - Upload a PDF file
  - Should show success message

- [ ] **Chat with Context**: Can get answers from uploaded docs
  - Go to user page
  - Ask question related to uploaded document
  - Should get contextual answer

## Common Installation Issues

### Issue: "python not found"

**Solution:**

- Reinstall Python with "Add to PATH" checked
- Or manually add to PATH:
  - Windows: System Properties → Environment Variables
  - Add: `C:\Python310\` and `C:\Python310\Scripts\`

### Issue: "psql not found"

**Solution:**

- Add PostgreSQL bin to PATH
- Windows: Add `C:\Program Files\PostgreSQL\14\bin`
- Mac/Linux: Usually auto-added

### Issue: "npm ERR! peer dependencies"

**Solution:**

```bash
npm install --legacy-peer-deps
```

### Issue: "Cannot create extension vector"

**Solution:**

1. Verify pgvector installed: Check PostgreSQL extensions folder
2. Restart PostgreSQL service
3. Try as superuser: `psql -U postgres -d tutorai -c "CREATE EXTENSION vector;"`

### Issue: "Port already in use"

**Solution:**

**Windows PowerShell:**

```powershell
# Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or change port in .env
```

**Mac/Linux:**

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in .env
```

### Issue: "CORS error in browser"

**Solution:**

1. Check VITE_API_BASE_URL in trial-web/.env
2. Should be: `http://localhost:3000/api` (not `127.0.0.1`)
3. Clear browser cache
4. Hard refresh (Ctrl+Shift+R)

### Issue: "Module not found" errors

**Solution:**

**Python:**

```bash
# Activate venv first!
source venv/bin/activate  # or venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Node.js:**

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database connection timeout

**Solution:**

1. Check PostgreSQL service running:
   ```bash
   # Windows: Services.msc → PostgreSQL service
   # Linux: sudo systemctl status postgresql
   ```
2. Check firewall not blocking port 5432
3. Verify DATABASE_URL format correct
4. Test connection: `psql -U postgres -d tutorai`

## Still Having Issues?

1. Check [FAQ.md](FAQ.md) for common questions
2. Check [Troubleshooting](README.md#-troubleshooting) in README
3. Search [GitHub Issues](https://github.com/your-repo/issues)
4. Create new issue with:
   - OS and versions
   - Error messages (full stack trace)
   - Steps to reproduce
   - What you've tried

---

**Installation Guide Version: 1.0**  
**Last Updated: November 2025**
