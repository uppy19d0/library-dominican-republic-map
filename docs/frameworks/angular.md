# Angular

Angular uses the standard Web Component API: `<dr-map>`. You do not need an Angular wrapper.

## Installation

```bash
npm install react react-dom dominican-republic-map
```

`react` and `react-dom` are required peer dependencies because the Web Component renders the map internally with React.

## Register the custom element

Import the element and the CSS once, usually in `src/main.ts`:

```ts
import "dominican-republic-map/element";
import "dominican-republic-map/styles.css";
```

## Standalone Angular

For Angular standalone components, add `CUSTOM_ELEMENTS_SCHEMA` to the component:

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "app-root",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <dr-map
      show-labels
      show-popup
      selection-mode="multiple"
      colors='{"defaultFill":"#dbeafe","selectedFill":"#1d4ed8"}'
      data='{"DO-01":{"value":120,"popup":"Administrative office"}}'
      markers='[{"id":"pickup-sti","x":237.91,"y":135.92,"icon":"pickup","label":"Field team","color":"#f59e0b","popup":"Response team","provinceId":"DO-25"}]'
      (provinceclick)="onProvinceClick($event)"
      (selectionchange)="onSelectionChange($event)"
      (popupopen)="onPopupOpen($event)"
    ></dr-map>
  `,
})
export class AppComponent {
  onProvinceClick(event: Event) {
    const customEvent = event as CustomEvent<{ province: { id: string; name: string } }>;
    console.log(customEvent.detail.province.id, customEvent.detail.province.name);
  }

  onSelectionChange(event: Event) {
    const customEvent = event as CustomEvent<{ selected: string[] }>;
    console.log(customEvent.detail.selected);
  }

  onPopupOpen(event: Event) {
    const customEvent = event as CustomEvent<{ type: "province" | "marker" }>;
    console.log(customEvent.detail.type);
  }
}
```

## NgModule Angular

For NgModule apps, add `CUSTOM_ELEMENTS_SCHEMA` to the module:

```ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
```

Template:

```html
<dr-map
  show-labels
  show-popup
  selection-mode="multiple"
  (provinceclick)="onProvinceClick($event)"
></dr-map>
```

## Complex props

For large data objects or functions, use `mapProps` from TypeScript instead of long JSON attributes:

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
      selectionMode: "multiple",
      data: {
        "DO-01": {
          value: 120,
          popupTitle: "Distrito Nacional",
          popup: "Main service center",
        },
        "DO-25": {
          value: 80,
          popupTitle: "Santiago",
          popup: "Northern regional operations",
        },
      },
      markers: [
        {
          id: "hospital-sdq",
          x: 444.68,
          y: 328.42,
          icon: "hospital",
          label: "Medical unit",
          color: "#dc2626",
          popup: "Mobile hospital available",
          provinceId: "DO-01",
        },
      ],
    };
  }
}
```

## Notes

- Use lowercase/kebab-case attributes in templates: `show-labels`, `show-popup`, `selection-mode`.
- JSON attributes must be valid JSON strings.
- Use `mapProps` for functions, large data, or values generated from Angular services.
- DOM events are emitted with `CustomEvent.detail`.

Complete event and attribute reference: [API docs](../api.md#web-component-dr-map).
