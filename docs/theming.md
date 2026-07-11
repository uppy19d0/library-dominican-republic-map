# Theming

El CSS exportado usa variables en `.rd-map`:

```css
.rd-map {
  --rd-map-bg: #f8fafc;
  --rd-map-border: #cbd5e1;
  --rd-map-control-bg: #ffffff;
  --rd-map-control-fg: #0f172a;
  --rd-map-tooltip-bg: #0f172a;
  --rd-map-tooltip-fg: #f8fafc;
  --rd-map-label: #0f172a;
}
```

Ejemplo dark:

```css
.my-dark-map.rd-map {
  --rd-map-border: #334155;
  --rd-map-control-bg: #0f172a;
  --rd-map-control-fg: #e2e8f0;
  --rd-map-tooltip-bg: #e2e8f0;
  --rd-map-tooltip-fg: #0f172a;
  --rd-map-label: #f8fafc;
  background: linear-gradient(160deg, #020617, #0f172a);
}
```

También puedes pintar provincias con props:

```tsx
<DominicanRepublicMap
  defaultFill="#1e293b"
  defaultStroke="#94a3b8"
  hoverFill="#38bdf8"
  selectedFill="#0ea5e9"
  getProvinceStyle={(province, { selected }) =>
    selected ? { strokeWidth: 2.2 } : undefined
  }
/>
```

O en un solo objeto con `colors`:

```tsx
<DominicanRepublicMap
  colors={{
    defaultFill: "#1e293b",
    defaultStroke: "#94a3b8",
    hoverFill: "#38bdf8",
    selectedFill: "#0ea5e9",
    markerFill: "#f43f5e",
    markerStroke: "#ffffff",
    focusStroke: "#f59e0b",
  }}
/>
```

Importa los estilos una vez en tu app:

```ts
import "react-dominican-republic-map/styles.css";
```
