import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: process.env.ELECTRON_RENDERER_URL || './',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'terser',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html')
            },
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    three: ['three', '@react-three/fiber', '@react-three/drei'],
                    router: ['react-router-dom'],
                    utils: ['zustand', 'clsx', 'tailwind-merge']
                }
            }
        },
        terserOptions: {
            compress: {
                drop_console: false,
                drop_debugger: true
            }
        },
        // Assurer que les chemins relatifs fonctionnent correctement
        assetsInlineLimit: 4096,
        chunkSizeWarningLimit: 1000
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    server: {
        port: 5173,
        host: true,
        strictPort: true
    },
    preview: {
        port: 4173,
        host: true
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            'three',
            '@react-three/fiber',
            '@react-three/drei',
            'zustand',
            'lucide-react',
            'clsx',
            'tailwind-merge'
        ]
    },
    // Configuration CSS pour utiliser PostCSS avec autoprefixer
    css: {
        postcss: './postcss.config.cjs'
    }
});
