import globals from "globals";
import react from 'eslint-plugin-react';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      strict: "error",
    }
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
