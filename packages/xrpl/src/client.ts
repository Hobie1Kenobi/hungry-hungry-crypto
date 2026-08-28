import { Client } from 'xrpl'
import { blockedError } from './submit'
import { wsUrlFromEnv } from './xrplConfig'

export async function connectTestnet(wsUrl = wsUrlFromEnv()): Promise<Client> {
  const client = new Client(wsUrl)
  try {
    await client.connect()
  } catch (err) {
    throw blockedError(`XRPL Testnet WS ${wsUrl}`, err)
  }
  return client
}

export async function withTestnet<T>(fn: (client: Client) => Promise<T>, wsUrl?: string): Promise<T> {
  const client = await connectTestnet(wsUrl)
  try {
    return await fn(client)
  } finally {
    try {
      await client.disconnect()
    } catch {
      /* already closed */
    }
  }
}
