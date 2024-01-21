import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // alias
  resolve: {
    alias: {
      "@/lib/utils":"/src/utils",
      '@': '/src'
    }
  }
  
})
