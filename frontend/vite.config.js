import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from "@vitejs/plugin-basic-ssl";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [basicSsl(), react()],
    server: {
        port: 4001,
        host: true,
        strictPort: true,
    },
    build: {
        outDir: "dist",
        sourcemap: false,
    },
    preview: {
        port: 4002,
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
});
