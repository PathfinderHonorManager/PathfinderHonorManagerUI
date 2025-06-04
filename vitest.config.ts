import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.mjs'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
      globals: true,
      setupFiles: ['src/test-setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        include: ['src/**/*.{js,ts,vue}'],
        exclude: [
          'src/**/*.spec.ts',
          'src/**/*.test.ts',
          'src/test-setup.ts',
          'src/utils/test-helpers.ts'
        ],
        thresholds: {
          global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
          },
          'src/stores/**': {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
          }
        }
      },
    },
  })
) 