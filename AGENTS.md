# AGENTS.md

Dummy Docker images for testing, published as `dockette/dummy`.

## Writing style

- Write in ASD-STE100 (Simplified Technical English).
- Follow Zinsser's four principles of quality writing:
  1. Simplicity
  2. Brevity
  3. Clarity
  4. Humanity

## Conventions

- One folder per variant. The folder name is the Docker tag (`mcp/` -> `dockette/dummy:mcp`).
- Keep every variant small. These are demo images, not products.
- `mcp/`: one source file, `src/server.ts`. Tools go in `createServer()`.
- Pin the Bun version in the `Dockerfile` (`oven/bun:<version>-alpine`).
- `make test` runs the unit tests. `make test-docker` smoke tests the image.
- Run `make test` and `make build test-docker` before you commit.
- A new variant needs a folder, a `Dockerfile`, and an entry in the `image` matrix in
  `.github/workflows/docker.yml`.
