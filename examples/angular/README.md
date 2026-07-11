# Angular + `<dr-map>`

Este ejemplo usa el Web Component exportado por la librería.

## Instalar en tu app Angular existente

```bash
npm install react react-dom react-dominican-republic-map
```

## 1) Registrar componente y estilos

```ts
// src/main.ts
import "react-dominican-republic-map/element";
import "react-dominican-republic-map/styles.css";
```

## 2) Permitir custom elements

```ts
// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
```

## 3) Consumirlo en template

```html
<dr-map
  show-labels
  selection-mode="multiple"
  (provinceclick)="onProvinceClick($event)"
></dr-map>
```

```ts
onProvinceClick(event: Event) {
  const customEvent = event as CustomEvent<{ province: { name: string } }>;
  console.log(customEvent.detail.province.name);
}
```

