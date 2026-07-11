# dominican-republic-map

[![CI](https://github.com/uppy19d0/library-dominican-republic-map/actions/workflows/ci.yml/badge.svg)](https://github.com/uppy19d0/library-dominican-republic-map/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Language: English | [Espanol](./README.es.md)

Interactive, touch-friendly SVG map of the **Dominican Republic**. It includes all 32 provinces, selection, choropleth colors, markers, wheel and pinch zoom, pan, tooltips, keyboard support, popups, and production-ready styles.

Created by [Luis Aneuris Tavarez De Jesus](https://www.ltavarez.me/).

## Screenshot

[![Open the interactive dominican-republic-map preview](./docs/assets/screenshot.svg)](https://raw.githack.com/uppy19d0/library-dominican-republic-map/gh-pages/docs/demo/index.html)

## Interactive Preview

GitHub and npm READMEs cannot run embedded JavaScript, so the screenshot opens an external interactive preview with events, choropleth data, custom colors, markers, icons, and popups.

[Open interactive preview](https://raw.githack.com/uppy19d0/library-dominican-republic-map/gh-pages/docs/demo/index.html) · [GitHub Pages URL](https://uppy19d0.github.io/library-dominican-republic-map/docs/demo/) · [View demo source](./docs/demo/index.html)

## Features

- 32 Dominican Republic provinces with embedded SVG paths
- Mouse, touch, and keyboard interactions
- Single, multiple, controlled, and uncontrolled selection
- Choropleth colors from numeric province data
- Global colors, per-province colors, and per-state colors
- Built-in marker icons: pin, car, pickup, truck, people, building, hospital, school, shield, warning
- Native click/tap popups for provinces and markers
- Native tooltips or custom renderers
- Optional province abbreviation labels
- Accessible province buttons with `aria-*`, Enter, and Space support
- Full TypeScript types
- CSS variables for theming
- React API plus Web Component API for Vue, Svelte, Angular, and vanilla JavaScript

## Installation

React:

```bash
npm install dominican-republic-map
```

Vue, Svelte, Angular, or vanilla JavaScript:

```bash
npm install react react-dom dominican-republic-map
```

`react` and `react-dom` are peer dependencies because the Web Component uses React internally.

## Framework Support

| Project | Use | Best for |
| --- | --- | --- |
| React | `DominicanRepublicMap` | Typed props, custom renderers, React callbacks |
| Vue | `<dr-map>` | Templates, DOM events, complex props through `mapProps` |
| Svelte | `<dr-map>` | JSON attributes, DOM events, simple integration |
| Angular | `<dr-map>` | Custom Elements with `CUSTOM_ELEMENTS_SCHEMA` |
| HTML / Vanilla JS | `<dr-map>` | Static demos, dashboards, CMS pages |

Useful links:

- [Getting started](./docs/getting-started.md)
- [Framework guides](./docs/frameworks/README.md)
- [API reference](./docs/api.md)
- [API recipes](./docs/recipes.md)
- [Theming](./docs/theming.md)
- [Touch and zoom](./docs/gestures.md)
- [Interactive demo source](./docs/demo/index.html)
- [Release automation](./docs/release.md)

## Quick Start: React

```tsx
import { DominicanRepublicMap } from "dominican-republic-map";
import "dominican-republic-map/styles.css";

export function App() {
  return (
    <DominicanRepublicMap
      showLabels
      showPopup
      enableZoom
      data={{
        "DO-01": {
          value: 120,
          label: "120 projects",
          popup: "Main service center",
        },
        "DO-25": {
          value: 80,
          label: "80 projects",
          popup: "Northern regional operations",
        },
        "DO-32": {
          value: 200,
          label: "200 projects",
          popup: "Metropolitan follow-up",
        },
      }}
      onProvinceClick={({ province }) => {
        console.log(province.name, province.region);
      }}
    />
  );
}
```

## Quick Start: Web Component

Use this mode for Vue, Svelte, Angular, and vanilla JavaScript.

```ts
import "dominican-republic-map/element";
import "dominican-republic-map/styles.css";
```

```html
<dr-map
  show-labels
  show-popup
  selection-mode="multiple"
  colors='{"defaultFill":"#dbeafe","selectedFill":"#1d4ed8"}'
  data='{"DO-01":{"fill":"#eef2ff","selectedFill":"#be123c","popup":"Administrative office"}}'
  markers='[{"id":"pickup-sti","x":237.91,"y":135.92,"label":"Field team","icon":"pickup","color":"#f59e0b","popup":"Response team in the field","provinceId":"DO-25"}]'
></dr-map>
```

DOM events:

```ts
const map = document.querySelector("dr-map");

map?.addEventListener("provinceclick", (event) => {
  console.log(event.detail.province.id);
});

map?.addEventListener("popupopen", (event) => {
  console.log(event.detail.type);
});
```

For large objects or functions, set complex props from JavaScript:

```ts
const map = document.querySelector("dr-map");

map.mapProps = {
  showPopup: true,
  selectionMode: "multiple",
  data: {
    "DO-01": { value: 120, popup: "Administrative office" },
  },
  getProvinceStyle: (province) =>
    province.region === "Cibao Norte" ? { fill: "#205a86" } : undefined,
};
```

## Angular

Angular support uses the standard Web Component.

```bash
npm install react react-dom dominican-republic-map
```

Register the element and styles once:

```ts
// src/main.ts
import "dominican-republic-map/element";
import "dominican-republic-map/styles.css";
```

Standalone component:

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <dr-map
      show-labels
      show-popup
      selection-mode="multiple"
      (provinceclick)="onProvinceClick($event)"
    ></dr-map>
  `,
})
export class AppComponent {
  onProvinceClick(event: Event) {
    const customEvent = event as CustomEvent<{ province: { id: string } }>;
    console.log(customEvent.detail.province.id);
  }
}
```

NgModule apps can add `CUSTOM_ELEMENTS_SCHEMA` to the module instead. See [docs/frameworks/angular.md](./docs/frameworks/angular.md).

## Common Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `ProvinceData` | - | Values and styles per province |
| `selectionMode` | `"none" \| "single" \| "multiple"` | `"single"` | Selection behavior |
| `selectedProvinces` | `ProvinceId[]` | - | Controlled selected provinces |
| `enableZoom` | `boolean` | `true` | Wheel, pinch, and pan zoom |
| `showZoomControls` | `boolean` | `true` | Plus, minus, and reset buttons |
| `showLabels` | `boolean` | `false` | Province abbreviation labels |
| `showTooltip` | `boolean` | `true` | Hover/focus tooltip |
| `showPopup` | `boolean` | `false` | Click/tap popup |
| `renderPopup` | `(target) => ReactNode` | - | Custom popup renderer in React |
| `colors` | `MapColors` | - | Unified palette |
| `colorScale` | `string[]` | blue scale | Choropleth color scale |
| `markers` | `MapMarker[]` | `[]` | Marker points/icons over the map |
| `onProvinceClick` | `(event) => void` | - | Province click/tap/Enter |
| `onSelectionChange` | `(ids) => void` | - | Selection changes |
| `getProvinceStyle` | `(province, state) => style` | - | Custom province style |

See [docs/api.md](./docs/api.md) for the complete API.

## Data Helpers

```ts
import {
  PROVINCES,
  REGIONS,
  getProvince,
  findProvinceByName,
  getProvincesByRegion,
} from "dominican-republic-map";

getProvince("DO-25"); // Santiago
findProvinceByName("Pedernales");
getProvincesByRegion("Cibao Norte");
```

## Examples

```bash
npm install
npm run example:react
npm run example:vue
npm run example:svelte
npm run example:vanilla
```

Example folders:

- [React + Vite](./examples/basic)
- [Vue](./examples/vue)
- [Svelte](./examples/svelte)
- [Vanilla JS](./examples/vanilla)
- [Angular guide](./examples/angular)

## License

MIT © Luis Aneuris Tavarez De Jesus
