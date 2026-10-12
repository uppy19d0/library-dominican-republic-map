# Changelog

## 1.4.2

- Preserve Web Component auto-registration when a bundler tree-shakes an element-only import.

- Make municipal drill-down opt-in in the Interactive Preview, with parameters, application values and release guidance.
- Serve the preview runtime from the locked build rather than remote `@latest` imports.

- Document package runtime permissions, supply-chain verification and scanner limitations.
- Gate CI/publication on reviewed artifact contents and add regression checks for packaging risks.
- Keep reviewed dependency update automation and preserve existing runtime APIs.


## 1.4.1

- Fix Matanzas selection in Peravia by adding its licensed historical display polygon.
- Replace Peravia display geometry with a consistent attributed HDX supplement; exclude Matanzas from Baní to avoid overlapping selections.
- Pin the source archive and verify topology, containment and coverage during generation.

## 1.4.0

- Add municipality application data, event payloads, controlled province navigation and localized detail messages.
- Redesign municipal selection with responsive map/list layouts, values and selection summaries.
- Add a separate bounded GeoJSON territory layer for custom provinces and municipalities, React and Web Components.
- Validate parent IDs, feature/position limits, supported geometry and finite coordinates; retain explicit source attribution.
- Preserve default national behavior and prevent hidden province popups from reappearing after drill-down.

## 1.3.0

- Add opt-in React/Web Component province drill-down with fitted municipal polygons, keyboard selection, events and a back button.
- Include attributed CC BY 4.0 geometry representing 2020: 154 joined polygons, with four missing boundaries explicitly disclosed.
- Include release workflow hardening, dependency signature verification and explicit bootstrap dispatch for the first staged release.
