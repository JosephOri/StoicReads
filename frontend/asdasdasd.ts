import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from "@vitejs/plugin-basic-ssl";
import fs from 'fs';
import path from 'path';

// Load SSL certificates
const keyPath = path.resolve(__dirname, '../../client-key.pem');
const certPath = path.resolve(__dirname, '../../client-cert.pem');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [basicSsl(), react()],
  server: {
    https: {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    },
    port: 443,
    host: '10.10.248.167',
    strictPort: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  preview: {
    port: 4001,
  },
  resolve: {
    alias: {
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@config': '/src/config',
      '@features': '/src/features',
      '@hooks': '/src/hooks',
      '@lib': '/src/lib',
      '@providers': '/src/providers',
      '@routes': '/src/routes',
      '@stores': '/src/stores',
      '@test': '/src/test',
      '@types': '/src/types',
      '@utils': '/src/utils',
      '@root': '/src',
    },
  },
})
