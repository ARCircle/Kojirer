import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import generouted from '@generouted/react-router/plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [generouted(), react()],
  resolve: {
    alias: {
      // エイリアスの名前解決 ./srcを@/にに変換する
      '@/': `${__dirname}/src/`,
    },
  },
  server: {
    host: true,
    port: 52800,
    proxy: {
      '/api': {
        // Backendとの通信設定 これがないと，CORSのせいでアクセスできない
        target: 'http://localhost:52600/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
  build: {
    outDir: 'built',
  },
});
