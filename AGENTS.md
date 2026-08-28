# AGENTS.md

Dummy MCP server (Bun) published as `dockette/dummy`.

## Writing style

- Write in ASD-STE100 (Simplified Technical English).
- Follow Zinsser's four principles of quality writing:
  1. Simplicity
  2. Brevity
  3. Clarity
  4. Humanity

## Conventions

- Keep the server small. It is a demo image, not a product.
- One source file: `src/server.ts`. Tools go in `createServer()`.
- Pin the Bun version in the `Dockerfile` (`oven/bun:<version>-alpine`).
- `bun test` covers the server over HTTP. `make test-docker` covers the image.
- Run `make test` and `make build test-docker` before you commit.
