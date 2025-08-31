# 🚨 GitHub Actions Not Building - Troubleshooting Guide

## Common Issues & Solutions

### 1. **Secrets Not Configured**
Make sure you have added these secrets in your GitHub repository:

Go to: `Repository → Settings → Secrets and variables → Actions`

Add these secrets:
- `VPS_HOST` - Your VPS IP address (e.g., `192.168.1.100`)
- `VPS_USERNAME` - SSH username (e.g., `root` or `ubuntu`)
- `VPS_SSH_KEY` - Your private SSH key (entire content of `~/.ssh/id_rsa`)
- `VPS_PORT` - SSH port (usually `22`)

### 2. **VPS Not Setup**
Run the setup script on your VPS first:
```bash
curl -fsSL https://raw.githubusercontent.com/BayajidAlam/ex-commerce/main/deployment/setup-vps.sh | bash
```

### 3. **Test Connection**
Use the test workflow:
1. Go to `Actions` tab in GitHub
2. Click `Test VPS Connection`
3. Click `Run workflow`

### 4. **SSH Key Issues**
Generate new SSH key if needed:
```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Copy public key to VPS
ssh-copy-id user@your-vps-ip

# Copy private key content to GitHub secret
cat ~/.ssh/id_rsa
```

### 5. **Manual Deployment Test**
SSH to your VPS and test manually:
```bash
cd /var/www/ex-commerce
git pull origin main
docker-compose up -d --build
```

### 6. **Check GitHub Actions Logs**
1. Go to `Actions` tab
2. Click on failed workflow
3. Click on failed job
4. Check error messages

### 7. **Environment File Missing**
Make sure `.env` exists on VPS:
```bash
cd /var/www/ex-commerce
cp .env.docker .env
nano .env  # Update with your settings
```

## Quick Debug Commands

```bash
# Check if Docker is running
sudo systemctl status docker

# Check if project exists
ls -la /var/www/ex-commerce

# Check if containers are running
docker-compose ps

# View container logs
docker-compose logs -f
```

## Working CI/CD Requirements Checklist

- ✅ VPS has Docker & Docker Compose installed
- ✅ Project cloned to `/var/www/ex-commerce`
- ✅ GitHub secrets configured
- ✅ SSH key access works
- ✅ `.env` file exists on VPS
- ✅ User has Docker permissions (`sudo usermod -aG docker $USER`)

If all above are ✅ and it still fails, check the GitHub Actions logs for specific error messages.
