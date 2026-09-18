# TranXSoft Website

Canonical repository for the TranXSoft company website, including the public landing page and the administration dashboard for managing website content.

## Repository Scope

* One repository for the complete TranXSoft website; individual pages and website modules are not split into separate repositories.
* The website serves as the public-facing landing page for TranXSoft and its language translation products and services.
* The repository also includes an administration dashboard for managing website content, products, services, and other configurable information displayed on the public website.
* The same codebase is intended to serve staging and production through environment-specific configuration.
* The repository remains private during initial development.

## Product Scope

TranXSoft focuses on **language translation and localization technologies**, providing translation products, AI-powered translation solutions, and related language services.

The website provides:

* Corporate information about TranXSoft.
* Product and service presentations.
* Information about translation and localization solutions.
* Contact and inquiry functionality.
* An administration dashboard for managing website content and configurations.

## Current Status

Repository initialized. Framework, hosting provider, deployment workflow, domains, and environment secrets are intentionally not assumed here; they must be recorded when approved.

## Delivery Rules

* Work through pull requests; do not commit product changes directly to `main`.
* Keep secrets outside source control.
* Require build/test evidence and an approved review before merge or deployment.
* Track delivery status and acceptance evidence in the canonical TranX PM board.


## 🚀 Features

### Landing Pages

- **Homepage** (`/`) - Overview of TranX and featured products
- **Products** (`/products`) - List of Mini Apps
- **About** (`/about`) - About TranX company
- **Contact** (`/contact`) - Contact info and support form
- **Support** (`/support`) - Support center and FAQ
- **Privacy** (`/privacy`) - Privacy policy
- **Terms** (`/terms`) - Terms of service

### Admin Dashboard

- **Dashboard** - Overview and statistics
- **Brands** - Brand management
- **Campaigns** - Marketing campaign management
- **Users** - User management
- **Analytics** - Data analytics
- **Documents** - Document management
- **Notifications** - Notification management
- **Settings** - System settings

## 🛠 Tech Stack

- **Framework**: Next.js 16.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**:
  - Zustand (Client state)
  - React Query (Server state)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 📋 System Requirements

- Node.js 18.x or higher
- pnpm 8.x or higher

## 🔧 Installation

1. Clone repository:

```bash
git clone <repository-url>
cd TranxFEWeb
```

2. Install dependencies:

```bash
pnpm install
```

3. Create `.env.local` file from `.env.example`:

```bash
cp .env.example .env.local
```

4. Update environment variables in `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Running the Project

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the result.

### Production Build

```bash
pnpm build
pnpm start
```

### Linting

```bash
pnpm lint
```

### Code Formatting

```bash
pnpm format
```

### Type Checking

```bash
pnpm type-check
```

## 📁 Directory Structure

```
.
├── app/                    # Next.js App Router
│   ├── (landing pages)     # Public pages
│   │   ├── page.tsx       # Homepage
│   │   ├── about/         # About page
│   │   ├── contact/       # Contact page
│   │   ├── products/      # Products page
│   │   ├── support/       # Support page
│   │   ├── privacy/       # Privacy policy
│   │   └── terms/         # Terms of service
│   ├── admin/             # Admin dashboard
│   │   ├── layout.tsx     # Admin layout
│   │   ├── dashboard/     # Dashboard page
│   │   ├── brands/        # Brands management
│   │   ├── campaigns/     # Campaigns management
│   │   ├── users/         # Users management
│   │   └── ...
│   ├── auth/              # Authentication pages
│   │   └── login/         # Login page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # UI components (shadcn/ui)
│   └── layout/           # Layout components
├── features/             # Feature modules
│   └── admin/            # Admin features
│       ├── brands/       # Brand feature
│       ├── campaigns/    # Campaign feature
│       └── ...
├── lib/                  # Utilities
│   ├── api-client.ts    # API client setup
│   └── utils.ts         # Helper functions
├── stores/              # Zustand stores
├── hooks/               # Custom React hooks
├── types/               # TypeScript types
├── constants/           # Constants
├── shared/              # Shared resources
│   ├── i18n/           # Internationalization
│   └── utils/          # Shared utilities
└── public/             # Static assets
```

## 🎨 UI Design System

The project uses shadcn/ui with custom design tokens:

### Colors

- **Primary**: Cyan (#38BDF8, #22D3EE)
- **Accent**: Orange/Brass (#F97316, #F59E0B)
- **Dark**: Slate (#0F172A, #1E293B)
- **Light**: Off-white (#F8FAFC)

### Typography

- **Font**: Inter, Sora, IBM Plex Sans
- **Mono**: Geist Mono

## 🔐 Authentication

The project handles authentication via:

- Zalo Login integration
- JWT tokens
- Protected routes with middleware

## 🌐 API Integration

The API client is configured in `lib/api-client.ts`:

- Base URL from environment variables
- Axios interceptors for auth tokens
- Error handling
- Request/response transforms

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

## 🧪 Testing

```bash
# Run tests (when set up)
pnpm test

# Run tests with coverage
pnpm test:coverage
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
vercel --prod
```

### Docker

```bash
# Build image
docker build -t tranx-web .

# Run container
docker run -p 3000:3000 tranx-web
```

### Manual Deployment

```bash
pnpm build
# Deploy contents of .next folder
```

## 📝 Environment Variables

| Variable              | Description     | Example                       |
| --------------------- | --------------- | ----------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.tranx.vn`        |
| `NEXT_PUBLIC_APP_URL` | Frontend URL    | `https://tranx.vn`            |
| `NODE_ENV`            | Environment     | `development` \| `production` |
