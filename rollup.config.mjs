import {babel} from "@rollup/plugin-babel";
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import del from "rollup-plugin-delete";

export default [{
    input: 'src/index.js',
    output: [
        {
            file: 'dist/d-dto.umd.min.js',
            format: 'umd',
            name: 'd-dto'
        },
        {
            file: 'dist/d-dto.cjs.min.js',
            format: 'cjs',
            name: 'd-dto'
        },
        {
            file: 'dist/d-dto.esm.min.js',
            format: 'esm',
            name: 'd-dto'
        }
    ],
    plugins: [
        del({targets: "dist/*"}),
        nodeResolve(),
        babel({
            exclude: "**/node_modules/**",
            babelHelpers: "bundled"
        }),
        commonjs(),
        terser()
    ],
}];