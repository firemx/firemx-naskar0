import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // or vue, svelte, etc. depending on your setup

export default defineConfig({
  plugins: [react()], // adjust according to your framework
  server: {
    host: '0.0.0.0',   // Allow external access
    port: 5173         // Optional: explicitly set port
  }
});