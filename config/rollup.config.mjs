import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import fs from 'fs';
import path from 'path';

const packageJson = JSON.parse(
    fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8')
);

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
    },
    // Separate bundle for semantic component styles that users can import
    {
        input: 'src/styles/components.css',
        output: {
            file: 'dist/styles/components.css',
        },
        plugins: [
            postcss({
                extract: true,
                minimize: true,
                sourceMap: true,
                modules: false, // These are semantic classes, not modules
            }),
        ],
    },
];
