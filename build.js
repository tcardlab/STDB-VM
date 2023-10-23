import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    vueJsx(),
    vue(),
    shebang('./dist/index.mjs'),
    del('./dist/index.umd.js')
  ],
  build: {
    lib: {
      entry: './index.jsx',
      fileName: 'index',
      name: 'default',
    },
    rollupOptions: {
      external: [/node_modules/, '@temir/core', 'vue', 'figures', '@vue/runtime-core'],
      output: {
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

import fs from 'fs'
function shebang (pathToBang) { 
  return {
    name: 'remove-main-script',
    enforce: 'post',
    apply: 'build',
    closeBundle: async () => {
      let stringToPrepend = `#! /usr/bin/env node\n\n`
      try {
        const data = fs.readFileSync(pathToBang, 'utf8')
        fs.writeFileSync(pathToBang, stringToPrepend + data)
      } catch (err) {
        console.error(err);
      }
    }
  }
}

function del(pathToRm) {
  return {
    name: 'del',
    enforce: 'post', 
    apply: 'build',
    closeBundle: async () => {
      fs.rmSync(pathToRm, { recursive: true } )
    }
  }
}