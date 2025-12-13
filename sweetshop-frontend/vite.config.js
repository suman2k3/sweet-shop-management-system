import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/sweet-shop-management-system/',
  plugins: [react()],
})
