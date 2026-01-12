# Fitpass HOPn - Wellness Membership Platform

A production-grade B2B2C wellness membership platform built with Next.js, featuring multi-language support (English/Arabic RTL), role-based dashboards, QR check-in system, and comprehensive admin tools.

## 🚀 Live Demo

**Live URL:** [Will be provided after deployment]

## 📋 Features

### Public Website
- ✅ Homepage with hero section and features
- ✅ Pricing page with 5 tiers (Bronze, Silver, Gold, Club+, Digital)
- ✅ Partner discovery with interactive map and filters
- ✅ About, FAQ, and Contact pages
- ✅ Full EN/AR localization with RTL support

### Authentication & Authorization
- ✅ Login/Register with JWT token management
- ✅ Role-based access control (Employee, Company Admin, Platform Admin)
- ✅ Protected routes with automatic redirects
- ✅ Password reset flow (UI ready)

### Employee Dashboard (`/app`)
- ✅ Active plan overview with check-in limits
- ✅ QR code generator for check-ins (5-minute expiry)
- ✅ Recent check-ins history
- ✅ Partner browsing
- ✅ Profile management

### Company Portal (`/company`) - HR Dashboard
- ✅ Employee management (invite, assign plans, deactivate)
- ✅ Usage analytics with date range filters
- ✅ Plan management view
- ✅ Invoice list with PDF download (UI ready)

### Admin Panel (`/admin`) - Platform Operator
- ✅ Company management (create, view all companies)
- ✅ Plan CRUD operations
- ✅ Partner approval workflow (pending/approved/rejected/suspended)
- ✅ Analytics dashboard with charts (check-ins over time, KPIs)

### Technical Features
- ✅ Next.js 14 App Router with TypeScript
- ✅ TailwindCSS with RTL support
- ✅ next-intl for i18n (Arabic & English)
- ✅ React Hook Form + Zod validation
- ✅ QR code generation with qrcode.react
- ✅ Leaflet maps for partner discovery
- ✅ Recharts for analytics visualization
- ✅ Mock API layer (switchable via env variable)
- ✅ Responsive design (mobile + desktop)
- ✅ Custom UI component library

## 🧪 Test Accounts

Use these credentials to test different roles:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Employee** | employee@test.com | Test@12345 | Employee dashboard, QR check-in, partner browsing |
| **Company Admin (HR)** | hr@test.com | Test@12345 | Employee management, usage analytics, invoices |
| **Platform Admin** | admin@test.com | Test@12345 | System-wide management, partner approval, analytics |

## 📖 Testing Guide

### 1. Employee Flow
1. Login as `employee@test.com` / `Test@12345`
2. View your active plan (Silver) on dashboard
3. Click "Generate QR Code" - observe 5-minute countdown timer
4. Navigate to "Partners" to browse available locations
5. Check "Recent Check-ins" section for history
6. Test language toggle (العربية) - interface switches to RTL

### 2. HR/Company Admin Flow
1. Login as `hr@test.com` / `Test@12345`
2. **Employees Tab:**
   - Click "Add Employee" to invite new member
   - Select an employee and click "Assign Plan"
   - Choose a plan and assign
   - Deactivate an active employee
3. **Usage Tab:** View employee check-in statistics
4. **Invoices Tab:** See company invoices (download ready)

### 3. Platform Admin Flow
1. Login as `admin@test.com` / `Test@12345`
2. **Companies Tab:**
   - Click "Add Company"
   - Create new company with unique code
3. **Partners Tab:**
   - View pending partner (PowerHouse Gym Dammam)
   - Click green checkmark to approve
   - Partner now appears in public discovery
   - Suspend/reject partners
4. **Plans Tab:** Create/edit membership tiers
5. **Analytics Tab:** View platform KPIs and charts

### 4. Partner Discovery (Public)
1. Logout (or open incognito)
2. Navigate to `/en/partners`
3. Use filters: City (Riyadh/Jeddah) and Type (Gym/Spa)
4. Click partner cards to view details in modal
5. Interact with map - click markers
6. Switch to Arabic - observe RTL map and filters

### 5. Localization Testing
1. On any page, click language toggle
2. Verify:
   - All text translates
   - Layout mirrors (RTL for Arabic)
   - Navigation preserves state
   - Forms work in both languages

