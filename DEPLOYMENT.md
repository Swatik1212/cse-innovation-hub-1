# Deployment Guide - CSE Innovation Hub

This guide covers all deployment options for the CSE Innovation Hub.

---

## Quick Deploy to Vercel (Recommended - 100% Free)

Vercel is the easiest and fastest way to deploy Next.js applications.

### Method 1: Deploy from v0.dev
1. Click the **"Publish"** button in the v0.dev interface
2. Connect your Vercel account
3. Choose a project name
4. Click "Deploy"
5. Done! You'll get a URL like: `your-project.vercel.app`

### Method 2: Deploy from GitHub
1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Vercel will auto-detect Next.js
5. Click "Deploy"
6. Your site will be live in ~2 minutes

### Custom Domain (Optional)
1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `csehub.com`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic, takes ~1 hour)

---

## Alternative: Deploy to Netlify

### Step 1: Build Configuration
Create a `netlify.toml` file in your project root:

\`\`\`toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
\`\`\`

### Step 2: Deploy
1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select your repository
5. Click "Deploy site"

---

## Deploy to Your Own Server (VPS)

If you have a server (AWS EC2, DigitalOcean, etc.):

### Prerequisites:
- Ubuntu 20.04+ or similar Linux server
- Root/sudo access
- Domain name (optional)

### Step 1: Install Node.js
\`\`\`bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
\`\`\`

### Step 2: Install PM2 (Process Manager)
\`\`\`bash
sudo npm install -g pm2
\`\`\`

### Step 3: Clone Your Project
\`\`\`bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/cse-hub.git
cd cse-hub
\`\`\`

### Step 4: Install Dependencies & Build
\`\`\`bash
npm install
npm run build
\`\`\`

### Step 5: Start with PM2
\`\`\`bash
pm2 start npm --name "cse-hub" -- start
pm2 startup
pm2 save
\`\`\`

### Step 6: Setup Nginx (Reverse Proxy)
\`\`\`bash
sudo apt install nginx
\`\`\`

Create nginx config: `/etc/nginx/sites-available/cse-hub`
\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

Enable the site:
\`\`\`bash
sudo ln -s /etc/nginx/sites-available/cse-hub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
\`\`\`

### Step 7: Setup SSL with Let's Encrypt
\`\`\`bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
\`\`\`

---

## Environment Variables for Production

Create a `.env.local` file (not committed to Git):

\`\`\`env
# For production database (when you add MySQL)
DATABASE_URL="mysql://user:password@localhost:3306/cse_hub"

# For email notifications (future feature)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# API Keys (if needed)
NEXT_PUBLIC_API_URL="https://api.your-domain.com"
\`\`\`

**Important:** Never commit `.env.local` to Git!

Add to `.gitignore`:
\`\`\`
.env.local
.env.production
\`\`\`

---

## Performance Optimization

### 1. Enable Image Optimization
In `next.config.mjs`:
\`\`\`js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-cdn.com'],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
\`\`\`

### 2. Add Caching Headers
For Vercel, create `vercel.json`:
\`\`\`json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
\`\`\`

### 3. Enable Compression
Already enabled by default in Next.js and Vercel.

---

## Monitoring & Analytics

### Add Google Analytics
1. Get your GA4 tracking ID from Google Analytics
2. Add to `app/layout.tsx`:

\`\`\`tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
\`\`\`

### Vercel Analytics
1. Go to your project in Vercel
2. Click "Analytics" tab
3. Enable Web Analytics (free)
4. No code changes needed!

---

## Continuous Deployment

### With Vercel (Automatic):
- Every push to `main` branch = automatic deployment
- Preview deployments for pull requests
- Rollback to previous versions with one click

### With GitHub Actions (DIY):
Create `.github/workflows/deploy.yml`:

\`\`\`yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Server
        run: |
          # Add your deployment script here
\`\`\`

---

## Backup Strategy

### Database Backups (When MySQL is integrated):
\`\`\`bash
# Daily backup script
mysqldump -u root -p cse_hub > backup_$(date +%Y%m%d).sql

# Automated daily backups
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
\`\`\`

### Code Backups:
- Use Git (automatic with GitHub)
- Enable GitHub repository backups
- Consider GitLab/Bitbucket mirrors

---

## Scaling for High Traffic

### 1. Use CDN for Static Assets
- Vercel provides this automatically
- Or use Cloudflare CDN (free tier available)

### 2. Database Optimization (Future)
- Add indexes to frequently queried columns
- Use connection pooling
- Consider read replicas for heavy traffic

### 3. Caching Strategy
- Next.js has built-in caching
- Add Redis for session management
- Use SWR for client-side data caching

---

## Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] Environment variables secured
- [ ] CORS configured properly
- [ ] Rate limiting on API routes (future)
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (React escapes by default)
- [ ] CSRF tokens (for forms in future)
- [ ] Regular dependency updates

---

## Cost Estimation

### Free Tier (Recommended for Students):
- **Vercel:** Free for personal projects
  - Unlimited deployments
  - 100 GB bandwidth/month
  - Serverless functions included

- **Total Cost:** $0/month ✅

### Paid Options (For Production):
- **Vercel Pro:** $20/month
  - More bandwidth
  - Team collaboration
  - Advanced analytics

- **VPS (DigitalOcean):** $5-10/month
  - Full server control
  - Unlimited bandwidth
  - Requires setup & maintenance

---

## Troubleshooting Deployment

### "Build Failed"
- Check build logs for errors
- Ensure all dependencies are in `package.json`
- Test `npm run build` locally first

### "Module not found" in production
- Make sure imports use correct casing
- Check that files are committed to Git

### "502 Bad Gateway"
- Check if application is running
- Verify port configuration
- Check server logs

### Slow initial load
- This is normal for serverless (cold start)
- Upgrades to Vercel Pro reduce this
- Or use a VPS with always-on server

---

**Need Help?**
- Vercel Support: https://vercel.com/support
- Next.js Docs: https://nextjs.org/docs
- Community: https://github.com/vercel/next.js/discussions

Your application is production-ready! 🚀
