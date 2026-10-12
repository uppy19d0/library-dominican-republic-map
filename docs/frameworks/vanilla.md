# Vanilla JS

## Instalación

```bash
npm install react react-dom dominican-republic-map
```

## Uso

```js
import "dominican-republic-map/element";
import "dominican-republic-map/styles.css";
```

```html
<dr-map
  id="map"
  show-labels
  show-popup
  selection-mode="single"
  colors='{"defaultFill":"#dbeafe","selectedFill":"#1d4ed8"}'
  data='{"DO-01":{"fill":"#eef2ff","selectedFill":"#be123c","popup":"Sede administrativa"}}'
  markers='[{"id":"car-sdq","x":444.68,"y":328.42,"icon":"car","label":"Transporte","color":"#dc2626","popup":"Flota activa"}]'
></dr-map>
```

```js
const map = document.querySelector("#map");
map?.addEventListener("provinceclick", (event) => {
  console.log(event.detail.province.name);
});

map?.addEventListener("popupopen", (event) => {
  console.log(event.detail.type);
});

map.mapProps = {
  getProvinceStyle: (province) =>
    province.region === "Cibao Norte" ? { fill: "#205a86" } : undefined,
};
```

Ejemplo base: [`examples/vanilla`](../../examples/vanilla).