## 🛠 Local Development

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone repository
git clone <repository-url>
cd HOPn

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_ENABLE_MOCK=true
```

- `NEXT_PUBLIC_API_BASE_URL`: Backend API endpoint (unused when mock enabled)
- `NEXT_PUBLIC_DEFAULT_LOCALE`: Default language (`en` or `ar`)
- `NEXT_PUBLIC_ENABLE_MOCK`: Use mock data (`true` for demo, `false` for real API)

## 📦 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Forms:** React Hook Form + Zod
- **i18n:** next-intl
- **Maps:** Leaflet + React Leaflet
- **Charts:** Recharts
- **QR Codes:** qrcode.react
- **Icons:** Lucide React

## 📁 Project Structure

```
HOPn/
├── app/
│   ├── [locale]/           # Internationalized routes
│   │   ├── page.tsx        # Homepage
│   │   ├── pricing/        # Pricing page
│   │   ├── partners/       # Partner discovery
│   │   ├── auth/           # Login, register, etc.
│   │   ├── app/            # Employee dashboard
│   │   ├── company/        # HR portal
│   │   └── admin/          # Admin panel
│   ├── globals.css         # Global styles
│   └── page.tsx            # Root redirect
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── AuthProvider.tsx    # Auth context
│   ├── PublicNav.tsx       # Public navigation
│   └── Map.tsx             # Leaflet map wrapper
├── lib/
│   ├── api/
│   │   ├── client.ts       # API client with mock support
│   │   └── mockData.ts     # Seed data for all entities
│   ├── types.ts            # TypeScript interfaces
│   └── utils.ts            # Helper functions
├── messages/
│   ├── en.json             # English translations
│   └── ar.json             # Arabic translations
└── public/                 # Static assets
```

## 🚀 Deployment to Vercel

### Automatic Deployment

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Next.js
     - Root Directory: ./
   - Add environment variables:
     ```
     NEXT_PUBLIC_API_BASE_URL=
     NEXT_PUBLIC_DEFAULT_LOCALE=en
     NEXT_PUBLIC_ENABLE_MOCK=true
     ```
   - Click "Deploy"

3. **Get Live URL:**
   - Vercel provides URL like: `https://hopn.vercel.app`
   - Custom domain can be added in project settings

### Manual Deployment via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 🔧 Build for Production

```bash
# Create production build
npm run build

# Test production build locally
npm start
```

## 🎯 Mock vs Real API

The application includes a complete mock API layer that simulates backend responses.

**Mock Mode (Default):**
- Set `NEXT_PUBLIC_ENABLE_MOCK=true`
- Uses in-memory data from `lib/api/mockData.ts`
- Includes realistic delays to simulate network latency
- Test accounts work immediately

**Real API Mode:**
- Set `NEXT_PUBLIC_ENABLE_MOCK=false`
- Set `NEXT_PUBLIC_API_BASE_URL` to your backend
- API client sends real HTTP requests
- Requires backend implementation

## 📊 Features Checklist

### Core Requirements ✅
- [x] Next.js App Router with TypeScript
- [x] TailwindCSS styling
- [x] Full EN/AR i18n with RTL
- [x] Mock API with seed data
- [x] Test accounts functional
- [x] Role-based routing
- [x] JWT token management

### Public Site ✅
- [x] Homepage
- [x] Pricing (5 tiers)
- [x] Partner discovery with map
- [x] About/FAQ/Contact pages

### Authentication ✅
- [x] Login/Register
- [x] Protected routes
- [x] Role-based redirects
- [x] Forgot password (UI)

### Employee Dashboard ✅
- [x] Plan overview
- [x] QR check-in with expiry
- [x] Recent check-ins
- [x] Partner browsing
- [x] Profile page

### Company Portal ✅
- [x] Employee management
- [x] Invite employees
- [x] Assign plans
- [x] Usage analytics
- [x] Invoice list

### Admin Panel ✅
- [x] Company CRUD
- [x] Plan CRUD
- [x] Partner approval workflow
- [x] Analytics dashboard

### Deployment ✅
- [x] Vercel-ready configuration
- [x] Environment variables
- [x] Production build tested
- [x] README with testing guide

## 🐛 Known Issues / Future Enhancements

1. **PDF Invoice Download:** UI ready, needs backend endpoint
2. **Partner Images:** Using placeholders, need CDN integration
3. **Real-time Updates:** Currently requires page refresh
4. **Email Notifications:** Invite emails need backend service
5. **Advanced Filters:** Partner search could include ratings, amenities
6. **Booking System:** Currently placeholder, needs full implementation

## 📝 License

Proprietary - Fitpass HOPn Platform

## 👥 Support

For questions or issues:
- Email: support@hopn.com
- Documentation: [Wiki/Docs]

---

**Built with ❤️ using Next.js**
