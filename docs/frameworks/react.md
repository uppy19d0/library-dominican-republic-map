# React

## Instalación

```bash
npm install react-dominican-republic-map
```

## Uso mínimo

```tsx
import { DominicanRepublicMap } from "react-dominican-republic-map";
import "react-dominican-republic-map/styles.css";

export function App() {
  return (
    <DominicanRepublicMap
      showLabels
      onProvinceClick={({ province }) => console.log(province.id)}
    />
  );
}
```

## Ejemplo con colores y eventos

```tsx
<DominicanRepublicMap
  colors={{
    defaultFill: "#dbeafe",
    selectedFill: "#1d4ed8",
    markerFill: "#dc2626",
  }}
  onProvinceClick={({ province }) => console.log("click", province.name)}
  onProvinceDoubleClick={({ province }) => console.log("double", province.name)}
  onMapClick={(event) => console.log("background", event.clientX, event.clientY)}
/>
```

Ejemplo runnable: [`examples/basic`](../../examples/basic).

