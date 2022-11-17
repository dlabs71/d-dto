import {babel} from "@rollup/plugin-babel";
import {terser} from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import del from "rollup-plugin-delete";

export default [{
    external: [
        'fs',
        'path'
    ],
    input: 'src/index.js',
    output: [
        {
            file: 'dist/d-dto.min.js',
            format: 'iife',
            name: 'd-dto'
        }
    ],
    plugins: [
        del({ targets: "dist/*" }),
        nodeResolve(),
        commonjs(),
        babel({
            babelrc: false,
            exclude: "**/node_modules/**",
            presets: [
                "@babel/preset-env"
            ],
            plugins: [
                "@babel/plugin-transform-runtime"
            ],
            babelHelpers: "runtime"
        }),
        terser()
    ],
}];