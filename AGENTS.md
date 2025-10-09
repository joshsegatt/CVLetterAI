# Repository Guidelines

## Project Structure & Module Organization
Use `src/` for all application logic. Group shared utilities under `src/lib`, reusable UI under `src/components`, and feature-specific modules inside `src/features/<feature-name>`. Keep API contracts and data mocks in `src/services`. Place static assets in `public/` and reference them via relative paths. Store test helpers in `tests/helpers`, unit specs beside their subject within `src`, and broader integration suites under `tests/integration`. Create developer-facing notes or ADRs in `docs/` so architectural decisions stay discoverable.

## Build, Test, and Development Commands
Install dependencies with `npm install`. Use `npm run dev` for the hot-reload development server, `npm run build` for production bundling, and `npm run preview` to locally inspect that build. Run `npm run lint` to surface style issues before committing, and `npm run test` (optionally with `-- --watch` or `-- --coverage`) to execute all automated tests. Keep scripts in `package.json` up to date when adding new tooling so every contributor relies on the same entry points.

## Coding Style & Naming Conventions
Adopt TypeScript everywhere (`.ts`/`.tsx`). Prefer 2-space indentation, single quotes, and trailing commas in multiline literals; rely on Prettier for enforcement (`npm run lint -- --fix` to auto-format). Export React components and modules in PascalCase, hooks in camelCase prefixed with `use`, and folders with hyphenated names when multiple words are needed. Keep files small by co-locating styles as `<Component>.module.css` and avoid default exports except for pages.

## Testing Guidelines
Write unit tests with Vitest and component/integration coverage with Testing Library. Co-locate critical unit specs as `<file>.test.ts` within `src`, and place end-to-end scenarios inside `tests/e2e` using Playwright. Aim for 80% line coverage minimum (`npm run test -- --coverage`) and treat failing snapshots as blockers. When adding new features, create at least one happy-path and one guard-rail case before opening a pull request.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat:`, `fix:`, `chore:`) to keep history searchable. Keep each commit scoped to a single concern and include short, imperative descriptions. Pull requests should describe the why, list the how (bullet points), and reference related issues with `Closes #id`. Attach screenshots or GIFs for visual changes, link to docs when architecture shifts, and confirm lint/tests pass by pasting the local command output.
