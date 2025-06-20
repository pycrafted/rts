import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    build: {
        target: 'es2015',
        minify: 'terser',
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                    'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
                    'ui-vendor': ['react-router-dom', 'zustand']
                }
            }
        },
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        }
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            'zustand',
            'three',
            '@react-three/fiber',
            '@react-three/drei'
        ]
    }
});
