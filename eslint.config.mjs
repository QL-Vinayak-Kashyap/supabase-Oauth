import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals", 
    "next", 
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ),
  {
    plugins: ["@typescript-eslint"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error", // Disallow 'any' type
      "@typescript-eslint/explicit-module-boundary-types": "error", // Enforce return types
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // Prevent unused variables
    },
  },
];

export default eslintConfig;

