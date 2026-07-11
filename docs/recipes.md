# API recipes

Esta guia muestra formas comunes de usar la libreria. Usa `DominicanRepublicMap` en React y `<dr-map>` en Vue, Svelte, Angular o HTML.

## 1. Mapa basico

React:

```tsx
<DominicanRepublicMap showLabels />
```

Web Component:

```html
<dr-map show-labels></dr-map>
```

## 2. Color global del mapa

```tsx
<DominicanRepublicMap
  colors={{
    defaultFill: "#205a86",
    defaultStroke: "#d7e9fa",
    hoverFill: "#2f7db6",
    selectedFill: "#f6b44b",
    disabledFill: "#c7ccd3",
  }}
/>
```

Web Component:

```html
<dr-map
  colors='{"defaultFill":"#205a86","defaultStroke":"#d7e9fa","hoverFill":"#2f7db6","selectedFill":"#f6b44b"}'
></dr-map>
```

## 3. Color por provincia y por estado

`data` puede mezclar datos, texto, colores y popup por provincia.

```tsx
<DominicanRepublicMap
  selectionMode="multiple"
  data={{
    "DO-01": {
      fill: "#eef2ff",
      hoverFill: "#c7d2fe",
      selectedFill: "#be123c",
      popup: "Sede administrativa",
    },
    "DO-25": {
      fill: "#ecfdf5",
      selectedFill: "#047857",
      popup: "Regional norte",
    },
  }}
/>
```

## 4. Choropleth por valores

Si `data[id].value` es numerico, la libreria pinta la provincia con `colorScale`.

```tsx
<DominicanRepublicMap
  data={{
    "DO-01": { value: 98, label: "98% cobertura" },
    "DO-25": { value: 84, label: "84% cobertura" },
    "DO-11": { value: 76, label: "76% cobertura" },
  }}
  valueMin={20}
  valueMax={100}
  colorScale={["#dff3e8", "#9bd8bc", "#42a883", "#17745f"]}
/>
```

## 5. Seleccion controlada

```tsx
const [selected, setSelected] = useState<ProvinceId[]>(["DO-01"]);

<DominicanRepublicMap
  selectionMode="multiple"
  selectedProvinces={selected}
  onSelectionChange={setSelected}
/>
```

## 6. Marcadores con iconos built-in

Iconos disponibles: `dot`, `pin`, `car`, `pickup`, `truck`, `people`, `building`, `hospital`, `school`, `shield`, `warning`.

```tsx
<DominicanRepublicMap
  showPopup
  markers={[
    {
      id: "hospital-sdq",
      x: 444.68,
      y: 328.42,
      icon: "hospital",
      label: "Hospital movil",
      color: "#dc2626",
      popup: "Unidad medica disponible",
      provinceId: "DO-01",
    },
    {
      id: "pickup-sti",
      x: 237.91,
      y: 135.92,
      icon: "pickup",
      label: "Brigada",
      color: "#f59e0b",
      popup: "Equipo en campo",
      provinceId: "DO-25",
    },
  ]}
/>
```

Web Component:

```html
<dr-map
  show-popup
  markers='[{"id":"pickup-sti","x":237.91,"y":135.92,"icon":"pickup","label":"Brigada","color":"#f59e0b","popup":"Equipo en campo","provinceId":"DO-25"}]'
></dr-map>
```

## 7. Popups

El popup nativo usa `popupTitle` y `popup` desde `data` o desde cada marcador.

```tsx
<DominicanRepublicMap
  showPopup
  data={{
    "DO-01": {
      popupTitle: "Distrito Nacional",
      popup: "120 solicitudes activas",
    },
  }}
/>
```

React tambien permite popup custom:

```tsx
<DominicanRepublicMap
  showPopup
  renderPopup={(target) =>
    target.type === "province" ? (
      <strong>{target.province.name}</strong>
    ) : (
      <strong>{target.marker.label}</strong>
    )
  }
/>
```

## 8. Props complejas desde JS

Usa `mapProps` cuando un framework no maneja bien funciones o datos complejos como atributo HTML.

