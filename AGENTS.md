<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project conventions

Next.js (App Router, TypeScript, Tailwind CSS). Database and auth via Neon (Postgres + Neon Auth, managed Better Auth), wrapped so the provider is swappable — hexagonal architecture (ports & adapters) combined with a feature-based folder layout.

## Architecture shape

Each feature lives under `src/features/<feature>/`:

```
domain/                  entities + error codes only, flat files, no subfolders
                          (e.g. user.ts, errors.ts — no business logic knows about providers)
application/
  ports/                 port interfaces (e.g. auth-provider.ts) — contracts the
                          application layer needs from the outside world. Ports live
                          here, NOT in domain/ — a port is a boundary contract defined
                          by what use-cases need, not business knowledge itself.
  use-cases/             use-case factories, flat files (sign-in.ts, sign-up.ts, ...)
infrastructure/          adapters implementing the ports (e.g. neon-auth-provider.ts).
  drizzle/               Drizzle-specific schema and repository files.
                          Only infrastructure files may import the actual provider SDK.
ui/
  actions/               one Next.js Server Action per file, named after the action
                          (sign-in.ts, not auth.actions.ts)
  queries/               server-only UI data layer for Server Components; authenticates
                          and authorizes access, invokes use-cases, and handles delivery
                          concerns such as route validation and redirects
  components/            React components
  hooks/                 client hooks that adapt an action to whatever a React API
                          needs (e.g. useActionState's (prevState, formData) contract)
  lib/                   UI delivery helpers, including routes, navigation, validation,
                          and revalidation utilities
composition.ts           internal server-only composition root wiring adapters into use-cases
index.ts                 universal public barrel, safe to import from server and client
server.ts                optional server-only public barrel
client.ts                optional client-only public barrel for browser-only APIs
```

`src/shared/` (cross-feature, not a feature itself):

```
domain/                  generic, business-agnostic kernel types used by every layer
                          (e.g. Result<T, E>) — pure plumbing, zero business meaning.
                          Does NOT belong under a feature's domain/.
infrastructure/          runtime/platform concerns: env var reading, provider SDK
                          client factories (the Neon Auth singleton, the Postgres client factory)
ui/                      generic, business-agnostic UI kit — shadcn's own CLI-managed
                          output, not hand-written application code:
  components/            shadcn/ui primitives (button.tsx, card.tsx, sidebar.tsx, ...).
                          components.json's `ui` alias points here (@/shared/ui/components).
    blocks/<block-name>/  a shadcn block installed wholesale, kept under its registry
                          name (e.g. components/blocks/dashboard/ for
                          `@shadcn/dashboard-01`) — composed out of the sibling
                          primitives in ui/components/, not a primitive itself. A
                          feature-specific composed view (not a vendored block) still
                          belongs in that feature's own ui/components/.
  hooks/                 supporting hooks for the primitives (use-mobile.ts).
                          components.json's `hooks` alias points here.
  lib/                   supporting utilities (cn() in lib/utils.ts).
                          components.json's `lib`/`utils` aliases point here.
index.ts                 universal public barrel, safe to import from server and client
server.ts                optional server-only public barrel
client.ts                optional client-only public barrel for browser-only APIs
```

### Import rules

- A feature or `shared/` can expose up to three public barrels. Create only the barrels that have meaningful exports:
    - `index.ts` is universal. Server and Client Components may import it, so it must not import or re-export modules marked with `server-only` or `client-only`.
    - `server.ts` starts with `import 'server-only';`. A feature exposes only the smallest intentional public surface of server-only queries and cross-feature services; its composition root, adapters, and providers stay internal. `shared/server.ts` exposes only platform services intentionally shared with features.
    - `client.ts` starts with `import 'client-only';`. It exposes browser-only hooks and utilities that must never be imported by Server Components.
- Crossing OUT of a feature (e.g. from `app/`) always uses `@/features/<feature>`, `@/features/<feature>/server`, or `@/features/<feature>/client` according to the runtime boundary. Never reach into a feature's `domain/`, `application/`, `infrastructure/`, or `ui/` from outside.
- Crossing OUT of `shared/` works the same way: use `@/shared`, `@/shared/server`, or `@/shared/client`, never a deep path like `@/shared/infrastructure/env`.
- Within a feature or within `shared/`, sibling internal files import each other directly (e.g. `ui/actions/sign-in.ts` imports `AuthErrorCode` straight from `../../domain/errors`, not through the feature's own barrel). The barrel is the feature's public surface, not a mandatory hop for every internal import.
- A module containing `'use client'` is not automatically appropriate for `client.ts`. React Client Components can be imported and rendered by Server Components, so reusable UI components belong in the universal `index.ts`. Use `client.ts` for APIs such as hooks that directly depend on browser or client runtime behavior.
- A `'use server'` action may be re-exported from `index.ts` because Next.js exposes it to Client Components as a callable server reference. Its underlying use-case, adapter, and provider remain internal behind `composition.ts`.
- The composition root (wiring an adapter into use-cases) lives in the feature's internal, server-only `composition.ts`. Server Actions and queries import composed implementations from there, while `server.ts` is only the public server barrel. Whether an adapter is built once as a module-level singleton or fresh per request depends on the provider (Neon Auth's `auth` object is a singleton that reads request context lazily per call; a provider without that trick needs a fresh client per request instead).

