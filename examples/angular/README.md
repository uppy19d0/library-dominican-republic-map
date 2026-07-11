# Angular + `<dr-map>`

Angular support works through the Web Component exported by the library. There is no Angular-specific wrapper to maintain.

## Install in an Angular app

```bash
npm install react react-dom dominican-republic-map
```

## 1. Register the element and styles

```ts
// src/main.ts
import "dominican-republic-map/element";
import "dominican-republic-map/styles.css";
```

## 2. Standalone component setup

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  onProvinceClick(event: Event) {
    const customEvent = event as CustomEvent<{ province: { id: string; name: string } }>;
    console.log(customEvent.detail.province.id, customEvent.detail.province.name);
  }

  onPopupOpen(event: Event) {
    const customEvent = event as CustomEvent<{ type: "province" | "marker" }>;
    console.log(customEvent.detail.type);
  }
}
```

## 3. Template

```html
<dr-map
  show-labels
  show-popup
  selection-mode="multiple"
  colors='{"defaultFill":"#dbeafe","selectedFill":"#1d4ed8"}'
  data='{"DO-01":{"value":120,"popup":"Administrative office"}}'
  markers='[{"id":"pickup-sti","x":237.91,"y":135.92,"icon":"pickup","label":"Field team","color":"#f59e0b","popup":"Response team","provinceId":"DO-25"}]'
  (provinceclick)="onProvinceClick($event)"
  (popupopen)="onPopupOpen($event)"
></dr-map>
```

## NgModule setup

```ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
```

## Complex data from TypeScript

```html
<dr-map #map show-popup></dr-map>
```

```ts
import { AfterViewInit, ElementRef, ViewChild } from "@angular/core";

type DrMapElement = HTMLElement & {
  mapProps?: Record<string, unknown>;
};

export class AppComponent implements AfterViewInit {
  @ViewChild("map", { static: true }) mapRef!: ElementRef<DrMapElement>;

  ngAfterViewInit() {
    this.mapRef.nativeElement.mapProps = {
      showLabels: true,
      selectionMode: "multiple",
      data: {
        "DO-01": { value: 120, popup: "Administrative office" },
        "DO-25": { value: 80, popup: "Northern regional operations" },
      },
    };
  }
}
```

Full guide: [`docs/frameworks/angular.md`](../../docs/frameworks/angular.md).