```ts
const map = document.querySelector("dr-map");

map.mapProps = {
  data: {
    "DO-01": { value: 98, popup: "Sede administrativa" },
  },
  markers: [
    { id: "team", x: 444.68, y: 328.42, icon: "people", label: "Equipo" },
  ],
  getProvinceStyle: (province, state) =>
    province.region === "Cibao Norte" && !state.selected
      ? { fill: "#205a86" }
      : undefined,
};
```

## 9. Eventos DOM

```ts
const map = document.querySelector("dr-map");

map.addEventListener("provinceclick", (event) => {
  console.log(event.detail.province.name);
});

map.addEventListener("popupopen", (event) => {
  console.log(event.detail.type);
});
```

## 10. Dashboard gubernamental o institucional

Este patron combina choropleth, colores por estado, iconos operativos y popups.

```tsx
<DominicanRepublicMap
  showLabels
  showPopup
  selectionMode="multiple"
  colors={{
    defaultFill: "#dbeafe",
    defaultStroke: "#bfdbfe",
    hoverFill: "#93c5fd",
    selectedFill: "#1d4ed8",
    markerStroke: "#ffffff",
  }}
  colorScale={["#eff6ff", "#bfdbfe", "#60a5fa", "#1d4ed8"]}
  data={{
    "DO-01": {
      value: 92,
      label: "92% cobertura",
      selectedFill: "#be123c",
      popupTitle: "Distrito Nacional",
      popup: "Centro de servicios, salud y respuesta ciudadana.",
    },
    "DO-25": {
      value: 76,
      label: "76% cobertura",
      selectedFill: "#047857",
      popupTitle: "Santiago",
      popup: "Regional norte con brigadas activas.",
    },
    "DO-32": {
      value: 64,
      label: "64% cobertura",
      hoverFill: "#fde68a",
      selectedFill: "#b45309",
      popupTitle: "Santo Domingo",
      popup: "Zona metropolitana en seguimiento.",
    },
  }}
  markers={[
    {
      id: "hospital-sdq",
      x: 444.68,
      y: 328.42,
      icon: "hospital",
      label: "Hospital movil",
      color: "#dc2626",
      popup: "Unidad medica disponible",
      provinceId: "DO-01",
    },
    {
      id: "pickup-sti",
      x: 237.91,
      y: 135.92,
      icon: "pickup",
      label: "Brigada norte",
      color: "#f59e0b",
      popup: "Equipo de respuesta en campo",
      provinceId: "DO-25",
    },
    {
      id: "people-sdo",
      x: 491.53,
      y: 329.08,
      icon: "people",
      label: "Equipo social",
      color: "#7c3aed",
      popup: "Personal asignado a visitas comunitarias",
      provinceId: "DO-32",
    },
  ]}
/>
```

Web Component equivalente:

```html
<dr-map
  show-labels
  show-popup
  selection-mode="multiple"
  colors='{"defaultFill":"#dbeafe","defaultStroke":"#bfdbfe","hoverFill":"#93c5fd","selectedFill":"#1d4ed8","markerStroke":"#ffffff"}'
  color-scale="#eff6ff,#bfdbfe,#60a5fa,#1d4ed8"
  data='{"DO-01":{"value":92,"label":"92% cobertura","selectedFill":"#be123c","popupTitle":"Distrito Nacional","popup":"Centro de servicios, salud y respuesta ciudadana."},"DO-25":{"value":76,"label":"76% cobertura","selectedFill":"#047857","popupTitle":"Santiago","popup":"Regional norte con brigadas activas."}}'
  markers='[{"id":"hospital-sdq","x":444.68,"y":328.42,"icon":"hospital","label":"Hospital movil","color":"#dc2626","popup":"Unidad medica disponible","provinceId":"DO-01"},{"id":"pickup-sti","x":237.91,"y":135.92,"icon":"pickup","label":"Brigada norte","color":"#f59e0b","popup":"Equipo de respuesta en campo","provinceId":"DO-25"}]'
></dr-map>
```
