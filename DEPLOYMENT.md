# Production Deployment Guide for Zimaboard

## Prerequisites
- Zimaboard with Ubuntu/Debian Linux
- Docker and Docker Compose installed
- Domain name pointed to your Zimaboard IP
- Ports 80 and 443 open in firewall

## Quick Start

### 1. Prepare Environment
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker (if not installed)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose -y

# Verify installation
docker --version
docker-compose --version
```

### 2. Configure Environment Variables
```bash
# Copy template
cp .env.template .env

# Edit with your credentials
nano .env
```

**Required Changes in .env:**
- `POSTGRES_PASSWORD`: Set a strong password (e.g., use `openssl rand -base64 32`)
- `SESSION_SECRET`: Generate with `openssl rand -base64 32`
- `DOMAIN_NAME`: Your actual domain (e.g., business.yourdomain.com)

### 3. Update Nginx Configuration
```bash
# Edit nginx.conf
nano nginx.conf

# Replace these TWO lines:
# Line 48: server_name your-domain.com;
# Line 51: ssl_certificate /etc/nginx/ssl/live/your-domain.com/fullchain.pem;
# Line 52: ssl_certificate_key /etc/nginx/ssl/live/your-domain.com/privkey.pem;
```

### 4. Set Up SSL Certificates

**Option A: Let's Encrypt (Recommended)**
```bash
# First run without SSL to get certificates
docker-compose up -d postgres app

# Wait for app to be healthy
docker-compose ps

# Get certificates
docker-compose run --rm certbot certonly --webroot \
  --webroot-path /var/www/certbot \
  -d your-domain.com \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email

# Start nginx
docker-compose up -d nginx
```

**Option B: Cloudflare (If using Cloudflare proxy)**
```bash
# Cloudflare handles SSL, use Cloudflare Origin Certificate
# Download from Cloudflare dashboard → SSL/TLS → Origin Server
# Place in ./ssl/
```

### 5. Deploy Application
```bash
# Build and start all services
docker-compose up -d --build

# Check status
docker-compose ps
docker-compose logs -f app

# Run database migrations
docker-compose exec app npx drizzle-kit push:pg
```

### 6. Verify Deployment
```bash
# Check health
curl http://localhost:5000/api/health

# Check HTTPS (after SSL setup)
curl https://your-domain.com/api/health
```

## Cloudflare Configuration

### DNS Setup
1. Go to Cloudflare Dashboard → DNS
2. Add A record:
   - Type: A
   - Name: @ (or subdomain like 'business')
   - IPv4 address: Your Zimaboard public IP
   - Proxy status: Proxied (orange cloud)
   - TTL: Auto

### SSL/TLS Settings
1. Go to SSL/TLS → Overview
2. Set mode to: **Full (strict)** or **Full**
3. Enable: Always Use HTTPS
4. Enable: Automatic HTTPS Rewrites

## Database Backups

### Automated Daily Backups
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
docker-compose exec -T postgres pg_dump -U promanage promanage_db | gzip > "$BACKUP_DIR/backup_$DATE.sql.gz"
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +${BACKUP_RETENTION_DAYS:-30} -delete
EOF

chmod +x backup.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * cd /path/to/promanage && ./backup.sh") | crontab -
```

### Manual Backup
```bash
# Create backup
docker-compose exec postgres pg_dump -U promanage promanage_db > backup_$(date +%F).sql

# Restore backup
docker-compose exec -T postgres psql -U promanage promanage_db < backup_2024-11-26.sql
```

## Monitoring

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
docker-compose logs -f nginx
```

### Resource Usage
```bash
# Container stats
docker stats

# Disk usage
df -h
docker system df
```

## Maintenance

### Update Application
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Run migrations if needed
docker-compose exec app npx drizzle-kit push:pg
```

### Database Maintenance
```bash
# Enter PostgreSQL shell
docker-compose exec postgres psql -U promanage promanage_db

# Vacuum database
docker-compose exec postgres psql -U promanage -d promanage_db -c "VACUUM ANALYZE;"
```

## Troubleshooting

### App won't start
```bash
# Check logs
docker-compose logs app

# Check database connection
docker-compose exec app env | grep DATABASE_URL

# Restart services
docker-compose restart app
```

### SSL Certificate Issues
```bash
# Renew manually
docker-compose run --rm certbot renew

# Check certificate expiry
openssl x509 -in ./ssl/live/your-domain.com/fullchain.pem -noout -dates
```

### High Memory Usage
```bash
# Restart services
docker-compose restart

# Or limit resources in docker-compose.yml:
# services:
#   app:
#     deploy:
#       resources:
#         limits:
#           memory: 512M
```

## Security Checklist

- [ ] Changed default passwords in .env
- [ ] Generated strong SESSION_SECRET
- [ ] SSL/TLS configured and working
- [ ] Firewall configured (only 80, 443 open)
- [ ] Automated backups running
- [ ] Cloudflare proxy enabled (DDoS protection)
- [ ] Rate limiting active (nginx.conf)
- [ ] Database not exposed publicly (127.0.0.1:5432)

## Next Steps

1. **Authentication**: Add user login system (Replit Auth or custom)
2. **Email Notifications**: Configure SMTP for appointment reminders
3. **Payment Integration**: Add Stripe/PayPal for invoicing
4. **Data Encryption**: Encrypt sensitive client data at rest
5. **Monitoring**: Set up Grafana/Prometheus for metrics
