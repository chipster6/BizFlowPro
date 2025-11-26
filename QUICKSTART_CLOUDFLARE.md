# 10-Minute Cloudflare Tunnel Deployment

Zero port forwarding required! This is the simplest way to deploy.

## What You Need

1. **Cloudflare account** (free tier works)
2. **Domain** added to Cloudflare
3. **Zimaboard** with SSH access
4. **5 minutes** of your time

## Step-by-Step

### 1. Create Cloudflare Tunnel (2 minutes)

Visit: https://one.dash.cloudflare.com/

1. **Zero Trust** → **Access** → **Tunnels** → **Create a tunnel**
2. Name: `promanage`
3. **Copy the tunnel token** (starts with `eyJh...`)
4. Add public hostname:
   - Subdomain: `business`
   - Domain: `yourdomain.com`
   - Type: `HTTP`
   - URL: `app:5000`
5. Click **Save**

### 2. Deploy to Zimaboard (3 minutes)

```bash
# SSH into Zimaboard
ssh user@zimaboard-ip

# Create project directory
mkdir -p ~/promanage && cd ~/promanage

# Download project files (or copy them over)
# Then:

# Configure
cp .env.cloudflare.template .env
nano .env
```

Paste in `.env`:
```env
POSTGRES_PASSWORD=$(openssl rand -base64 32)  # Generate this
SESSION_SECRET=$(openssl rand -base64 32)      # Generate this
TUNNEL_TOKEN=eyJhIjoiXXXXXXXXXXXXXX...        # From step 1
```

### 3. Start Everything (1 minute)

```bash
# Deploy
docker-compose -f docker-compose.cloudflare.yml up -d --build

# Initialize database
docker-compose -f docker-compose.cloudflare.yml exec app npx drizzle-kit push:pg
```

### 4. Done! ✅

Visit: `https://business.yourdomain.com`

## Common Commands

```bash
# View logs
docker-compose -f docker-compose.cloudflare.yml logs -f

# Backup database
./backup.sh

# Restart
docker-compose -f docker-compose.cloudflare.yml restart

# Update app
git pull && docker-compose -f docker-compose.cloudflare.yml up -d --build
```

## Why This Is Better

✅ No port forwarding  
✅ No SSL certificates to manage  
✅ No nginx configuration  
✅ Works behind CGNAT/dynamic IPs  
✅ Free Cloudflare DDoS protection  
✅ Automatic HTTPS  

## Troubleshooting

**Can't access website?**
```bash
# Check tunnel status
docker-compose -f docker-compose.cloudflare.yml logs cloudflared

# Should see "Connection registered"
```

**App not responding?**
```bash
# Check app health
docker-compose -f docker-compose.cloudflare.yml ps
docker-compose -f docker-compose.cloudflare.yml logs app
```

See `CLOUDFLARE_TUNNEL_SETUP.md` for detailed documentation.
