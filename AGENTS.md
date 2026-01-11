# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains application code (Vue 3 + TypeScript).
- `src/components/` holds reusable UI components; `src/views/` are route-level pages.
- `src/stores/` contains Pinia stores; `src/router/` defines routes.
- `src/assets/` is for bundled static assets; `public/` is for unprocessed static files.
- `docs/` houses documentation; `dist/` is build output.

## Build, Test, and Development Commands
- `yarn dev`: start the Vite dev server on `http://localhost:3000` (production API by default).
- `yarn dev:local`: run the dev server against the local API (`https://localhost:5001`).
- `yarn dev:prod`: explicit production API dev server.
- `yarn build`: typecheck with `vue-tsc` then build via Vite.
- `yarn preview`: preview the production build on `http://localhost:5050`.
- `yarn test:unit`: run Vitest once in jsdom mode.
- `yarn test:unit:watch`: run Vitest in watch mode.
- `yarn test:stores`: run store tests only.
- `yarn typecheck`: run `vue-tsc` type checking.
- `yarn lint`: run ESLint with auto-fix.

## Coding Style & Naming Conventions
- Indentation: follow existing file style (TypeScript/Vue uses 2-space indentation).
- Vue SFCs live in `src/` with `PascalCase.vue` component filenames.
- Tests use `*.spec.ts` or `*.test.ts` naming; place near the unit under test.
- Linting: ESLint with Vue + TypeScript rules (`eslint.config.js`). Prettier is included in tooling; rely on ESLint for formatting.

## Testing Guidelines
- Framework: Vitest with jsdom (`vitest.config.ts`).
- Coverage: global thresholds 80% (branches/functions/lines/statements), with the same threshold for `src/stores/**`.
- Test setup: `src/test-setup.ts` is loaded for unit tests.
- Example: `src/components/Button.spec.ts`.

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commits (see `VERSIONING.md`), e.g. `feat(ui): add badge`.
- Semantic-release uses commit types for versioning; use `!` or `BREAKING CHANGE:` for major changes.
- PRs should include: a concise description, linked issue (if applicable), and screenshots for UI changes.
- Ensure tests and linting pass before requesting review.

## Configuration & Environment Tips
- Copy `env.local.example` to `.env.local` for local API settings.
- Node requirement: `>=22.0.0` (see `package.json`).
