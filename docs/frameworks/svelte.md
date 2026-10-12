# Svelte

## Instalación

```bash
npm install react react-dom dominican-republic-map
```

## Registro del custom element

```ts
import "dominican-republic-map/element";
import "dominican-republic-map/styles.css";
```

## Uso en componente

```svelte
<script lang="ts">
  const colors = JSON.stringify({
    defaultFill: "#dbeafe",
    selectedFill: "#1d4ed8",
  });
  const data = JSON.stringify({
    "DO-01": {
      fill: "#eef2ff",
      selectedFill: "#be123c",
      popup: "Sede administrativa",
    },
  });
  const markers = JSON.stringify([
    {
      id: "truck-sdq",
      x: 444.68,
      y: 328.42,
      icon: "truck",
      label: "Logistica",
      color: "#dc2626",
      popup: "Ruta activa",
    },
  ]);

  function onProvinceClick(event: Event) {
    const customEvent = event as CustomEvent<{ province: { id: string } }>;
    console.log(customEvent.detail.province.id);
  }
</script>

<dr-map
  show-labels
  show-popup
  selection-mode="single"
  {colors}
  {data}
  {markers}
  on:provinceclick={onProvinceClick}
></dr-map>
```

Ejemplo base: [`examples/svelte`](../../examples/svelte).
