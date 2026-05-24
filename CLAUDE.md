# Neuralingual Blog — Claude Code Project Config

## What This Is

Hashnode enterprise blog theme for Neuralingual (`blog.neuralingual.com`). Built on Hashnode's Starter Kit — a headless CMS setup that fetches content from Hashnode's GraphQL API and renders via Next.js.

## Project Structure

```
packages/
  blog-starter-kit/
    themes/
      enterprise/          <- The active theme (all work happens here)
        components/        <- React components (43 files)
        pages/             <- Next.js pages (file-based routing)
        generated/         <- GraphQL codegen output (DO NOT edit manually)
        lib/               <- Utility libraries
        utils/             <- Constants, helpers
        styles/            <- Tailwind + custom CSS
        public/            <- Static assets
  eslint-config-custom/    <- Shared ESLint config
  tsconfig/                <- Shared TypeScript config
  utils/                   <- Shared utilities (@starter-kit/utils)
```

## Build Commands

All commands run from `packages/blog-starter-kit/themes/enterprise/`:

```bash
pnpm build          # Next.js production build
pnpm dev            # Dev server (Next.js + codegen watch)
pnpm typecheck      # TypeScript check (tsc)
pnpm lint           # ESLint via next lint
pnpm codegen        # GraphQL codegen (generates types from schema)
```

Install from repo root:
```bash
pnpm install        # From repo root — uses pnpm workspaces
```

## Required Environment Variables

Copy `.env.example` to `.env.local` in the enterprise theme directory:

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT` | Hashnode GraphQL API endpoint | `https://gql.hashnode.com` |
| `NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST` | Publication host identifier | (set in Vercel) |
| `NEXT_PUBLIC_MODE` | `development` or `production` | — |
| `NEXT_PUBLIC_BASE_URL` | Base URL for the blog (optional, sets basePath) | — |

Production values are set in Vercel project settings. The GQL endpoint fallback in `next.config.js` handles missing env vars gracefully (returns empty redirects).

## Deployment

- **Platform:** Vercel
- **Production:** Auto-deploys from `main` branch to `blog.neuralingual.com`
- **Preview:** Every PR gets a preview deployment
- **Root directory (Vercel):** `packages/blog-starter-kit/themes/enterprise`
- **Framework:** Next.js (auto-detected)

## Component Conventions

- Functional components with TypeScript (no class components in new code)
- Tailwind CSS for styling (with `tailwind-merge` for conditional classes)
- GraphQL types from `generated/graphql.ts` — run `pnpm codegen` after schema changes
- Pages use `getStaticProps` + `getStaticPaths` with ISR (`revalidate: 1`)
- Type-only imports for GraphQL types that conflict with component names: `import type { Post } from '...'`

## Known Issues

- Pre-existing ESLint warnings (img elements, missing deps) are from the Hashnode starter kit upstream — do not fix unless specifically scoped
- The `generated/` directory is committed; regenerate with `pnpm codegen` if the Hashnode schema changes
- Local builds require env vars for the GQL endpoint; without them, the build still succeeds (redirects fallback to empty array) but pages that fetch data will fail at runtime

## GraphQL Codegen

Schema is fetched from Hashnode's public API. Config in `codegen.yml`. Output goes to `generated/graphql.ts`. Types are used throughout pages and components for publication, post, and tag data.

## Issues

Issues for this repo are tracked on the main Neuralingual repo: `innerstacklabs/neuralingual` (this repo has issues disabled).
