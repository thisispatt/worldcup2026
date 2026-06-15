import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match your GitHub repository name exactly (with leading/trailing slash)
export default defineConfig({
  plugins: [react()],
  base: '/worldcup2026/',
})
