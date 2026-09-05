import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
const port = Number(process.env.PORT) || 5175

export default defineConfig({
  base: '/dash-agro/',
  plugins: [react(), tailwindcss()],
  server: {
    port,
  },
  preview: {
    port,
  },
})
