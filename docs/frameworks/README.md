# Framework guides

Esta librería soporta dos modos:

1. **React API** (`DominicanRepublicMap`)
2. **Web Component** (`<dr-map>`) para Vue, Svelte, Angular y Vanilla JS

Si estas empezando, lee primero [Getting started](../getting-started.md).

## Guías

- [React](./react.md)
- [Vue](./vue.md)
- [Svelte](./svelte.md)
- [Angular](./angular.md)
- [Vanilla JS](./vanilla.md)

## Eventos del Web Component

`<dr-map>` emite:

- `provinceclick`
- `provincedoubleclick`
- `provinceenter`
- `provinceleave`
- `selectionchange`
- `markerclick`
- `zoomchange`
- `mapclick`
- `popupopen`
- `popupclose`

Para datos complejos en frameworks que no manejan bien JSON inline, asigna la propiedad `mapProps` al elemento:

```ts
const map = document.querySelector("dr-map");

map.mapProps = {
  showPopup: true,
  data: {
    "DO-01": { value: 120, popup: "Sede administrativa" },
  },
};
```
