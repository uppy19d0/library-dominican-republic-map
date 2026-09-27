# Security Policy

Thank you for helping keep `dominican-republic-map` safe for production use.

## Supported Versions

Security fixes are prepared for the latest published major version.

| Version | Supported |
| --- | --- |
| 1.x | Yes |

## Reporting a Vulnerability

Please do not open a public issue for a vulnerability. Report security concerns through GitHub private vulnerability reporting when available, or contact the maintainer from the npm package metadata.

Include:

- Package version and runtime environment.
- A minimal reproduction or affected API.
- Expected impact and whether the issue is exploitable in browser, SSR, or build tooling.

The maintainer will acknowledge valid reports, investigate, and publish a fix or mitigation when needed.

## Supply Chain

Releases are validated with type checking, tests, SSR verification, build output checks, and `npm pack --dry-run`. GitHub Actions run the release workflow from tags and publish with npm provenance when configured in npm.
