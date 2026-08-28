import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['src/smoke.ts'],
    testTimeout: 20000,
    hookTimeout: 20000,
  },
  resolve: {
    alias: {
      '@hhc/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
      '@hhc/ai': path.resolve(__dirname, '../../packages/ai/src/index.ts'),
      '@hhc/xrpl': path.resolve(__dirname, '../../packages/xrpl/src/index.ts'),
    },
  },
})
