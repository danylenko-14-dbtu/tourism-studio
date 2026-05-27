// env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SANITY_STUDIO_PROJECT_ID: string
  readonly SANITY_STUDIO_DATASET: string
  readonly SANITY_STUDIO_NEXT_URL: string
  readonly SANITY_STUDIO_TRANSLATE_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}