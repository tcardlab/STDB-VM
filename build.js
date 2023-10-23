import { defineConfig } from 'vite';

import path from 'path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VitePluginNode } from 'vite-plugin-node';
import nodePolyfills from 'rollup-plugin-polyfill-node';

export default defineConfig({
  clearScreen: false,
  logLevel: 'error',
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  plugins: [
    // run b4 node to avoid auto ssr detection
    {... vueJsx(), enforce:'pre'},
    {...vue(), enforce:'pre'},

    // polyfil node
    {...VitePluginNode({
      appPath: './index.jsx'
    }), enforce:'post'},
    //nodePolyfills(),
  ],
  build: {
    minify: false,
    lib: {
      entry: './index.jsx',
      name: 'default',
      fileName: 'index',
      format: ['es']
    },
    rollupOptions: {
      external: ['vue', '@temir/core', /node_modules/],
      output: {
        //inlineDynamicImports: false,
        //preserveModules: true,
        //sourcemap: false,
        globals: {
          vue: 'Vue',
          '@temir/core': 'temir'
        }
      }
    }
  }
})
