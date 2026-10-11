import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MUNICIPALITIES } from '../src/geodata';
import { PROVINCES } from '../src/data';
import { getProvinceBoundaries, getMissingProvinceBoundaries, getMunicipalityViewBox } from '../src/data/municipalities';

describe('dated municipality boundaries', () => {
  it('joins every shipped polygon to the correct existing municipality and province', () => {
    const seen = new Set<string>();
    for (const province of PROVINCES) {
      for (const boundary of getProvinceBoundaries(province.id)) {
        assert.ok(!seen.has(boundary.id)); seen.add(boundary.id);
        const municipality = MUNICIPALITIES.find(item => item.id === boundary.id);
        assert.equal(municipality?.provinceId, province.id);
        assert.equal(municipality?.name, boundary.name);
        assert.match(boundary.path, /^M[\d,\-.MLZ]+Z$/);
        assert.ok(boundary.bounds.every(Number.isFinite));
      }
    }
    assert.equal(seen.size, 155);
  });
  it('exposes known missing boundaries rather than inventing geometry', () => {
    const missing = PROVINCES.flatMap(province => getMissingProvinceBoundaries(province.id));
    assert.deepEqual(missing.map(item => item.name).sort(), ['Baitoa', 'Oviedo', 'San Víctor'].sort());
    assert.equal(getProvinceBoundaries('DO-32').length, 7);
    assert.equal(getMissingProvinceBoundaries('DO-32').length, 0);
  });
  it('gives Matanzas its own Peravia polygon joined to the catalog ID', () => {
    const peravia = getProvinceBoundaries('DO-17');
    assert.deepEqual(peravia.map(item => [item.id, item.name]), [
      ['DO-17-01', 'Baní'], ['DO-17-02', 'Matanzas'], ['DO-17-03', 'Nizao'],
    ]);
    assert.equal(getMissingProvinceBoundaries('DO-17').length, 0);
    const matanzas = peravia[1];
    assert.ok(matanzas.path.length > 100);
    assert.notEqual(matanzas.path, peravia[0].path);
  });
  it('assigns the source Matanzas interior point to Matanzas rather than Baní', () => {
    // HDX's representative point for DO09020102, projected as the shipped SVG.
    const x = -70.4169349 * Math.cos(19 * Math.PI / 180) * 100;
    const y = -18.28829055 * 100;
    const contains = (path: string) => {
      let inside = false;
      for (const ring of path.match(/M[^M]+/g) ?? []) {
        const coordinates = (ring.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
        const points = Array.from({ length: coordinates.length / 2 }, (_, i) => [coordinates[i * 2], coordinates[i * 2 + 1]]);
        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
          const [xi, yi] = points[i]; const [xj, yj] = points[j];
          if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
        }
      }
      return inside;
    };
    const peravia = getProvinceBoundaries('DO-17');
    assert.deepEqual(peravia.filter(item => contains(item.path)).map(item => item.name), ['Matanzas']);
  });
  it('fits all province polygons including islands inside a padded viewBox', () => {
    for (const province of PROVINCES) {
      const items = getProvinceBoundaries(province.id);
      const [x, y, width, height] = getMunicipalityViewBox(items).split(' ').map(Number);
      assert.ok(width > 0 && height > 0);
      for (const { bounds } of items) {
        assert.ok(bounds[0] > x && bounds[1] > y);
        assert.ok(bounds[2] < x + width && bounds[3] < y + height);
      }
    }
    assert.throws(() => getMunicipalityViewBox([]), RangeError);
  });
});
