# Timeless Tours - Next.js Travel Website

A modern, responsive travel website for Timeless Tours Maldives built with Next.js 15, featuring internationalization, database integration, and beautiful UI components.

## Features

- 🌍 **Multi-language Support** - English, Chinese, Italian, Spanish
- 🏝️ **Tour Management** - Dynamic tour listings with filtering
- 📱 **Responsive Design** - Mobile-first approach
- 🎨 **Modern UI** - Tailwind CSS with custom animations
- 💾 **Database Integration** - Prisma ORM with MySQL
- ⚡ **Performance Optimized** - Next.js 15 with App Router
- 🔄 **Real-time Updates** - Dynamic content loading

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: MySQL with Prisma ORM
- **Deployment**: PM2, Nginx, Node.js 20

## Getting Started

### Prerequisites

- Node.js 20+
- MySQL database
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd timeless-tours-nextjs
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your database credentials:
```env
DATABASE_URL="mysql://username:password@localhost:3306/timeless_tours"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Set up the database**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed
```

5. **Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Production Deployment

### Server Setup (Ubuntu/Debian)

**VPS Details:**
- IP: `5.223.51.245`
- Domain: `timelesstours.oala.dev`
- Node.js 20 (already installed)

### 1. Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Nginx
sudo apt install nginx -y

# Install PM2 globally
sudo npm install -g pm2

# Install MySQL (if not already installed)
sudo apt install mysql-server -y

# Install Git (if not already installed)
sudo apt install git -y
```

### 2. Configure MySQL

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p
```

In MySQL console:
```sql
CREATE DATABASE timeless_tours;
CREATE USER 'timeless_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON timeless_tours.* TO 'timeless_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Deploy Application

```bash
# Create application directory
sudo mkdir -p /var/www/timeless-tours
sudo chown -R $USER:$USER /var/www/timeless-tours

# Clone repository
cd /var/www/timeless-tours
git clone <your-repository-url> .

# Install dependencies
npm install

# Build the application
npm run build
```

### 4. Configure Environment Variables

```bash
# Create production environment file
nano .env.local
```

Add your production configuration:
```env
DATABASE_URL="mysql://timeless_user:your_secure_password@localhost:3306/timeless_tours"
NEXTAUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="https://timelesstours.oala.dev"
NODE_ENV="production"
```

### 5. Set up Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed the database
npx prisma db seed
```

### 6. Configure PM2

Create PM2 ecosystem file:
```bash
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'timeless-tours',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/timeless-tours',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/timeless-tours-error.log',
    out_file: '/var/log/pm2/timeless-tours-out.log',
    log_file: '/var/log/pm2/timeless-tours.log',
    time: true
  }]
};
```

Start the application with PM2:
```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

### 7. Configure Nginx

Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/timeless-tours
```

```nginx
server {
    listen 80;
    server_name timelesstours.oala.dev;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name timelesstours.oala.dev;

    # SSL Configuration (replace with your SSL certificate paths)
    ssl_certificate /etc/ssl/certs/timelesstours.oala.dev.crt;
    ssl_certificate_key /etc/ssl/private/timelesstours.oala.dev.key;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # Static files caching
    location /_next/static/ {
        alias /var/www/timeless-tours/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API routes
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/timeless-tours /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 8. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d timelesstours.oala.dev

# Test automatic renewal
sudo certbot renew --dry-run
```

### 9. Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 10. Monitoring and Maintenance

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs timeless-tours

# Restart application
pm2 restart timeless-tours

# Check Nginx status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed     # Seed database
```

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

## Troubleshooting

### Common Issues

1. **PM2 not starting**
   ```bash
   pm2 logs timeless-tours
   pm2 restart timeless-tours
   ```

2. **Nginx 502 Bad Gateway**
   - Check if PM2 is running: `pm2 status`
   - Check application logs: `pm2 logs timeless-tours`

3. **Database connection issues**
   - Verify DATABASE_URL in .env.local
   - Check MySQL service: `sudo systemctl status mysql`

4. **SSL certificate issues**
   - Renew certificate: `sudo certbot renew`
   - Check certificate status: `sudo certbot certificates`

## Support

For issues and questions, please check the logs and ensure all services are running properly.
