# API

## `DominicanRepublicMap`

Componente principal. Renderiza el SVG de las 32 provincias.

### Selection

- `selectionMode="none"` — solo eventos, sin estado de selección
- `selectionMode="single"` — una provincia a la vez
- `selectionMode="multiple"` — toggle de varias provincias

Controlado:

```tsx
const [selected, setSelected] = useState<ProvinceId[]>([]);

<DominicanRepublicMap
  selectionMode="multiple"
  selectedProvinces={selected}
  onSelectionChange={setSelected}
/>
```

### Choropleth

Pasa valores numéricos en `data` y opcionalmente `colorScale`, `valueMin`, `valueMax`:

```tsx
<DominicanRepublicMap
  data={{
    "DO-01": { value: 10 },
    "DO-25": { value: 40 },
  }}
  colorScale={["#ecfdf5", "#34d399", "#065f46"]}
/>
```

Prioridad de fill:

1. Disabled: `data[id].disabledFill` o `colors.disabledFill`
2. Selected: `data[id].selectedFill` o `colors.selectedFill`
3. Hover/focus: `data[id].hoverFill` o `colors.hoverFill`
4. Base por provincia: `data[id].fill`
5. Choropleth: `data[id].value` + `colorScale`
6. Base global: `colors.defaultFill` o `defaultFill`

Cada provincia puede personalizar su color base y sus estados:

```tsx
<DominicanRepublicMap
  colors={{
    defaultFill: "#dbeafe",
    selectedFill: "#1d4ed8",
    hoverFill: "#60a5fa",
  }}
  data={{
    "DO-01": {
      fill: "#eef2ff",
      hoverFill: "#c7d2fe",
      selectedFill: "#be123c",
      disabledFill: "#94a3b8",
      popup: "Sede administrativa",
    },
    "DO-25": {
      value: 40,
      selectedFill: "#047857",
    },
  }}
/>
```

Esto permite tener una paleta general para el mapa completo y excepciones por provincia cuando un proyecto, estado o institución necesita color propio.

También puedes pasar una paleta completa con `colors`:

```tsx
<DominicanRepublicMap
  colors={{
    defaultFill: "#dbeafe",
    selectedFill: "#1d4ed8",
    markerFill: "#dc2626",
  }}
/>
```

### Markers

Las coordenadas `x` / `y` están en el espacio del `viewBox` del mapa:

```tsx
<DominicanRepublicMap
  showPopup
  markers={[
    {
      id: "sdq",
      x: 450,
      y: 340,
      label: "Santo Domingo",
      icon: "hospital",
      color: "#ef4444",
      popup: "Unidad médica disponible",
      provinceId: "DO-01",
    },
    {
      id: "brigade-sti",
      x: 238,
      y: 136,
      label: "Brigada Santiago",
      icon: "pickup",
      color: "#f59e0b",
      popup: "Equipo de respuesta en campo",
      provinceId: "DO-25",
    },
  ]}
  onMarkerClick={({ marker }) => console.log(marker.id)}
/>
```

Iconos built-in disponibles: `dot`, `pin`, `car`, `pickup`, `truck`, `people`, `building`, `hospital`, `school`, `shield`, `warning`.

En React, si necesitas un marcador totalmente custom, puedes seguir usando `renderMarker`.

### Popups

Activa popups con `showPopup`. El popup se abre al click/tap/Enter sobre una provincia o marcador.

```tsx
<DominicanRepublicMap
  showPopup
  data={{
    "DO-01": {
      popupTitle: "Distrito Nacional",
      popup: "120 solicitudes activas",
      selectedFill: "#be123c",
    },
  }}
  markers={[
    {
      id: "people-sdq",
      x: 444.68,
      y: 328.42,
      icon: "people",
      label: "Equipo social",
      popup: "18 personas asignadas",
    },
  ]}
/>
```

Popup custom en React:

```tsx
<DominicanRepublicMap
  showPopup
  renderPopup={(target) =>
    target.type === "province" ? (
      <div>
        <strong>{target.province.name}</strong>
        <span>{target.data?.metadata?.status as string}</span>
      </div>
    ) : (
      <div>
        <strong>{target.marker.label}</strong>
        <span>{target.marker.popup}</span>
      </div>
    )
  }
/>
```

### Events

```ts
onProvinceClick?: (event: ProvinceEvent) => void
onProvinceDoubleClick?: (event: ProvinceEvent) => void
onProvinceEnter?: (event: ProvinceEvent) => void
onProvinceLeave?: (event: ProvinceEvent) => void
onSelectionChange?: (selected: ProvinceId[]) => void
onMarkerClick?: (event: MarkerEvent) => void
onZoomChange?: (zoom: ZoomState) => void
onMapClick?: (event: MouseEvent<SVGSVGElement>) => void
onPopupOpen?: (target: MapPopupTarget) => void
onPopupClose?: () => void
```

