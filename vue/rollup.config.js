import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import { eslint } from 'rollup-plugin-eslint'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import json from 'rollup-plugin-json'
import pkg from './package.json'

const isProduction = process.env.NODE_ENV === 'production'

export default {
    input: 'src/main.js',
    output: {
        name: 'websocket',
        file: pkg.browser,
        format: 'umd'
    },
    plugins: [
        resolve(),
        json(),
        commonjs(), // so Rollup
        globals(),
        builtins({}),
        eslint({
            exclude: ['node_modules/**']
        }),
        babel({
            exclude: ['node_modules/**'],
            runtimeHelpers: true
        }),
        !isProduction &&
            serve({
                open: true, // 是否打开浏览器
                contentBase: './', // 入口HTML 文件位置
                historyApiFallback: true, // Set to true to return index.html instead of 404
                host: '0.0.0.0',
                port: 10001
            }),
        !isProduction &&
            livereload({
                watch: 'dist',
                exclude: ['node_modules/**']
            }),
        replace({
            exclude: 'node_modules/**',
            ENV: JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        isProduction && terser()
    ]
}
