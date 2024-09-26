// eslint.config.js

import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import eslintPluginJest from "eslint-plugin-jest";
import globals from "globals";

export default [
  // Base ESLint recommended rules
  js.configs.recommended,

  // General configuration for all JavaScript files
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node, // Include Node.js globals
      },
    },
    rules: {
      // Add your custom rules here
    },
  },

  // Jest-specific configuration for test files
  {
    files: ["**/__tests__/**/*.js", "**/*.test.js", "**/*.spec.js"],
    plugins: {
      jest: eslintPluginJest,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node, // Include Node.js globals
        ...globals.jest, // Include Jest globals
      },
    },
    rules: {
      ...eslintPluginJest.configs.recommended.rules,
      // Add or override Jest-specific rules here
    },
  },

  // Prettier configuration to prevent conflicts with ESLint rules
  prettier,
];
