import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import eslint from '@rollup/plugin-eslint';
import packageJson from './package.json';
import { terser } from 'rollup-plugin-terser';
import prettier from 'rollup-plugin-prettier';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    eslint({
      throwOnError: true
    }),
    prettier({
      cwd: './'
    }),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
    postcss({
      modules: true,
      extract: false,
      use: ['sass']
    }),
    terser()
  ]
};
