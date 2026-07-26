# Project Rules

## TypeScript Standards
- **Modern TypeScript Path Mapping**: Always follow modern TypeScript standards for `tsconfig.json`. Do not use deprecated legacy options like `"baseUrl": "./"` or `"ignoreDeprecations"`. Always configure path aliases using relative paths, e.g., `"paths": { "@/*": ["./src/*"] }`.
- **Clean Configuration**: Keep `tsconfig.json` clean, type-safe, and free of deprecated flags.
