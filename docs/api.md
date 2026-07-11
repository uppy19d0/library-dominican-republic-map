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

Prioridad de fill: `disabled` → `selected` → `hover` → `data.fill` → escala → `defaultFill`.

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
  markers={[
    {
      id: "sdq",
      x: 450,
      y: 340,
      label: "Santo Domingo",
      color: "#ef4444",
      provinceId: "DO-01",
    },
  ]}
  onMarkerClick={({ marker }) => console.log(marker.id)}
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
```

`ProvinceEvent` incluye `province`, `data` opcional y el evento nativo.

Guías completas por framework: [docs/frameworks](./frameworks/README.md).

## Web Component (`<dr-map>`)

Registra el custom element:

```ts
import { registerDominicanRepublicMapElement } from "react-dominican-republic-map";
registerDominicanRepublicMapElement();
```

Registro automático:

```ts
import "react-dominican-republic-map/element";
```

Uso:

```html
<dr-map
  show-labels
  selection-mode="multiple"
  colors='{"defaultFill":"#dbeafe","selectedFill":"#1d4ed8"}'
  data='{"DO-01":{"value":200}}'
></dr-map>
```

Eventos DOM emitidos:

- `provinceclick`
- `provincedoubleclick`
- `provinceenter`
- `provinceleave`
- `selectionchange`
- `markerclick`
- `zoomchange`
- `mapclick`

También puedes setear props complejas desde JS:

```ts
import type { DominicanRepublicMapElement } from "react-dominican-republic-map";

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
