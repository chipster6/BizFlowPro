# Quick Start - Deploy to Your Zimaboard

## What You Need From Your Side

### 1. **Domain Name & Cloudflare**
- A domain name (e.g., `business.yourdomain.com`)
- Cloudflare account with domain added
- Cloudflare API Token (Dashboard → Profile → API Tokens → Create Token)
- Zone ID (Dashboard → Overview → scroll down to find Zone ID)

### 2. **Zimaboard Preparation**
- SSH access to your Zimaboard
- Docker installed (`curl -fsSL https://get.docker.com | sh`)
- Ports 80 and 443 accessible from internet

### 3. **Generate Secrets**
Run these commands to generate secure secrets:
```bash
# PostgreSQL password
openssl rand -base64 32

# Session secret
openssl rand -base64 32
```

## 5-Minute Deployment

### Step 1: Copy Files to Zimaboard
```bash
# On your local machine
scp -r ./* user@zimaboard-ip:/home/user/promanage/
```

### Step 2: Configure Environment
```bash
# SSH into Zimaboard
ssh user@zimaboard-ip
cd /home/user/promanage

# Copy and edit environment file
cp .env.template .env
nano .env
```

Edit `.env` with:
```env
POSTGRES_PASSWORD=<paste first secret here>
SESSION_SECRET=<paste second secret here>
DOMAIN_NAME=business.yourdomain.com
```

### Step 3: Update Nginx Config
```bash
nano nginx.conf
```

Replace `your-domain.com` (3 places: lines 48, 51, 52) with your actual domain.

### Step 4: Configure Cloudflare DNS
1. Log into Cloudflare
2. Go to your domain → DNS
3. Add A record:
   - Name: `business` (or `@` for root domain)
   - IPv4: Your Zimaboard public IP
   - Proxy: ON (orange cloud)

### Step 5: Deploy
```bash
# Start database first
docker-compose up -d postgres
sleep 10

# Get SSL certificate
docker-compose run --rm certbot certonly --webroot \
  --webroot-path /var/www/certbot \
  -d business.yourdomain.com \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email

# Start everything
docker-compose up -d --build

# Initialize database
docker-compose exec app npx drizzle-kit push:pg
```

### Step 6: Verify
```bash
# Check all services are running
docker-compose ps

# Test health endpoint
curl https://business.yourdomain.com/api/health

# Should return: {"status":"healthy","timestamp":"..."}
```

## Your Application URLs

- **Website**: `https://business.yourdomain.com`
- **API**: `https://business.yourdomain.com/api/*`

## Daily Operations

### View Logs
```bash
docker-compose logs -f app
```

### Backup Database
```bash
./backup.sh
# Backups saved to ./backups/
```

### Update Application
```bash
git pull
docker-compose up -d --build
```

### Restart Services
```bash
docker-compose restart
```

## What This Gives You

✅ **Full-stack business management application**
- Calendar & appointment scheduling
- Client database management
- Invoice generation & tracking
- Financial reporting

✅ **Production-ready infrastructure**
- PostgreSQL database with automatic backups
- HTTPS with Let's Encrypt SSL
- Nginx reverse proxy with rate limiting
- Docker containerization

✅ **Security**
- All traffic encrypted (HTTPS)
- Cloudflare DDoS protection
- Database not exposed publicly
- Rate limiting on API endpoints

✅ **Self-hosted on your Zimaboard**
- Full data ownership
- No monthly SaaS fees
- Complete control

## Troubleshooting

**"Connection refused"**
- Check Zimaboard firewall: `sudo ufw allow 80,443/tcp`
- Verify Docker running: `docker-compose ps`

**"502 Bad Gateway"**
- App container crashed: `docker-compose logs app`
- Restart: `docker-compose restart app`

**"Database connection failed"**
- Check postgres running: `docker-compose ps postgres`
- View logs: `docker-compose logs postgres`

## Next Steps

1. **Add authentication** - Set up user login system
2. **Email notifications** - Configure SMTP for appointment reminders  
3. **Payment processing** - Integrate Stripe for invoice payments
4. **Mobile app** - Build React Native mobile client

## Support

See `DEPLOYMENT.md` for detailed documentation on:
- Advanced configuration
- Backup & restore procedures
- Monitoring & maintenance
- Security hardening
