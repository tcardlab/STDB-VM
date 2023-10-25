import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import { dependencies } from './package.json'
import { builtinModules } from "module"

let node_libs = builtinModules.flatMap(m=>[m, `node:${m}`])
let node_libs_map = Object.fromEntries(node_libs.map(m => [m, m.replaceAll(/[\@\/\:]/g, '_')]))

let pkg_deps = Object.keys(dependencies)
let pkg_dep_map = Object.fromEntries(pkg_deps.map(m => [m, m.replaceAll(/[\@\/\:]/g, '_')]))

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),

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
      external: [ ...pkg_deps, ...node_libs ],
      output: {
        globals: { ...pkg_dep_map, ...node_libs_map }
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