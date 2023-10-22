import { defineConfig } from 'vite';

import vuePlugin from '@vitejs/plugin-vue'
import viteJsxPlugin from '@vitejs/plugin-vue-jsx'
import { VitePluginNode } from 'vite-plugin-node';
import nodePolyfills from 'rollup-plugin-polyfill-node';

export default defineConfig({
  /* root: './',
  base: '', */
  plugins: [
    // nodePolyfills(),
    ...VitePluginNode({
      appPath: './index.jsx',
      tsCompiler: 'esbuild',
    }),
    vuePlugin(),
    viteJsxPlugin(),
  ],
  build: {
    target: 'esnext',
    outDir: './dist',
    lib: {
      entry: 'index.jsx',
      name: 'default',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      //external: ['@vue/runtime-core', '@temir/core', 'vue', ],
      output: {
        entryFileNames: `index.js`,
        //manualChunks: undefined,
        /* globals: {
          '@vue/runtime-core': '@vue/runtime-core',
          '@temir/core': '@temir/core',
        } */
      }
    }
  }
})
