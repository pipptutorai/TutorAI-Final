@echo off
REM Chat Context Migration Script for Windows
REM This script applies the chat sessions migration to enable conversation continuity

echo ==================================
echo TutorAI - Chat Context Migration
echo ==================================
echo.

REM Check if .env exists
if not exist "tutor-cerdas-api\.env" (
    echo Error: .env file not found in tutor-cerdas-api/
    echo Please create .env file with database credentials
    exit /b 1
)

REM Parse .env file (simplified - you may need to adjust)
echo Reading database configuration...
echo.

REM You need to manually set these or parse from .env
set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=tutorai
set DB_USER=postgres

echo Database Configuration:
echo    Host: %DB_HOST%
echo    Port: %DB_PORT%
echo    Database: %DB_NAME%
echo    User: %DB_USER%
echo.

set /p DB_PASSWORD="Enter database password: "
echo.

echo Running migration...
echo.

REM Run migration using psql
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f database\migration_add_sessions.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Migration completed successfully!
    echo.
    echo Next steps:
    echo    1. Restart your backend server
    echo    2. Test the new chat context feature
    echo    3. Check CHAT_CONTEXT_FEATURE.md for usage guide
) else (
    echo.
    echo Migration failed!
    echo Please check the error messages above
    exit /b 1
)
