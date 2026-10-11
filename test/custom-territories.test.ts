import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseTerritoryGeoJson } from '../src/data/territory-geojson';
import { GeoJsonTerritoryMap } from '../src/components/GeoJsonTerritoryMap';
import { DominicanRepublicMap } from '../src/components/DominicanRepublicMap';
import { getProvinceMunicipalities } from '../src/geodata';

const ring = [[-70, 18], [-69, 18], [-69, 19], [-70, 19], [-70, 18]];
const feature = (id: string, level = 'province', provinceId?: string) => ({ type: 'Feature', properties: { id, name: id, level, provinceId }, geometry: { type: 'Polygon', coordinates: [ring] } });
const collection = (...features: unknown[]) => ({ type: 'FeatureCollection', features });

describe('custom territory GeoJSON boundary', () => {
  it('keeps custom IDs independent and preserves polygon holes and islands', () => {
    const province = feature('my-province');
    province.geometry.coordinates = [ring, [[-69.8,18.2],[-69.6,18.2],[-69.6,18.4],[-69.8,18.4],[-69.8,18.2]]];
    const dataset = parseTerritoryGeoJson(collection(province, feature('my-town', 'municipality', 'my-province')));
    assert.equal(dataset.territories.length, 2);
    assert.equal(dataset.territories[1].provinceId, 'my-province');
    assert.equal(dataset.territories[0].path.match(/Z/g)?.length, 2);
    const island = { ...feature('islands'), geometry: { type: 'MultiPolygon', coordinates: [[ring], [ring]] } };
    assert.equal(parseTerritoryGeoJson(collection(island)).territories[0].path.match(/Z/g)?.length, 2);
  });
  it('rejects duplicate IDs, unknown parents, unsupported geometry and bad coordinates', () => {
    for (const source of [collection(feature('a'), feature('a')), collection(feature('town','municipality','missing')),
      collection({ ...feature('a'), geometry: { type: 'Point', coordinates: [-70,18] } }),
      collection({ ...feature('a'), geometry: { type: 'Polygon', coordinates: [[[NaN,18],...ring]] } }),
      collection({ ...feature('a'), geometry: { type: 'Polygon', coordinates: [[[200,18],...ring]] } }),
      collection({ ...feature('a'), geometry: { type: 'Polygon', coordinates: [ring.slice(0,4)] } }),
      collection(feature('a','unknown')), collection()]) assert.throws(() => parseTerritoryGeoJson(source));
  });
  it('bounds features and total positions before constructing an unbounded layer', () => {
    assert.throws(() => parseTerritoryGeoJson(collection(...Array.from({ length: 2001 },(_,i)=>feature(String(i))))), RangeError);
    const many = { ...feature('a'), geometry: { type: 'Polygon', coordinates: [Array.from({length:50001},(_,i)=>ring[i%5]),Array.from({length:50001},(_,i)=>ring[i%5])] } };
    assert.throws(() => parseTerritoryGeoJson(collection(many)), RangeError);
  });
  it('escapes caller names and attribution in SSR; no source HTML is evaluated', () => {
    const source=collection(feature('<img src=x onerror=alert(1)>'));
    const html=renderToStaticMarkup(createElement(GeoJsonTerritoryMap,{source,attribution:'<script>alert(1)</script>'}));
    assert.ok(html.includes('&lt;img')); assert.ok(html.includes('&lt;script'));
    assert.ok(!html.includes('<img')); assert.ok(!html.includes('<script'));
  });
});

describe('official municipality application data', () => {
  it('renders a controlled province with caller values, labels and localized messages', () => {
    const municipality=getProvinceMunicipalities('DO-25')[0];
    const html=renderToStaticMarkup(createElement(DominicanRepublicMap,{ drillDown:true,focusedProvince:'DO-25',
      municipalityMessages:{back:'Back to country',list:'Municipalities'},municipalityData:{[municipality.id]:{value:42,label:'42 teams'}} }));
    assert.ok(html.includes('Back to country')); assert.ok(html.includes('42 teams')); assert.ok(html.includes('Santiago'));
  });
  it('keeps the national default and controlled null view backwards compatible', () => {
    const html=renderToStaticMarkup(createElement(DominicanRepublicMap,{drillDown:true,focusedProvince:null}));
    assert.ok(html.includes('DO-25')); assert.ok(!html.includes('rd-map__municipality-detail'));
  });
});
