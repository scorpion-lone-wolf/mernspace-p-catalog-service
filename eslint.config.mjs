// @ts-check
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig({
  // 1. Target files
  files: ["**/*.{js,ts,mjs,cjs}"],

  // 2. Global ignores (replaces .eslintignore)
  ignores: ["dist/", "node_modules/", "coverage/"],

  // 3. Extend modern configurations
  extends: [
    js.configs.recommended,
     "prettier",
    ...tseslint.configs.recommended,

  ],

  // 4. Setup Node.js environments and TypeScript options
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: {
      ...globals.node, // Gives access to process, __dirname, etc.
    },
    parserOptions: {
      project: true, // Auto-discovers nearest tsconfig.json
      tsconfigRootDir: import.meta.dirname,
    },
  },

  // 5. Add custom Backend/Express rules
  rules: {
    "no-console": "warn",
    "@typescript-eslint/no-explicit-any": "error", // Prevents bypassing type checks
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }], // Useful for req, res, next
  },
});
