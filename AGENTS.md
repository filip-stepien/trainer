<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project conventions

Next.js (App Router, TypeScript, Tailwind CSS). Auth via Supabase, wrapped so the provider is swappable — hexagonal architecture (ports & adapters) combined with a feature-based folder layout.

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
infrastructure/          adapters implementing the ports (e.g. supabase-auth-provider.ts).
                          Only file(s) here may import the actual provider SDK.
ui/
  actions/               one Next.js Server Action per file, named after the action
                          (sign-in.ts, not auth.actions.ts)
  components/            React components
  hooks/                 client hooks that adapt an action to whatever a React API
                          needs (e.g. useActionState's (prevState, formData) contract)
index.ts                 composition root + the feature's only public barrel
```

`src/shared/` (cross-feature, not a feature itself):

```
domain/                  generic, business-agnostic kernel types used by every layer
                          (e.g. Result<T, E>) — pure plumbing, zero business meaning.
                          Does NOT belong under a feature's domain/.
infrastructure/          runtime/platform concerns: env var reading, provider SDK
                          client factories (Supabase browser/server/middleware clients)
index.ts                 single public barrel for shared/
```

### Import rules

- Crossing OUT of a feature (e.g. from `app/`) always goes through that feature's `index.ts`. Never reach into a feature's `domain/`, `application/`, `infrastructure/`, or `ui/` from outside.
- Crossing OUT of `shared/` works the same way: only `@/shared` (the barrel), never a deep path like `@/shared/infrastructure/env`.
- Within a feature or within `shared/`, sibling internal files import each other directly (e.g. `ui/actions/sign-in.ts` imports `AuthErrorCode` straight from `../../domain/errors`, not through the feature's own barrel). The barrel is the feature's public surface, not a mandatory hop for every internal import.
- The composition root (wiring an adapter into use-cases, building a per-request provider client) lives in the feature's `index.ts`.

### Errors

- No thrown exceptions for expected/domain-level failures. Use `Result<T, E>` (`{ ok: true, value } | { ok: false, error }`) with `ok()` / `err()` helpers from `@/shared`. `ok()` takes an optional value so it can be called as `ok()` for a `void` success.
- The caller decides how to present a `Result`'s error — mapping to a message, logging, etc. — never bake presentation into the domain/application layer.
- Error codes are a dictionary, not a bare union: `export const AuthErrorCode = { InvalidCredentials: 'invalid_credentials', ... } as const` plus `export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode]`. Call sites reference `AuthErrorCode.InvalidCredentials`, never the raw string literal.
- One shared error-code union per bounded concept is fine even if a given operation can't produce every member of it — don't fragment into a separate union per operation unless there's a concrete reason to.
- Match a provider's own errors by its stable error **code** (e.g. Supabase's `error.code`), never by parsing `error.message` — message text is locale/wording-dependent and not a public contract.

## Code style

- Prefer `function` declarations over arrow functions for top-level/exported functions. An arrow function is only acceptable when it's nested inside a `function`-declared function (e.g. a factory returning a bound closure).
- No classes. Adapters and factories are `export function createX(...) { return {...} }` or `export const` only when unavoidable — plain object literals, not `class`.
- `type` over `interface`, everywhere.
- Let TypeScript infer return types on use-case factories and their returned closures instead of annotating them explicitly — the port type already fully determines the shape.
- No comments in the code. If something needs explaining, make the code itself clearer instead.
- Server Actions: one per file, file named after the action (`sign-in.ts`), the exported action function takes only `(formData: FormData)` — no `prevState` parameter on the action itself.
- Client hooks (`ui/hooks/`) are what adapt a plain action into whatever contract a React API demands (e.g. wrapping it into `useActionState`'s `(prevState, formData)` shape). That adaptation never leaks into the action itself.
- Hooks return a plain object (`{ state, formAction, isPending }`), never a tuple.
- Components never import a Server Action directly — always through the corresponding hook.
- Validate `FormData` inside the Server Action with Zod; the schema is defined locally in that action's file, not shared.
- File names: kebab-case for anything multi-word (`sign-in.ts`, `auth-provider.ts`, `login-form.tsx`). Single-word files are unaffected. Next.js–mandated filenames (`page.tsx`, `layout.tsx`, `middleware.ts`) keep their required names as-is.
- Avoid baking generic pattern words into names where possible (avoid "-repository", "-use-case" suffixes) — but a name that's genuinely the concept (e.g. `AuthProvider`) is fine.

## Tooling

- Prettier config (`.prettierrc.json`): `printWidth: 100`, `tabWidth: 4`, `semi: true`, `singleQuote: true`, `jsxSingleQuote: true`, `trailingComma: "none"`, `bracketSameLine: false`, `arrowParens: "avoid"`, `endOfLine: "lf"`, plugin `prettier-plugin-tailwindcss`.
- After any code change, verify with: `npx tsc --noEmit`, `npm run lint`, `npx prettier --write .`, then a clean build (`rm -rf .next && npm run build`).

## Known gotcha: proxy.ts

The installed Next.js version (16.3.4, Turbopack) accepts and compiles `proxy.ts` (the file Next.js docs say replaces deprecated `middleware.ts`) without error, but it **does not execute at runtime** — empty middleware manifests, no session refresh, nothing. Verified directly (diagnostic response header, manifest inspection) and by reading the official `@next/codemod middleware-to-proxy` transform source, which performs the identical rename — so this isn't a migration mistake, it's a bug/limitation in this Next.js version. Keep using `middleware.ts` with `export function middleware` until a future Next.js patch actually runs `proxy.ts`. Do not re-migrate to `proxy.ts` without re-verifying it executes at runtime first.

## Git

- Conventional Commits for commit messages.
- No `Co-Authored-By` trailer.
- No extended description body — subject line only.
