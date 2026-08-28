import { afterAll, beforeAll, expect, test } from 'bun:test'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { serve } from '../src/server.ts'

process.env.MCP_WHO = 'tester'

const server = serve(0)
const url = new URL(`http://localhost:${server.port}/mcp`)

let client: Client

beforeAll(async () => {
  client = new Client({ name: 'test-client', version: '1.0.0' })
  await client.connect(new StreamableHTTPClientTransport(url))
})

afterAll(async () => {
  await client.close()
  await server.stop(true)
})

test('lists both tools', async () => {
  const { tools } = await client.listTools()

  expect(tools.map(tool => tool.name).sort()).toEqual(['time', 'whoami'])
})

test('whoami returns MCP_WHO', async () => {
  const result = await client.callTool({ name: 'whoami', arguments: {} })

  expect(result.content).toEqual([{ type: 'text', text: 'tester' }])
})

test('time returns a current ISO timestamp', async () => {
  const result = await client.callTool({ name: 'time', arguments: {} })
  const text = (result.content as { text: string }[])[0]!.text

  expect(text).toMatch(/^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/)
  expect(Math.abs(Date.parse(text) - Date.now())).toBeLessThan(10_000)
})

test('health endpoint responds', async () => {
  const response = await fetch(`http://localhost:${server.port}/health`)

  expect(response.status).toBe(200)
  expect(await response.json()).toMatchObject({ status: 'ok' })
})

test('unknown path returns 404', async () => {
  const response = await fetch(`http://localhost:${server.port}/nope`)

  expect(response.status).toBe(404)
})
