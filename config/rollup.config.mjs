import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import { exec } from 'child_process';
import fs from 'fs';

const packageJson = JSON.parse(
    fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8')
);

// Plugin to build Tailwind CSS
const tailwindBuildPlugin = () => {
  return {
    name: 'tailwind-build',
    buildStart() {
      return new Promise((resolve, reject) => {
        exec('npx @tailwindcss/cli -i ./src/styles/components.css -o ./dist/styles/components.css', (error, stdout, stderr) => {
          if (error) {
            console.error('Tailwind build error:', error);
            reject(error);
          } else {
            console.log('Tailwind CSS built successfully');
            resolve();
          }
        });
      });
    }
  };
};

export default [
    // Main bundle
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: packageJson.module,
                format: 'es',
                sourcemap: true,
            },
        ],
        plugins: [
            tailwindBuildPlugin(),
            resolve({
                browser: true,
                preferBuiltins: false
            }),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.rollup.json',
                declaration: false,
                declarationMap: false,
                exclude: ['**/__tests__/**', '**/*.test.ts', '**/*.test.tsx'],
            }),
            postcss({
                extensions: ['.css'],
                modules: {
                    generateScopedName: '[name]__[local]___[hash:base64:5]'
                },
                extract: false, // Don't extract CSS modules - they're bundled with JS
                minimize: true,
                sourceMap: true,
            }),
        ],
        external: ['react', 'react-dom'],
    }
];