### Errors

- No thrown exceptions for expected/domain-level failures. Use `Result<T, E>` (`{ ok: true, value } | { ok: false, error }`) with `ok()` / `err()` helpers from `@/shared`. `ok()` takes an optional value so it can be called as `ok()` for a `void` success.
- The caller decides how to present a `Result`'s error — mapping to a message, logging, etc. — never bake presentation into the domain/application layer.
- Error codes are a dictionary, not a bare union: `export const AuthErrorCode = { InvalidCredentials: 'invalid_credentials', ... } as const` plus `export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode]`. Call sites reference `AuthErrorCode.InvalidCredentials`, never the raw string literal.
- One shared error-code union per bounded concept is fine even if a given operation can't produce every member of it — don't fragment into a separate union per operation unless there's a concrete reason to.
- Match a provider's own errors by its stable error **code** (e.g. Better Auth's `error.code`, like `INVALID_EMAIL_OR_PASSWORD`), never by parsing `error.message` — message text is locale/wording-dependent and not a public contract.

## Code style

- Prefer `function` declarations over arrow functions for top-level/exported functions. An arrow function is only acceptable when it's nested inside a `function`-declared function (e.g. a factory returning a bound closure).
- No classes. Adapters and factories are `export function createX(...) { return {...} }` or `export const` only when unavoidable — plain object literals, not `class`.
- `type` over `interface`, everywhere.
- Let TypeScript infer return types on use-case factories and their returned closures instead of annotating them explicitly — the port type already fully determines the shape.
- Name operation payloads `data`, not `input`; use type names such as `CreateClientData`, not `CreateClientInput`.
- No comments in the code. If something needs explaining, make the code itself clearer instead.
- Server Actions: one per file, file named after the action (`sign-in.ts`), the exported action function takes only `(formData: FormData)` — no `prevState` parameter on the action itself.
- Client hooks (`ui/hooks/`) are what adapt a plain action into whatever contract a React API demands (e.g. wrapping it into `useActionState`'s `(prevState, formData)` shape). That adaptation never leaks into the action itself.
- Hooks return a plain object (`{ state, formAction, isPending }`), never a tuple.
- Components never import a Server Action directly — always through the corresponding hook.
- Server Actions pass `FormData` to feature-local validators in `ui/lib/validation.ts`.
  Validators own Zod schemas and map Zod errors to plain field-error objects; Server Actions
  do not import Zod or depend on its result/error API.
- Pages follow the same validation boundary and do not import Zod. Feature route construction
  lives in universal `ui/lib/routes.ts`, while calls to Next.js `redirect()` live in server-only
  `ui/lib/navigation.ts`. Pages, components, and actions use these helpers instead of literal paths.
- Server Components read feature data through `ui/queries/`, not application use-cases directly.
  Queries verify the current user and scope reads to that user before invoking a use-case. Like
  Server Actions, queries import composed use-case implementations from the feature's internal
  `composition.ts`. Queries return explicit, minimal DTOs instead of forwarding domain entities
  directly across the Server-to-Client boundary.
- File names: kebab-case for anything multi-word (`sign-in.ts`, `auth-provider.ts`, `login-form.tsx`). Single-word files are unaffected. Next.js–mandated filenames (`page.tsx`, `layout.tsx`, `middleware.ts`) keep their required names as-is.
- Avoid baking generic pattern words into names where possible (avoid "-repository", "-use-case" suffixes) — but a name that's genuinely the concept (e.g. `AuthProvider`) is fine.

## Tooling

- Prettier config (`.prettierrc.json`): `printWidth: 100`, `tabWidth: 4`, `semi: true`, `singleQuote: true`, `jsxSingleQuote: true`, `trailingComma: "none"`, `bracketSameLine: false`, `arrowParens: "avoid"`, `endOfLine: "lf"`, plugin `prettier-plugin-tailwindcss`.
- After any code change, verify with: `npx tsc --noEmit`, `npm run lint`, `npx prettier --write .`, then a clean build (`rm -rf .next && npm run build`).

## shadcn/ui

- `components.json` aliases are customized: `ui` → `@/shared/ui/components`, `hooks` → `@/shared/ui/hooks`, `lib`/`utils` → `@/shared/ui/lib` (see the `shared/` shape above), not the CLI's default `@/components/ui`, `@/hooks`, `@/lib`. The `components` alias stays at the CLI default (`@/components`) since a freshly-added block has no single correct home the CLI can target — after `add`, manually move its files into `shared/ui/components/blocks/<block-name>/` (matching the registry item's own name, e.g. `@shadcn/dashboard-01` → `components/blocks/dashboard/`) and fix their imports.
- A route that just renders a vendored block for demo/example purposes (not a real feature with its own domain/application/infrastructure) imports the block's components straight from `shared/ui/components/blocks/<block-name>/` — e.g. `src/app/dashboard-example/page.tsx` importing from `@/shared/ui/components/blocks/dashboard/*`. A feature that actually builds on a block still keeps its own composed views in that feature's `ui/components/`, not in `shared/`.

