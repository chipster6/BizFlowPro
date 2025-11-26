# Cloudflare Zero Trust Deployment (No Port Forwarding Needed!)

This is the **simpler, more secure** way to deploy - no need to open ports 80/443 on your Zimaboard!

## Prerequisites
- Zimaboard with Docker installed
- Cloudflare account (free tier works!)
- Domain added to Cloudflare

## Step 1: Create Cloudflare Tunnel (5 minutes)

### Via Cloudflare Dashboard (Easiest):

1. **Go to Zero Trust Dashboard**
   - Visit: https://one.dash.cloudflare.com/
   - Or: Cloudflare Dashboard → Zero Trust

2. **Create a Tunnel**
   - Navigate to: **Access → Tunnels**
   - Click: **Create a tunnel**
   - Choose: **Cloudflared**
   - Name it: `promanage-zimaboard` (or whatever you like)
   - Click: **Save tunnel**

3. **Copy the Tunnel Token**
   - You'll see a command like:
   ```
   docker run cloudflare/cloudflared:latest tunnel --no-autoupdate run --token eyJhIjoiXXXXXXXXXXX...
   ```
   - **Copy the entire token** (starts with `eyJh...`)
   - Save this token - you'll need it in Step 3

4. **Configure Public Hostname**
   - Still in the tunnel configuration page
   - Under **Public Hostnames**, click **Add a public hostname**
   - Fill in:
     - **Subdomain**: `business` (or whatever you want)
     - **Domain**: Select your domain from dropdown
     - **Type**: `HTTP`
     - **URL**: `app:5000`
   - Click **Save hostname**

   Your app will be accessible at: `https://business.yourdomain.com`

5. **Click "Done"** (you don't need to run the Docker command shown - we'll do that next)

## Step 2: Prepare Your Zimaboard

```bash
# SSH into Zimaboard
ssh user@zimaboard-ip

# Create project directory
mkdir -p ~/promanage
cd ~/promanage

# Install Docker if not already installed
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Verify Docker is running
docker --version
docker-compose --version
```

## Step 3: Configure Application

```bash
# Copy the Cloudflare environment template
cp .env.cloudflare.template .env

# Edit configuration
nano .env
```

### Fill in these values in `.env`:

```env
# Generate secure passwords:
POSTGRES_PASSWORD=<run: openssl rand -base64 32>
SESSION_SECRET=<run: openssl rand -base64 32>

# Paste your Cloudflare Tunnel Token from Step 1:
TUNNEL_TOKEN=eyJhIjoiXXXXXXXXXXXXXXXXXXXXXX...
```

## Step 4: Deploy Everything

```bash
# Use the Cloudflare-specific compose file
docker-compose -f docker-compose.cloudflare.yml up -d --build

# Wait for services to start (about 30 seconds)
docker-compose -f docker-compose.cloudflare.yml ps

# Initialize database
docker-compose -f docker-compose.cloudflare.yml exec app npx drizzle-kit push:pg
```

## Step 5: Verify It's Working

```bash
# Check all containers are running
docker-compose -f docker-compose.cloudflare.yml ps

# Should show:
# - promanage_db (healthy)
# - promanage_app (healthy)  
# - promanage_tunnel (up)

# Check tunnel connection
docker-compose -f docker-compose.cloudflare.yml logs cloudflared

# You should see: "Connection XXXX registered"
```

**Visit your app**: `https://business.yourdomain.com`

## That's It! 🎉

Your application is now:
- ✅ Live on the internet via Cloudflare
- ✅ Fully encrypted (HTTPS automatic)
- ✅ Protected by Cloudflare's DDoS protection
- ✅ **No ports exposed on your Zimaboard!**
- ✅ No need for SSL certificates or nginx

## Daily Operations

