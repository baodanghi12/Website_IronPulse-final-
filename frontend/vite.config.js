import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [ tailwindcss() ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // backend của bạn
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
