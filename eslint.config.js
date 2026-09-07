import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { exhibitIsolation } from './lint/exhibitIsolation.js';

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Exhibits are isolated modules (ADR 0001): this rule is the enforcement.
    files: ['src/exhibits/**/*.ts'],
    plugins: { 'exhibit-isolation': exhibitIsolation },
    rules: { 'exhibit-isolation/only-allowed-imports': 'error' },
  },
);
