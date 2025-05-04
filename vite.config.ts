import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv'

// https://vite.dev/config/
config()

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.VITE_PORT!),
    allowedHosts: [process.env.VITE_HOSTNAME!],
  },
})
