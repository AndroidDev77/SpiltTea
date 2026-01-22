# Spilt Tea Operations Runbook

This runbook covers deployment procedures, monitoring, common issues, and incident response for the Spilt Tea platform.

## Table of Contents

- [Deployment Procedures](#deployment-procedures)
- [Monitoring and Alerts](#monitoring-and-alerts)
- [Common Issues and Fixes](#common-issues-and-fixes)
- [Rollback Procedures](#rollback-procedures)
- [Database Operations](#database-operations)
- [Security Incident Response](#security-incident-response)

## Deployment Procedures

### Pre-Deployment Checklist

- [ ] All tests passing (`npm run test`)
- [ ] Code review completed
- [ ] Security review completed (for auth/input handling changes)
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Backup created (if database changes)

### Docker Deployment

#### 1. Build and Deploy All Services

```bash
# Pull latest code
git pull origin main

# Build and start services
docker-compose up -d --build

# Verify all containers running
docker-compose ps

# Check logs for errors
docker-compose logs -f
```

#### 2. Backend Only Deployment

```bash
# Rebuild backend
docker-compose up -d --build backend

# Verify backend health
curl http://localhost:3001/health

# Check logs
docker-compose logs -f backend
```

#### 3. Frontend Only Deployment

```bash
# Rebuild frontend
docker-compose up -d --build frontend

# Verify frontend accessible
curl http://localhost:3000

# Check logs
docker-compose logs -f frontend
```

### Database Migration Deployment

**CRITICAL: Always backup before migrations**

```bash
# 1. Backup database
docker exec spilttea-postgres pg_dump -U spilttea spilttea > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Run migrations (backend container)
docker exec spilttea-backend npm run prisma:migrate

# 3. Verify migration success
docker exec spilttea-backend npx prisma migrate status

# 4. Restart backend
docker-compose restart backend
```

### Zero-Downtime Deployment Strategy

For production deployments with minimal downtime:

1. **Deploy new version alongside old**
   - Start new containers with different names
   - Run health checks
   - Verify functionality

2. **Switch traffic**
   - Update load balancer/reverse proxy
   - Gradually shift traffic to new version

3. **Monitor**
   - Watch error rates
   - Check performance metrics
   - Monitor user sessions

4. **Complete cutover**
   - Once stable, stop old containers
   - Clean up old images

## Monitoring and Alerts

### Health Checks

#### Backend Health Endpoint

```bash
# Check backend health
curl http://localhost:3001/health

# Expected response:
# { "status": "ok" }
```

#### Service Status

```bash
# Check all services
docker-compose ps

# Expected output:
# NAME                 STATUS
# spilttea-postgres    Up 2 hours (healthy)
# spilttea-redis       Up 2 hours (healthy)
# spilttea-backend     Up 2 hours
# spilttea-frontend    Up 2 hours
```

### Log Monitoring

#### View Real-Time Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend

# Database logs
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100 backend
```

#### Log Analysis

**Backend Errors:**
```bash
# Find errors in backend logs
docker-compose logs backend | grep -i "error"

# Find warnings
docker-compose logs backend | grep -i "warn"
```

**Database Connection Issues:**
```bash
# Check database connection errors
docker-compose logs backend | grep -i "prisma\|database"
```

**Authentication Failures:**
```bash
# Check auth errors
docker-compose logs backend | grep -i "unauthorized\|forbidden\|jwt"
```

### Performance Metrics

#### Database Performance

```bash
# Connect to Prisma Studio
cd backend
npm run prisma:studio

# Check slow queries
docker exec spilttea-postgres psql -U spilttea -d spilttea -c "
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;
"
```

#### Redis Metrics

```bash
# Redis stats
docker exec spilttea-redis redis-cli INFO stats

# Memory usage
docker exec spilttea-redis redis-cli INFO memory

# Connected clients
docker exec spilttea-redis redis-cli CLIENT LIST
```

#### Container Resource Usage

```bash
# CPU and memory usage
docker stats

# Disk usage
docker system df
```

### Key Metrics to Monitor

| Metric | Tool | Alert Threshold |
|--------|------|----------------|
| API Response Time | Backend logs | > 2 seconds |
| Error Rate | Backend logs | > 1% of requests |
| Database Connections | PostgreSQL | > 80% of max |
| Redis Memory Usage | Redis INFO | > 80% of limit |
| Container CPU | docker stats | > 80% |
| Container Memory | docker stats | > 80% |
| Disk Usage | docker system df | > 80% |

## Common Issues and Fixes

### Issue: Backend Container Crashes on Startup

**Symptoms:**
- Backend container exits immediately
- Logs show database connection errors

**Diagnosis:**
```bash
docker-compose logs backend
```

**Common Causes & Fixes:**

1. **Database not ready**
   ```bash
   # Check if postgres is healthy
   docker-compose ps postgres

   # Wait for postgres to be ready
   docker-compose up -d postgres
   sleep 10
   docker-compose up -d backend
   ```

2. **Missing environment variables**
   ```bash
   # Check .env file exists
   ls -la .env backend/.env

   # Verify required variables
   docker-compose config
   ```

3. **Prisma client not generated**
   ```bash
   docker exec spilttea-backend npm run prisma:generate
   docker-compose restart backend
   ```

### Issue: Frontend Shows "Network Error" / Cannot Connect to Backend

**Symptoms:**
- Frontend loads but API calls fail
- Console shows CORS errors or connection refused

**Diagnosis:**
```bash
# Check if backend is running
curl http://localhost:3001/health

# Check CORS configuration
docker-compose logs backend | grep -i "cors"
```

**Fixes:**

1. **Backend not running**
   ```bash
   docker-compose up -d backend
   ```

2. **Wrong API URL in frontend**
   ```bash
   # Check frontend .env
   cat frontend/.env
   # Should be: VITE_API_URL=http://localhost:3001

   # Rebuild frontend
   docker-compose up -d --build frontend
   ```

3. **CORS misconfiguration**
   ```bash
   # Check FRONTEND_URL in backend/.env
   cat backend/.env | grep FRONTEND_URL
   # Should match frontend origin

   docker-compose restart backend
   ```

### Issue: Database Connection Pool Exhausted

**Symptoms:**
- API requests timeout
- Logs show "Too many connections"

**Diagnosis:**
```bash
# Check active connections
docker exec spilttea-postgres psql -U spilttea -d spilttea -c "
SELECT count(*) FROM pg_stat_activity;
"
```

**Fix:**
```bash
# Kill idle connections
docker exec spilttea-postgres psql -U spilttea -d spilttea -c "
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
AND state_change < current_timestamp - INTERVAL '5 minutes';
"

# Restart backend to reset pool
docker-compose restart backend
```

### Issue: Redis Out of Memory

**Symptoms:**
- Rate limiting fails
- Cache misses increase

**Diagnosis:**
```bash
# Check memory usage
docker exec spilttea-redis redis-cli INFO memory | grep used_memory_human
```

**Fix:**
```bash
# Clear all cache (use with caution in production)
docker exec spilttea-redis redis-cli FLUSHALL

# Or clear specific keys
docker exec spilttea-redis redis-cli KEYS "cache:*" | xargs docker exec spilttea-redis redis-cli DEL
```

### Issue: S3 Upload Failures

**Symptoms:**
- File uploads fail
- Logs show AWS credential errors

**Diagnosis:**
```bash
# Check S3 configuration in logs
docker-compose logs backend | grep -i "s3\|aws"
```

**Fix:**

1. **Verify credentials**
   ```bash
   # Check environment variables
   docker exec spilttea-backend printenv | grep AWS

   # Test S3 access (if AWS CLI available)
   docker exec spilttea-backend aws s3 ls s3://spilttea-uploads
   ```

2. **Regenerate presigned URLs**
   - Restart backend to refresh credentials
   ```bash
   docker-compose restart backend
   ```

### Issue: Email Verification Not Sending

**Symptoms:**
- Users don't receive verification emails
- No email errors in logs

**Diagnosis:**
```bash
# Check SMTP configuration
docker exec spilttea-backend printenv | grep SMTP

# Check email logs
docker-compose logs backend | grep -i "email\|nodemailer"
```

**Fix:**

1. **SMTP credentials expired**
   - Update `SMTP_PASSWORD` in backend/.env
   - For Gmail: Generate new app password
   ```bash
   docker-compose restart backend
   ```

2. **Rate limited by provider**
   - Check provider's sending limits
   - Implement exponential backoff

### Issue: Trending Posts Not Updating

**Symptoms:**
- Trending page shows stale data
- New popular posts don't appear

**Diagnosis:**
```bash
# Check if posts are being created
docker exec spilttea-postgres psql -U spilttea -d spilttea -c "
SELECT id, title, \"createdAt\", \"viewCount\"
FROM \"Post\"
ORDER BY \"createdAt\" DESC
LIMIT 10;
"
```

**Fix:**

The trending algorithm runs on-demand, not cached. If issues persist:

1. **Check view count tracking**
   ```bash
   # Verify viewCount is incrementing
   docker-compose logs backend | grep -i "view"
   ```

2. **Database query performance**
   - Trending query fetches from last 30 days
   - Check if database is slow
   ```bash
   docker exec spilttea-postgres psql -U spilttea -d spilttea -c "ANALYZE \"Post\";"
   ```

## Rollback Procedures

### Application Rollback

#### 1. Quick Rollback (Docker)

```bash
# List recent images
docker images spilttea-backend
docker images spilttea-frontend

# Stop current containers
docker-compose down

# Use previous image by tag or ID
docker tag <previous-backend-image-id> spilttea-backend:latest
docker tag <previous-frontend-image-id> spilttea-frontend:latest

# Restart with previous images
docker-compose up -d
```

#### 2. Git-Based Rollback

```bash
# Find commit to revert to
git log --oneline -10

# Checkout previous version
git checkout <commit-hash>

# Rebuild and deploy
docker-compose up -d --build

# Or create revert commit
git revert <bad-commit-hash>
git push origin main
docker-compose up -d --build
```

### Database Rollback

**CRITICAL: Only rollback if migration caused issues**

#### 1. Rollback Last Migration

```bash
# Check current migration status
docker exec spilttea-backend npx prisma migrate status

# Rollback last migration (destructive!)
docker exec spilttea-backend npx prisma migrate resolve --rolled-back <migration-name>

# Or restore from backup (safer)
docker exec -i spilttea-postgres psql -U spilttea spilttea < backup_20260122_120000.sql

# Restart backend
docker-compose restart backend
```

#### 2. Full Database Restore

```bash
# Stop backend to prevent writes
docker-compose stop backend

# Drop and recreate database
docker exec spilttea-postgres psql -U spilttea -c "DROP DATABASE spilttea;"
docker exec spilttea-postgres psql -U spilttea -c "CREATE DATABASE spilttea;"

# Restore from backup
docker exec -i spilttea-postgres psql -U spilttea spilttea < backup_20260122_120000.sql

# Restart backend
docker-compose start backend
```

### Rollback Decision Matrix

| Scenario | Action | Rollback Type |
|----------|--------|---------------|
| Frontend bug | Rebuild frontend only | Frontend image rollback |
| Backend API error | Rebuild backend only | Backend image rollback |
| Database corruption | Restore from backup | Full database restore |
| Bad migration | Rollback migration OR restore | Migration rollback |
| Config error | Update env vars | Environment variable update |

## Database Operations

### Backup Procedures

#### Manual Backup

```bash
# Full database backup
docker exec spilttea-postgres pg_dump -U spilttea spilttea > backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
docker exec spilttea-postgres pg_dump -U spilttea spilttea | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Schema only
docker exec spilttea-postgres pg_dump -U spilttea --schema-only spilttea > schema_backup.sql

# Data only
docker exec spilttea-postgres pg_dump -U spilttea --data-only spilttea > data_backup.sql
```

#### Automated Backup (Recommended)

Create a cron job for daily backups:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /path/to/SpiltTea && docker exec spilttea-postgres pg_dump -U spilttea spilttea | gzip > backups/backup_$(date +\%Y\%m\%d).sql.gz

# Keep only last 7 days
0 3 * * * find /path/to/SpiltTea/backups -name "backup_*.sql.gz" -mtime +7 -delete
```

### Database Maintenance

#### Vacuum and Analyze

```bash
# Vacuum database (reclaim space)
docker exec spilttea-postgres psql -U spilttea -d spilttea -c "VACUUM VERBOSE;"

# Analyze tables (update statistics)
docker exec spilttea-postgres psql -U spilttea -d spilttea -c "ANALYZE VERBOSE;"

# Full vacuum (locks tables, use off-peak)
docker exec spilttea-postgres psql -U spilttea -d spilttea -c "VACUUM FULL VERBOSE;"
```

#### Check Database Size

```bash
# Total database size
docker exec spilttea-postgres psql -U spilttea -d spilttea -c "
SELECT pg_size_pretty(pg_database_size('spilttea'));
"

# Table sizes
docker exec spilttea-postgres psql -U spilttea -d spilttea -c "
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

### Migration Best Practices

1. **Always test migrations locally first**
   ```bash
   # Create migration
   npm run prisma:migrate dev --name add_user_blocking

   # Test on development database
   npm run test:e2e
   ```

2. **Review generated SQL**
   ```bash
   # Check migration SQL
   cat backend/prisma/migrations/<timestamp>_<name>/migration.sql
   ```

3. **Backup before production migration**
   ```bash
   # Always backup first!
   docker exec spilttea-postgres pg_dump -U spilttea spilttea > pre_migration_backup.sql
   ```

4. **Run migrations in maintenance window**
   - Schedule during low traffic
   - Notify users of maintenance
   - Have rollback plan ready

## Security Incident Response

### Suspected Security Breach

#### 1. Immediate Actions

```bash
# 1. Stop all services
docker-compose down

# 2. Backup current state for forensics
docker-compose logs > incident_logs_$(date +%Y%m%d_%H%M%S).txt
docker exec spilttea-postgres pg_dump -U spilttea spilttea > incident_backup.sql

# 3. Review logs for suspicious activity
grep -i "unauthorized\|failed\|error\|attack" incident_logs_*.txt
```

#### 2. Investigation

```bash
# Check for brute force attempts
docker exec spilttea-postgres psql -U spilttea -d spilttea -c "
SELECT email, COUNT(*) as failed_attempts
FROM \"User\"
WHERE \"lastFailedLogin\" > NOW() - INTERVAL '1 hour'
GROUP BY email
HAVING COUNT(*) > 5;
"

# Check recent account creations
docker exec spilttea-postgres psql -U spilttea -d spilttea -c "
SELECT id, email, \"createdAt\"
FROM \"User\"
WHERE \"createdAt\" > NOW() - INTERVAL '24 hours'
ORDER BY \"createdAt\" DESC;
"

# Check for suspicious posts/reports
docker exec spilttea-postgres psql -U spilttea -d spilttea -c "
SELECT id, title, \"authorId\", \"createdAt\"
FROM \"Post\"
WHERE \"createdAt\" > NOW() - INTERVAL '24 hours'
ORDER BY \"createdAt\" DESC;
"
```

#### 3. Mitigation

```bash
# Rotate JWT secret
# 1. Update JWT_SECRET in .env and backend/.env
# 2. All users will need to log in again

# Reset suspicious user passwords
docker exec spilttea-postgres psql -U spilttea -d spilttea -c "
UPDATE \"User\"
SET password = 'LOCKED', \"isActive\" = false
WHERE id IN (<suspicious-user-ids>);
"

# Clear all sessions (Redis)
docker exec spilttea-redis redis-cli FLUSHALL
```

### Exposed Secrets

If AWS keys, JWT secret, or other credentials are exposed:

1. **Immediately rotate credentials**
   - AWS: Deactivate old keys in IAM console
   - Generate new keys
   - Update .env files

2. **Update application**
   ```bash
   # Update environment variables
   vim .env
   vim backend/.env

   # Restart services
   docker-compose down
   docker-compose up -d
   ```

3. **Audit access logs**
   - Check AWS CloudTrail for suspicious activity
   - Review database logs for unauthorized queries

### Rate Limit Exceeded / DDoS

```bash
# Check top IPs in logs (requires access logs)
docker-compose logs backend | grep "GET\|POST" | awk '{print $1}' | sort | uniq -c | sort -rn | head -20

# Block IP at firewall level (example with iptables)
# iptables -A INPUT -s <malicious-ip> -j DROP

# Increase rate limits temporarily (backend/.env)
# Update throttler configuration in backend code

# Restart backend
docker-compose restart backend
```

## Emergency Contacts

| Role | Responsibility | Contact |
|------|----------------|---------|
| DevOps Lead | Infrastructure, deployments | TBD |
| Backend Lead | API, database issues | TBD |
| Frontend Lead | UI/UX issues | TBD |
| Security Lead | Security incidents | TBD |
| Database Admin | Database performance, backups | TBD |

## Post-Incident Checklist

After resolving an incident:

- [ ] Document what happened
- [ ] Document root cause
- [ ] Document resolution steps
- [ ] Update runbook with lessons learned
- [ ] Schedule post-mortem meeting
- [ ] Implement preventive measures
- [ ] Test incident response procedures
