/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  readonly VITE_INQUIRY_EMAIL?: string;
  readonly VITE_INQUIRY_SUBJECT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
