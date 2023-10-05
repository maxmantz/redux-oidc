import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  optimizeDeps: {
    exclude: ['react', 'react-is', 'prop-types', 'oidc-client-ts'],
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'ReduxOidc',
      formats: ['umd', 'es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-is', 'prop-types', 'oidc-client-ts'],
    },
    terserOptions: {
      compress: true,
    },
  },
  esbuild: {
    loader: 'jsx',
    exclude: [/node_modules/],
  },
});
