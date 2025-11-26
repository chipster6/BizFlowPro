# ProManage - Production Deployment Guide

## Choose Your Deployment Method

### 🚀 Recommended: Cloudflare Zero Trust Tunnel
**Best for most users - No port forwarding needed!**

✅ **Advantages:**
- No ports to open on Zimaboard
- Works behind any firewall/router
- Free Cloudflare DDoS protection
- Automatic HTTPS/SSL
- Simpler setup (no nginx, no certbot)
- Works with dynamic IPs / CGNAT

📚 **Guide**: `QUICKSTART_CLOUDFLARE.md`
📄 **Config**: Use `docker-compose.cloudflare.yml`

**Setup Time**: 10 minutes  
**What You Need**:
- Cloudflare account (free)
- Domain added to Cloudflare
- Create tunnel in Cloudflare dashboard
- Copy tunnel token to `.env`

---

### 🔧 Alternative: Traditional Nginx + Let's Encrypt
**For advanced users who want full control**

✅ **Advantages:**
- Full control over reverse proxy
- Direct connection (no middleman)
- Can work without Cloudflare

❌ **Disadvantages:**
- Must open ports 80/443 on router
- Need to manage SSL certificates
- More complex nginx configuration
- Doesn't work behind CGNAT

📚 **Guide**: `DEPLOYMENT.md`
📄 **Config**: Use `docker-compose.yml`

**Setup Time**: 20 minutes  
**What You Need**:
- Port forwarding (80, 443)
- Static IP or Dynamic DNS
- Domain pointing to your IP

---

## Quick Comparison

| Feature | Cloudflare Tunnel | Traditional |
|---------|------------------|-------------|
| Port Forwarding | ❌ Not needed | ✅ Required |
| SSL Setup | 🟢 Automatic | 🟡 Manual (certbot) |
| DDoS Protection | ✅ Free | ❌ None |
| Works with CGNAT | ✅ Yes | ❌ No |
| Setup Complexity | 🟢 Simple | 🟡 Medium |
| Monthly Cost | 💚 $0 | 💚 $0 |
| Speed | Fast | Slightly faster |

## Recommendation

**Use Cloudflare Tunnel** unless you have a specific reason not to.

It's simpler, more secure, and works in more network situations.

---

## Files Overview

### For Cloudflare Tunnel Deployment:
- `QUICKSTART_CLOUDFLARE.md` - 10-minute deployment guide
- `CLOUDFLARE_TUNNEL_SETUP.md` - Detailed documentation
- `docker-compose.cloudflare.yml` - Cloudflare-specific compose file
- `.env.cloudflare.template` - Environment variables template

### For Traditional Deployment:
- `QUICKSTART.md` - Traditional deployment guide
- `DEPLOYMENT.md` - Detailed documentation
- `docker-compose.yml` - Full nginx + certbot setup
- `.env.template` - Environment variables template
- `nginx.conf` - Nginx reverse proxy configuration

### Shared Files:
- `Dockerfile` - Application container build
- `backup.sh` - Database backup script
- All application source code

---

## What's Included

Your ProManage application includes:

✅ **Calendar & Scheduling**
- Create, view, delete appointments
- Multiple appointment types (Consultation, Follow-up, Meeting)
- Date/time scheduling
- Client association

✅ **Client Management**
- Complete client database
- Contact information (email, phone, location)
- Company tracking
- Status management (Lead, Active, Inactive)
- Custom tags

✅ **Invoice Management**
- Generate invoices
- Track payment status (Pending, Paid, Overdue)
- Due date monitoring
- Client association

✅ **Financial Tracking**
- Record income and expenses
- Categorize transactions
- Travel expense tracking
- Financial reporting

✅ **Production Infrastructure**
- PostgreSQL database with backups
- RESTful API
- React frontend
- Automatic SSL/HTTPS
- Health monitoring
- Docker containerization

---

## Next Steps After Deployment

Once your app is deployed:

### 1. Test All Features (5 minutes)
```bash
# Visit your domain
https://business.yourdomain.com

# Test each page:
- Dashboard → Overview
- Calendar → Add appointment
- Clients → Add client
- Invoices → Create invoice
- Finances → Record transaction
```

### 2. Set Up Automated Backups (5 minutes)
```bash
# Make backup script executable
chmod +x backup.sh

# Test backup
./backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * cd /home/user/promanage && ./backup.sh
```

### 3. Optional Enhancements

**Add User Authentication**
- Implement login system
- Protect routes
- Multi-user support

**Email Notifications**
- Appointment reminders
- Invoice payment reminders
- Client follow-ups

**Payment Integration**
- Stripe for invoice payments
- Automatic payment tracking
- Receipt generation

**Mobile App**
- React Native mobile client
- Push notifications
- Offline mode

---

## Support

### Documentation
- `QUICKSTART_CLOUDFLARE.md` - Quick Cloudflare setup
- `CLOUDFLARE_TUNNEL_SETUP.md` - Detailed Cloudflare guide
- `QUICKSTART.md` - Quick traditional setup
- `DEPLOYMENT.md` - Detailed traditional guide

### Common Issues

**Database connection errors**
```bash
docker-compose logs postgres
docker-compose restart postgres
```

**App not responding**
```bash
docker-compose logs app
docker-compose restart app
```

**Cloudflare tunnel disconnected**
```bash
docker-compose logs cloudflared
# Check TUNNEL_TOKEN in .env
```

### Health Check
```bash
# Test API health
curl http://localhost:5000/api/health

# Or via your domain
curl https://business.yourdomain.com/api/health

# Should return: {"status":"healthy","timestamp":"..."}
```

---

## Architecture

```
┌─────────────────────────────────────────────┐
│          Cloudflare Global Network          │
│  (DDoS Protection, SSL, CDN, Zero Trust)   │
└──────────────────┬──────────────────────────┘
                   │ Encrypted Tunnel
                   │ (No ports exposed)
┌──────────────────┴──────────────────────────┐
│            Your Zimaboard                    │
│                                              │
│  ┌────────────┐  ┌──────────────┐          │
│  │ Cloudflared│  │ ProManage App│          │
│  │  Tunnel    ├─→│  (Node.js)   │          │
│  └────────────┘  └───────┬──────┘          │
│                          │                   │
│                  ┌───────┴──────┐           │
│                  │  PostgreSQL  │           │
│                  │   Database   │           │
│                  └──────────────┘           │
└──────────────────────────────────────────────┘
```

---

## Security

Your deployment includes:

✅ **Network Security**
- All traffic encrypted (HTTPS)
- No exposed ports (Cloudflare Tunnel)
- Cloudflare DDoS protection
- Rate limiting on API endpoints

✅ **Data Security**
- Database not exposed publicly
- Automated encrypted backups
- Session management
- Environment variable secrets

🔒 **Recommended Additions**:
- User authentication system
- Role-based access control
- Database encryption at rest
- Audit logging
- 2FA for admin access

---

## Performance

Expected performance:
- **Page Load**: < 2 seconds
- **API Response**: < 100ms
- **Database Queries**: < 50ms
- **Concurrent Users**: 100+ (limited by Zimaboard hardware)

Optimize by:
- Enabling Cloudflare caching
- Database indexing
- API response caching
- Image optimization
