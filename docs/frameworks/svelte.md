# Svelte

## Instalación

```bash
npm install react react-dom react-dominican-republic-map
```

## Registro del custom element

```ts
import "react-dominican-republic-map/element";
import "react-dominican-republic-map/styles.css";
```

## Uso en componente

```svelte
<script lang="ts">
  function onProvinceClick(event: Event) {
    const customEvent = event as CustomEvent<{ province: { id: string } }>;
    console.log(customEvent.detail.province.id);
  }
</script>

<dr-map
  show-labels
  selection-mode="single"
  on:provinceclick={onProvinceClick}
></dr-map>
```

Ejemplo base: [`examples/svelte`](../../examples/svelte).

