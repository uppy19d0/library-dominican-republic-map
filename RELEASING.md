# Publishing dominican-republic-map

This package publishes from GitHub Actions using npm Trusted Publishing with OIDC. Configure the trusted publisher in the npm settings for `dominican-republic-map` before the next release:

- Owner: `uppy19d0`
- Repository: `library-dominican-republic-map`
- Workflow filename: `publish.yml` (filename only)
- Allowed action: direct `npm publish`

The workflow checks that the Git tag exactly matches the package version, installs from the lockfile with lifecycle scripts disabled, verifies registry signatures and advisories, runs tests, previews the tarball, and publishes with provenance. After the first OIDC release succeeds, revoke the old npm automation token and remove the `NPM_TOKEN` GitHub secret if present. Verify the new version's provenance attestation on npm.

Use a new version and tag for any retry; do not replace a published version or move a published tag.
