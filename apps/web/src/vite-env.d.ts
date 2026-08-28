/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GAME_SERVER_URL?: string
  readonly VITE_XRPL_ISSUER_ADDRESS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
