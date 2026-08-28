import { ArraySchema, Schema, defineTypes } from '@colyseus/schema'

export class PelletState extends Schema {
  id = ''
  x = 0
  z = 0
  golden = false
  eatenBy = -1
}
defineTypes(PelletState, {
  id: 'string',
  x: 'number',
  z: 'number',
  golden: 'boolean',
  eatenBy: 'int8',
})

export class SeatState extends Schema {
  seat = 0
  kind = 'ai'
  personality = ''
  sessionId = ''
  address = ''
}
defineTypes(SeatState, {
  seat: 'uint8',
  kind: 'string',
  personality: 'string',
  sessionId: 'string',
  address: 'string',
})

export class HungryState extends Schema {
  matchId = ''
  phase = 'lobby'
  code = ''
  mode = 'quick'
  timeLeft = 45
  dumpT = 0
  startAt = 0
  score0 = 0
  score1 = 0
  score2 = 0
  score3 = 0
  neck0 = 0
  neck1 = 0
  neck2 = 0
  neck3 = 0
  chomp0 = false
  chomp1 = false
  chomp2 = false
  chomp3 = false
  pellets = new ArraySchema<PelletState>()
  seats = new ArraySchema<SeatState>()
}
defineTypes(HungryState, {
  matchId: 'string',
  phase: 'string',
  code: 'string',
  mode: 'string',
  timeLeft: 'number',
  dumpT: 'number',
  startAt: 'number',
  score0: 'number',
  score1: 'number',
  score2: 'number',
  score3: 'number',
  neck0: 'number',
  neck1: 'number',
  neck2: 'number',
  neck3: 'number',
  chomp0: 'boolean',
  chomp1: 'boolean',
  chomp2: 'boolean',
  chomp3: 'boolean',
  pellets: [PelletState],
  seats: [SeatState],
})
