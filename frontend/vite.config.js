import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Siquiejvel/',
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0'
  }
});
