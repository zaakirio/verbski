import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use 'assets' as the public directory to serve audio files
  publicDir: 'assets',
  build: {
    // Prevent audio files from being copied multiple times
    assetsInlineLimit: 0, // Don't inline any assets as base64
  },
})
