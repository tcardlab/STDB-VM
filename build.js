import { defineConfig } from 'vite';
import {join} from 'path';

import vuePlugin from '@vitejs/plugin-vue'
import viteJsxPlugin from '@vitejs/plugin-vue-jsx'
import { VitePluginNode } from 'vite-plugin-node';
import nodePolyfills from 'rollup-plugin-polyfill-node';

export default defineConfig({
  plugins: [
    nodePolyfills(),
    ...VitePluginNode({
      appPath: './index.jsx',
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
      fileName: 'index.js',
    },
    rollupOptions: {
      //external: ['@vue/runtime-core', '@temir/core', 'child_process'],
      output: {
        output: {
          manualChunks: undefined,
        },
        /* globals: {
          '@vue/runtime-core': '@vue/runtime-core',
          '@temir/core': '@temir/core',
          'child_process': 'child_process'
        } */
      }
    },
  },
  resolve: {
    alias: [
      { find: '~', replacement: join('./') }
    ]
  }
})
