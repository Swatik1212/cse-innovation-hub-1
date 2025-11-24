import nextPlugin from "@next/eslint-plugin-next"
import js from "@eslint/js"
import globals from "globals"
import tsParser from "@typescript-eslint/parser"
import tsPlugin from "@typescript-eslint/eslint-plugin"

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly",
        process: "readonly",
        Buffer: "readonly",
        URL: "readonly",
        Response: "readonly",
        Request: "readonly",
      },
    },
    rules: {
      "no-undef": "off",
      "no-empty": "off",
      "no-unused-vars": "off",
    },
  },
  {
    ignores: ["node_modules/**", ".next/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly",
        process: "readonly",
        Buffer: "readonly",
        URL: "readonly",
        Response: "readonly",
        Request: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
      "no-empty": "off",
      "no-unused-vars": "off",
      "no-undef": "off",
    },
  },
  {
    files: ["**/*.{js}"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly",
        process: "readonly",
        Buffer: "readonly",
        URL: "readonly",
        Response: "readonly",
        Request: "readonly",
      },
    },
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
      "no-empty": "off",
      "no-unused-vars": "off",
      "no-undef": "off",
    },
  },
]
