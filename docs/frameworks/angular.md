# Angular

## Instalación

```bash
npm install react react-dom react-dominican-republic-map
```

## Registro global

```ts
// src/main.ts
import "react-dominican-republic-map/element";
import "react-dominican-republic-map/styles.css";
```

## Habilitar custom elements

```ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
```

## Uso en template

```html
<dr-map
  show-labels
  selection-mode="multiple"
  (provinceclick)="onProvinceClick($event)"
></dr-map>
```

```ts
onProvinceClick(event: Event) {
  const customEvent = event as CustomEvent<{ province: { id: string } }>;
  console.log(customEvent.detail.province.id);
}
```

Ejemplo base: [`examples/angular`](../../examples/angular).

