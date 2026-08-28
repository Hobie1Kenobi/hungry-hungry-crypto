import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@hhc/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
      '@hhc/ai': path.resolve(__dirname, '../../packages/ai/src/index.ts'),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 5173,
  },
})
