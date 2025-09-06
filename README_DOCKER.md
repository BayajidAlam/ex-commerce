# Ex-Commerce - Simple Docker Deployment

Simple, secure Docker-based e-commerce application with MongoDB.

## Quick Setup

### 1. Server Setup

```bash
# Run on your VPS
curl -fsSL https://raw.githubusercontent.com/BayajidAlam/ex-commerce/main/deployment/setup-vps.sh | bash
```

### 2. Configure

```bash
cd /var/www/ex-commerce
nano .env

# Update these:
MONGO_ROOT_PASSWORD=your_secure_password
JWT_SECRET=your_long_random_secret
```

### 3. Deploy

```bash
docker-compose up -d
```

## Access

- **Frontend**: http://your-server:3000
- **Backend API**: http://your-server:5000
- **MongoDB**: Internal only (secure)

## Management

```bash
# View status
docker-compose ps

# View logs
docker-compose logs -f

# Backup database
./backup.sh

# Update app
git pull origin main && docker-compose up -d --build
```

## CI/CD

Add GitHub secrets:

- `VPS_HOST` - Your server IP
- `VPS_USERNAME` - SSH user
- `VPS_SSH_KEY` - SSH private key
- `VPS_PORT` - SSH port (22)

Push to `main` branch = auto-deploy ✅

## Security Features

✅ MongoDB not exposed externally  
✅ Non-root containers  
✅ Persistent data storage  
✅ Environment-based config

That's it! Simple, secure, and it works. 🚀
