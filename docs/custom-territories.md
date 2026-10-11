# Custom provinces, municipalities and GeoJSON

Use `DominicanRepublicMap` for the included Dominican geography. Use `GeoJsonTerritoryMap` for **your own** province and municipality IDs and geometry. Custom geometry is a separate layer; it does not replace or claim to update the official catalog. You own the source, license, date and attribution.

## Feature contract

Supply a GeoJSON `FeatureCollection`, using the [RFC 7946 coordinate and polygon model](https://www.rfc-editor.org/rfc/rfc7946). The hierarchy properties below are this library’s application contract. Every feature has `properties.id` (unique nonempty string), `properties.name`, and `properties.level` (`province` or `municipality`). Each municipality also has `properties.provinceId` referencing a province in the same collection. Geometry must be a WGS84 longitude/latitude `Polygon` or `MultiPolygon`, with closed rings. Holes and islands are retained.

```tsx
import { GeoJsonTerritoryMap, parseTerritoryGeoJson } from 'dominican-republic-map';
import 'dominican-republic-map/styles.css';

// Load your own licensed FeatureCollection outside rendering.
const source = await fetch('/my-territories.geojson').then(response => {
  if (!response.ok) throw new Error('Territory download failed');
  return response.json();
});
parseTerritoryGeoJson(source); // Validate before updating UI; handle errors in your loader.

<GeoJsonTerritoryMap
  source={source}
  attribution="My organization · Survey 2026 · Source license"
  data={{ 'my-city-id': { value: 42, label: '42 services', popup: 'Local coverage' } }}
  onTerritoryClick={({ territory, data }) => {
    console.log(territory.level, territory.id, territory.provinceId, data?.value);
  }}
/>
```

Select a province to fit its municipalities; select a municipality in the map or list. The back button returns to your province collection. Styling and data updates preserve stable territory IDs. `data` can describe province IDs and municipality IDs, but does not create features or change geometry.

## Web Component

```js
import { registerDominicanRepublicMapElement } from 'dominican-republic-map/element';
registerDominicanRepublicMapElement();
const map = document.querySelector('dr-map');
map.mapProps = { territorySource: source, territoryAttribution: 'My licensed source',
  territoryData: { 'my-city-id': { value: 42 } } };
map.addEventListener('territoryclick', ({ detail }) => console.log(detail.territory.id));
map.addEventListener('territoryerror', ({ detail }) => console.error(detail.message));
```

You can also use `territory-source`, `territory-data` JSON attributes and `territory-attribution`. Prefer the property for large objects. Invalid custom sources display an error and emit `territoryerror`; they do not silently show the included country map. React callers should validate at the loader boundary or use their existing error boundary.

## Resource and cartographic limits

Validation limits: 2,000 features, 100,000 positions across all features, names/IDs of at most 200 characters, finite two-dimensional WGS84 positions, closed rings, positive bounding extents, unique IDs and known parent provinces. Only known properties are retained; feature HTML is never inserted. The parser makes no network requests. Cap downloads/text input separately: the parser receives an already-decoded object and cannot prevent allocation by an oversized JSON download.

This component fits SVG longitude/latitude coordinates; it is not a GIS engine. It does not validate self-intersections, containment of municipalities inside parent polygons, legal boundaries, topology or source authority. Antimeridian-spanning layers, other coordinate reference systems and Point/LineString features are rejected. Reproject and validate licensed data upstream. The component provides selection and automatic fitting, not tiled basemaps or wheel/pinch navigation.
