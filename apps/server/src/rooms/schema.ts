import { Schema, type, ArraySchema } from '@colyseus/schema'

export class PelletState extends Schema {
  @type('string') id = ''
  @type('number') x = 0
  @type('number') z = 0
  @type('boolean') golden = false
  @type('int8') eatenBy = -1
}

export class SeatState extends Schema {
  @type('uint8') seat = 0
  @type('string') kind = 'ai'
  @type('string') personality = ''
  @type('string') sessionId = ''
}

export class HungryState extends Schema {
  @type('string') matchId = ''
  @type('string') phase = 'lobby'
  @type('string') code = ''
  @type('string') mode = 'quick'
  @type('number') timeLeft = 45
  @type('number') dumpT = 0
  @type('number') startAt = 0
  @type('number') score0 = 0
  @type('number') score1 = 0
  @type('number') score2 = 0
  @type('number') score3 = 0
  @type('number') neck0 = 0
  @type('number') neck1 = 0
  @type('number') neck2 = 0
  @type('number') neck3 = 0
  @type('boolean') chomp0 = false
  @type('boolean') chomp1 = false
  @type('boolean') chomp2 = false
  @type('boolean') chomp3 = false
  @type([PelletState]) pellets = new ArraySchema<PelletState>()
  @type([SeatState]) seats = new ArraySchema<SeatState>()
}
