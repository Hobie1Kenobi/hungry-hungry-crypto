import { createServer, type Server as HttpServer } from 'node:http'
import cors from 'cors'
import express from 'express'
import { Server } from 'colyseus'
import { WebSocketTransport } from '@colyseus/ws-transport'
import { ROOM_NAME, pickWinner } from '@hhc/shared'
import { HungryRoom } from './rooms/HungryRoom'
import { lookupRoomId } from './rooms/codes'
import { getSettlement, listSettlements, settleMatch } from './settle/settleMatch'

export const DEFAULT_PORT = 2567

export interface StartedServer {
  port: number
  httpServer: HttpServer
  gameServer: Server
  shutdown: () => Promise<void>
}

export function createHttpApp(): express.Express {
  const app = express()
  app.use(cors())
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ ok: true, room: ROOM_NAME, xrplWrites: false })
  })

  app.get('/rooms/:code', (req, res) => {
    const roomId = lookupRoomId(String(req.params.code ?? ''))
    if (!roomId) {
      res.status(404).json({ error: 'room not found' })
      return
    }
    res.json({ roomId, room: ROOM_NAME })
  })

  app.post('/settle-match', (req, res) => {
    const body = req.body as {
      matchId?: string
      scores?: { 0: number; 1: number; 2: number; 3: number }
      seats?: Parameters<typeof settleMatch>[1]
    }
    if (!body?.matchId || !body.scores) {
      res.status(400).json({ error: 'matchId and scores required' })
      return
    }
    const record = settleMatch(
      {
        matchId: body.matchId,
        scores: body.scores,
        addresses: {},
        winner: pickWinner(body.scores),
        txHashes: [],
      },
      body.seats ?? [],
    )
    res.json(record)
  })

  app.get('/settlements/:matchId', (req, res) => {
    const record = getSettlement(String(req.params.matchId ?? ''))
    if (!record) {
      res.status(404).json({ error: 'not recorded' })
      return
    }
    res.json(record)
  })

  app.get('/settlements', (_req, res) => {
    res.json(listSettlements())
  })

  return app
}

export async function startServer(port = DEFAULT_PORT): Promise<StartedServer> {
  const app = createHttpApp()
  const httpServer = createServer(app)
  const gameServer = new Server({
    transport: new WebSocketTransport({ server: httpServer }),
  })
  gameServer.define(ROOM_NAME, HungryRoom)

  await new Promise<void>((resolve, reject) => {
    httpServer.listen(port, () => resolve())
    httpServer.once('error', reject)
  })

  const address = httpServer.address()
  const bound = typeof address === 'object' && address ? address.port : port

  return {
    port: bound,
    httpServer,
    gameServer,
    shutdown: async () => {
      try {
        await gameServer.gracefullyShutdown(false)
      } catch {
        /* already closing */
      }
      await new Promise<void>((resolve) => {
        httpServer.close(() => resolve())
      })
    },
  }
}
