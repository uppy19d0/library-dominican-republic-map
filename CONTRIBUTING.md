# Contributing

Thanks for improving `dominican-republic-map`.

## Development

```bash
npm ci
npm run typecheck
npm test
npm run build
```

Use the framework examples when changing public rendering behavior:

```bash
npm run example:react
npm run example:vue
npm run example:svelte
npm run example:vanilla
```

## Pull Requests

- Keep public APIs typed and documented.
- Add or update tests for behavior changes.
- Verify SSR compatibility for rendering changes.
- Keep generated build output out of commits unless the repository explicitly asks for it.
- Update README examples when changing developer-facing usage.

## Release Readiness

Before publishing, run:

```bash
npm run typecheck
npm test
npm run build
npm pack --dry-run
```

The package should stay small, framework-friendly, and safe for React plus Web Component consumers.
