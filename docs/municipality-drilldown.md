# Province zoom and municipal boundaries

Enable province drill-down in React:

```tsx
<DominicanRepublicMap
  drillDown
  onMunicipalityClick={({ municipality, province }) => {
    console.log(province.name, municipality.name, municipality.id);
  }} />
```

Or use the Web Component in Vue, Svelte, Angular or vanilla JavaScript:

```html
<dr-map drill-down></dr-map>
```

Listen to `municipalityclick`; its `detail` contains `municipality` and `province`. Province activation still emits the existing province event. Drill-down is opt-in, preserving the default behavior of existing applications.

Click or activate a province with Enter/Space to open its fitted municipal view. Real polygons are scaled to the available viewport with padding; islands and polygon holes are retained. Click a polygon or a list button to select a municipality. The back button restores the country view. The province detail is fitted automatically; wheel/pinch gestures and national markers remain features of the country view rather than this separate municipal view.

## Cartographic coverage and license

The bundled geometry is a **dated 2020 snapshot**, not authoritative current legal boundaries. It includes 154 polygons joined by explicit names/aliases to the package's 158 municipality records. **Baitoa, Matanzas, Oviedo and San Víctor lack polygons in this source** and remain selectable from the list. Their names are shown as missing geometry, not replaced by invented borders. Boundaries of parent municipalities in the snapshot can also predate later administrative changes.

Source: [geoBoundaries DOM ADM2 metadata](https://www.geoboundaries.org/api/current/gbOpen/DOM/ADM2/), boundary ID `DOM-ADM2-3306468`, Caribbean GeoPortal. Pinned upstream geometry: https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/DOM/ADM2/geoBoundaries-DOM-ADM2_simplified.geojson .

Geometry is distributed under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). Retain attribution when redistributing it. The library code remains MIT. Changes: normalized names, explicit municipality joins, simplified upstream geometry projected to local SVG coordinates, three-decimal coordinate rounding and province grouping. The source SHA-256 is stored in `src/data/municipality-boundaries.json`. The generator is `scripts/generate-municipality-boundaries.py`; pass the pinned GeoJSON and the exported `MUNICIPALITIES` JSON. Runtime performs no geometry downloads.

The reviewed government and GeoDOM endpoints did not establish a clear redistribution license for a current complete dataset. This release therefore does not claim all 158 current borders. Updating the geometry requires a licensed, dated source and province/municipality join verification.
