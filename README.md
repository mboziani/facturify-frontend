# Facturify Frontend

Next.js frontend application for Facturify - All-in-One Business Management SaaS.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS
- **State Management**: React Query
- **Forms**: React Hook Form + Zod
- **API Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file from the example:

```bash
cp .env.local.example .env.local
```

Update the environment variables as needed.

### Development

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser.

### Build

```bash
npm run build
npm start
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Demo Account

To quickly explore the platform without registering:

**Credentials:**
```
Email:    demo@facturify.com
Password: demo123
```

**Features:**
- Access to all platform features
- Pre-loaded sample data (invoices, clients, expenses)
- Auto-fill button available on login page
- "Try Demo Account" button on landing page

**Note:** Demo data is reset weekly. See [DEMO-ACCOUNT-GUIDE.md](../DEMO-ACCOUNT-GUIDE.md) for full details.

## Project Structure

```
facturify-frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes (protected)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   └── forms/            # Form components
├── lib/                  # Utilities & helpers
│   ├── api/             # API client
│   ├── hooks/           # Custom hooks
│   └── utils/           # Utility functions
├── types/               # TypeScript types
└── public/              # Static assets
```

## Features

- 🔐 Authentication (Login, Register, Forgot Password)
- 📊 Dashboard with analytics
- 🧾 Invoice management
- 👥 Client management
- 💰 Expense tracking
- ⏱️ Time tracking
- 📈 Financial reports
- 👥 Team management
- ⚙️ Settings

## Deployment

This project is optimized for deployment on Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## License

Proprietary - All rights reserved
