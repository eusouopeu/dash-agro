import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/dash-agro/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5175,
  },
  preview: {
    port: 5175,
  },
})
