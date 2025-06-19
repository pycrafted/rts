import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
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
          'charts-vendor': ['chart.js', 'react-chartjs-2', 'recharts']
        }
      }
    },
    // Optimisations de compression
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // Optimisations de développement
  server: {
    hmr: {
      overlay: false // Désactiver l'overlay HMR pour les performances
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
      '@react-three/drei'
    ]
  }
})
