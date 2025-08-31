# Ex-Commerce Docker Setup

Simple Docker-based deployment for the Ex-Commerce application.

## Quick Setup

### 1. VPS Setup

```bash
# Run setup script on your VPS
curl -fsSL https://raw.githubusercontent.com/BayajidAlam/ex-commerce/main/deployment/setup-vps.sh -o setup-vps.sh
chmod +x setup-vps.sh
./setup-vps.sh
```

### 2. Configure Environment

```bash
cd /var/www/ex-commerce
nano .env
```

Update these important variables:

- `MONGO_ROOT_PASSWORD` - Secure MongoDB password
- `JWT_SECRET` - Long random string for JWT tokens
- `CLOUDINARY_*` - If using Cloudinary for images

### 3. Start Application

```bash
docker-compose up -d
```

## Services

- **Frontend**: http://your-server:3000
- **Backend API**: http://your-server:5000
- **MongoDB**: Internal only (secure)

## Security Features

✅ **MongoDB is NOT exposed externally** - Only accessible through backend
✅ **Non-root containers** - Security hardened
✅ **Persistent data storage** - Data survives container restarts
✅ **Environment variables** - Secure configuration

## Basic Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Backup database
./backup.sh

# Update application
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## GitHub CI/CD

Add these secrets to your GitHub repository:

- `VPS_HOST` - Your VPS IP address
- `VPS_USERNAME` - SSH username
- `VPS_SSH_KEY` - Private SSH key
- `VPS_PORT` - SSH port (usually 22)

Any push to `main` branch will auto-deploy to your VPS.

## Data Persistence

MongoDB data is stored in Docker volumes and persists across:

- Container restarts
- Image rebuilds
- System reboots

Your data is safe! 🔒
