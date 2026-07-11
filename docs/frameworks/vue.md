# Vue

## Instalación

```bash
npm install react react-dom dominican-republic-map
```

## Registro del custom element

```ts
import "dominican-republic-map/element";
import "dominican-republic-map/styles.css";
```

## Uso en template

```vue
<template>
  <dr-map
    show-labels
    selection-mode="multiple"
    colors='{"defaultFill":"#dbeafe","selectedFill":"#1d4ed8"}'
    @provinceclick="onProvinceClick"
  />
</template>

<script setup lang="ts">
function onProvinceClick(event: Event) {
  const customEvent = event as CustomEvent<{ province: { id: string } }>;
  console.log(customEvent.detail.province.id);
}
</script>
```

Ejemplo base: [`examples/vue`](../../examples/vue).

