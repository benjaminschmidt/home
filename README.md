# Home App

Home App is a work-in-progress application for managing household data. The current codebase is organized as a small
monorepo:

- `api`: OpenAPI contract and generated TypeScript API client.
- `backend`: Spring Boot backend with PostgreSQL persistence.
- `frontend`: React frontend using TanStack Router.

The project is licensed under AGPL-3.0-or-later.

## Development Setup

### Prerequisites

Install these tools on your machine:

- [`mise`](https://mise.jdx.dev/) for tool and task management.
- [`podman`](https://podman.io/) for the local PostgreSQL database used by the backend.

The remaining runtime tools are managed by `mise`. After installing `mise`, enable it in your shell according to the
`mise` installation instructions. You can install all tools explicitly, even though starting the development stack
will do that automatically as well:

```shell
mise install
```

### Running The Application

Start the full local development stack from the repository root. The first run also installs all tools and builds
the generated API client from `api/api.yaml`.

```shell
mise dev
```

This starts:

- PostgreSQL through `podman kube play backend/postgres.yaml`.
- The Spring Boot backend with the `local` profile.
- The Vite frontend development server.

Default local URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- PostgreSQL: `localhost:5432`, database `postgres`, user `postgres`, password `postgres`

The frontend development environment is configured in `frontend/.env.development`. The backend local profile is
configured in `backend/src/main/resources/application-local.yaml`.

### Recreating the Database

To delete the database and recreate it on the next start, run:
```shell
mise //backend:db-delete
```
The database should be automatically shut down together with the dev stack. If something went wrong, you can do that
manually with:
```shell
mise //backend:db-down
```

### Running Checks

Run all project checks and tests from the repository root:

```shell
mise check
```

The CI-equivalent command is:

```shell
mise ci
```

## Forgejo action workflows

Forgejo workflows under `.forgejo/workflows` run backend and frontend checks for pull requests and create releases
from `main`.
