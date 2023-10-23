import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import { VitePluginNode } from 'vite-plugin-node';
import nodePolyfills from 'rollup-plugin-polyfill-node';

import commonjs from '@rollup/plugin-commonjs'

export default defineConfig({
  plugins: [
    {enforce: 'pre', ...vue()},
    {enforce: 'pre', ...vueJsx()},

    ...VitePluginNode({
      
    }).map(p=> ({...p, enforce:'post'})), 
    shebang('./dist/index.mjs'),
    //del('./dist/index.umd.js')
  ],
  build: {
    minify: false,
    lib: {
      entry: './index.jsx',
      fileName: 'index',
      name: 'default',
    },
    rollupOptions: {
      external: [
        /node_modules/, '@temir/core', 'vue', 'figures', '@vue/runtime-core',
        'util', 'os', 'child_process', 'axios', 'commander', 'stream', 'path', 'fs'
      ],
      plugins: [
        nodePolyfills(),
        //commonjs()
      ], 
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
      if (!fs.existsSync(pathToBang)) return
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
      if (!fs.existsSync(pathToRm)) return
      fs.rmSync(pathToRm, { recursive: true } )
    }
  }
}