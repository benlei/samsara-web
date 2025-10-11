/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  esbuild: {
    target: 'node14'
  },
  optimizeDeps: {
    // Pre-bundle ALL heavy dependencies to speed up collection
    include: [
      '@testing-library/react', 
      '@testing-library/jest-dom',
      '@mui/material',
      '@mui/icons-material',
      '@mui/system',
      'react',
      'react-dom',
      'next-themes',
      'lodash'
    ],
    force: true // Force re-optimization
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: false,
    // Very specific patterns - only actual test files
    include: ['__tests__/**/*.test.{ts,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/out/**',
      '**/coverage/**',
      '**/*.d.ts',
      // Exclude spec files to reduce collection time
      '**/*.spec.{ts,tsx}'
    ],
    // Fastest possible execution
    pool: 'forks',
    // Minimal reporters for speed
    reporters: [['default', { summary: false }]],
    coverage: {
      enabled: false // Disable coverage for speed
    },
    // Optimize imports
    server: {
      deps: {
        inline: [/@mui\//] // Inline MUI packages to reduce loading time
      }
    }
  },
  resolve: {
    alias: {
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/banners': path.resolve(__dirname, './src/banners'),
      '@/artifacts': path.resolve(__dirname, './artifacts'),
      '@/characters': path.resolve(__dirname, './characters'),
      '@/format': path.resolve(__dirname, './src/format'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/data': path.resolve(__dirname, './public/data'),
      '@/lotypes': path.resolve(__dirname, './src/lotypes'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/test-utils': path.resolve(__dirname, './__tests__/test-utils'),
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './')
    }
  }
})