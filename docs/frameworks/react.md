# React

## Instalación

```bash
npm install dominican-republic-map
```

## Uso mínimo

```tsx
import { DominicanRepublicMap } from "dominican-republic-map";
import "dominican-republic-map/styles.css";

export function App() {
  return (
    <DominicanRepublicMap
      showLabels
      onProvinceClick={({ province }) => console.log(province.id)}
    />
  );
}
```

## Ejemplo con colores, iconos y popups

```tsx
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
      popup: "Sede administrativa",
    },
  }}
  markers={[
    {
      id: "pickup-sti",
      x: 237.91,
      y: 135.92,
      icon: "pickup",
      label: "Brigada Santiago",
      color: "#f59e0b",
      popup: "Equipo en campo",
      provinceId: "DO-25",
    },
  ]}
  onProvinceClick={({ province }) => console.log("click", province.name)}
  onProvinceDoubleClick={({ province }) => console.log("double", province.name)}
  onMapClick={(event) => console.log("background", event.clientX, event.clientY)}
/>
```

## Popup custom

```tsx
<DominicanRepublicMap
  showPopup
  renderPopup={(target) =>
    target.type === "province" ? target.province.name : target.marker.label
  }
/>
```

Ejemplo runnable: [`examples/basic`](../../examples/basic).
