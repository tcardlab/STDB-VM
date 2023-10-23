import { defineConfig } from 'vite';

import path from 'path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VitePluginNode } from 'vite-plugin-node';
import nodePolyfills from 'rollup-plugin-polyfill-node';

import commonjs from '@rollup/plugin-commonjs'

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
    /* {...VitePluginNode({
      appPath: './index.jsx'
    }), enforce:'post'}, */
    //{...nodePolyfills(), enforce:'post'},
  ],
  build: {
    target: 'esnext',
    minify: false,
    lib: {
      entry: './index.jsx',
      fileName: 'index',
      name: 'default',
      format: ['es']
    },
    rollupOptions: {
      external: [/node_modules/, '@temir/core', 'vue', 'figures', '@vue/runtime-core'],
      //plugins: [commonjs()],
      output: {
        format: 'es',
        //format: 'es',
        //format: ['es'],
        //inlineDynamicImports: false,
        //preserveModules: true,
        //sourcemap: false,
        globals: {
          vue: 'Vue',
          '@temir/core': 'temir',
          'figures': 'figures',
          '@vue/runtime-core': 'runtimeCore'
        }
      } 
    }
  }
})
