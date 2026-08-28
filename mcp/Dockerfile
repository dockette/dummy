FROM oven/bun:1.3.14-alpine

LABEL maintainer="sulcmil@gmail.com"

ENV MCP_WHO="dummy"
ENV MCP_PORT="3000"

WORKDIR /app

# Dependencies (cached layer)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Application
COPY tsconfig.json ./
COPY src ./src

USER bun

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- "http://127.0.0.1:${MCP_PORT}/health" || exit 1

CMD ["bun", "run", "src/server.ts"]
