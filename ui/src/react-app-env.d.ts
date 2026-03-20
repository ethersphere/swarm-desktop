/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BEE_DESKTOP_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
