#!/bin/bash

# Fixed VPS Setup Script for Ex-Commerce Docker Deployment
set -e

echo "=== Ex-Commerce VPS Setup Script (Fixed) ==="

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
sudo mkdir -p /var/www
cd /var/www

# Remove existing directory if it exists
if [ -d "ex-commerce" ]; then
    echo "Removing existing ex-commerce directory..."
    sudo rm -rf ex-commerce
fi

# Clone repository to the correct location
echo "Cloning repository to /var/www/ex-commerce..."
sudo git clone https://github.com/BayajidAlam/ex-commerce.git
sudo chown -R $USER:$USER /var/www/ex-commerce

# Navigate to project directory
cd /var/www/ex-commerce

# Verify files exist
echo "Checking project files..."
if [ -f "docker-compose.yml" ]; then
    echo "✅ docker-compose.yml found"
else
    echo "❌ docker-compose.yml not found"
fi

if [ -f ".env.docker" ]; then
    echo "✅ .env.docker template found"
else
    echo "❌ .env.docker template not found"
    echo "Creating basic .env.docker template..."
    cat > .env.docker << 'EOF'
# MongoDB Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=change_this_secure_password
MONGO_DB_NAME=ex_commerce

# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://localhost:5000

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EOF
fi

# Create environment file
echo "Setting up environment file..."
if [ ! -f ".env" ]; then
    cp .env.docker .env
    echo "✅ Environment file created from template"
else
    echo "✅ Environment file already exists"
fi

# Set proper permissions
sudo chown -R $USER:$USER /var/www/ex-commerce
chmod +x /var/www/ex-commerce/backup.sh 2>/dev/null || echo "backup.sh not found, skipping..."

echo "=== Setup completed successfully! ==="
echo ""
echo "📁 Project location: /var/www/ex-commerce"
echo "🔧 Next steps:"
echo "1. Edit the environment file: nano /var/www/ex-commerce/.env"
echo "2. Update MongoDB password, JWT secret, and API URL"
echo "3. Start the application: cd /var/www/ex-commerce && docker-compose up -d"
echo ""
echo "🔐 Generate secure passwords:"
echo "MongoDB password: openssl rand -base64 32"
echo "JWT secret: openssl rand -base64 64"
echo ""
echo "🌐 Your application will be available at:"
echo "- Frontend: http://$(curl -s ifconfig.me):3000"
echo "- Backend API: http://$(curl -s ifconfig.me):5000"
echo ""
echo "⚠️  Important: Edit /var/www/ex-commerce/.env with secure values before starting!"
