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

## Associate application data without changing geography

```tsx
import { useState } from 'react';
import { DominicanRepublicMap, type MunicipalityData, type ProvinceId } from 'dominican-republic-map';
import { getProvinceMunicipalities } from 'dominican-republic-map/geodata';

const city = getProvinceMunicipalities('DO-25')[0];
const municipalityData: MunicipalityData = {
  [city.id]: { value: 42, label: '42 services', fill: '#99f6e4', popup: 'Your application data' },
};
function CoverageMap() {
  const [province, setProvince] = useState<ProvinceId | null>(null);
  return <DominicanRepublicMap drillDown
    focusedProvince={province} onFocusedProvinceChange={setProvince}
    data={{ 'DO-25': { value: 120, popup: 'Province coverage' } }}
    municipalityData={municipalityData}
    onMunicipalityClick={({ municipality, data }) => console.log(municipality.id, data?.value)} />;
}
```

`data` is keyed by province ID; `municipalityData` is keyed by municipality ID. Adding a value does not add a territory or a boundary. Obtain IDs from the geodata helpers; do not guess them from names. Municipal values, labels and popup text appear in the detail list/selection panel; `fill` and `selectedFill` style the polygons. This is explicit styling, not automatic municipal choropleth aggregation.

`focusedProvince` is optional: omit it for automatic internal navigation, or pass an ID/null and update it through `onFocusedProvinceChange`. Municipality UI labels can be translated using `municipalityMessages` (`back`, `instruction`, `list`, `boundaries`, `missing`, `selected`). Municipal fills inherit `colors` defaults. The Web Component supports `municipality-data`, `municipality-messages`, `focused-province` and `provinceviewchange`; `municipalityclick.detail.data` includes the associated data.

For provinces and municipalities with your own IDs and polygons, see the separate [custom GeoJSON layer](custom-territories.md).
