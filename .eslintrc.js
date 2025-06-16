module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "next/core-web-vitals",
    "prettier", // Make sure prettier is last to override other configs
  ],
  plugins: [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "jsx-a11y",
    "import",
    "prettier",
  ],
  rules: {
    // React rules
    "react/react-in-jsx-scope": "off", // Not needed in Next.js
    "react/prop-types": "off", // We use TypeScript for prop validation
    "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/no-unescaped-entities": "off", // Turning off to avoid &apos; warnings

    // TypeScript rules
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Downgrade from error to warning
    "@typescript-eslint/no-non-null-assertion": "warn",

    // Import rules

    "import/order": "off", // Turning off import order rule
    "import/no-duplicates": "warn",

    // General rules

    "prettier/prettier": "off", // Turning off Prettier rules in ESLint
    "jsx-a11y/anchor-is-valid": "off", // Next.js uses <a> tags without href
    "prefer-const": "warn", // Downgrade from error to warning
    "no-var": "warn", // Downgrade from error to warning
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {},
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  overrides: [
    {
      files: ["scripts/**/*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-unused-vars": "off",
      },
      env: {
        node: true,
      },
      parserOptions: {
        sourceType: "script", // Allow CommonJS
      },
    },
  ],
};
