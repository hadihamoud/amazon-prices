# 🚀 Production Setup Guide for Zobda

## 📋 Quick Start Checklist

### ✅ Pre-Deployment Requirements
- [ ] Domain name registered
- [ ] GitHub repository created
- [ ] Environment variables prepared
- [ ] Database schema ready
- [ ] SSL certificates configured

## 🛠️ Infrastructure Setup

### **Frontend: Vercel (Recommended)**

#### **Step 1: Prepare Frontend for Production**
```bash
cd amazon-prices

# Install Vercel CLI
npm install -g vercel

# Create production build
npm run build

# Test production build locally
npm install -g serve
serve -s dist
```

#### **Step 2: Deploy to Vercel**
```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Set environment variables
vercel env add VITE_API_BASE_URL
vercel env add VITE_AMAZON_API_KEY
vercel env add VITE_GOOGLE_ANALYTICS_ID
```

#### **Step 3: Configure Custom Domain**
```bash
# Add domain to Vercel project
vercel domains add yourdomain.com

# Update DNS records
# A record: @ -> 76.76.19.61
# CNAME: www -> cname.vercel-dns.com
```

### **Backend: Railway (Recommended)**

#### **Step 1: Prepare Backend for Production**
```bash
cd backend

# Install Railway CLI
npm install -g @railway/cli

# Create railway.json
echo '{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
  }
}' > railway.json
```

#### **Step 2: Deploy to Railway**
```bash
# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up

# Set environment variables
railway variables set DATABASE_URL=postgresql://...
railway variables set AMAZON_API_KEY=your_key
railway variables set SECRET_KEY=your_secret
```

### **Database: PostgreSQL**

#### **Step 1: Create Production Database**
```sql
-- Create database
CREATE DATABASE zobda_production;

-- Create user
CREATE USER zobda_user WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE zobda_production TO zobda_user;
```

#### **Step 2: Run Migrations**
```bash
# Install Alembic
pip install alembic

# Initialize migrations
alembic init migrations

# Create migration
alembic revision --autogenerate -m "Initial migration"

# Run migration
alembic upgrade head
```

## 🔧 Environment Configuration

### **Frontend Environment Variables**
```env
# .env.production
VITE_API_BASE_URL=https://your-backend.railway.app
VITE_AMAZON_API_KEY=your_amazon_api_key
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_SENTRY_DSN=your_sentry_dsn
```

### **Backend Environment Variables**
```env
# .env.production
DATABASE_URL=postgresql://user:password@host:port/database
AMAZON_API_KEY=your_amazon_api_key
SECRET_KEY=your_secret_key
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
REDIS_URL=redis://your_redis_url
```

## 🛡️ Security Configuration

### **HTTPS & SSL**
```bash
# Vercel automatically provides HTTPS
# Railway provides HTTPS by default
# Ensure all traffic redirects to HTTPS
```

### **CORS Configuration**
```python
# backend/app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com", "https://www.yourdomain.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

### **Rate Limiting**
```python
# backend/app/middleware.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Apply to routes
@app.get("/api/products")
@limiter.limit("100/hour")
async def get_products(request: Request):
    pass
```

## 📊 Monitoring & Analytics

### **Error Tracking: Sentry**
```bash
# Install Sentry
npm install @sentry/react @sentry/tracing

# Configure in main.tsx
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### **Analytics: Google Analytics**
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### **Uptime Monitoring: UptimeRobot**
```bash
# Free tier: 50 monitors
# Monitor your frontend and backend URLs
# Set up alerts for downtime
```

## 🚀 Deployment Scripts

### **Frontend Deployment**
```bash
#!/bin/bash
# deploy-frontend.sh

echo "Building frontend..."
npm run build

echo "Deploying to Vercel..."
vercel --prod

echo "Frontend deployed successfully!"
```

### **Backend Deployment**
```bash
#!/bin/bash
# deploy-backend.sh

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Running migrations..."
alembic upgrade head

echo "Deploying to Railway..."
railway up

echo "Backend deployed successfully!"
```

## 🔄 CI/CD Pipeline

### **GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.11'
      - run: pip install -r backend/requirements.txt
      - run: railway up --token ${{ secrets.RAILWAY_TOKEN }}
```

## 📈 Performance Optimization

### **Frontend Optimizations**
```javascript
// Lazy loading components
const ProductCard = lazy(() => import('./ProductCard'));

// Image optimization
<img 
  src={product.imageUrl} 
  loading="lazy"
  alt={product.title}
  className="w-full h-48 object-cover"
/>

// Code splitting
const AdminDashboard = lazy(() => import('./AdminDashboard'));
```

### **Backend Optimizations**
```python
# Database connection pooling
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20
)

# Caching
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend

FastAPICache.init(RedisBackend(), prefix="zobda-cache")
```

## 🧪 Testing Strategy

### **Frontend Testing**
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Run tests
npm test

# Run tests in CI
npm run test:ci
```

### **Backend Testing**
```bash
# Install testing dependencies
pip install pytest pytest-asyncio

# Run tests
pytest

# Run tests with coverage
pytest --cov=app tests/
```

## 📱 Mobile Optimization

### **PWA Configuration**
```json
// public/manifest.json
{
  "name": "Zobda - Amazon Price Tracker",
  "short_name": "Zobda",
  "description": "Track Amazon prices and never overpay again",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#f97316",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## 🔍 SEO Optimization

### **Meta Tags**
```html
<!-- index.html -->
<meta name="description" content="Track Amazon prices and never overpay again. Get price alerts, historical data, and deal notifications.">
<meta name="keywords" content="amazon price tracker, price alerts, deals, savings">
<meta property="og:title" content="Zobda - Amazon Price Tracker">
<meta property="og:description" content="Track Amazon prices and never overpay again">
<meta property="og:image" content="/og-image.png">
```

### **Sitemap Generation**
```javascript
// scripts/generate-sitemap.js
const fs = require('fs');
const path = require('path');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/trending</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap);
```

## 🚨 Emergency Procedures

### **Rollback Strategy**
```bash
# Frontend rollback
vercel rollback [deployment-url]

# Backend rollback
railway rollback [deployment-id]

# Database rollback
alembic downgrade -1
```

### **Backup Strategy**
```bash
# Database backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated backups (cron job)
0 2 * * * pg_dump $DATABASE_URL > /backups/backup_$(date +\%Y\%m\%d).sql
```

## 📞 Support & Maintenance

### **Monitoring Checklist**
- [ ] **Uptime**: 99.9% target
- [ ] **Response Time**: <2 seconds
- [ ] **Error Rate**: <1%
- [ ] **Database Performance**: Query optimization
- [ ] **Security**: Regular security audits

### **Maintenance Schedule**
- **Daily**: Check error logs, monitor performance
- **Weekly**: Review user feedback, update dependencies
- **Monthly**: Security updates, performance optimization
- **Quarterly**: Feature planning, user research

---

**Ready to launch?** Follow this guide step by step, and you'll have a production-ready Zobda application! 🚀


