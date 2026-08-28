<h1 align=center>Dockette / Dummy</h1>

<p align=center>
   🐳 Dummy Docker images for testing. Start with <code>dockette/dummy:mcp</code>, an <a href="https://modelcontextprotocol.io">MCP</a> server with 2 tools.
</p>

<p align=center>
🕹 <a href="https://f3l1x.io">f3l1x.io</a> | 💻 <a href="https://github.com/f3l1x">f3l1x</a> | 🐦 <a href="https://twitter.com/xf3l1x">@xf3l1x</a>
</p>

<p align=center>
   <a href="https://github.com/dockette/dummy/actions"><img src="https://github.com/dockette/dummy/actions/workflows/docker.yml/badge.svg" alt="GitHub Actions"></a>
   <a href="https://hub.docker.com/r/dockette/dummy"><img src="https://img.shields.io/docker/pulls/dockette/dummy.svg" alt="Docker Hub pulls"></a>
   <a href="https://github.com/sponsors/f3l1x"><img src="https://img.shields.io/badge/sponsor-GitHub%20Sponsors-ea4aaa" alt="GitHub Sponsors"></a>
   <a href="https://github.com/orgs/dockette/discussions"><img src="https://img.shields.io/badge/support-discussions-6f42c1" alt="Support/Discussions"></a>
</p>

-----

## Motivation

`dockette/dummy` holds small images that do almost nothing. Use them to test a client, a gateway,
or a proxy, without a real backend.

Every image is published to Docker Hub as [`dockette/dummy`](https://hub.docker.com/r/dockette/dummy),
one tag per variant. Each variant lives in its own folder in this repository.

| Tag                    | Folder  | Description                                    |
| ---------------------- | ------- | ---------------------------------------------- |
| **`mcp`**              | `mcp/`  | MCP server with 2 tools, built with [Bun](https://bun.sh). |

## `dockette/dummy:mcp`

A minimal MCP server. It answers 2 questions only: who it is and what time it is. The server
speaks the [Streamable HTTP](https://modelcontextprotocol.io/specification/basic/transports)
transport on `/mcp` in stateless mode.

### Tools

| Tool     | Arguments | Returns                                             |
| -------- | --------- | --------------------------------------------------- |
| `whoami` | none      | The value of the `MCP_WHO` environment variable.     |
| `time`   | none      | The current time as an ISO-8601 timestamp (UTC).     |

### Usage

```bash
docker run --rm -p 3000:3000 -e MCP_WHO=alice dockette/dummy:mcp
```

Or with Docker Compose:

```yaml
services:
    dummy:
        image: dockette/dummy:mcp
        ports:
            - 3000:3000
        environment:
            - MCP_WHO=alice
```

Add the server to your MCP client (Claude Code, Cursor, …):

```json
{
  "mcpServers": {
    "dummy": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

Or call it with `curl`:

```bash
curl -sS http://localhost:3000/mcp \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json, text/event-stream' \
    -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"whoami","arguments":{}}}'
```

### Configuration

| Variable   | Default | Description                              |
| ---------- | ------- | ---------------------------------------- |
| `MCP_WHO`  | `dummy` | The text that the `whoami` tool returns.  |
| `MCP_PORT` | `3000`  | The HTTP port that the server listens on. |

### Endpoints

| Endpoint  | Method | Description                       |
| --------- | ------ | --------------------------------- |
| `/mcp`    | `POST` | MCP Streamable HTTP transport.    |
| `/health` | `GET`  | Health check. Returns `200` JSON. |

## Development

Every target works on one variant. `DOCKER_VARIANT` selects it and defaults to `mcp`.

```bash
make install      # install dependencies (bun)
make dev          # run the server with a file watcher
make test         # run the tests (bun test)
make typecheck    # run the TypeScript compiler

make build        # build the Docker image (dockette/dummy:mcp)
make test-docker  # smoke test the Docker image
make push         # build and push a multi-arch image to Docker Hub
```

Add a variant with a new folder and a `Dockerfile` in it, then add the folder name to the
`image` matrix in [`.github/workflows/docker.yml`](.github/workflows/docker.yml).

See [how to contribute](https://contributte.org/contributing.html) to this package.

This package is currently maintaining by these authors.

<a href="https://github.com/f3l1x">
    <img width="80" height="80" src="https://avatars2.githubusercontent.com/u/538058?v=3&s=80">
</a>

-----

Consider to [support](https://github.com/sponsors/f3l1x) **f3l1x**. Also thank you for using this package.