### View Logs
```bash
cd ~/promanage

# All services
docker-compose -f docker-compose.cloudflare.yml logs -f

# Just the app
docker-compose -f docker-compose.cloudflare.yml logs -f app

# Just the tunnel
docker-compose -f docker-compose.cloudflare.yml logs -f cloudflared
```

### Backup Database
```bash
cd ~/promanage
./backup.sh
```

Backups are saved to `./backups/` directory.

### Update Application
```bash
cd ~/promanage
git pull
docker-compose -f docker-compose.cloudflare.yml up -d --build
```

### Restart Services
```bash
docker-compose -f docker-compose.cloudflare.yml restart
```

### Stop Everything
```bash
docker-compose -f docker-compose.cloudflare.yml down
```

## Advantages of Cloudflare Tunnel

1. **No Port Forwarding**: Zimaboard firewall stays closed
2. **No SSL Certificates**: Cloudflare handles all HTTPS
3. **DDoS Protection**: Free with Cloudflare
4. **Dynamic IP Friendly**: Works even if your ISP changes your IP
5. **Remote Access**: Access from anywhere, even behind CGNAT
6. **No Reverse Proxy Setup**: No nginx configuration needed
7. **Automatic Failover**: If tunnel disconnects, it automatically reconnects

## Troubleshooting

### "Tunnel connection failed"
```bash
# Check tunnel logs
docker-compose -f docker-compose.cloudflare.yml logs cloudflared

# Common issues:
# - Invalid TUNNEL_TOKEN in .env
# - Cloudflare tunnel not created in dashboard
# - Network connectivity issues
```

### "502 Bad Gateway" on website
```bash
# Check app is healthy
docker-compose -f docker-compose.cloudflare.yml ps app

# Check app logs
docker-compose -f docker-compose.cloudflare.yml logs app

# Usually means app crashed - restart it:
docker-compose -f docker-compose.cloudflare.yml restart app
```

### "Database connection error"
```bash
# Check database is running
docker-compose -f docker-compose.cloudflare.yml ps postgres

# Check database logs
docker-compose -f docker-compose.cloudflare.yml logs postgres

# Restart database
docker-compose -f docker-compose.cloudflare.yml restart postgres
```

## Advanced: Multiple Tunnels / Hostnames

You can add more public hostnames to the same tunnel:

1. Go to Cloudflare Dashboard → Zero Trust → Access → Tunnels
2. Click on your tunnel name
3. Click **Public Hostnames** tab
4. Click **Add a public hostname**

Examples:
- `api.yourdomain.com` → `app:5000` (API only)
- `admin.yourdomain.com` → `app:5000` (Admin interface)

## Security Enhancements

### Add Cloudflare Access (Optional - Restrict Access)

Require login before accessing your app:

1. Zero Trust → Access → Applications
2. **Add an application** → Self-hosted
3. Application domain: `business.yourdomain.com`
4. Create access policy:
   - **Allow** → **Emails** → Enter your email
5. Save

Now only you can access the app (must login with your email).

### IP Whitelist (Optional)

Restrict access to specific IPs:

1. Zero Trust → Access → Tunnels → Your Tunnel
2. Click on the public hostname
3. Add **Access Policy**
4. Allow only specific IP ranges

## Monitoring

### View Tunnel Analytics
1. Cloudflare Dashboard → Zero Trust → Analytics
2. View requests, bandwidth, and errors

### Set Up Alerts
1. Cloudflare Dashboard → Notifications
2. Create alert for tunnel health
3. Get email/SMS if tunnel goes down

## Cost

**$0 per month** for:
- Cloudflare Tunnel (unlimited bandwidth)
- Zero Trust (up to 50 users)
- DDoS protection
- SSL certificates

No credit card required for basic features!

## Next Steps

Once deployed:
1. ✅ Test creating appointments, clients, invoices
2. ✅ Set up automated backups (cron job)
3. 🔒 Add authentication (user login)
4. 📧 Configure email notifications
5. 💳 Integrate payment processing (Stripe)
