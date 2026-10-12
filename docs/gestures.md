# Touch & zoom

El mapa está pensado para móvil y desktop.

## Gestos

| Gesto | Acción |
| --- | --- |
| Tap / click | Selecciona / dispara `onProvinceClick` |
| Hover / focus | Tooltip + `onProvinceEnter` |
| Rueda del mouse | Zoom hacia el cursor |
| Pellizco (2 dedos) | Zoom pinch |
| Arrastre (con zoom > 1) | Pan |
| Doble tap | Zoom in centrado |
| Botones + / − / ⟲ | Zoom programático / reset |

`touch-action: none` evita el scroll del navegador mientras interactúas con el mapa.

## Configuración

```tsx
<DominicanRepublicMap
  enableZoom
  showZoomControls
  zoomConfig={{
    minScale: 1,
    maxScale: 6,
    step: 0.4,
    doubleTapFactor: 2,
  }}
  zoom={zoom}
  onZoomChange={setZoom}
/>
```

## Tips táctiles

- Usa `selectionMode="single"` en dashboards móviles para menos fricción.
- Desactiva zoom con `enableZoom={false}` si el mapa es solo informativo dentro de un scroll largo.
- Los controles tienen `touch-action: manipulation` para evitar el delay de doble-tap del browser.
