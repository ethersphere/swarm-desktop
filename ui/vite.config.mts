import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const DEFAULT_VITE_DEV_PORT = 3002

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'

  return {
    base: './',
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'],
    },
    build: {
      outDir: 'build',
      minify: isProd,
      sourcemap: !isProd,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('@ethersphere/bee-dashboard')) return 'vendor-bee-dashboard'

              if (id.includes('react')) return 'vendor-react'

              return 'vendor'
            }
          },
        },
      },
    },
    server: {
      port: DEFAULT_VITE_DEV_PORT,
      open: true,
    },
    publicDir: 'public',
    assetsInclude: ['**/*.svg'],
  }
})
