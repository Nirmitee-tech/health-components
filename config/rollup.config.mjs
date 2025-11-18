import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import { exec } from 'child_process';
import fs from 'fs';

const packageJson = JSON.parse(
    fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8')
);

const tailwindBuildPlugin = () => ({
  name: 'tailwind-build',
  buildStart() {
    return new Promise((resolveFn, rejectFn) => {
      exec('npx @tailwindcss/cli -i ./src/styles/components.css -o ./dist/styles/components.css',
        (error) => {
          if (error) rejectFn(error);
          else resolveFn();
        });
    });
  }
});

export default [
  // ESM build (NO COMMONJS)
  {
    input: 'src/index.ts',
    output: {
      file: packageJson.module,
      format: 'es',
      sourcemap: true
    },
    plugins: [
      tailwindBuildPlugin(),
      resolve({
        browser: true,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        mainFields: ['module', 'main']
      }),
      typescript({
        tsconfig: './tsconfig.rollup.json',
      }),
      postcss({
        extract: false,
        minimize: true
      })
    ],
    external: ['react', 'react-dom', 'react/jsx-runtime']
  },

  // CJS build (commonjs allowed)
  {
    input: 'src/index.ts',
    output: {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.rollup.json',
      }),
      postcss({
        extract: false,
        minimize: true
      })
    ],
    external: ['react', 'react-dom', 'react/jsx-runtime']
  }
];
