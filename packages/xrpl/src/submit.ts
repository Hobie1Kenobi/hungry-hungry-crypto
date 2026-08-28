import type { Client, SubmittableTransaction, Wallet } from 'xrpl'

export interface LedgerWriteLog {
  hash: string
  ledgerIndex: number | undefined
  result: string
}

export function logLedgerWrite(label: string, log: LedgerWriteLog): void {
  console.info(
    `[xrpl] ${label} hash=${log.hash} ledgerIndex=${log.ledgerIndex ?? 'n/a'} result=${log.result}`,
  )
}

function engineResult(meta: unknown, engine?: string): string {
  if (meta && typeof meta === 'object' && 'TransactionResult' in meta) {
    return String((meta as { TransactionResult: string }).TransactionResult)
  }
  if (typeof engine === 'string') return engine
  return 'unknown'
}

const TESTNET_JSON_RPC = 'https://s.altnet.rippletest.net:51234'

async function jsonRpc(method: string, params: Record<string, unknown>): Promise<Record<string, unknown>> {
  const response = await fetch(TESTNET_JSON_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method, params: [params] }),
  })
  const body = (await response.json()) as { result?: Record<string, unknown> }
  return body.result ?? {}
}

async function lookupTx(hash: string): Promise<{ ledgerIndex?: number; result: string; validated: boolean } | null> {
  const result = await jsonRpc('tx', { transaction: hash, binary: false })
  if (result.error) return null
  const meta = result.meta
  const code = engineResult(meta, typeof result.engine_result === 'string' ? result.engine_result : undefined)
  return {
    ledgerIndex: typeof result.ledger_index === 'number' ? result.ledger_index : undefined,
    result: code,
    validated: result.validated === true,
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForValidated(hash: string, attempts = 25): Promise<LedgerWriteLog | null> {
  for (let i = 0; i < attempts; i += 1) {
    const looked = await lookupTx(hash)
    if (looked?.validated) {
      return { hash, ledgerIndex: looked.ledgerIndex, result: looked.result }
    }
    await sleep(1200)
  }
  return null
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} submitAndWait timeout after ${ms}ms`)), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (err: unknown) => {
        clearTimeout(timer)
        reject(err)
      },
    )
  })
}

async function prepare(client: Client, tx: SubmittableTransaction, label: string) {
  const preview = await client.autofill({ ...tx })
  try {
    const sim = await client.simulate(preview)
    const simResult = sim.result as {
      engine_result?: string
      meta?: { TransactionResult?: string }
    }
    const simCode = simResult.engine_result ?? simResult.meta?.TransactionResult
    console.info(`[xrpl] ${label} simulate ${simCode ?? 'ok'}`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.info(`[xrpl] ${label} simulate skipped: ${msg}`)
  }
  const filled = await client.autofill({ ...tx })
  if (typeof filled.LastLedgerSequence === 'number') filled.LastLedgerSequence += 80
  return filled
}

async function submitOnce(
  client: Client,
  tx: SubmittableTransaction,
  wallet: Wallet,
  label: string,
): Promise<LedgerWriteLog> {
  const filled = await prepare(client, tx, label)
  const signed = wallet.sign(filled)
  if (!signed.hash) throw new Error(`${label} sign returned no hash`)
  console.info(`[xrpl] ${label} signed hash=${signed.hash}`)

  await jsonRpc('submit', { tx_blob: signed.tx_blob })

  try {
    const submitted = await withTimeout(client.submitAndWait(signed.tx_blob), 18_000, label)
    const hash = submitted.result.hash || signed.hash
    if (submitted.result.validated) {
      const log: LedgerWriteLog = {
        hash,
        ledgerIndex: submitted.result.ledger_index,
        result: engineResult(submitted.result.meta),
      }
      logLedgerWrite(label, log)
      return log
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.info(`[xrpl] ${label} submitAndWait: ${msg}`)
  }

  const waited = await waitForValidated(signed.hash)
  if (waited) {
    logLedgerWrite(label, waited)
    return waited
  }
  throw new Error(`BLOCKED: ${label} hash=${signed.hash} not validated on Testnet`)
}

export async function autofillSimulateSubmit(
  client: Client,
  tx: SubmittableTransaction,
  wallet: Wallet,
  label: string,
): Promise<LedgerWriteLog> {
  try {
    return await submitOnce(client, tx, wallet, label)
  } catch (first) {
    const msg = first instanceof Error ? first.message : String(first)
    console.info(`[xrpl] ${label} retry after: ${msg}`)
    return submitOnce(client, tx, wallet, label)
  }
}

export function blockedError(where: string, err: unknown): Error {
  const msg = err instanceof Error ? err.message : String(err)
  return new Error(msg.startsWith('BLOCKED:') ? msg : `BLOCKED: ${where}: ${msg}`)
}
