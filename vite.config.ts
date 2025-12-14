import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Fix lỗi process is not defined nếu có thư viện cũ dùng nó
    'process.env': {} 
  }
})