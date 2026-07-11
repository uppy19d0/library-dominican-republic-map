# Release automation

This package publishes to npm from GitHub Actions when a semver tag is pushed.
The interactive demo is deployed to GitHub Pages from `main`.

## npm trusted publisher setup

Configure Trusted Publishing on npm before relying on the workflow:

- Package: `dominican-republic-map`
- Publisher: GitHub Actions
- Owner / organization: `uppy19d0`
- Repository: `library-dominican-republic-map`
- Workflow file: `publish.yml`
- Environment: leave empty unless the workflow is later changed to use one

The workflow uses OIDC through GitHub Actions, so it does not require a long-lived `NPM_TOKEN` secret. npm generates provenance automatically when the package is published through Trusted Publishing.

## Publishing a new version

```bash
npm version patch
git push origin main
git push origin v$(node -p "require('./package.json').version")
```

The workflow checks types, tests, builds, previews the npm package, and runs:

```bash
npm publish --access public
```

## Demo deployment

The live README preview is deployed by `.github/workflows/pages.yml`:

- URL: `https://uppy19d0.github.io/library-dominican-republic-map/docs/demo/`
- Trigger: push to `main` or manual `workflow_dispatch`
- Artifact content: `docs/` and generated `dist/`

The demo imports `../../dist/element.js` and `../../dist/styles.css`, so the Pages artifact must include `dist/` at the site root.
