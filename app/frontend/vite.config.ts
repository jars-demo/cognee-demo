import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The backend runs on :8000. In development, Vite serves the UI on :5173 and forwards /api to it.
// `npm run build` writes dist/, which the backend then serves at http://localhost:8000.
export default defineConfig({
  plugins: [react()],
  // cytoscape alone is ~500 kB; one bundle is fine for a local workshop app.
  build: { chunkSizeWarningLimit: 800 },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
  preview: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
