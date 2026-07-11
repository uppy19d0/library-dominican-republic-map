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
<dr-map show-labels selection-mode="single"></dr-map>
```

```js
const map = document.querySelector("dr-map");
map?.addEventListener("provinceclick", (event) => {
  console.log(event.detail.province.name);
});
```

Ejemplo base: [`examples/vanilla`](../../examples/vanilla).

