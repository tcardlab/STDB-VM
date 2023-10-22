import { defineConfig } from 'vite';

import vuePlugin from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VitePluginNode } from 'vite-plugin-node';
import nodePolyfills from 'rollup-plugin-polyfill-node';

export default defineConfig({
  clearScreen: false,
  logLevel: 'error',
  entries: ['./index'],
  clean: false,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  resolve: {
    mainFields: ['index'],
  },
  //root: './',
  //base: ,
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  plugins: [
    //nodePolyfills(),
    vueJsx({

    }),
    vuePlugin({
      
    }),
    ...VitePluginNode({
      appPath: './dist/index.mjs',
      //tsCompiler: '',
    }),
    
  ],
  build: {
    minify: false,
    //target: 'modules',
    outDir: './dist',
    lib: {
      entry: 'index.jsx',
      name: 'default',
      fileName: 'index.js',
      formats: ['es']
    },
    rollupOptions: {
      external: ['@vue/runtime-core', '@temir/core', 'vue/server-renderer', 'vue'],
     /*  output: {
        //entryFileNames: `index.js`,
        // manualChunks: undefined,
        globals: {
          '@vue/runtime-core': 'runtimeCore',
          '@temir/core': 'temir',
          'vue/server-renderer': 'serverRenderer',
          'vue': 'vue'
        }
      } */
    }
  }
})
