import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import { dependencies } from './package.json'

let node_libs = [
  // careful of node:xyz variants
  'util', 'os', 'child_process', 'stream', 'path', 'fs',
  'axios', 'commander'
]

export default defineConfig({
  plugins: [
    {enforce: 'pre', ...vue()},
    {enforce: 'pre', ...vueJsx()},

    shebang('./dist/index.js'),
    del('./dist/index.umd.cjs')
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
        //'@temir/core', 'vue', '@vue/runtime-core',
        ...Object.keys(dependencies),
        ...node_libs
      ],
      output: {
        globals: {
          vue: 'Vue',
          '@temir/core': 'temir',
          '@vue/runtime-core': 'runtimeCore',
          ...Object.fromEntries(node_libs.map(n=>[n,n]))
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