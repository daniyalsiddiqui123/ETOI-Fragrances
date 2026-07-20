# ÉTOI Fragrances

Premium, minimalist fragrance e-commerce website built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **CMS:** Sanity
- **Database:** Neon (PostgreSQL)
- **Email:** Nodemailer (Google App Password)
- **State Management:** Zustand
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/                    # App Router pages and API routes
    api/                  # API route handlers
    cart/                 # Cart page
    checkout/             # Checkout page
    contact/              # Contact page
    men/                  # Men's products
    women/                # Women's products
  components/             # Reusable React components
  lib/                    # Utilities, types, database, email
  store/                  # Zustand store (cart)
```

## Features

- Responsive, mobile-first design
- Product catalog with filtering and sorting
- Product detail pages with reviews
- Shopping cart with persistent storage
- Checkout with city selection and payment methods
- Contact form with validation
- Email notifications for orders
- SEO optimized
- Glassmorphic UI elements
- Smooth page transitions

## Deployment

The application is ready for deployment on Vercel.

```bash
npm run build
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity CMS project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `EMAIL_USER` | Gmail address for sending emails |
| `EMAIL_APP_PASSWORD` | Google App Password |
| `NEXT_PUBLIC_SITE_URL` | Production site URL |
