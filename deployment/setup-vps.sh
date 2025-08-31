#!/bin/bash

# Simple VPS Setup Script for Ex-Commerce Docker Deployment
set -e

echo "=== Ex-Commerce VPS Setup Script ==="

# Update system
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "Docker installed successfully"
else
    echo "Docker is already installed"
fi

# Install Docker Compose
echo "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "Docker Compose installed successfully"
else
    echo "Docker Compose is already installed"
fi

# Create application directory
echo "Setting up application directory..."
sudo mkdir -p /var/www/ex-commerce
sudo chown -R $USER:$USER /var/www/ex-commerce

# Clone repository (if not already done)
if [ ! -d "/var/www/ex-commerce/.git" ]; then
    echo "Cloning repository..."
    cd /var/www
    git clone https://github.com/BayajidAlam/ex-commerce.git
    cd ex-commerce
else
    echo "Repository already exists, pulling latest changes..."
    cd /var/www/ex-commerce
    git pull origin main
fi

# Create environment file
echo "Setting up environment file..."
if [ ! -f ".env" ]; then
    cp .env.docker .env
    echo "Environment file created. Edit it with your settings:"
    echo "nano .env"
else
    echo "Environment file already exists"
fi

echo "=== Setup completed! ==="
echo ""
echo "Next steps:"
echo "1. Edit the environment file: nano /var/www/ex-commerce/.env"
echo "2. Start the application: cd /var/www/ex-commerce && docker-compose up -d"
echo "3. Check status: docker-compose ps"
echo ""
echo "Your application will be available at:"
echo "- Frontend: http://your-server-ip:3000"
echo "- Backend API: http://your-server-ip:5000"
echo "1. Edit the environment file: nano /var/www/ex-commerce/.env"
echo "2. Start the application: cd /var/www/ex-commerce && docker-compose up -d"
echo "3. Check status: docker-compose ps"
echo "4. View logs: docker-compose logs -f"
echo ""
echo "For SSL certificate (recommended for production):"
echo "sudo certbot --nginx -d your-domain.com"
echo ""
echo "To create a backup:"
echo "docker-compose run --rm mongo-backup /scripts/backup.sh"
echo ""
echo "To restore from backup:"
echo "docker-compose run --rm mongo-backup /scripts/restore.sh <backup_file.tar.gz>"
