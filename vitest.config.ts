import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

// Map the `@/` path alias (see tsconfig.json) to the project root so tests can
// Import app/lib modules the same way the app does. No extra plugin is needed.
export default defineConfig({
  root: projectRoot,
  resolve: {
    alias: {
      '@': projectRoot,
    },
  },
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
  },
})
