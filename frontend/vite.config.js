import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  env: {
    VITE_JAWG_MAPS_TOKEN: process.env.VITE_JAWG_MAPS_TOKEN,
    VITE_GEOAPIFY_TOKEN: process.env.VITE_GEOAPIFY_TOKEN,
    VITE_GOOGLE_AUTH_TOKEN: process.env.VITE_GOOGLE_AUTH_TOKEN
  }
})
