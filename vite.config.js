import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        dedupe: ['react', 'react-dom']
    },
    // Optimisations de build pour la production
    build: {
        target: 'es2015',
        minify: 'terser',
        rollupOptions: {
            output: {
                manualChunks: {
                    // Séparer les dépendances lourdes
                    'react-vendor': ['react', 'react-dom'],
                    'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
                    'ui-vendor': ['react-router-dom', 'zustand'],
                    'charts-vendor': ['chart.js', 'react-chartjs-2', 'recharts'],
                    'math-vendor': ['mathjs'],
                    'pdf-vendor': ['jspdf', 'jspdf-autotable'],
                    'icons-vendor': ['react-icons']
                },
                // Optimisation des noms de fichiers
                chunkFileNames: (chunkInfo) => {
                    const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
                    return `js/[name]-[hash].js`;
                },
                entryFileNames: 'js/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name?.split('.') || ['unknown'];
                    const ext = info[info.length - 1];
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
                        return `images/[name]-[hash][extname]`;
                    }
                    if (/css/i.test(ext)) {
                        return `css/[name]-[hash][extname]`;
                    }
                    return `assets/[name]-[hash][extname]`;
                }
            }
        },
        // Optimisations de compression
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug'],
                passes: 2
            },
            mangle: {
                safari10: true
            }
        },
        // Optimisations de chunk
        chunkSizeWarningLimit: 1000,
        // Source maps pour la production (optionnel)
        sourcemap: false
    },
    // Optimisations de développement
    server: {
        hmr: {
            overlay: false // Désactiver l'overlay HMR pour les performances
        },
        // Optimisation du hot reload
        watch: {
            usePolling: false,
            interval: 100
        }
    },
    // Optimisations de pré-bundling
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            'zustand',
            'three',
            '@react-three/fiber',
            '@react-three/drei',
            'chart.js',
            'react-chartjs-2',
            'recharts',
            'mathjs',
            'jspdf',
            'react-icons'
        ],
        exclude: [
        // Exclure les dépendances qui causent des problèmes
        ]
    },
    // Optimisations CSS
    css: {
        postcss: {
            plugins: [
                autoprefixer,
                tailwindcss
            ]
        }
    },
    // Optimisations de préchargement
    preview: {
        port: 4173,
        strictPort: true,
        host: true
    },
    // Optimisations de cache
    cacheDir: '.vite'
});
