# nuoitoi

Full-stack application repository containing the Next.js frontend and the NestJS API in one source repository.

## Repository layout

```text
.
├── app/                  # Next.js App Router, pages and BFF routes
├── components/           # Shared React components
├── services/             # Frontend API services
├── backend/
│   ├── src/              # NestJS API source
│   ├── prisma/           # Prisma schema
│   └── test/             # API tests
├── public/               # Frontend assets
└── package.json          # Frontend commands and root orchestration
```

The frontend and backend remain separate runtime applications because Next.js and NestJS have different bootstraps and build pipelines. They are now maintained, documented and operated from this single `nuoitoi` repository.

## Requirements

- Node.js 20 or newer
- pnpm for the frontend
- npm for the backend

## Install

```bash
pnpm install
npm --prefix backend ci
```

Create the local environment files before starting the applications:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

`BE_API_URL` in the root `.env` should point to the backend API, normally `http://localhost:3069/api`.

## Run locally

Start the frontend and backend in separate terminals:

```bash
pnpm dev
pnpm dev:backend
```

The frontend runs on `http://localhost:3000`; the API runs on `http://localhost:3069`.

## Build and test

```bash
pnpm build
pnpm build:backend
pnpm test:backend
pnpm test:e2e:backend
```

The root TypeScript and ESLint configurations exclude `backend/` so frontend checks do not apply incompatible Next.js and NestJS compiler settings to the same files. Use the backend-specific commands for API linting and formatting:

```bash
pnpm lint
pnpm lint:backend
pnpm format
pnpm format:backend
```

## API proxy

The Next.js BFF routes under `app/api/` forward requests to the NestJS API using `BE_API_URL`. The browser continues to call same-origin `/api` routes, so this consolidation does not change the frontend API contract.
