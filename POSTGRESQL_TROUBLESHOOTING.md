# PostgreSQL Troubleshooting Guide

## Common Issues & Fixes

### 1. Password Authentication Failed
**Error**: `password authentication failed for user "postgres"`

**Solutions**:
- Double-check your PostgreSQL password (it's case-sensitive!)
- Make sure you're using the correct username (default is "postgres")
- Reset the password if needed:
  1. Open pgAdmin
  2. Right-click on the "postgres" user → Properties
  3. Go to "Definition" tab
  4. Set a new password and save

### 2. Connection Refused
**Error**: `ECONNREFUSED`

**Solutions**:
- Make sure PostgreSQL service is running
  - Windows: Check Services → "postgresql-x64-XX"
  - Mac/Linux: `sudo systemctl start postgresql`
- Verify the port (default is 5432)

### 3. Database Doesn't Exist
**Error**: `database "oxypc_erp" does not exist`

**Solutions**:
- Create the database manually:
  1. Open pgAdmin
  2. Right-click "Databases" → Create → Database
  3. Name it "oxypc_erp" and save

## How to Verify PostgreSQL is Working
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. If you can browse the databases, it's working!

## Testing Connection
Run the test script:
```bash
node test-db.ts
```
