# dominican-republic-map

[![CI](https://github.com/uppy19d0/library-dominican-republic-map/actions/workflows/ci.yml/badge.svg)](https://github.com/uppy19d0/library-dominican-republic-map/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Mapa SVG interactivo y táctil de la **República Dominicana**. Incluye las 32 provincias, selección, choropleth, marcadores, zoom/pan con rueda y pellizco, tooltips, teclado y estilos listos para producción.

Creado por [Luis Aneuris Tavarez De Jesus](https://www.ltavarez.me/).

## Screenshot

[![Open the interactive dominican-republic-map preview](./docs/assets/screenshot.svg)](https://uppy19d0.github.io/library-dominican-republic-map/docs/demo/)

## Interactive preview

El README de GitHub y npm no permite ejecutar JavaScript embebido, por eso el preview interactivo vive en GitHub Pages. La imagen de arriba abre el demo con eventos, choropleth, colores, marcadores, iconos y popups.

[Open interactive preview](https://uppy19d0.github.io/library-dominican-republic-map/docs/demo/) · [View demo source](./docs/demo/index.html)

## Features

- 32 provincias con paths SVG embebidos (sin dependencias de mapas externas)
- Interacción mouse + touch: tap, hover, long focus, pinch-zoom, pan, double-tap zoom
- Selección simple o múltiple (controlada o no controlada)
- Choropleth por valores numéricos con escala de color interpolada
- Colores globales, por provincia y por estado (`hover`, `selected`, `disabled`)
- Marcadores con iconos built-in: pin, carro, pickup, camión, personas, edificios, hospitales, escuelas, seguridad y alerta
- Popups nativos al click/tap para provincias y marcadores
- Tooltips nativos o render propio
- Labels de abreviatura opcionales
- Accesible: `role="button"`, teclado Enter/Espacio, `aria-*`
- TypeScript completo
- CSS con variables para theming
- Paleta de colores unificada con prop `colors`
- Zero runtime dependencies (solo peer `react` / `react-dom`)
- Soporte cross-framework con Web Component (`<dr-map>`) para React, Vue, Svelte, etc.

## Installation

```bash
npm install dominican-republic-map
```

Para Vue, Svelte, Angular o Vanilla JS instala tambien los peer dependencies:

```bash
npm install react react-dom dominican-republic-map
```

## Framework support

- React: usa `DominicanRepublicMap`
- Vue / Svelte / Angular / Vanilla JS: usa `<dr-map>` (Web Component estándar)
- Guia de inicio: [docs/getting-started.md](./docs/getting-started.md)
- Guías por framework: [docs/frameworks](./docs/frameworks/README.md)
- Recetas de uso de la API: [docs/recipes.md](./docs/recipes.md)
- Preview interactivo: [GitHub Pages demo](https://uppy19d0.github.io/library-dominican-republic-map/docs/demo/)
- Código del showcase: [docs/demo](./docs/demo/index.html)
- Release automation: [docs/release.md](./docs/release.md)

## Pick the right API

| Proyecto | Usa | Ideal para |
| --- | --- | --- |
| React | `DominicanRepublicMap` | Props tipadas, render custom, callbacks React |
| Vue | `<dr-map>` | Templates, eventos DOM, props complejas con `mapProps` |
| Svelte | `<dr-map>` | Atributos JSON, eventos DOM, integracion simple |
| Angular | `<dr-map>` | Custom Elements con `CUSTOM_ELEMENTS_SCHEMA` |
| HTML / Vanilla | `<dr-map>` | Demos estaticas, dashboards simples, CMS |

## Quick Start

```tsx
import { DominicanRepublicMap } from "dominican-republic-map";
import "dominican-republic-map/styles.css";

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
| `showPopup` | `boolean` | `false` | Popup al click/tap |
| `renderPopup` | `(target) => ReactNode` | — | Popup custom en React |
| `colors` | `MapColors` | — | Paleta unificada (`defaultFill`, `selectedFill`, etc.) |
| `colorScale` | `string[]` | blues | Escala choropleth |
| `markers` | `MapMarker[]` | `[]` | Puntos/iconos sobre el mapa |
| `onProvinceClick` | `(e) => void` | — | Click / tap / Enter |
| `onProvinceDoubleClick` | `(e) => void` | — | Doble click / doble tap |
| `onSelectionChange` | `(ids) => void` | — | Cambio de selección |
| `onMapClick` | `(e) => void` | — | Click en el fondo del SVG |
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
} from "dominican-republic-map";

getProvince("DO-25"); // Santiago
findProvinceByName("Pedernales");
getProvincesByRegion("Cibao Norte");
```

## Examples

Ejemplos completos: [examples/README.md](./examples/README.md)

### Formas de usar la API

| Caso | API principal |
| --- | --- |
| Mapa basico | `showLabels`, `enableZoom` |
| Seleccion | `selectionMode`, `selectedProvinces`, `onSelectionChange` |
| Choropleth | `data[id].value`, `colorScale`, `valueMin`, `valueMax` |
| Color global | `colors.defaultFill`, `colors.selectedFill`, `colors.markerFill` |
| Color por provincia | `data[id].fill`, `data[id].hoverFill`, `data[id].selectedFill` |
| Iconos | `markers[].icon` |
| Popups | `showPopup`, `data[id].popup`, `markers[].popup`, `renderPopup` |
| Web Component dinamico | `element.mapProps = { ... }` |

Ver la guia completa en [docs/recipes.md](./docs/recipes.md).

### React (componente)

```tsx
import { DominicanRepublicMap } from "dominican-republic-map";
import "dominican-republic-map/styles.css";

<DominicanRepublicMap
  showPopup
  colors={{
    defaultFill: "#dbeafe",
    selectedFill: "#1d4ed8",
    markerFill: "#dc2626",
  }}
  data={{
    "DO-01": {
      fill: "#eef2ff",
      selectedFill: "#be123c",
      popup: "Sede administrativa y servicios digitales",
    },
    "DO-25": {
      value: 80,
      selectedFill: "#047857",
      popup: "Operaciones regionales",
    },
  }}
  markers={[
    {
      id: "ambulance-sdq",
      x: 444.68,
      y: 328.42,
      label: "Unidad médica",
      icon: "hospital",
      color: "#dc2626",
      popup: "Hospital móvil disponible",
      provinceId: "DO-01",
    },
    {
      id: "pickup-sti",
      x: 237.91,
      y: 135.92,
      label: "Brigada",
      icon: "pickup",
      color: "#f59e0b",
      popup: "Equipo de respuesta en campo",
      provinceId: "DO-25",
    },
  ]}
  onProvinceClick={({ province }) => console.log("React:", province.id)}
/>;
```

### Vue / Svelte / Angular / otros (Web Component)

```ts
import "dominican-republic-map/element";
import "dominican-republic-map/styles.css";
```

> Nota: esta librería usa React internamente, así que en Vue/Svelte también debes tener instalados `react` y `react-dom` (peer dependencies).

```html
<dr-map
  show-labels
  show-popup
  selection-mode="multiple"
  colors='{"defaultFill":"#dbeafe","selectedFill":"#1d4ed8"}'
  data='{"DO-01":{"fill":"#eef2ff","selectedFill":"#be123c","popup":"Sede administrativa"}}'
  markers='[{"id":"pickup-sti","x":237.91,"y":135.92,"label":"Brigada","icon":"pickup","color":"#f59e0b","popup":"Equipo en campo","provinceId":"DO-25"}]'
></dr-map>
```

Eventos DOM:

```ts
const map = document.querySelector("dr-map");
map?.addEventListener("provinceclick", (event) => {
  console.log("Web component:", event.detail.province.id);
});
```

### Angular quick use

```ts
// main.ts
import "dominican-republic-map/element";
import "dominican-republic-map/styles.css";
```

```ts
// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
```

```html
<dr-map show-labels selection-mode="single"></dr-map>
```

### Vue / Svelte / Vanilla (runnable)

```bash
npm --prefix examples/vue install && npm run example:vue
npm --prefix examples/svelte install && npm run example:svelte
npm --prefix examples/vanilla install && npm run example:vanilla
```

### HTML standalone (sin build)

```bash
npm run demo
# o
npx serve examples/standalone
```

Archivo: [`examples/standalone/index.html`](./examples/standalone/index.html)  
También en [`docs/demo/index.html`](./docs/demo/index.html).

> `examples/basic/index.html` es un entry de **Vite + React**. No funciona abriéndolo como `file://`; usa el comando de abajo.

### Example React (Vite)

```bash
npm install
npm run example
```

El example en `examples/basic` muestra choropleth, selección múltiple, marcadores y zoom táctil.

## Docs

- [API](./docs/api.md)
- [API recipes](./docs/recipes.md)
- [Theming](./docs/theming.md)
- [Touch & zoom](./docs/gestures.md)
- [Framework guides](./docs/frameworks/README.md)

## License

MIT © Luis Aneuris Tavarez De Jesus