`ProvinceEvent` incluye `province`, `data` opcional y el evento nativo.

Guías completas por framework: [docs/frameworks](./frameworks/README.md).

## Web Component (`<dr-map>`)

Registra el custom element:

```ts
import { registerDominicanRepublicMapElement } from "dominican-republic-map";
registerDominicanRepublicMapElement();
```

Registro automático:

```ts
import "dominican-republic-map/element";
```

Uso:

```html
<dr-map
  show-labels
  show-popup
  selection-mode="multiple"
  colors='{"defaultFill":"#dbeafe","selectedFill":"#1d4ed8"}'
  data='{"DO-01":{"value":200,"selectedFill":"#be123c","popup":"Sede administrativa"}}'
  markers='[{"id":"pickup-sti","x":238,"y":136,"label":"Brigada","icon":"pickup","color":"#f59e0b","popup":"Equipo en campo"}]'
></dr-map>
```

### Atributos soportados

| Atributo | Prop React equivalente | Tipo |
| --- | --- | --- |
| `aria-label` | `aria-label` | string |
| `width` / `height` | `width` / `height` | string o number |
| `selection-mode` | `selectionMode` | `"none"` / `"single"` / `"multiple"` |
| `show-labels` | `showLabels` | boolean |
| `show-tooltip` | `showTooltip` | boolean |
| `show-popup` | `showPopup` | boolean |
| `close-popup-on-map-click` | `closePopupOnMapClick` | boolean |
| `enable-zoom` | `enableZoom` | boolean |
| `show-zoom-controls` | `showZoomControls` | boolean |
| `animated` | `animated` | boolean |
| `default-fill` | `defaultFill` | color |
| `default-stroke` | `defaultStroke` | color |
| `hover-fill` | `hoverFill` | color |
| `selected-fill` | `selectedFill` | color |
| `disabled-fill` | `disabledFill` | color |
| `value-min` / `value-max` | `valueMin` / `valueMax` | number |
| `color-scale` | `colorScale` | colores separados por coma |
| `disabled-provinces` | `disabledProvinces` | JSON `ProvinceId[]` |
| `selected-provinces` | `selectedProvinces` | JSON `ProvinceId[]` |
| `default-selected-provinces` | `defaultSelectedProvinces` | JSON `ProvinceId[]` |
| `data` | `data` | JSON `ProvinceData` |
| `markers` | `markers` | JSON `MapMarker[]` |
| `colors` | `colors` | JSON `MapColors` |

Los booleanos pueden usarse como atributo vacio (`show-popup`) o como string (`show-popup="false"`). Para pasar funciones, render custom o datos grandes, usa la propiedad `mapProps` desde JavaScript.

Eventos DOM emitidos:

- `provinceclick`
- `provincedoubleclick`
- `provinceenter`
- `provinceleave`
- `selectionchange`
- `markerclick`
- `zoomchange`
- `mapclick`
- `popupopen`
- `popupclose`

Payloads principales:

| Evento | `event.detail` |
| --- | --- |
| `provinceclick`, `provincedoubleclick`, `provinceenter`, `provinceleave` | `{ province, data }` |
| `selectionchange` | `{ selected }` |
| `markerclick` | `{ marker }` |
| `zoomchange` | `{ scale, x, y }` |
| `mapclick` | `{ x, y }` |
| `popupopen` | `{ type: "province", province, data }` o `{ type: "marker", marker, province }` |
| `popupclose` | `undefined` |

También puedes setear props complejas desde JS:

```ts
import type { DominicanRepublicMapElement } from "dominican-republic-map";

const element = document.querySelector("dr-map") as DominicanRepublicMapElement | null;
if (element) {
  element.mapProps = {
    markers: [{ id: "sdq", x: 450, y: 340, label: "Santo Domingo" }],
  };
}
```

## Dataset exports

| Export | Description |
| --- | --- |
| `PROVINCES` | Array de 32 provincias |
| `PROVINCE_BY_ID` | Lookup por id |
| `PROVINCE_IDS` | Lista de ids |
| `REGIONS` | Regiones de desarrollo |
| `getProvince(id)` | Provincia por id |
| `findProvinceByName(name)` | Por nombre, abbr o capital |
| `getProvincesByRegion(region)` | Filtro por región |
| `MAP_VIEW_BOX` | viewBox SVG |
| `MAP_WIDTH` / `MAP_HEIGHT` | Dimensiones lógicas |

## Province shape

```ts
interface Province {
  id: ProvinceId; // "DO-01" … "DO-32"
  name: string;
  code: string;
  iso: string;
  region: string;
  capital: string;
  abbr: string;
  path: string;
  labelX: number;
  labelY: number;
}
```
