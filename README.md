# Lingkoraq

A premium bio-link platform built with Next.js 14, Supabase, and GitHub CDN.

## Features

- **Hybrid Editor** - Switch between Visual and Code editing with Monaco Editor
- **GitHub Image Hosting** - Free CDN via raw.githubusercontent.com
- **Supabase Auth & DB** - Secure authentication and data storage
- **Real-time Preview** - Live iPhone mockup canvas
- **Server-side Sanitization** - DOMPurify on all public pages
- **Glassmorphism UI** - Apple-tier aesthetics with Framer Motion

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- Monaco Editor
- Supabase
- Octokit (GitHub)
- DOMPurify

## Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd lingkoraq
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

### 3. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase_schema.sql` in the SQL Editor
3. Enable GitHub and Google OAuth providers (optional)
4. Copy your Project URL and Anon Key to `.env.local`

### 4. GitHub Setup (for image CDN)

1. Create a GitHub repository (e.g., `lingkoraq-assets`)
2. Generate a Personal Access Token with `repo` scope
3. Add token to `.env.local`

### 5. Run

```bash
npm run dev
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Or push to GitHub and import into Vercel dashboard.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `GITHUB_TOKEN` | GitHub Personal Access Token |
| `GITHUB_OWNER` | Your GitHub username |
| `GITHUB_REPO` | Repository name for assets |
| `GITHUB_BRANCH` | Branch to push to (default: main) |
