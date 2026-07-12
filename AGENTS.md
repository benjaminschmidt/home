<!-- intent-skills:start -->
## Skill Loading for frontend

Before substantial work on the frontend:
- Skill check: run `mise exec -- pnpx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `mise exec -- pnpx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

## Tooling
- Use `mise exec -- <command>` for commands that need Node, pnpm, Java, or Maven. The only exception are mise tasks, e.g., `mise check` can be run straight up.
- The frontend and API packages use pnpm. Do not use npm or yarn for install, scripts, or dependency changes.
- Prefer running commands from the smallest relevant directory first. Use the repository root when a change spans packages.

## Architecture
- `backend/` contains the Spring Boot backend.
- `frontend/` contains the React frontend.
- `api/` contains the OpenAPI contract and generated TypeScript API client. It is also used by the backend for generated server stubs.
- Treat `api/api.yaml` and files under `api/paths/` and `api/components/` as the source of truth for API shape. Update the contract before adapting backend or frontend code to an API change.
- Frontend source is organized by Feature-Sliced Design. Keep imports and placement compatible with Steiger checks.

## Validation
- Full repository check: `mise check` from the repository root.
- Frontend check: `mise check` from `frontend/`. This runs Biome, Steiger, build, TypeScript, and tests.
- Backend check: `mise check` from `backend/`. This runs `mvn clean verify`.
- API build: `mise run build` from `api/` after API contract changes.
- If a full check is too expensive for a small change, run the narrowest relevant check and report what was not run.

## Change Guidelines
- Keep generated files in sync with their sources. For API changes, regenerate the API client through the existing mise/pnpm tasks instead of hand-editing generated output.
- Preserve the existing package boundaries: API contract in `api/`, server implementation in `backend/`, UI and client usage in `frontend/`.
- Follow existing style and patterns before adding new abstractions.
- Do not mix unrelated formatting or refactors into functional changes.
