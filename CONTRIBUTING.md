# Contributing to DevDocs

Thank you for your interest in contributing! This document covers how to get the project running locally and the conventions we follow.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Submitting Changes](#submitting-changes)

## Getting Started

### Prerequisites

- **Node.js** 20+
- **pnpm** 9+ (`npm install -g pnpm`)
- **PostgreSQL** 15+ (or use the Replit-managed database)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/vikash-kushwah/Content-Hub.git
cd Content-Hub

# 2. Install dependencies
pnpm install

# 3. Copy environment variables
cp .env.example .env
# Edit .env and fill in real values

# 4. Run database migrations
pnpm --filter @workspace/db run migrate

# 5. Seed initial data (optional)
pnpm --filter @workspace/db run seed

# 6. Start the API server
pnpm --filter @workspace/api-server run dev

# 7. Start the frontend (in a separate terminal)
pnpm --filter @workspace/tutorial-hub run dev
```

The frontend is served at `http://localhost:5173` and the API at `http://localhost:8080/api`.

## Project Structure

```
├── artifacts/
│   ├── api-server/        # Express 5 REST API
│   └── tutorial-hub/      # React + Vite frontend
├── lib/
│   ├── api-spec/          # OpenAPI contract (source of truth)
│   ├── api-client-react/  # Generated React Query hooks (do not edit manually)
│   ├── api-zod/           # Generated Zod schemas (do not edit manually)
│   └── db/                # Drizzle ORM schema + migrations
├── scripts/               # Utility scripts
├── .env.example           # Required environment variables
└── pnpm-workspace.yaml    # Workspace config
```

## Development Workflow

### Adding a new API endpoint

This repo follows a **contract-first** approach — define the API in OpenAPI before implementing it:

1. Edit `lib/api-spec/openapi.yaml` to add your endpoint and schemas
2. Run codegen: `pnpm --filter @workspace/api-spec run codegen`
3. Implement the route in `artifacts/api-server/src/routes/`
4. Use the generated hook in the frontend (`@workspace/api-client-react`)

### Adding a new page

1. Create the page component in `artifacts/tutorial-hub/src/pages/`
2. Add a `<SEO>` component at the top with title, description, and JSON-LD
3. Register the route in `artifacts/tutorial-hub/src/App.tsx`

### Database changes

1. Edit the schema in `lib/db/src/schema/`
2. Generate a migration: `pnpm --filter @workspace/db run generate`
3. Apply it: `pnpm --filter @workspace/db run migrate`

## Code Style

- **TypeScript** everywhere — no `any` types unless absolutely necessary
- **Prettier** for formatting — run `pnpm format` before committing
- **No `console.log`** in server code — use `req.log` (Pino) instead
- Component files use **PascalCase**; utilities use **camelCase**
- Keep components small and focused; extract sub-components when a file exceeds ~200 lines

## Submitting Changes

1. Fork the repository and create a feature branch: `git checkout -b feat/my-feature`
2. Make your changes and commit with a descriptive message
3. Push to your fork and open a pull request against `main`
4. Fill in the PR template and link any related issues

We review PRs within a few days. Thank you for contributing!
