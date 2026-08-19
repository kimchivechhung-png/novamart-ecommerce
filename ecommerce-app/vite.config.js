import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `base` must match your GitHub Pages repo name so built asset paths
// (JS/CSS) resolve correctly at https://<username>.github.io/novamart-ecommerce/
export default defineConfig({
  plugins: [react()],
  base: '/novamart-ecommerce/',
})
