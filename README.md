# react-dominican-republic-map

[![CI](https://github.com/uppy19d0/react-dominican-republic-map/actions/workflows/ci.yml/badge.svg)](https://github.com/uppy19d0/react-dominican-republic-map/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Mapa SVG interactivo y táctil de la **República Dominicana** para React. Incluye las 32 provincias, selección, choropleth, marcadores, zoom/pan con rueda y pellizco, tooltips, teclado y estilos listos para producción.

Creado por [Luis Aneuris Tavarez De Jesus](https://www.ltavarez.me/).

## Features

- 32 provincias con paths SVG embebidos (sin dependencias de mapas externas)
- Interacción mouse + touch: tap, hover, long focus, pinch-zoom, pan, double-tap zoom
- Selección simple o múltiple (controlada o no controlada)
- Choropleth por valores numéricos con escala de color interpolada
- Marcadores personalizables sobre el mapa
- Tooltips nativos o render propio
- Labels de abreviatura opcionales
- Accesible: `role="button"`, teclado Enter/Espacio, `aria-*`
- TypeScript completo
- CSS con variables para theming
- Zero runtime dependencies (solo peer `react` / `react-dom`)

## Installation

```bash
npm install react-dominican-republic-map
```

## Quick Start

```tsx
import { DominicanRepublicMap } from "react-dominican-republic-map";
import "react-dominican-republic-map/styles.css";

export function App() {
  return (
    <DominicanRepublicMap
      showLabels
      enableZoom
      data={{
        "DO-01": { value: 120, label: "120 proyectos" },
        "DO-25": { value: 80, label: "80 proyectos" },
        "DO-32": { value: 200, label: "200 proyectos" },
      }}
      onProvinceClick={({ province }) => {
        console.log(province.name, province.region);
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `ProvinceData` | — | Valores / estilos por provincia |
| `selectionMode` | `"none" \| "single" \| "multiple"` | `"single"` | Modo de selección |
| `selectedProvinces` | `ProvinceId[]` | — | Selección controlada |
| `enableZoom` | `boolean` | `true` | Zoom rueda / pellizco / pan |
| `showZoomControls` | `boolean` | `true` | Botones + / − / reset |
| `showLabels` | `boolean` | `false` | Abreviaturas en el mapa |
| `showTooltip` | `boolean` | `true` | Tooltip al hover/focus |
| `colorScale` | `string[]` | blues | Escala choropleth |
| `markers` | `MapMarker[]` | `[]` | Puntos sobre el mapa |
| `onProvinceClick` | `(e) => void` | — | Click / tap / Enter |
| `onSelectionChange` | `(ids) => void` | — | Cambio de selección |
| `getProvinceStyle` | `(province, state) => style` | — | Estilo custom por provincia |

Ver [docs/api.md](./docs/api.md) para la API completa.

## Data helpers

```ts
import {
  PROVINCES,
  REGIONS,
  getProvince,
  findProvinceByName,
  getProvincesByRegion,
} from "react-dominican-republic-map";

getProvince("DO-25"); // Santiago
findProvinceByName("Pedernales");
getProvincesByRegion("Cibao Norte");
```

## Examples

```bash
npm install
npm run build
npm run example
```

El ejemplo en `examples/basic` muestra choropleth, selección múltiple, marcadores y zoom táctil.

## Docs

- [API](./docs/api.md)
- [Theming](./docs/theming.md)
- [Touch & zoom](./docs/gestures.md)

## License

MIT © Luis Aneuris Tavarez De Jesus
