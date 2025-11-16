#!/bin/bash

# Chat Context Migration Script
# This script applies the chat sessions migration to enable conversation continuity

echo "=================================="
echo "TutorAI - Chat Context Migration"
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f "tutor-cerdas-api/.env" ]; then
    echo " Error: .env file not found in tutor-cerdas-api/"
    echo "Please create .env file with database credentials"
    exit 1
fi

# Load database credentials from .env
source tutor-cerdas-api/.env

# Extract DB connection details
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-tutorai_db}"
DB_USER="${DB_USER:-postgres}"

echo " Database Configuration:"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo ""

# Prompt for password if not in .env
if [ -z "$DB_PASSWORD" ]; then
    echo " Enter database password:"
    read -s DB_PASSWORD
    echo ""
fi

export PGPASSWORD="$DB_PASSWORD"

echo " Running migration..."
echo ""

# Run migration
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f database/migration_add_sessions.sql

if [ $? -eq 0 ]; then
    echo ""
    echo " Migration completed successfully!"
    echo ""
    echo " Next steps:"
    echo "   1. Restart your backend server"
    echo "   2. Test the new chat context feature"
    echo "   3. Check CHAT_CONTEXT_FEATURE.md for usage guide"
else
    echo ""
    echo " Migration failed!"
    echo "Please check the error messages above"
    exit 1
fi

unset PGPASSWORD