## Known gotcha: proxy.ts

The installed Next.js version (16.3.4, Turbopack) accepts and compiles `proxy.ts` (the file Next.js docs say replaces deprecated `middleware.ts`) without error, but it **does not execute at runtime** — empty middleware manifests, no session refresh, nothing. Verified directly (diagnostic response header, manifest inspection) and by reading the official `@next/codemod middleware-to-proxy` transform source, which performs the identical rename — so this isn't a migration mistake, it's a bug/limitation in this Next.js version. Keep using `middleware.ts` (a default export or a named `middleware` export both work) until a future Next.js patch actually runs `proxy.ts`. Do not re-migrate to `proxy.ts` without re-verifying it executes at runtime first.

## Neon Auth

- `@neondatabase/auth` is still pre-1.0 (beta) as of this writing — a conscious risk accepted for this project, not an oversight. Expect breaking changes on upgrade; re-check the actual installed types in `node_modules` before trusting docs or memory, the API has already had one breaking rewrite.
- `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL`, and `DATABASE_URL` are Neon-managed — read them through `@neon/env`'s `parseEnv(neonConfig)` (see `shared/infrastructure/env.ts`), not raw `process.env`. `NEON_AUTH_COOKIE_SECRET` is NOT Neon-managed — it's an app-level secret we generate ourselves (`openssl rand -base64 32`, minimum 32 characters) and store only in `.env.local`/deployment secrets.
- The `auth` object (`createNeonAuth(...)`) is a genuine module-level singleton (`shared/infrastructure/neon/auth.ts`), unlike a typical per-request provider client — its methods read the current request's cookies/headers lazily via `next/headers` at call time, not at construction time. Don't rebuild it per request.
- Sign-up requires a `name` field in addition to email/password (Better Auth's default user schema) — the sign-up form collects first/last name and concatenates them.
- Local dev works out of the box because `allow_localhost` is enabled on this Neon Auth project's config; a new deployment domain must be registered with `neon neon-auth domain add <domain>` or sign-in will fail with `invalid domain`.

## Known gotcha: auth.middleware() crashes on Edge

`auth.middleware({ loginUrl: '/login' })` (from `@neondatabase/auth/next/server`) looks like the obvious way to protect `/dashboard`, matching the library's own documented example — **do not add it to `middleware.ts`**. Its bundle pulls in `node:fs`, which does not exist in the Edge runtime that classic `middleware.ts` uses by default, and crashes every matched request with `Error: Failed to load external module node:fs` (a 500, confirmed via `next start` + curl, not just a build-time warning). Explicitly opting the file into `export const runtime = 'nodejs'` does not fix it either — the middleware silently disappears from `middleware-manifest.json` entirely and never runs (same empty-manifest symptom as the `proxy.ts` bug above, different cause). `proxy.ts` isn't a fallback here either, per its own gotcha. Net effect: there is currently no working way to run Neon Auth's own middleware-based route protection in this project's toolchain (Next 16.3.4 + Turbopack + `@neondatabase/auth` 0.5.0-beta) — rely solely on query-level `getAuthenticatedUserOrRedirect()` checks instead of adding `middleware.ts` back for this. Re-verify at runtime (not just a clean build) before ever re-adding it.

## Git

- Conventional Commits for commit messages.
- No `Co-Authored-By` trailer.
- No extended description body — subject line only.
