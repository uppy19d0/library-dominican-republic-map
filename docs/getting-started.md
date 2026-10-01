# Getting started

Esta guia resume la forma recomendada de instalar y usar `dominican-republic-map` en React o como Web Component.

## 1. Instalacion

React:

```bash
npm install dominican-republic-map
```

Vue, Svelte, Angular o Vanilla JS:

```bash
npm install react react-dom dominican-republic-map
```

`react` y `react-dom` son peer dependencies porque el Web Component usa React internamente.

## 2. Importa los estilos

Importa el CSS una sola vez en el entry principal de tu app:

```ts
import "dominican-republic-map/styles.css";
```

Sin este CSS el mapa renderiza, pero pierdes tooltips, popups, controles de zoom y estilos base.

## 3. Escoge la API

| Proyecto | API recomendada | Import |
| --- | --- | --- |
| React | `DominicanRepublicMap` | `import { DominicanRepublicMap } from "dominican-republic-map"` |
| Vue | `<dr-map>` | `import "dominican-republic-map/element"` |
| Svelte | `<dr-map>` | `import "dominican-republic-map/element"` |
| Angular | `<dr-map>` + `CUSTOM_ELEMENTS_SCHEMA` | `import "dominican-republic-map/element"` |
| HTML / Vanilla JS | `<dr-map>` | `import "dominican-republic-map/element"` |

## 4. Primer mapa en React

```tsx
import { DominicanRepublicMap } from "dominican-republic-map";
import "dominican-republic-map/styles.css";

export function App() {
  return (
    <DominicanRepublicMap
      showLabels
      showPopup
      enableZoom
      colors={{
        defaultFill: "#dbeafe",
        defaultStroke: "#bfdbfe",
        hoverFill: "#93c5fd",
        selectedFill: "#1d4ed8",
        markerFill: "#dc2626",
      }}
      data={{
        "DO-01": {
          value: 120,
          label: "120 solicitudes",
          popupTitle: "Distrito Nacional",
          popup: "Centro de servicios principal",
        },
        "DO-25": {
          value: 80,
          label: "80 solicitudes",
          selectedFill: "#047857",
          popup: "Regional norte",
        },
      }}
      markers={[
        {
          id: "hospital-sdq",
          x: 444.68,
          y: 328.42,
          icon: "hospital",
          label: "Unidad medica",
          color: "#dc2626",
          popup: "Hospital movil disponible",
          provinceId: "DO-01",
        },
      ]}
      onSelectionChange={(ids) => console.log(ids)}
    />
  );
}
```

## 5. Primer mapa con Web Component

```ts
import "dominican-republic-map/element";
import "dominican-republic-map/styles.css";
```

```html
<dr-map
  show-labels
  show-popup
  enable-zoom
  colors='{"defaultFill":"#dbeafe","defaultStroke":"#bfdbfe","hoverFill":"#93c5fd","selectedFill":"#1d4ed8"}'
  data='{"DO-01":{"value":120,"popupTitle":"Distrito Nacional","popup":"Centro de servicios principal"}}'
  markers='[{"id":"hospital-sdq","x":444.68,"y":328.42,"icon":"hospital","label":"Unidad medica","color":"#dc2626","popup":"Hospital movil disponible","provinceId":"DO-01"}]'
></dr-map>
```

Los atributos que reciben objetos o arrays (`colors`, `data`, `markers`, `selected-provinces`) deben pasarse como JSON valido.

## 6. Props complejas desde JavaScript

Para datos grandes, funciones o integraciones donde sea incomodo escribir JSON en HTML, usa `mapProps`:

```ts
const map = document.querySelector("dr-map");

map.mapProps = {
  showPopup: true,
  selectionMode: "multiple",
  data: {
    "DO-01": { value: 120, popup: "Sede administrativa" },
    "DO-25": { value: 80, popup: "Regional norte" },
  },
  markers: [
    {
      id: "pickup-sti",
      x: 237.91,
      y: 135.92,
      icon: "pickup",
      label: "Brigada Santiago",
      popup: "Equipo de respuesta en campo",
      provinceId: "DO-25",
    },
  ],
};
```

## 7. Colores y estados

La prioridad de color es:

1. Provincia disabled
2. Provincia seleccionada
3. Provincia hover/focus
4. Color base por provincia
5. Choropleth por `value`
6. Color global

```tsx
<DominicanRepublicMap
  colors={{ defaultFill: "#dbeafe", selectedFill: "#1d4ed8" }}
  data={{
    "DO-01": {
      fill: "#eef2ff",
      hoverFill: "#c7d2fe",
      selectedFill: "#be123c",
    },
  }}
/>
```

## 8. Marcadores

Iconos incluidos:

```ts
"dot" | "pin" | "car" | "pickup" | "truck" | "people" | "building" | "hospital" | "school" | "shield" | "warning"
```

Las coordenadas `x` y `y` usan el espacio interno del SVG (`MAP_VIEW_BOX`). Para ubicar puntos nuevos, abre la demo, usa una provincia cercana como referencia y ajusta con valores pequenos hasta que el marcador quede donde lo necesitas.

## 9. Eventos utiles

React:

```tsx
<DominicanRepublicMap
  onProvinceClick={({ province }) => console.log(province.id)}
  onMarkerClick={({ marker }) => console.log(marker.id)}
  onPopupOpen={(target) => console.log(target.type)}
/>
```

Web Component:

```ts
const map = document.querySelector("dr-map");

map.addEventListener("provinceclick", (event) => {
  console.log(event.detail.province.id);
});

map.addEventListener("popupopen", (event) => {
  console.log(event.detail.type);
});
```

## 10. Checklist de produccion

- Importa `dominican-republic-map/styles.css`.
- En Web Components, instala tambien `react` y `react-dom`.
- Usa `showPopup` si defines `popup` en provincias o marcadores.
- Usa JSON valido en atributos HTML.
- Usa `mapProps` para funciones, datos grandes o render custom.
- Fija `valueMin` y `valueMax` cuando necesites una escala choropleth comparable entre pantallas.
- Revisa [docs/api.md](./api.md) para todos los props y eventos.
