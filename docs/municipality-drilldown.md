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

The bundled geometry is dated display cartography, not authoritative current legal boundaries. It includes **155 polygons** joined to the package's 158 municipality records. Most provinces use geoBoundaries (2020). Peravia uses a separate **HDX / OCHA COD-AB DOM v01** supplement (source geometry edited in 2017, valid-on metadata 2021-06-29), licensed CC BY-IGO. The source's historical Matanzas ADM4 polygon is mapped explicitly to the catalog's Matanzas municipality ID `DO-17-02`; that area is removed from Baní so the polygons do not overlap. Nizao is taken from the same source for consistent Peravia coverage. This is a display supplement, not a claim that HDX has updated its administrative classification. **Baitoa, Oviedo and San Víctor** remain selectable only from the list because the bundled sources lack their polygons.

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


### Reproduce the Peravia correction

Download the [pinned HDX GeoJSON archive](https://data.humdata.org/dataset/1b26ea94-4d28-4167-9209-4984ab087973/resource/66c7a7c9-5be1-4b1a-8b5a-a559e0c970a8/download/dom_admin_boundaries.geojson.zip) and run `python scripts/generate-peravia-boundaries.py ARCHIVE.zip` with Shapely installed in an isolated build environment. The generator verifies the SHA-256 pin, source codes, topology, containment, disjoint interiors and preserved Baní/Matanzas union. Shapely is not a runtime dependency. See NOTICE for attribution and source license terms.
