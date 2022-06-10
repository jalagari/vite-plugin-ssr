import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // React not defined in server if uncommented
import ssr from 'vite-plugin-ssr/plugin'
// @ts-ignore
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'

// https://vitejs.dev/config/

export default defineConfig({
    build : {
        sourcemap : true,
        commonjsOptions: {
            exclude: [/./],
        },
        minify : false
    },
    clearScreen: false,
    // external dependency means this won't be process by cjs loader during server runtime
    // if uncommented, Reference error, require not defined @spectrum-icons/workflow/Add.js
    // @ts-ignore
    ssr : {
        external: ['@spectrum-icons/workflow', 'node-fetch']
    },
    define: {
        "process.env": {}, // todo: added for assert, has to be removed later
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        "process.platform": JSON.stringify(process.platform),
        "process.browser": JSON.stringify(process.browser)
    },
    plugins: [
        react(), ssr(),
        resolve(),
        commonjs({
            include: /node_modules/,
            transformMixedEsModules: true
        })
    ],
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                // https://githubmemory.com/repo/vitejs/vite/issues/3409
                esbuildCommonjs(['@react/react-spectrum', '@react-spectrum', '@spectrum-icons/workflow'])
            ]
        }
    },
    server: {
      fs: {
          strict: false,
      },
      open: true,
  }
})