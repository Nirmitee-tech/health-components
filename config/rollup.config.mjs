import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";
import postcss from "rollup-plugin-postcss";
import url from "@rollup/plugin-url";
import copy from "rollup-plugin-copy";
import { exec } from "child_process";
import fs from "fs";

const packageJson = JSON.parse(
  fs.readFileSync(new URL("../package.json", import.meta.url), "utf8")
);

// Plugin to build Tailwind CSS
const tailwindBuildPlugin = () => {
  return {
    name: "tailwind-build",
    buildStart() {
      return new Promise((resolve, reject) => {
        exec(
          "npx @tailwindcss/cli -i ./src/styles/components.css -o ./dist/styles/components.css",
          (error, stdout, stderr) => {
            if (error) {
              console.error("Tailwind build error:", error);
              reject(error);
            } else {
              resolve();
            }
          }
        );
      });
    },
  };
};

export default [
  // ESM build
  {
    input: "src/index.ts",
    output: {
      file: packageJson.module,
      format: "esm",
      sourcemap: true,
    },
    plugins: [
      tailwindBuildPlugin(),
      copy({
        targets: [{ src: "assets/*", dest: "dist/assets" }],
        hook: "buildStart",
      }),
      url({
        include: ["**/*.svg", "**/*.png", "**/*.jpg", "**/*.gif"],
        limit: 0,
        fileName: "[name][extname]",
        publicPath: "./assets/",
        emitFiles: true,
      }),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      esbuild({
        include: /\.[jt]sx?$/,
        exclude: /node_modules/,
        sourceMap: true,
        target: "esnext",
        jsx: "automatic",
        tsconfig: "./tsconfig.build.json",
      }),
      postcss({
        extensions: [".css"],
        modules: {
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
        extract: false,
        minimize: true,
        sourceMap: true,
      }),
    ],
    external: ["react", "react-dom"],
  },

  // CJS build
  {
    input: "src/index.ts",
    output: {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      esbuild({
        include: /\.[jt]sx?$/,
        exclude: /node_modules/,
        sourceMap: true,
        target: "esnext",
        jsx: "automatic",
        tsconfig: "./tsconfig.build.json",
      }),
      postcss({
        extensions: [".css"],
        modules: {
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
        extract: false,
        minimize: true,
        sourceMap: true,
      }),
    ],
    external: ["react", "react-dom"],
  },
];
