export interface TrophyNftStub {
  skipped: true
  reason: string
}

export function trophyNftStub(): TrophyNftStub {
  return {
    skipped: true,
    reason: 'Trophy NFTs are optional in Phase 4 and must not block Payment-first settlement.',
  }
}
