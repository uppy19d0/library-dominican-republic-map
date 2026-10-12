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
    show-popup
    selection-mode="multiple"
    colors='{"defaultFill":"#dbeafe","selectedFill":"#1d4ed8","markerFill":"#dc2626"}'
    data='{"DO-01":{"fill":"#eef2ff","selectedFill":"#be123c","popup":"Sede administrativa"}}'
    markers='[{"id":"pickup-sti","x":237.91,"y":135.92,"icon":"pickup","label":"Brigada","color":"#f59e0b","popup":"Equipo en campo","provinceId":"DO-25"}]'
    @provinceclick="onProvinceClick"
    @popupopen="onPopupOpen"
  />
</template>

<script setup lang="ts">
function onProvinceClick(event: Event) {
  const customEvent = event as CustomEvent<{ province: { id: string } }>;
  console.log(customEvent.detail.province.id);
}

function onPopupOpen(event: Event) {
  const customEvent = event as CustomEvent<{ type: "province" | "marker" }>;
  console.log(customEvent.detail.type);
}
</script>
```

## Props complejas con `mapProps`

Usa `mapProps` cuando necesites pasar datos grandes o funciones:

```vue
<script setup lang="ts">
import { onMounted, ref } from "vue";

const map = ref<HTMLElement & { mapProps?: unknown } | null>(null);

onMounted(() => {
  if (!map.value) return;
  map.value.mapProps = {
    data: {
      "DO-01": { value: 98, popup: "Sede administrativa" },
    },
  };
});
</script>

<template>
  <dr-map ref="map" show-popup />
</template>
```

Ejemplo base: [`examples/vue`](../../examples/vue).
