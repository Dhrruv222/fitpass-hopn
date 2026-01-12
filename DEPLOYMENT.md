# 🚀 Deployment Guide - Fitpass HOPn

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Install Git** (if not already installed):
   - Download from: https://git-scm.com/downloads
   - Or use GitHub Desktop: https://desktop.github.com/

2. **Initialize Git Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Fitpass HOPn production-ready application"
   ```

3. **Push to GitHub**:
   - Create a new repository on GitHub: https://github.com/new
   - Name it: `fitpass-hopn` or `hopn-wellness-platform`
   - Don't initialize with README (we already have one)
   - Run the commands shown by GitHub:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

4. **Deploy to Vercel**:
   - Go to: https://vercel.com/new
   - Sign in with GitHub
   - Import your `fitpass-hopn` repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `./` (leave default)
     - **Build Command**: `npm run build` (auto-detected)
     - **Output Directory**: `.next` (auto-detected)
   - **Environment Variables** (click "Add"):
     ```
     NEXT_PUBLIC_API_BASE_URL=
     NEXT_PUBLIC_DEFAULT_LOCALE=en
     NEXT_PUBLIC_ENABLE_MOCK=true
     ```
   - Click **Deploy**
   - Wait 2-3 minutes for deployment to complete
   - Copy your live URL (e.g., `https://fitpass-hopn.vercel.app`)

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Select your scope
   - Link to existing project or create new one
   - Set environment variables when prompted

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

---

## Environment Variables

Configure these in Vercel dashboard under **Settings → Environment Variables**:

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | _(empty)_ | Leave blank for mock API mode |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `en` | Default language (en/ar) |
| `NEXT_PUBLIC_ENABLE_MOCK` | `true` | Enable mock API (set to `false` when backend is ready) |

---

## Post-Deployment Testing

Once deployed, test with these accounts:

### 1️⃣ Employee Dashboard
- URL: `https://your-app.vercel.app/en/auth/login`
- Email: `employee@test.com`
- Password: `Test@12345`
- **Test Flow**:
  1. View plan overview
  2. Generate QR code for check-in
  3. View recent check-ins
  4. Browse partners on map
  5. View bookings
  6. Update profile

### 2️⃣ Company/HR Portal
- URL: `https://your-app.vercel.app/en/auth/login`
- Email: `hr@test.com`
- Password: `Test@12345`
- **Test Flow**:
  1. View employee list
  2. Invite new employee
  3. Assign plan to employee
  4. View usage analytics
  5. Download invoices
  6. View available plans

### 3️⃣ Admin Panel
- URL: `https://your-app.vercel.app/en/auth/login`
- Email: `admin@test.com`
- Password: `Test@12345`
- **Test Flow**:
  1. Create new company
  2. Add new partner location
  3. Approve pending partner
  4. Create membership plan
  5. View analytics dashboard
  6. Edit/delete plans

---

## Arabic/RTL Testing

Switch to Arabic version:
- URL: `https://your-app.vercel.app/ar`
- Verify:
  - Text direction is RTL
  - Navigation aligns right
  - Forms maintain proper layout
  - Tables display correctly
  - Modals and cards render properly

---

## Troubleshooting

### Build Fails on Vercel

**Error**: `Module not found: Can't resolve 'leaflet'`
- **Fix**: Already configured in `package.json`. Redeploy.

**Error**: `Type errors in TypeScript`
- **Fix**: Run `npm run build` locally first to catch errors
- Check `tsconfig.json` has `"noEmit": true`

### Map Not Loading

**Error**: Leaflet map shows blank tiles
- **Fix**: Already configured in `components/Map.tsx` with default marker icons from CDN
- Ensure `leaflet` CSS is imported in `app/globals.css`

### Environment Variables Not Working

**Error**: Mock API not enabled
- **Fix**: Add `NEXT_PUBLIC_ENABLE_MOCK=true` in Vercel dashboard
- Redeploy after adding variables

### QR Code Not Generating

**Error**: QR modal shows error
- **Fix**: Check `lib/api/client.ts` has `generateQRToken()` method
- Verify mock data includes QR tokens

---

## Domain Configuration (Optional)

### Custom Domain Setup

1. Go to Vercel dashboard → **Settings → Domains**
2. Add your custom domain (e.g., `hopn.fitpass.ae`)
3. Update DNS records as instructed:
   - **A Record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`
4. Wait for DNS propagation (5-60 minutes)
5. SSL certificate is auto-provisioned

---

## Monitoring & Analytics

### Vercel Analytics (Free)

1. Enable in dashboard: **Analytics → Enable**
2. View real-time metrics:
   - Page views
   - Unique visitors
   - Performance scores
   - Core Web Vitals

### Vercel Speed Insights

1. Install package:
   ```bash
   npm install @vercel/speed-insights
   ```
2. Add to `app/[locale]/layout.tsx`:
   ```typescript
   import { SpeedInsights } from '@vercel/speed-insights/next';
   
   export default function Layout({ children }) {
     return (
       <>
         {children}
         <SpeedInsights />
       </>
     );
   }
   ```

---

## Production Checklist

Before going live with real backend:

- [ ] Update `NEXT_PUBLIC_API_BASE_URL` to real API endpoint
- [ ] Set `NEXT_PUBLIC_ENABLE_MOCK=false`
- [ ] Configure CORS on backend to allow Vercel domain
- [ ] Set up JWT secret rotation
- [ ] Enable rate limiting on API
- [ ] Configure error tracking (Sentry, LogRocket)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Review security headers in `next.config.js`
- [ ] Test all user flows with real data
- [ ] Set up backup/restore procedures
- [ ] Configure CDN for static assets
- [ ] Enable Vercel Edge Functions if needed
- [ ] Set up CI/CD pipeline for automated deployments

---

## Integration with Real Backend

When backend API is ready:

1. **Update Environment Variables**:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=https://api.hopn.fitpass.ae
   NEXT_PUBLIC_ENABLE_MOCK=false
   ```

2. **Switch API Client** in `lib/api/client.ts`:
   ```typescript
   // Change from:
   export const api = new MockAPI();
   
   // To:
   export const api = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'true' 
     ? new MockAPI() 
     : new RealAPI();
   ```

3. **Implement RealAPI Methods**:
   - All method signatures already defined
   - Replace mock logic with actual fetch/axios calls
   - Handle real JWT tokens
   - Implement error handling

4. **Test Integration**:
   - Login with real credentials
   - Verify token persistence
   - Test all CRUD operations
   - Check error messages
   - Validate data formats

---

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **next-intl Setup**: https://next-intl-docs.vercel.app/docs/getting-started/app-router
- **TailwindCSS RTL**: https://tailwindcss.com/docs/configuration#direction

---

## Contact & Maintenance

- **Repository**: Link to GitHub repo after creation
- **Live URL**: Update after deployment
- **Maintainer**: Your contact information
- **Last Updated**: January 2025
