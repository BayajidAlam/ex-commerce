# Security Configuration Guide

## Environment Variables Security

### ✅ Safe Files (Committed to Git)

- `.env.docker` - Template with placeholder values only
- `docker-compose.yml` - Uses environment variables, no hardcoded secrets

### ❌ Never Commit These Files

- `.env` - Contains real production secrets
- Any file with actual passwords, API keys, or JWT secrets

## VPS Security Setup

### 1. Manual .env Configuration on VPS

```bash
# SSH to your VPS
ssh user@your-vps-ip

# Navigate to project directory
cd /var/www/ex-commerce

# Edit environment file with real values
nano .env
```

### 2. Required Environment Variables

```bash
# MongoDB - Use strong passwords
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_mongodb_password_here

# Database name
MONGO_DB_NAME=ex_commerce

# JWT - Generate a strong secret (32+ characters)
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_minimum_32_chars

# Production environment
NODE_ENV=production

# API URL - Update with your domain
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

### 3. Generate Secure Secrets

```bash
# Generate secure MongoDB password
openssl rand -base64 32

# Generate secure JWT secret
openssl rand -base64 64
```

## GitHub Actions Security

### Required Repository Secrets

1. Go to GitHub Repository → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `VPS_HOST` - Your VPS IP address
   - `VPS_USERNAME` - Your VPS username
   - `VPS_SSH_KEY` - Your private SSH key
   - `VPS_PORT` - SSH port (usually 22)

### What's NOT in GitHub Actions

- No environment variables exposed in workflow
- No database passwords in logs
- No API keys or JWT secrets

## MongoDB Security

### Internal Access Only

- MongoDB runs inside Docker network
- No external ports exposed (port 27017 not accessible from outside)
- Only backend container can access MongoDB
- Authentication required with username/password

### Data Persistence

- MongoDB data stored in Docker volume `mongodb_data`
- Data survives container restarts and updates
- Located at `/var/lib/docker/volumes/ex-commerce_mongodb_data`

## Best Practices

1. **Never commit .env files with real values**
2. **Always use strong, unique passwords**
3. **Regularly rotate JWT secrets**
4. **Keep VPS and Docker updated**
5. **Monitor container logs for security issues**
6. **Use HTTPS in production**
7. **Regularly backup MongoDB data**

## Backup Security

```bash
# Create encrypted backup
docker exec ex-commerce-mongodb-1 mongodump --authenticationDatabase admin \
  -u admin -p your_password --db ex_commerce --out /backup

# Copy backup from container
docker cp ex-commerce-mongodb-1:/backup ./backup-$(date +%Y%m%d)

# Encrypt backup (optional)
tar -czf backup-$(date +%Y%m%d).tar.gz backup-$(date +%Y%m%d)
gpg --symmetric backup-$(date +%Y%m%d).tar.gz
```
