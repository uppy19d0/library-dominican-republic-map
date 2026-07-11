# Release automation

This package publishes to npm from GitHub Actions when a semver tag is pushed.

## npm trusted publisher setup

Configure Trusted Publishing on npm before relying on the workflow:

- Package: `dominican-republic-map`
- Publisher: GitHub Actions
- Owner / organization: `uppy19d0`
- Repository: `library-dominican-republic-map`
- Workflow file: `publish.yml`
- Environment: leave empty unless the workflow is later changed to use one

The workflow uses OIDC through GitHub Actions, so it does not require a long-lived `NPM_TOKEN` secret.

## Publishing a new version

```bash
npm version patch
git push origin main
git push origin v$(node -p "require('./package.json').version")
```

The workflow checks types, tests, builds, previews the npm package, and runs:

```bash
npm publish --access public --provenance
```
