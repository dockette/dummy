import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'

export const SERVER_NAME = 'dockette-dummy'
export const SERVER_VERSION = '1.0.0'

/**
 * MCP server with 2 dummy tools.
 */
export function createServer(): McpServer {
  const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION })

  server.registerTool(
    'whoami',
    {
      title: 'Who am I',
      description: 'Return the identity from the MCP_WHO environment variable.',
      inputSchema: {},
    },
    async () => ({
      content: [{ type: 'text', text: process.env.MCP_WHO ?? 'unknown' }],
    })
  )

  server.registerTool(
    'time',
    {
      title: 'Time',
      description: 'Return the current time as an ISO-8601 timestamp.',
      inputSchema: {},
    },
    async () => ({
      content: [{ type: 'text', text: new Date().toISOString() }],
    })
  )

  return server
}

/**
 * Handle one HTTP request. Each request gets its own server and transport (stateless mode).
 */
export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url)

  if (url.pathname === '/health') {
    return Response.json({ status: 'ok', name: SERVER_NAME, version: SERVER_VERSION })
  }

  if (url.pathname !== '/mcp') {
    return jsonrpcError(404, -32001, 'Not found')
  }

  if (request.method !== 'POST') {
    return jsonrpcError(405, -32000, 'Method not allowed')
  }

  const server = createServer()
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })

  await server.connect(transport)

  try {
    return await transport.handleRequest(request)
  } finally {
    await server.close()
  }
}

function jsonrpcError(status: number, code: number, message: string): Response {
  return Response.json({ jsonrpc: '2.0', error: { code, message }, id: null }, { status })
}

/**
 * Start the HTTP server. Port 0 picks a free port, which the tests use.
 */
export function serve(port = Number(process.env.MCP_PORT ?? 3000)) {
  return Bun.serve({ port, hostname: '0.0.0.0', fetch: handleRequest })
}

if (import.meta.main) {
  const server = serve()
  console.log(`MCP server (${SERVER_NAME}) listening on http://${server.hostname}:${server.port}/mcp`)
}
