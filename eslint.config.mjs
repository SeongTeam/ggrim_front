import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: fixupConfigRules(compat.extends(
        "next/core-web-vitals",
        "next/typescript",
        "plugin:react-hooks/recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
        "plugin:prettier/recommended",
    )),

    plugins: {
        react: fixupPluginRules(react),
        "react-hooks": fixupPluginRules(reactHooks),
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
    },

    languageOptions: {
        parser: tsParser,
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-this-alias": "warn",
        "react/react-in-jsx-scope": "off",

        "react/function-component-definition": ["error", {
            namedComponents: "arrow-function",
            unnamedComponents: "arrow-function",
        }],

        "no-restricted-syntax": ["error", {
            selector: "ClassDeclaration",
            message: "Class is not allowed. Use functions and objects instead.",
        }, {
            selector: "TSEnumDeclaration",
            message: "Enum is not allowed. Use union types or object literals instead.",
        }],

        eqeqeq: "warn",
        curly: ["warn", "all"],
    },
}, {
    files: ["src/app/**/*.tsx"],

    rules: {
        "react/function-component-definition": "off",
    },
}, {
    files: ["src/util/otel/*.ts", "src/generated/**/*.ts"],

    rules: {
        "no-restricted-syntax": "off",
    },
}]);