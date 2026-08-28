declare module '@crossmarkio/sdk' {
  const sdk: {
    sync?: { isInstalled?: () => boolean }
    methods: {
      signInAndWait: () => Promise<{ response?: { data?: { address?: string }; address?: string } }>
      signAndSubmitAndWait: (tx: unknown) => Promise<{
        response?: {
          data?: {
            resp?: { result?: { hash?: string; engine_result?: string; ledger_index?: number } }
            hash?: string
          }
        }
      }>
    }
    session?: { network?: { name?: string } | string; address?: string }
  }
  export default sdk
  export { sdk }
}
